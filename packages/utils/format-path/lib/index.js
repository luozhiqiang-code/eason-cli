"use strict";

const path = require("path");

module.exports = formatPath;

// 格式化路径分隔符为 "\"
function formatPath(p) {
  if (p && typeof p === "string") {
    const seperate = path.sep;

    if (seperate === "/") {
      return p;
    } else {
      return p.replace(/\\/g, "/");
    }
  }

  return p;
}
