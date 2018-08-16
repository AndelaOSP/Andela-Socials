import axios from 'axios';

/**
 * ApiCall - The base for all API call
 * @param {object} data
 * @param {string} type
 * @param {string} url
 * @returns {object}
 */
export default function apiCall(url, type, data,) {
  return new Promise((resolve, reject) => {
    const apiData = {
      method: type,
      url: url,
      data: data
    }
    if(apiData.data === undefined) {
      delete apiData.data;
    }
    axios(apiData)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (error) {
        return reject(error);
      });    
  });
}