import { markdownToBlocks } from "@tryfabric/martian"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { insertBlocks } from "../index"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const blocks = markdownToBlocks(req.body)
  console.log(blocks)

  insertBlocks(blocks)
}

export default handler
