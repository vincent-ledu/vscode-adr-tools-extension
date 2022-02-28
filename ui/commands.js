const vscode = require('vscode')
const adrUtils = require('../adrfunc/adr-utils')
const path = require('path')
const parsing = require('../parsing/parsingAdr')
const graph = require('../reports/graph')
const logger = require('../common/logger')
const UriUtils = require('vscode-uri').Utils

async function adrInit () {
  let configuredAdrProjectDirectory = path.normalize(vscode.workspace.getConfiguration().get('adr.project.directory'))
  const adrProjectDirectory = await vscode.window
    .showInputBox({
      value: configuredAdrProjectDirectory,
      prompt: 'Enter your adr directory destination:',
      placeHolder: 'Your ADR folder in this workspace'
    })
  if (!adrProjectDirectory) return
  let configuredTemplateRepo = vscode.workspace.getConfiguration().get('adr.templates.repo')
  vscode.window
    .showInputBox({
      value: configuredTemplateRepo,
      prompt: 'Enter your adr templates git repo url:',
      placeHolder: 'https://yourGitRepoWithADRTemplates'
    })
    .then(adrTemplateGitRepo => {
      if (!adrTemplateGitRepo) return
      let configuredTemplateDirectory = path.normalize(vscode.workspace.getConfiguration().get('adr.templates.directory'))
      vscode.window
        .showInputBox({
          value: configuredTemplateDirectory,
          prompt: 'Enter your adr templates Directory path for this workspace:',
          placeHolder: '.adr-templates'
        })
        .then(adrTemplateDirectory => {
          if (!adrTemplateDirectory) return
          logger.vsLog('adr.project.directory: ' + adrProjectDirectory)
          logger.vsLog('adr.templates.directory' + adrTemplateDirectory)
          logger.vsLog('adr.templates.repo' + adrTemplateGitRepo)
          vscode.workspace.getConfiguration().update('adr.project.directory', adrProjectDirectory, vscode.ConfigurationTarget.Workspace)
          vscode.workspace.getConfiguration().update('adr.templates.directory', adrTemplateDirectory, vscode.ConfigurationTarget.Workspace)
          vscode.workspace.getConfiguration().update('adr.templates.repo', adrTemplateGitRepo, vscode.ConfigurationTarget.Workspace)
          let basedir = vscode.workspace.rootPath
          adrUtils.init(path.join(basedir, adrProjectDirectory),
            path.join(basedir, adrTemplateDirectory),
            adrTemplateGitRepo)
          vscode.window.showInformationMessage('ADR Init')
        })
    })
}

async function adrNew () {
  let adrAttr = {}
  const rootPath = vscode.workspace.rootPath
  let adrFolder = path.join(
    rootPath,
    vscode.workspace.getConfiguration().get('adr.project.directory')
  )
  const adrTemplateFolder = path.join(
    rootPath,
    vscode.workspace.getConfiguration().get('adr.templates.directory')
  )
  const useTimestampForFilePrefix = vscode.workspace.getConfiguration().get('adr.naming.timestamp')
  const multiFolderSelection = vscode.workspace
    .getConfiguration()
    .get('adr.project.directory-choose-from-marked')

  if (multiFolderSelection) {
    const rootFolders = await vscode.workspace.findFiles('**/.adr')
    if (rootFolders.length === 0) {
      vscode.window.showErrorMessage("Please at least add one folder with a placeholder file `.adr` or disable adr.project.directory.choose-from-marked' setting.")
      return
    }
    const paths = rootFolders.map(uri => UriUtils.dirname(uri).fsPath)
    const selectedPath = await vscode.window.showQuickPick(paths, {
      placeHolder: 'Select the adr folder to work with.'
    })
    adrFolder = selectedPath
  }

  const srcAdrName = await vscode.window.showInputBox({
    prompt: 'Enter new ADR name',
    placeHolder: 'E.g.: Choosed database for backend.'
  })

  logger.vsLog('srcAdrName: ' + srcAdrName)
  if (!srcAdrName) return

  const status = await vscode.window.showQuickPick(['Accepted', 'Proposal'], {
    placeHolder: 'Select status for this ADR'
  })
  logger.vsLog('status: ' + status)

  if (!status) return

  const linkType = await vscode.window.showQuickPick(
    ['None', 'Supersedes', 'Amends'],
    {
      placeHolder: 'Select if there is a relation with an existing ADR'
    }
  )

  logger.vsLog('linkType: ' + linkType)
  if (!linkType) return
  if (!(linkType === 'None')) {
    const tgtAdrName = await vscode.window.showQuickPick(
      adrUtils.getAllAdr(adrFolder),
      {
        prompt: 'Enter target ADR name',
        placeHolder: 'Enter target ADR name'
      }
    )

    if (!tgtAdrName) return
    adrAttr.srcAdrName = srcAdrName
    adrAttr.linkType = linkType
    adrAttr.tgtAdrName = tgtAdrName
    adrAttr.status = status
    let filepath = adrUtils.createNewAdr(adrAttr, adrFolder, adrTemplateFolder, useTimestampForFilePrefix)
    const doc = await vscode.workspace.openTextDocument(filepath)
    vscode.window.showTextDocument(doc)
  } else {
    adrAttr.srcAdrName = srcAdrName
    adrAttr.status = status
    let filepath = adrUtils.createNewAdr(adrAttr, adrFolder, adrTemplateFolder, useTimestampForFilePrefix)
    const doc = await vscode.workspace.openTextDocument(filepath)
    vscode.window.showTextDocument(doc)
  }
}

function adrChangeStatus () {
  let adrFolder = path.join(vscode.workspace.rootPath,
    vscode.workspace.getConfiguration().get('adr.project.directory'))
  vscode.window.showQuickPick(adrUtils.getAllAdr(adrFolder), {
    prompt: 'Enter target ADR name'
  }).then(adrFile => {
    if (!adrFile) return
    vscode.window.showQuickPick(['Accepted', 'Proposal', 'Rejected'], {
      prompt: 'Select new status'
    }).then(newStatus => {
      if (!newStatus) return
      adrUtils.changeStatus(path.join(adrFolder, adrFile), newStatus)
    })
  })
}

function adrLink () {
  let adrFolder = path.join(vscode.workspace.rootPath, vscode.workspace.getConfiguration().get('adr.project.directory'))
  vscode.window
    .showQuickPick(adrUtils.getAllAdr(adrFolder), {
      prompt: 'Enter source ADR name',
      placeHolder: 'Choose database'
    })
    .then(srcAdrName => {
      if (!srcAdrName) return
      vscode.window
        .showQuickPick(['Supersedes', 'Amends'], {
          prompt: 'Select if there is a relation with existing ADR'
        })
        .then(linkType => {
          if (!linkType) return
          vscode.window
            .showQuickPick(adrUtils.getAllAdr(adrFolder), {
              prompt: 'Enter target ADR name',
              placeHolder: 'Choose database'
            })
            .then(tgtAdrName => {
              if (!tgtAdrName) return
              adrUtils.addLink(tgtAdrName, adrFolder + path.sep + srcAdrName, linkType)
              let linkedType = ''
              if (linkType === 'Supersedes') {
                linkedType = 'Superceded by'
              } else {
                linkedType = linkType.replace(/s$/, 'ed by')
              }
              adrUtils.addLink(srcAdrName, adrFolder + path.sep + tgtAdrName, linkedType)
              vscode.window.showInformationMessage('ADR Link')
            })
        })
    })
}

function getLinkDst (linkStr) {
  // must match: Superseded by 0003-rechange_db.md
  let dst = linkStr.match(/([\w-]*\.md)[ \t]*$/)
  if (dst.length > 1) {
    return dst[1]
  }
}

function getLinkType (linkStr) {
  let dst = linkStr.match(/^([\w\t -_]*) [\w-]*\.md[ \t]*$/)
  if (dst.length > 1) {
    return dst[1]
  }
}

function adrGenerateDocs () {
  logger.vsLog('entering generate docs')
  let adrFolder = path.join(vscode.workspace.rootPath, vscode.workspace.getConfiguration().get('adr.project.directory'))
  let adrs = adrUtils.getAllAdr(adrFolder)
  graph.deleteGraph(adrFolder)
  logger.vsLog('adrfolder: ' + adrFolder + ' - adrs: ' + adrs)
  try {
    adrs.forEach(adr => {
      logger.vsLog('treating adr: ' + adr)

      let adrTitle = parsing.getTitle(adrFolder, adr)
      let sectionData = parsing.getStatusSection(adrFolder, adr)
      let status = parsing.getStatus(sectionData)
      let prevStatus = parsing.getPreviousStatus(sectionData)
      let adrIndex = adr.split('-')[0]
      logger.vsLog('adrTitle: ' + adrTitle)
      logger.vsLog('statuses: ' + status)
      logger.vsLog('adrIndex: ' + adrIndex)
      graph.createNode(adrFolder, adrIndex, adr, adrTitle, status.date, status.status)
      prevStatus.forEach(pStatus => {
        graph.addStatus(adrFolder, adrIndex, pStatus.status, pStatus.date)
      })
      let links = parsing.getRelations(sectionData)
      if (links !== undefined && links.length > 0) {
        links.forEach(link => {
          // let indexDst = getLinkDst(link)
          // let linkType = getLinkType(link)
          graph.addLink(adrFolder, adrIndex, link.adrFilename.split('-')[0], link.link, link.date)
        })
      }
    })
    graph.graphToFlowChart(adrFolder)
  } catch (error) {
    logger.vsLog(error)
  }
  // parse
  // create graph
  // generate flowchart
}

module.exports.adrLink = adrLink
module.exports.adrNew = adrNew
module.exports.adrInit = adrInit
module.exports.adrChangeStatus = adrChangeStatus
module.exports.adrGenerateDocs = adrGenerateDocs
