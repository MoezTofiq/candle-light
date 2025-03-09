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

async function checkAlarmState_checkFilterSchedule() {
  try {
    const alarm = await chrome.alarms.get("checkFilterSchedule1")

    if (!alarm) {
      console.log("Alarm does not exist, creating one at the next full hour.")

      // Get the current time
      const now = new Date()
      const currentMinutes = now.getMinutes()
      const currentSeconds = now.getSeconds()

      // Calculate delay until the next full hour (in minutes)
      const delayMinutes = 60 - currentMinutes - (currentSeconds > 0 ? 1 : 0)

      // Create an initial one-time alarm at the next full hour
      await chrome.alarms.create("checkFilterSchedule", {
        delayInMinutes: delayMinutes,
        periodInMinutes: 60
      })

      console.log(`Alarm set to fire in ${delayMinutes} minutes.`)
    } else {
      console.log("Alarm exists, not creating a new one.")
    }
  } catch (error) {
    console.error("checkAlarmState -> ", error)
  }
}

// Call the function on startup
checkAlarmState_checkFilterSchedule()

try {
  // // schedule logic :
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "checkFilterSchedule") {
      console.log("Checking filter schedule...")

      // Get stored settings
      const storage = new Storage()

      const timerEnabled = await storage.get("timerEnabled")
      const timeRange = await storage.get("timeRange")
      const activeDays = await storage.get("activeDays")

      const parsedTimer = timerEnabled === "true"
      const parsedTimeRange = timeRange ? JSON.parse(timeRange) : [18, 6]
      const parsedDays = activeDays
        ? JSON.parse(activeDays)
        : [false, false, false, false, false, false, false]

      console.log("Checking filter schedule...")
      console.log("parsedTimer", parsedTimer)
      console.log("parsedTimeRange", parsedTimeRange)
      console.log("parsedDays", parsedDays)

      if (!parsedTimer) {
        console.log("Scheduler is disabled.")
        return
      }

      // Get current time and day
      const now = new Date()
      const currentHour = now.getHours() // 24-hour format
      const currentDay = now.getDay() // 0 = Sunday, 6 = Saturday

      // Check if today is an active day
      if (!parsedDays[currentDay]) {
        console.log("Filter is inactive today.")
        return
      }

      // Determine if the filter should be ON
      const [startHour, endHour] = parsedTimeRange
      let isFilterActive = false

      if (startHour < endHour) {
        // Normal case (e.g., 8 AM - 10 PM)
        isFilterActive = currentHour >= startHour && currentHour < endHour
      } else {
        // Overnight case (e.g., 8 PM - 6 AM)
        isFilterActive = currentHour >= startHour || currentHour < endHour
      }

      // Send message to content script
      if (isFilterActive) {
        console.log("Enabling filter.")
        // enableFilter

        await storage.set("power", true)
      } else {
        console.log("Disabling filter.")
        // disableFilter
        await storage.set("power", false)
      }
    }
  })
} catch (error) {
  console.log("error with alarm lister", error)
}
