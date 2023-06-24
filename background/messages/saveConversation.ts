import { Client } from "@notionhq/client"
import { markdownToBlocks } from "@tryfabric/martian"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { type Bookmark, getBookmarkLink } from "~model/sidebar"
import { getFmtTime } from "~utils/base"

export interface SaveConversationBody {
  bookmark: Bookmark
  markdownStr: string
  notionApiKey: string
  pageId: string
}
const handler: PlasmoMessaging.MessageHandler<SaveConversationBody> = async (
  req,
  res
) => {
  const { bookmark, markdownStr, notionApiKey, pageId } = req.body

  const notionClient = new Client({ auth: notionApiKey })

  const baseInfoBlocks = getComposedBaseInfoBlocks(bookmark)
  const contentBlocks = markdownToBlocks(markdownStr)
  const paddingBlocks = getPaddingBlocks()

  try {
    const insertRes = await notionClient.blocks.children.append({
      block_id: pageId,
      // @ts-ignore
      children: [...baseInfoBlocks, ...contentBlocks, ...paddingBlocks]
    })
    res.send({
      success: true,
      insertRes
    })
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    })
  }
}

function getComposedBaseInfoBlocks(bookmark: Bookmark) {
  const { title, sessionId, bookmarkId, createUnix } = bookmark
  const bookmarkLink = getBookmarkLink(sessionId, bookmarkId)

  return [
    {
      object: "block",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "🔖  ",
              link: null
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default"
            },
            // @ts-ignore
            plain_text: "🔖  ",
            href: null
          },
          {
            type: "text",
            text: {
              content: title,
              link: {
                url: bookmarkLink
              }
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default"
            },
            // @ts-ignore
            plain_text: title,
            href: bookmarkLink
          }
        ]
      }
    },
    {
      object: "block",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "⏱️  ",
              link: null
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default"
            },
            // @ts-ignore
            plain_text: "⏱️  ",
            href: null
          },
          {
            type: "text",
            text: {
              content: getFmtTime(createUnix),
              link: null
            },
            annotations: {
              bold: false,
              italic: true,
              strikethrough: false,
              underline: false,
              code: false,
              color: "gray"
            },
            // @ts-ignore
            plain_text: getFmtTime(createUnix),
            href: null
          }
        ]
      }
    }
  ]
}

function getPaddingBlocks() {
  return [
    {
      object: "block",
      type: "paragraph",
      paragraph: { rich_text: [] }
    },
    {
      object: "block",
      type: "divider",
      divider: {}
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: { rich_text: [] }
    }
  ]
}

export default handler
