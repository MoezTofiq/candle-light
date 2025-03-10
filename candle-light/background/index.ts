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
    chrome.alarms.clearAll()
  } else if (details.reason === "update") {
    console.log("Extension updated!")
    chrome.alarms.clearAll()
  }
})

try {
  // // schedule logic :
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "checkFilterSchedule") {
      const temp = chrome.alarms.getAll()

      console.log("alarms", temp)
    }
  })

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    const storage = new Storage()

    if (alarm.name.startsWith("enableFilter")) {
      console.log("Time to enable filter.")
      await storage.set("power", true)
    }

    if (alarm.name.startsWith("disableFilter")) {
      console.log("Time to disable filter.")
      await storage.set("power", false)
    }
  })
} catch (error) {
  console.log("error with alarm lister", error)
}
