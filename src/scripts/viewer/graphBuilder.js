/**
 * Creates a graph for a give package name
 */
var createGraphBuilder = require('npmgraphbuilder');
var registryUrl = require('../config.js').registryUrl;
var requestWrapper = require('../request.js');

module.exports = buildGraph;

function buildGraph(pkgName, version, http, changed) {
  var graph = require('ngraph.graph')({uniqueLinkId: false});

  var graphBuilder = createGraphBuilder(function (url) {
    var name = url.slice(registryUrl.length);
    return requestWrapper('registryUrl', function(url2) {
      return http.get(url2 + name);
    })
  }, registryUrl);

  graphBuilder.notifyProgress(changed);
  var promise = graphBuilder.createNpmDependenciesGraph(pkgName, graph, version);

  return {
    graph: graph,
    start: promise
  };
}
