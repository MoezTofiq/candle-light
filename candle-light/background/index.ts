import { Storage } from "@plasmohq/storage"

import { COLOR, OPACITY } from "~shared/defaults"

export {}

console.log("background active")

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    const storage = new Storage()

    await storage.set("color", COLOR)
    await storage.set("opacity", OPACITY)
    await storage.set("power", true)
  } else if (details.reason === "update") {
    console.log("Extension updated!")
  }
})
