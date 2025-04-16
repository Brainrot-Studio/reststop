const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const sendRequest = require('../renderer/js/sendRequest');

// Initial set up
app.setName('RESTStop');

function createWindow () {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.maximize();
  win.loadFile(path.join(__dirname, '../renderer/html' ,'index.html'));
}

// Listeners
ipcMain.handle('reststop:sendRequest', async (event, data) => {
    return await sendRequest(data);
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});