const {ipcRenderer} = require('electron/renderer')

const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron",{
    saveLuaCode: (code: string, name: string, shortcut: string): Promise<string> => {
        return ipcRenderer.invoke('save-lua-code', code, name, shortcut);
      }
    
})