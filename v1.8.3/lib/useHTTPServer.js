'use strict';

exports.__esModule = true;

var _http = require('http');

var _toughCookie = require('tough-cookie');

function getStateFromRequest(request, secret) {
  return request.headers.cookie;
}

function useHTTPServer(createHistory) {
  return function (options) {
    var history = createHistory(options);
    var secret = options.secret;

    var server = _http.createServer(function (request, response) {});

    function listen(listener) {
      function handleRequest(request, response) {
        var location = createLocation(request.url, getStateFromRequest(request));
      }

      server.on('request', handleRequest);

      return function () {
        server.removeListener('request', handleRequest);
      };
    }

    server.listen(port);
  };
}

exports['default'] = useHTTPServer;
module.exports = exports['default'];