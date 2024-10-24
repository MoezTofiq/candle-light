import type { PlasmoCSConfig } from "plasmo"

import { relayMessage, type PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()
const elementName = "temptemp"

let color: string,
  opacity: string,
  power: boolean,
  didChange: boolean = false,
  timer: NodeJS.Timeout | null = null

const setStorage = () => {
  didChange = false
  storage.set("color", color || "rgb(255, 255, 0)")
  storage.set("opacity", opacity || "0.3")
  storage.set("power", power ?? true)
}

const initGlobals = async () => {
  color = await storage.get("color")
  opacity = await storage.get("opacity")
  power = await storage.get("power")
}

const setTimer = () => {
  didChange = true
  // Clear the existing timer if it exists
  if (timer) {
    clearTimeout(timer)
  }

  // Set a new timer for 5 seconds (example duration)
  timer = setTimeout(() => {
    console.log("Timer expired. saving changes.")
    setStorage()
  }, 1000) // Reset after 5 seconds of inactivity
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start",
  all_frames: true
}

// Define global default values
const DEFAULTS = {
  opacity: "0.3", // Default opacity
  backgroundColor: "initial" // Default background color
}

initGlobals()

window.addEventListener("beforeunload", (event) => {
  if (didChange) {
    console.log("User is closing the tab or browser, and changes were made.")
    // Optionally, save changes before unloading
    setStorage()
  }
  // Optionally, add a confirmation dialog (not supported by all browsers)
  // event.returnValue = "Are you sure you want to leave?";
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in content script:", message)

  const element = document.getElementById(elementName)

  if (!element) {
    console.error("Element not found:", elementName)
    sendResponse({ received: false, error: "Element not found" })
    return true
  }

  const { name, body = {} } = message

  switch (name) {
    case "setDefault":
      element.style.backgroundColor = body.color || DEFAULTS.backgroundColor
      element.style.opacity = body.opacity || DEFAULTS.opacity

      color = body.color
      opacity = body.opacity
      setTimer()
      break

    case "setPower":
      element.style.opacity = body.power
        ? body.opacity || DEFAULTS.opacity
        : "0"

      opacity = body.power ? body.opacity || DEFAULTS.opacity : "0"
      power = body.power
      setTimer()
      break

    case "setColor":
      element.style.backgroundColor = body.color || DEFAULTS.backgroundColor

      color = body.color
      setTimer()
      break

    case "setOpacity":
      element.style.opacity = body.opacity || DEFAULTS.opacity

      opacity = body.opacity
      setTimer()
      break

    default:
      console.warn("Unknown message name:", name)
      sendResponse({ received: false, error: "Unknown message name" })
      return true
  }

  sendResponse({ received: true })
  return true
})

storage.watch({
  color: (c) => {
    console.log(c.newValue)
    const element = document.getElementById(elementName)
    if (element) {
      element.style.backgroundColor = c.newValue
    }
  },
  opacity: (c) => {
    console.log(c.newValue)
    const element = document.getElementById(elementName)
    if (element) {
      element.style.opacity = c.newValue
    }
  },
  power: async (c) => {
    console.log(c.newValue)
    const element = document.getElementById(elementName)
    if (element && c.newValue === true) {
      const opacity = await storage.get("opacity")
      element.style.opacity = opacity
    } else if (element) {
      element.style.opacity = "0"
    }
  }
})

const applyTint = async () => {
  console.log("applying tint")
  const color = await storage.get("color")
  const opacity = await storage.get("opacity")
  console.log(color, opacity)
  const overlay = document.createElement("div")
  overlay.id = elementName
  overlay.style.position = "fixed"
  overlay.style.top = "0"
  overlay.style.left = "0"
  overlay.style.width = "100vw"
  overlay.style.height = "100vh"
  overlay.style.pointerEvents = "none"
  overlay.style.zIndex = "100000"
  overlay.style.backgroundColor = color
  overlay.style.opacity = opacity
  document.documentElement.appendChild(overlay)
}

applyTint()
