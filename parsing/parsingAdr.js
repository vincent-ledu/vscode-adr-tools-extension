const fs = require('fs')
const path = require('path')
const logger = require('../common/logger')

/**
 * Look in the first line of text of the file, beginning with '# digit. Title'
 * @param {String} adrDir folder where are stored adrs
 * @param {String} file filename of the adr to parse
 */
function getTitle (adrDir, file) {
  let data = fs.readFileSync(path.join(adrDir, file), 'utf8')
  let res = data.match(/^#[ \t]*\d+[ \t]*\.([ \t\w,-]*)$/m)
  if (res.length === 2) {
    return res[1].trim()
  }
}

/**
 * Get content of the Status section
 * @param {String} adrDir adr folder
 * @param {String} file ADR filename
 */
function getStatusSection (adrDir, file) {
  let data = fs.readFileSync(path.join(adrDir, file), 'utf8')
  let res = data.match(/^## Status\s*([\w\W]*)^## Context/m)
  if (res.length === 2) {
    return res[1].trim()
  }
}

/**
 * Get the actual status from the status section
 * @param {String} data content in the status section
 */
function getStatus (data) {
  let res = data.match(/^Status:[ \t]*([\w \t]+) on ([\w -]+)$/m)
  if (res.length > 1) {
    return { 'status': res[1].trim(), 'date': Date.parse(res[2].trim()) }
  } else {
    logger.vsLog('error, no status found')
  }
}

function getPreviousStatus (data) {
  const regex = /^Previous status:[ \t]*([\w \t]+) on ([\w -]+)$/mg
  let res = []
  let m
  while ((m = regex.exec(data)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    if (m.length === 3) {
      res.push({ 'status': m[1].trim(), 'date': Date.parse(m[2].trim()) })
    }
  }
  return res
}

function getRelations (data) {
  const regex = /^([\w \t-]+)\[([\d\w-]+\.md)\]\([\d\w-]+\.md\) on ([\w -]+)$/gm
  let res = []
  let m
  while ((m = regex.exec(data)) != null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    if (m.length === 4) {
      res.push({ 'link': m[1].trim(), 'adrFilename': m[2].trim(), 'date': Date.parse(m[3].trim()) })
    }
  }
  return res
}

module.exports.getStatusSection = getStatusSection
module.exports.getStatus = getStatus
module.exports.getPreviousStatus = getPreviousStatus
module.exports.getRelations = getRelations
module.exports.getTitle = getTitle
