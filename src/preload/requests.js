const { expose } = require('./utils/expose.js');
const sendRequest = require('../core/sendRequest.js');

expose('RequestAPI', {
  /**
   * Sends a request via Axios
   * @param {Object} options The request options object
   * @param {String} options.url The request url
   * @param {String} options.method The HTTP request type
   * @param {Object} options.headers The HTTP request headers
   * @param {Object|String} options.body The HTTP request body
   * @returns {Promise<Object>} The response object.
  */
  sendRequest: async (data) => await sendRequest(data)
});