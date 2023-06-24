# ChatGPT Bookmarks

A chrome extension for managing chatgpt conversations.

## 🚀Features

- Save each conversation as a bookmark.
- Sync conversation content to Notion.

## 📖Usage

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
