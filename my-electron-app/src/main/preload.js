const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('minimize-window'),
    close: () => ipcRenderer.send('close-window')
});

contextBridge.exposeInMainWorld('databaseAPI', {
    getMeals: () => ipcRenderer.invoke('database:getMeals')
});

contextBridge.exposeInMainWorld('recommendationAPI', {
    getRecommendation: () => ipcRenderer.invoke('recommender:getRecommendation')
})