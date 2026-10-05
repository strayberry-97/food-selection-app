const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const db = require('./database')
const projectRoot = path.join(__dirname, '..', '..')
const pagesPath = path.join(__dirname, '..', 'renderer', 'pages')

require('electron-reload')(projectRoot);

function handleGetMeals(){
  const query = db.prepare(`SELECT *
           FROM meals`);

  return query.all();
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 673,
    height: 408,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    }
  })

  win.loadFile(path.join(pagesPath, 'result.html'))
}

ipcMain.on('minimize-window', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize()
})

ipcMain.on('close-window', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close()
})

ipcMain.handle('database:getMeals', handleGetMeals)

app.whenReady().then(() => {
  
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})