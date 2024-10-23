import { Storage } from "@plasmohq/storage"

export {}

console.log("background active")

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    console.log("Extension installed for the first time!")
    const storage = new Storage()

    await storage.set("color", "rgb(255, 255, 0)")
    await storage.set("opacity", "0.3")
    await storage.set("power", true)
  } else if (details.reason === "update") {
    console.log("Extension updated!")
    const storage = new Storage()

    await storage.set("color", "rgb(255, 255, 0)")
    await storage.set("opacity", "0.3")
    await storage.set("power", true)
  }
})
