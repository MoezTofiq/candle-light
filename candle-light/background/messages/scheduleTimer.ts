import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = "temp return"

  console.log("got message from the pop up script ", req)

  res.send({
    message
  })
}

export default handler
