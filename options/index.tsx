import * as React from "react";
import { useState } from "react";

import { createStyles } from "~utils/base";
import "./index.css";

import { useDebounceEffect, useMount } from "ahooks";

import {
  dataSyncStore,
  initData,
  setNotionApiKey,
  setNotionPageIds,  // Change to notionPageIds
  settingNotionApiKey,
  settingNotionPageIds  // Change to notionPageIds
} from "~model/dataSync";
import storage from "~utils/storage";
import SyncIcon from "~components/Icons/SyncIcon";

function SettingPage() {
  const { notionApiKey, notionPageIds } = dataSyncStore;  // Change to notionPageIds

  useMount(initData);

  useDebounceEffect(
    () => {
      storage.set(settingNotionApiKey, notionApiKey);
    },
    [notionApiKey],
    { wait: 200 }
  );

  useDebounceEffect(
    () => {
      storage.set(settingNotionPageIds, notionPageIds);  // Change to notionPageIds
    },
    [notionPageIds],  // Change to notionPageIds
    { wait: 200 }
  );

  const handleNotionApiKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNotionApiKey(event.target.value);
  };

  const handleNotionPageIdChange = (index: number) => ( // Update to handle array input
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newNotionPageIds = [...notionPageIds];
    newNotionPageIds[index] = event.target.value;
    setNotionPageIds(newNotionPageIds);
  };

  const addNotionPageId = () => {
    setNotionPageIds([...notionPageIds, '']);
  };

  const removeNotionPageId = (index: number) => {
    setNotionPageIds(notionPageIds.filter((_, idx) => idx !== index));
  };

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
              <h4>notion</h4>
              <input
                value={notionApiKey}
                placeholder="notion api key"
                onChange={handleNotionApiKeyChange}
                id="notion-api-key"
                type="text"
                style={styles.input}
              />
              {
                notionPageIds.map((pageId, index) => ( // Map notionPageIds to multiple inputs
                  <div style={styles.inputGroup} key={index}>
                    <input
                      id={`notion-page-id-${index}`}
                      placeholder="notion page id"
                      type="text"
                      style={styles.input}
                      value={pageId}
                      onChange={(e) => handleNotionPageIdChange(e, index)}
                    />

                    <SyncIcon style={{marginTop:10}}></SyncIcon>
                    {/* <button style={styles.removeButton} type="button" onClick={() => removeNotionPageId(index)}>-</button> */}
                  </div>
                ))
              }
              <button style={styles.addButton} type="button" onClick={addNotionPageId}>Add Page ID</button>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
  );
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
    alignItems: "center",
  },

  removeButton: {
    marginLeft: "10px",
    backgroundColor: "transparent",
    color: "#fff",
    border: "none",
    cursor: "pointer",
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
    cursor: "pointer",
  },
})

export default SettingPage
