var cache = Object.create(null);
var npa = require('npm-package-arg');
var requestWrapper = require('./request.js');

module.exports = getPackageVersions;

function getPackageVersions(http, q, packageName) {
  var cached = cache[packageName];
  if (cached) {
    return q.when(cached);
  }

  var escapedName = npa(packageName).escapedName;
  if (!escapedName) {
    throw new Error('Could not escape ' + packageName);
  }
  
  return requestWrapper('registryUrl', function(url) {
    return http.get(url + escapedName)
  })
  .then(function(response) {
    var versions = Object.keys(response.data.versions);
    return versions;
  });
}
