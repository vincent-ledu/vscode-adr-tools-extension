const fs = require('fs')
const path = require('path')

/**
 * filter element that match adrfilename pattern 0001-my_adr_name.md
 * @param {String} element filename to filter
 */
function filePattern (element) {
  return element.match(/(\d){4}-([\w\d'-_]*)\.md/)
};

/**
 * return ADR filename
 * @param {String} adrDir Adr folder
 */
function getADRFiles (adrDir) {
  let list = fs.readdirSync(adrDir)
  let files = []
  list.filter(filePattern).forEach(function (value) {
    files.push(value)
  })
  return files
}

/**
 * Create folders recursively
 * @param {String} targetDir target directory to delete
 * @param {*} param1 boolean to tell if path is relative to targetdir
 */
function mkDirByPathSync (targetDir, { isRelativeToScript = false } = {}) {
  const sep = path.sep
  const initDir = path.isAbsolute(targetDir) ? sep : ''
  const baseDir = isRelativeToScript ? __dirname : '.'

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir)
    try {
      fs.mkdirSync(curDir)
    } catch (err) {
      if (err.code === 'EEXIST') {
        // curDir already exists!
        return curDir
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`)
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1
      if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
        throw err // Throw if it's just the last created dir.
      }
    }

    return curDir
  }, initDir)
}

module.exports.mkDirByPathSync = mkDirByPathSync
module.exports.getADRFiles = getADRFiles