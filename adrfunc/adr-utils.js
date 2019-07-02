const fs = require('fs')
const path = require('path')
const mustache = require('mustache')

const utils = require('../common/utils')

/**
 * Clean ADR name user input to make a filename
 * @param {String} adrName the ADR name typed by the user
 */
function sanitizedAdrName (adrName) {
  return adrName
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/'/, '-')
}

/**
 * return list of ADR files
 * @param {String} adrPath path where ADR are stored
 */
function getAllAdr (adrPath) {
  return utils.getADRFiles(adrPath)
}

/**
 * Return the last index
 * @param {String} adrPath Folder where are stored ADR
 */
function getLastIndex (adrPath) {
  var lastIndex = -1
  let files = utils.getADRFiles(adrPath)
  files.forEach(file => {
    var index = parseInt(file.split('-')[0])
    if (isNaN(index)) {
      index = 0
    }
    lastIndex = Math.max(lastIndex, index)
  })
  return lastIndex
}

/**
 * Create new ADR
 * @param {Object} adrAttr Object containing: srcAdrName, status, linkType, tgtAdrName
 * @param {String} srcAdrName Name of the ADR to create
 * @param {String} linkType link to add between 2 ADR if provided
 * @param {String} tgtAdrName filename of the ADR to link to
 * @param {String} adrPath Folder where to store ADR
 * @param {String} adrTemplatePath Folder where are stored ADR templates
 */
function createNewAdr (adrAttr, adrPath, adrTemplatePath) {
  console.log(
    'create new adr ' + adrAttr.srcAdrName + ' in ' + adrPath + ' from templatepath ' + adrTemplatePath
  )
  let srcAdrSanitizeName = ''
  let lastIndex = getLastIndex(adrPath)
  lastIndex = '' + (lastIndex + 1)
  var data = ''
  let d = new Date().toISOString().split('T')[0]
  data = {
    date: d,
    status: '' + adrAttr.status + ' on ' + d,
    'adr-index': lastIndex,
    'adr-name': '' + adrAttr.srcAdrName + ''
  }
  srcAdrSanitizeName = lastIndex.padStart(4, '0') + '-' + sanitizedAdrName(adrAttr.srcAdrName) + '.md'

  if (adrAttr.linkType != null && adrAttr.tgtAdrName != null) {
    data['links'] = adrAttr.linkType + ' [' + adrAttr.tgtAdrName + '](' + adrAttr.tgtAdrName + ') on ' + d
    let tgtFilePath = adrPath + path.sep + adrAttr.tgtAdrName
    let linkedType = adrAttr.linkType.replace(/s$/, 'ed by')
    if (adrAttr.linkType.trim().endsWith('es')) {
      linkedType = adrAttr.linkType.trim().replace(/es$/, 'ed by')
    }
    addLink(srcAdrSanitizeName, tgtFilePath, linkedType)
  }
  let templateContent = fs.readFileSync(adrTemplatePath + path.sep + 'index-recordname.md', 'utf8')

  let output = mustache.render(templateContent, data)
  fs.writeFileSync(adrPath + path.sep + srcAdrSanitizeName, output)
  return adrPath + path.sep + srcAdrSanitizeName
}

/**
 * change status of an adr
 * @param {String} adrFilename filename of the adr
 * @param {String} status new status
 */
function changeStatus (adrFilePath, status) {
  let data = fs.readFileSync(adrFilePath, 'utf8')
  let d = new Date().toISOString().split('T')[0]
  var result = ''
  result = data.replace(
    /^## Status([\s\S]+)^Status:([\w \t-]*)$/m,
    '## Status$1Status: ' + status + ' on ' + d + '  \nPrevious status:$2\n'
  )
  fs.writeFileSync(adrFilePath, result, 'utf8', function (err) {
    if (err) return console.log(err)
  })
}

/**
 * add a relation between 2 ADR.
 * A special case for "supersed" relation:
 *  * it replace the current status instead of adding a new relation.
 * @param {String} srcAdrName adr source
 * @param {String} tgtFilePath file path of targeted adr
 * @param {String} linkType link type for linking the 2 ADR
 */
function addLink (srcAdrName, tgtFilePath, linkType) {
  console.log('add link ' + linkType + ' ' + srcAdrName + ' to ' + tgtFilePath)
  if (linkType === 'Superseded by') {
    changeStatus(tgtFilePath, 'Superseded')
  }
  let data = fs.readFileSync(tgtFilePath, 'utf8')
  let d = new Date().toISOString().split('T')[0]
  let result = data.replace(
    /^## Status([\s\S]+)^Status:([\w \t-]*)$/m,
    '## Status$1Status:$2\n' + linkType + ' [' + srcAdrName + '](' + srcAdrName + ') on ' + d + '  '
  )
  fs.writeFileSync(tgtFilePath, result, 'utf8')
}

function init (adrPath, adrTemplatePath, gitRepo) {
  if (!fs.existsSync(adrPath)) {
    utils.mkDirByPathSync(adrPath)
  }
  if (!fs.existsSync(adrTemplatePath)) {
    utils.mkDirByPathSync(adrTemplatePath)

    const cp = require('child_process')
    let result = cp.execSync('git clone ' + gitRepo + ' ' + adrTemplatePath, { stdio: 'inherit' })
    console.log(result)
  } else {
    // TODO : find something to do...
  }

  var data = ''
  let d = new Date().toISOString().split('T')[0]
  data = {
    date: d,
    status: 'Accepted on ' + d
  }
  let output = mustache.render(
    fs.readFileSync(adrTemplatePath + path.sep + '0000-record-architecture-decisions.md', 'utf8'),
    data)
  fs.writeFileSync(adrPath + path.sep + '0000-record-architecture-decisions.md', output)
}

exports.init = init
exports.getAllAdr = getAllAdr
exports.createNewAdr = createNewAdr
exports.addLink = addLink
exports.changeStatus = changeStatus
