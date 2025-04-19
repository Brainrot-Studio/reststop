const { expose } = require('./utils/expose.js');
const sendRequest = require('../core/sendRequest.js');

expose('RequestAPI', {
  sendRequest: async (data) => await sendRequest(data)
});