const { expose } = require('./utils/expose.js');
const RequestHistory = require('../database/requestHistory.js');

expose('DatabaseAPI', {
  /**
   * Gets all of a user's request history
   * @returns {Promise<Object[]>} The response object.
  */
  getHistory: async () => await RequestHistory.getHistory(),
  /**
   * Adds an entry to the user's history save file
   * @param {Object} req The request options object.
   * @param {Object} res The response data.
   * @returns {Promise<Boolean>} The response object.
  */
  addHistory: async (data) => await RequestHistory.addHistory(data)
});