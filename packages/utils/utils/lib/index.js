"use strict";

function isObject(o) {
  return Object.prototype.toString.call(o) === "[object object]";
}

module.exports = { isObject };
