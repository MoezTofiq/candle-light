import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = "temp return"

  console.log("got message from the pop up script ", req)

  const activeDays = req.body.activeDays
  const timeRange = req.body.timeRange
  const timerEnabled = req.body.timerEnabled

  const storage = new Storage()

  await storage.set("timerEnabled", timerEnabled.toString())
  await storage.set("timeRange", JSON.stringify(timeRange))
  await storage.set("activeDays", JSON.stringify(activeDays))

  res.send({
    message
  })
}

export default handler
