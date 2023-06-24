# ChatGPT Bookmarks

A chrome extension for managing chatgpt conversations.

## 🎥Preview

https://github.com/SeekingLight233/chatgpt-bookmarks/assets/44890048/33630952-ee4c-418b-b054-d882392f483d

## 🚀Features

- Save each conversation as a bookmark.
- Sync conversation content to Notion.

## 📖Usage

### Installation

Click here to install the extension: [chrome web store](https://chrome.google.com/webstore/detail/chatgpt-bookmarks/okjgjgjgjgjgjgjgjgjgjgjgjgjgjgj).

### Sync to notion config

1. Click here to create a Notion API key: [Notion Integrations](https://www.notion.so/my-integrations)
2. After creating, in the Notion page, click on the `...` on the right side, select `Add Connections`, and find the Notion integration you just created.
   ![alt](./assets/add_connections.jpg)
3. In Chrome, right-click on the ChatGPT-Bookmarks extension icon, click on `Options` to enter the configuration page.
4. On the configuration page, fill in the Notion API key and Notion page id.

https://github.com/SeekingLight233/chatgpt-bookmarks/assets/44890048/3c0b10c6-8ec7-43fb-b04c-06f0b41cb3a4

⚠️: Notion page id is a string of characters in the URL of the Notion page. For example, `https://www.notion.so/ChatGPT-Bookmarks-0e1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`, the Notion page id is `0e1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`.

## 🤝Contribution

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit plasmo Documentation](https://docs.plasmo.com/)
