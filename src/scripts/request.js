const config = require('./config.js');
const retry = (urls, request, resolve, reject) => {
  if (!Array.isArray(urls) || !urls.length) {
    return reject();
  }
  request(urls.shift()).then(function(data) {
    resolve(data)
  }).catch(err => {
    retry(urls, request, resolve, reject)
  });
};
module.exports = function(key, request) {
  const urls = Array().concat(config[key + 's'] || config[key]);
  return new Promise((resolve, reject) => {
    retry(urls, request, resolve, reject);
  })
}