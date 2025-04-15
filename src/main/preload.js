const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('reststop', {
  /**
   * @param {Object} data - request config
   * @returns {Promise<Object>} - response or error from main process
   */
  sendRequest: (data) => ipcRenderer.invoke('reststop:sendRequest', data),
});