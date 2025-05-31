import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('localDb', {
    getResults: () => ipcRenderer.invoke('get-results'),
    connectDb: () => ipcRenderer.invoke('connect-db'),
    executeQuery: (query: string) => ipcRenderer.invoke('execute-query', query)
});