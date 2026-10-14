const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('minimize-window'),
    close: () => ipcRenderer.send('close-window')
});

contextBridge.exposeInMainWorld('databaseAPI', {
    getMeals: () => ipcRenderer.invoke('database:getMeals'),
    getCuisines: () => ipcRenderer.invoke('database:getCuisines'),
    getRestaurants: () => ipcRenderer.invoke('database:getRestaurants'),
    getTags: () => ipcRenderer.invoke('database:getTags'),
    savePreferences: (preferences) => ipcRenderer.invoke('database:savePreferences', preferences),
    loadPreferences: () => ipcRenderer.invoke('database:loadPreferences')
});

contextBridge.exposeInMainWorld('recommendationAPI', {
    getRecommendation: () => ipcRenderer.invoke('recommender:getRecommendation')
})

contextBridge.exposeInMainWorld('historyAPI', {
    add: (mealId, rating) => ipcRenderer.invoke('history:add', mealId, rating),
    retrieve: () => ipcRenderer.invoke('history:retrieve'),
    decline: (mealId, reason) => ipcRenderer.invoke('history:decline', mealId, reason),
    updateRating: (historyId, rating) => ipcRenderer.invoke('history:updateRating', historyId, rating),
    declinedHistory: () => ipcRenderer.invoke('history:declinedHistory')
})

