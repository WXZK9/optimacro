const {ipcRenderer} = require('electron/renderer')

const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron",{
    saveLuaCode: (code: string): Promise<string> => ipcRenderer.invoke('save-lua-code', code),
})