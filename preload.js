const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    launchAppWithURL: (data) => ipcRenderer.send('launch-url', data),
    hideLauncher: () => ipcRenderer.send('hide-launcher')
});