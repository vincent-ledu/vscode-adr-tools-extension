const fs = require('fs')
const logger = require('./common/logger')

function deleteFolderRecursive (path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })

    logger.vsLog(`Deleting directory "${path}"...`)
    fs.rmdirSync(path)
  }
};
exports.deleteFolderRecursive = deleteFolderRecursive
