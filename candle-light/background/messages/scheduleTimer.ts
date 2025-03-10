import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("got message from the pop up script ", req)

  // adding to storage

  try {
    const activeDays = req.body.activeDays
    const timeRange = req.body.timeRange
    const timerEnabled = req.body.timerEnabled

    const storage = new Storage()

    await storage.set("timerEnabled", timerEnabled.toString())
    await storage.set("timeRange", JSON.stringify(timeRange))
    await storage.set("activeDays", JSON.stringify(activeDays))

    scheduleAlarms()

    res.send({
      error: false,
      message: "Changes Saved, will be applied at the start of the next hour"
    })
  } catch (error) {
    res.send({
      error: true,
      message: "unable to save change due to a un-expected error"
    })
  }

  /*
  need to add check for alarm and inform the user about it 
  need to add message for success set or error set and alarm permission not given
  */
}

export default handler

async function scheduleAlarms() {
  console.log("Scheduling alarms...")

  const storage = new Storage()
  const timerEnabled = await storage.get("timerEnabled")
  const timeRange = await storage.get("timeRange")
  const activeDays = await storage.get("activeDays")

  if (timerEnabled !== "true") {
    console.log("Timer is disabled, clearing alarms...")
    chrome.alarms.clearAll()
    return
  }

  const [startHour, endHour] = timeRange ? JSON.parse(timeRange) : [18, 6]
  const parsedDays = activeDays
    ? JSON.parse(activeDays)
    : [false, false, false, false, false, false, false]

  chrome.alarms.clearAll() // Clear existing alarms before scheduling new ones

  for (let day = 0; day < 7; day++) {
    if (parsedDays[day]) {
      scheduleAlarm("enableFilter", startHour, day)
      scheduleAlarm("disableFilter", endHour, day)
    }
  }
}

function scheduleAlarm(name, hour, day) {
  const now = new Date()
  const nextTrigger = new Date()

  nextTrigger.setDate(now.getDate() + ((day - now.getDay() + 7) % 7)) // Get next occurrence of the selected day
  nextTrigger.setHours(hour, 0, 0, 0) // Set alarm time

  if (nextTrigger < now) {
    nextTrigger.setDate(nextTrigger.getDate() + 7) // Schedule for the next week if the time has already passed
  }

  chrome.alarms.create(`${name}_${day}`, {
    when: nextTrigger.getTime(),
    periodInMinutes: 7 * 24 * 60 // Repeat every 7 days
  })

  console.log(`Scheduled ${name} alarm for ${nextTrigger} (Repeats Weekly)`)
}
