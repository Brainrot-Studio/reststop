const axios = require('axios');

/**
 * Sends a request via Axios
 * @param {Object} options The request options object
 * @param {String} options.url The request url
 * @param {String} options.method The HTTP request type
 * @param {Object} options.headers The HTTP request headers
 * @param {Object|String} options.body The HTTP request body
 * @returns {Promise<Object>} The response object.
 */
module.exports = async function sendRequest({ url, method, headers, body }) {
    const startTime = Date.now(); // start timer

    try {
        const response = await axios({ url, method, headers, data: body });
        const duration = Date.now() - startTime; // end timer

        return {
            success: true,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            url: url,
            data: response.data,
            duration // in ms
        };
    } catch (error) {
        const duration = Date.now() - startTime;

        return {
            success: false,
            error: error.message,
            status: error.response?.status,
            data: error.response?.data,
            duration
        };
    }
};
