import {app, BrowserWindow,ipcMain} from "electron";
import path from 'path';
import fs from 'fs';
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
//type test = string;
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
    
    ipcMain.handle('save-lua-code', async (event,code: string) => {
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().replace(/[:.-]/g, '-');  
            const filePath = path.join('/home/bary/Desktop/Opti/optimacro/app/src/electron/MacroData', `generatedCode_${formattedDate}.lua`);
            fs.writeFileSync(filePath, code, 'utf-8');
            return filePath; // Return the file path to notify success
        } catch (error) {
            console.error('Error saving file:', error);
            throw error;
        }
      });
      
    
})