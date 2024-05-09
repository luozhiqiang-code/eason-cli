#! /usr/bin/env node

const importLocal = require("import-local");

// 当本地node_modules和全局node_modules都安装了脚手架，优先执行本地的
if (importLocal(__dirname)) {
  require("npmlog").info("cli", "正在使用 eason-cli 本地版本");
} else {
  require("../lib")(process.argv.slice(2));
}
