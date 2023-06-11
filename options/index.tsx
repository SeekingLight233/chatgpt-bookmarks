import * as React from "react"

import { createStyles } from "~utils/base"

import "./index.css"

function SettingPage() {
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
              <label htmlFor="notion-api-key" style={styles.label}>
                Notion API Key:{" "}
              </label>
              <input id="notion-api-key" type="text" style={styles.input} />
              <label htmlFor="notion-page-id" style={styles.label}>
                Notion Page ID:{" "}
              </label>
              <input id="notion-page-id" type="text" style={styles.input} />
            </div>
          </fieldset>
        </form>
      </div>
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
    width: "100%",
    padding: "5px",
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #666",
    borderRadius: "5px",
    marginTop: "10px"
  }
})

export default SettingPage
