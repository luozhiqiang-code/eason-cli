"use strict";

module.exports = core;

const fs = require("fs");
const pkg = require("../package.json");
const userHome = require("user-home");
const colors = require("colors/safe");
const semver = require("semver");
const log = require("@eason-cli/log");
const path = require("path");
const constant = require("./const");

async function core() {
  try {
    await prepare();
  } catch (e) {
    console.error(e);
  }
}

// 脚手架执行前准备阶段（检查版本、root权限、用户主目录等）
async function prepare() {
  checkPkgVersion();
  checkRoot();
  checkUserHome();
  checkEnv();
  await checkGlobalUpdate();
}

function checkPkgVersion() {
  log.info("cli", pkg.version);
}

function checkRoot() {
  // 检查 root权限
  const rootCheck = require("root-check");
  rootCheck();
}

function checkUserHome() {
  // 检测用户主目录
  if (!userHome || !fs.existsSync(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在！"));
  }
}

function checkEnv() {
  // 检查.env文件
  const dotenv = require("dotenv");
  const dotenvPath = path.resolve(userHome, ".env");

  if (fs.existsSync(dotenvPath)) {
    // 如果主目录下.env文件存在，则读取
    dotenv.config({ path: dotenvPath });
  }

  createDefaultConfig();
}

function createDefaultConfig() {
  const cliConfig = { home: userHome };
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
}

async function checkGlobalUpdate() {
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  const { getNpmSemverVersion } = require("@eason-cli/get-npm-info");
  const latestVersion = await getNpmSemverVersion(currentVersion, "pnpm");
  if (latestVersion && semver.gt(latestVersion, currentVersion)) {
    log.warn(
      colors.yellow(
        `请手动更新${npmName}, 当前版本${currentVersion}, 最新版本：${latestVersion}
         更新命令：npm install -g ${npmName}`
      )
    );
  }
}
