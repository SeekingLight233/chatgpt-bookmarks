import * as React from "react"
import { useState } from "react"

import { createStyles } from "~utils/base"

import "./index.css"

import { useDebounceEffect, useMemoizedFn, useMount } from "ahooks"
import toast, { Toaster } from "react-hot-toast"

import HelpIcon from "~components/Icons/HelpIcon"
import SyncIcon from "~components/Icons/SyncIcon"
import UnBindIcon from "~components/Icons/UnBindIcon"
import {
  addNotionPageId,
  bingNotionPage,
  dataSyncStore,
  initData,
  removeNotionPageId,
  setNotionApiKey,
  setNotionPageId,
  setNotionPageTitle,
  setNotionPages,
  settingNotionApiKey,
  settingNotionPages
} from "~model/dataSync"
import storage from "~utils/storage"

function SettingPage() {
  const { notionApiKey, notionPages } = dataSyncStore
  const [loading, setLoading] = useState(false)

  useMount(initData)

  useDebounceEffect(
    () => {
      console.log("persist notionApiKey:", notionApiKey)
      storage.set(settingNotionApiKey, notionApiKey)
    },
    [notionApiKey],
    { wait: 200 }
  )

  useDebounceEffect(
    () => {
      console.log("persist notionPages:", notionPages)
      storage.set(settingNotionPages, notionPages)
    },
    [notionPages],
    { wait: 200 }
  )

  const handleNotionApiKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNotionApiKey(event.target.value)
  }

  const handleClickSync = useMemoizedFn(
    async (pageId: string, index: number) => {
      setLoading(true)
      const res = await bingNotionPage(pageId, notionApiKey)
      setLoading(false)
      if (res.success) {
        toast.success("sync success")
        setNotionPageTitle(res.title, index)
      } else {
        toast.error(res.message, { duration: 4000 })
      }
    }
  )

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <form>
          <fieldset style={styles.fieldset}>
            <legend>Theme</legend>
            <select style={styles.select} defaultValue="auto">
              <option value="auto">auto</option>
              <option value="dark">dark</option>
              <option value="light">light</option>
            </select>
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend>Data Sync</legend>
            <div>
              <span style={styles.row}>
                <h4>notion</h4>
                <HelpIcon></HelpIcon>
              </span>

              <input
                value={notionApiKey}
                placeholder="notion api key"
                onChange={handleNotionApiKeyChange}
                id="notion-api-key"
                type="text"
                style={styles.input}
              />
              {notionPages.map(({ pageId, title }, index) => {
                const disabled = title ? true : false
                return (
                  // Map notionPageIds to multiple inputs
                  <div style={styles.inputGroup} key={index}>
                    <input
                      key={`notion-page-title-${index}`}
                      id={`notion-page-id-${index}`}
                      placeholder="notion page id"
                      type="text"
                      style={{
                        ...styles.input,
                        cursor: disabled ? "not-allowed" : "auto"
                      }}
                      value={title ? title : pageId}
                      disabled={disabled}
                      onChange={(e) => setNotionPageId(e.target.value, index)}
                    />
                    {title ? (
                      <UnBindIcon
                        style={styles.icon}
                        onClick={() => removeNotionPageId(index)}></UnBindIcon>
                    ) : (
                      <SyncIcon
                        onClick={() => handleClickSync(pageId, index)}
                        loading={loading}
                        style={styles.icon}></SyncIcon>
                    )}
                  </div>
                )
              })}
              <button
                style={styles.addButton}
                type="button"
                onClick={addNotionPageId}>
                Add Page ID
              </button>
            </div>
          </fieldset>
        </form>
      </div>
      <Toaster />
    </main>
  )
}

const styles = createStyles({
  page: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#444654",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    color: "#fff",
    backgroundColor: "#333",
    width: "400px",
    margin: "0 auto",
    marginTop: -200,
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
  },
  fieldset: {
    border: "1px solid #666",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
  },
  select: {
    display: "block",
    width: "100%",
    padding: "5px",
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #666",
    borderRadius: "5px",
    marginTop: "10px"
  },
  label: {
    display: "block",
    marginTop: "10px"
  },
  input: {
    display: "block",
    width: "96%",
    padding: "5px",
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #666",
    borderRadius: "5px",
    marginTop: "10px"
  },
  inputGroup: {
    display: "flex",
    alignItems: "center"
  },

  removeButton: {
    marginLeft: "10px",
    backgroundColor: "transparent",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },

  addButton: {
    display: "block",
    width: "100%",
    padding: "5px",
    marginTop: "10px",
    color: "#fff",
    backgroundColor: "transparent",
    border: "1px dashed #666",
    borderRadius: "5px",
    cursor: "pointer"
  },
  icon: { marginTop: 10, marginLeft: 6 },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
    height: 30,
    alignItems: "center"
  }
})

export default SettingPage
