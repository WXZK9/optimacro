import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  saveJsonToFile: (data: any) => ipcRenderer.invoke('save-json-to-file', data),
});