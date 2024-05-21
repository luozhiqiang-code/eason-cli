"use strict";

const axios = require("axios");
const urlJoin = require("url-join");
const semver = require("semver");

// 获取npm包的信息
function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null;
  }

  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  return axios
    .get(npmInfoUrl)
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      }

      return null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

/**
 * 获取默认下载源
 */

function getDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npmmirror.com/";
}

/**
 * 获取npm版本数组
 */
async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}

/**
 * 获取某版本以上的版本数组，降序排列
 */
function getSemverVersions(baseVersion, versions) {
  return versions
    .filter((version) => semver.satisfies(version, `>${baseVersion}`))
    .sort((next, pre) => (semver.gt(pre, next) ? 1 : -1));
}

/**
 * 获取某个版本以上的版本中最新的
 */
async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0];
  }

  return null;
}

/**
 * 获取某个包的最新版本
 */
async function getNpmLatestVersion(npmName, registry) {
  let versions = await getNpmVersions(npmName, registry);

  if (versions) {
    return versions.sort((next, pre) => (semver.gt(pre, next) ? 1 : -1))[0];
  }
  return null;
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersion,
  getDefaultRegistry,
  getNpmLatestVersion,
};
