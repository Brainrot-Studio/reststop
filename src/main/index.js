const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

// Initial set up
app.setName('RESTStop');

function createWindow () {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: true
    }
  });
  win.maximize();
  win.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
}

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