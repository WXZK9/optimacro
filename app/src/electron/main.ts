import {app, BrowserWindow,ipcMain} from "electron";
import path from 'path';
import fs from 'fs';
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
//type test = string;

interface SavedCodeInfo {
    name: string;
    shortcut: string;
    filePath: string;
  }
  
app.on("ready",()=>{
    const mainWindow = new BrowserWindow({
        webPreferences:{
            preload:getPreloadPath(),
        }
    });
    if(isDev()){
        mainWindow.loadURL("http://localhost:5123")
    }else{
        mainWindow.loadFile(path.join(app.getAppPath()+"/dist-react/index.html"));
    }
    //Saving lua code 
    ipcMain.handle('save-lua-code', async (_event, code: string, name: string, shortcut: string) => {
        try {
          // Save the Lua code to a file
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().replace(/[:.-]/g, '-');
          let filePath = path.join('./', `generatedCode_${formattedDate}.lua`);
          fs.writeFileSync(filePath, code, 'utf-8');
      
          // Save the name, shortcut, and filePath to a JSON file
          const jsonFilePath = path.join('./', 'savedCodes.json');
          let savedCodes: SavedCodeInfo[] = [];
          
          // Read the existing JSON file if it exists
          if (fs.existsSync(jsonFilePath)) {
            const fileData = fs.readFileSync(jsonFilePath, 'utf-8');
            savedCodes = JSON.parse(fileData);
          }
          filePath = filePath;
          // Add the new code info to the list
          savedCodes.push({ name, shortcut, filePath });
      
          // Write the updated list to the JSON file
          fs.writeFileSync(jsonFilePath, JSON.stringify(savedCodes, null, 2), 'utf-8');
      
          return filePath; 
        } catch (error) {
          console.error('Error saving file:', error);
          throw error;
        }
      });
      //Delete Macro
      ipcMain.handle("delete-macro", async (_event, filePath, updatedMacros,LuaPath) => {
        try {
          fs.writeFileSync(filePath,updatedMacros);
          fs.rmSync("./"+LuaPath);    //MOZE POWODOWAC PROBLEMY
          return { success: true };
        } catch (error) {
          console.error("Error writing to savedCodes.json:", error);
          return { success: false, error };
        }
      });
      //Fetch all macro data
      ipcMain.handle("fetch-macros", async () => {
        const filePath = "./savedCodes.json";
        try {
          const data = fs.readFileSync(filePath, "utf-8");
          return JSON.parse(data);
        } catch (error) {
          console.error("Error reading savedCodes.json:", error);
          return [];
        }
      });
    
})