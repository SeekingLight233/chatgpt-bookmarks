import { Client } from "@notionhq/client"
import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { pageId, notionApiKey } = req.body
  const notionClient = new Client({ auth: notionApiKey })

  try {
    let hasMore = true;
    let startCursor: string | undefined = undefined;
    const allBlocks: any[] = [];

    while (hasMore) {
      const blocksResponse = await notionClient.blocks.children.list({
        block_id: pageId,
        start_cursor: startCursor,
        page_size: 100  // This is the maximum number of blocks you can fetch in a single request.
      });

      allBlocks.push(...blocksResponse.results);

      hasMore = blocksResponse.has_more;
      startCursor = blocksResponse.next_cursor;
    }

    res.send({ success: true, blocks: allBlocks });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
}

export default handler;
