'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function defaultStringifyQuery(query) {
  return _qs2['default'].stringify(query, { arrayFormat: 'brackets' });
}

function defaultParseQueryString(queryString) {
  return _qs2['default'].parse(queryString);
}

function enableQueries(createHistory) {
  return function (options) {
    var history = createHistory(options);

    var stringifyQuery = options.stringifyQuery;
    var parseQueryString = options.parseQueryString;

    if (typeof stringifyQuery !== 'function') stringifyQuery = defaultStringifyQuery;

    if (typeof parseQueryString !== 'function') parseQueryString = defaultParseQueryString;

    function listen(listener) {
      return history.listen(function (location) {
        if (!location.query) location.query = parseQueryString(location.search.substring(1));

        listener(location);
      });
    }

    function createPath(pathname, query) {
      var queryString;
      if (query == null || (queryString = stringifyQuery(query)) === '') return pathname;

      return history.createPath(pathname + (pathname.indexOf('?') === -1 ? '?' : '&') + queryString);
    }

    function pushState(state, pathname, query) {
      return history.pushState(state, createPath(pathname, query));
    }

    function replaceState(state, pathname, query) {
      return history.replaceState(state, createPath(pathname, query));
    }

    function createHref(pathname, query) {
      return history.createHref(createPath(pathname, query));
    }

    return _extends({}, history, {
      listen: listen,
      pushState: pushState,
      replaceState: replaceState,
      createPath: createPath,
      createHref: createHref
    });
  };
}

exports['default'] = enableQueries;
module.exports = exports['default'];