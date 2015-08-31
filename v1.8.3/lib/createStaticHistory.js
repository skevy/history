'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _createHistory = require('./createHistory');

var _createHistory2 = _interopRequireDefault(_createHistory);

function createStaticHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var location = options.location;

  _invariant2['default'](location != null, 'Static history needs a location');

  function getCurrentLocation() {
    return location;
  }

  return _createHistory2['default'](_extends({}, options, {
    getCurrentLocation: getCurrentLocation
  }));
}

exports['default'] = createStaticHistory;
module.exports = exports['default'];