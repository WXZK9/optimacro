import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev } from "./util.js";

// Function to handle saving the JSON file
ipcMain.handle("save-json-to-file", async (event, data) => {
  try {
    const fs = require("fs");
    const os = require("os");
    const dir = path.join(os.homedir(), "MacroData"); // Save in MacroData directory
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); // Create the directory if it doesn't exist
    }

    const filePath = path.join(dir, "macro-data.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // Save the file as JSON
    return filePath; // Return the path of the saved file
  } catch (error) {
    console.error("Error saving JSON:", error);
    return null;
  }
});

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Load the preload script
      contextIsolation: true, // Ensures renderer cannot directly access Node.js APIs
      nodeIntegration: false, // Disable nodeIntegration for security
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
