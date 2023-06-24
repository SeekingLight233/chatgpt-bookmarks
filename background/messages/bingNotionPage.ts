import { Client } from "@notionhq/client"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { pageId, notionApiKey } = req.body
  const notionClient = new Client({ auth: notionApiKey })
  try {
    const getPageRes = await notionClient.pages.retrieve({
      page_id: pageId
    })
    console.log("getPageResponse", getPageRes)
    // @ts-ignore
    const title =
      getPageRes?.properties?.title?.title?.[0]?.plain_text ?? "Untitled"
    res.send({ success: true, title })
  } catch (error) {
    res.send({ success: false, message: error.message })
  }
}

export default handler
