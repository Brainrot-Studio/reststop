const { contextBridge } = require('electron');

/**
 * Exposes an API into the renderer process
 * @param {string} name - The key in window (e.g., 'RequestAPI')
 * @param {object} api - An object of functions or data to expose
 */
function expose(name, api) {
  contextBridge.exposeInMainWorld(name, api);
}

module.exports = { expose };