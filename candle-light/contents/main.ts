import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

import { COLOR, OPACITY } from "~shared/defaults"
import { log } from "~shared/helper"

const storage = new Storage()
const elementName = "CANDLELIGHT_ELEMENT"

let color: string,
  opacity: string,
  power: boolean,
  didChange: boolean = false,
  timer: NodeJS.Timeout | null = null

const setStorage = () => {
  didChange = false
  log(`setStorage : ${color} ${opacity}`)
  storage.set("color", color || COLOR)
  storage.set("opacity", opacity || OPACITY)
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
    log("Timer expired. saving changes.")
    setStorage()
  }, 1000) // Reset after 5 seconds of inactivity
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start",
  all_frames: true
}

initGlobals()

window.addEventListener("beforeunload", (event) => {
  if (didChange) {
    log("User is closing the tab or browser, and changes were made.")
    // Optionally, save changes before unloading
    setStorage()
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  log("Received message in content script:", message)

  const element = document.getElementById(elementName)

  if (!element) {
    console.error("Element not found:", elementName)
    sendResponse({ received: false, error: "Element not found" })
    return true
  }

  const { name, body = {} } = message

  switch (name) {
    case "setAll":
      element.style.backgroundColor = body.color || COLOR
      element.style.opacity = body.power ? body.opacity || OPACITY : "0"

      opacity = body.power ? body.opacity || OPACITY : "0"
      power = body.power
      color = body.color
      setTimer()
      break

    case "setDefault":
      element.style.backgroundColor = body.color || COLOR
      element.style.opacity = body.opacity || OPACITY

      color = body.color
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
    log(c.newValue)
    const element = document.getElementById(elementName)
    if (element) {
      element.style.backgroundColor = c.newValue
    }
  },
  opacity: (c) => {
    log(c.newValue)
    const element = document.getElementById(elementName)
    if (element) {
      element.style.opacity = c.newValue
    }
  },
  power: async (c) => {
    log(c.newValue)
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
  log("applying tint")
  const color = await storage.get("color")
  const opacity = await storage.get("opacity")
  log(color, opacity)
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
  const rootHTML = document.getElementsByTagName("html")[0]
  if (rootHTML) {
    log("found root html", rootHTML)
    rootHTML.appendChild(overlay)
  } else {
    document.documentElement.appendChild(overlay)
  }
}

applyTint()
