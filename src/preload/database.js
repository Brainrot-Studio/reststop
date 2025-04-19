const { expose } = require('./utils/expose.js');
const RequestHistory = require('../database/requestHistory.js');

expose('DatabaseAPI', {
  getHistory: async () => await RequestHistory.getHistory(),
  addHistory: async (data) => await RequestHistory.addHistory(data)
});