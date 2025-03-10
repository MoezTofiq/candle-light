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

    res.send({
      error: false,
      message: "Changes Saved"
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
