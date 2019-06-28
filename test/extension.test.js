/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require('assert')

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode')
const fs = require('fs')
const path = require('path')
// const myExtension = require('../extension');
const adrUtils = require('../adrfunc/adr-utils')

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', function () {
  let adrPath = vscode.workspace
    .getConfiguration()
    .get('adr.project.directory')
  let adrTemplatePath = vscode.workspace
    .getConfiguration()
    .get('adr.templates.directory')

  // Defines a Mocha unit test
  test('adr init', function () {
    let rootPath = vscode.workspace.rootPath
    if (typeof rootPath === 'undefined') {
      rootPath = './testworkspace'
    }
    console.log('typeof vscode.workspace.rootPath:' + typeof (vscode.workspace.rootPath))
    console.log('typeof adrPath:' + typeof (adrPath))
    console.log('typeof adrTemplatePath:' + typeof (adrTemplatePath))
    console.log('typeof vscode.workspace.getConfiguration().get("adr.templates.repo"):' + typeof (vscode.workspace.getConfiguration().get('adr.templates.repo')))
    adrUtils.init(
      rootPath,
      adrPath,
      adrTemplatePath,
      vscode.workspace.getConfiguration().get('adr.templates.repo')
    )
    assert.equal(
      fs.accessSync(
        path.join(rootPath, adrPath),
        fs.constants.F_OK
      ),
      undefined
    )
    assert.equal(
      fs.accessSync(
        path.join(rootPath, adrTemplatePath),
        fs.constants.F_OK
      ),
      undefined
    )
    assert.equal(
      typeof adrUtils.getAllAdr(path.join(rootPath, adrPath)),
      typeof ['']
    )
  })

  test('adr new', function () {
    let rootPath = vscode.workspace.rootPath
    if (typeof rootPath === 'undefined') {
      rootPath = './testworkspace'
    }
    let adr1 = adrUtils.createNewAdr(
      'mytest1adr',
      null,
      null,
      path.join(rootPath, adrPath),
      path.join(rootPath, adrTemplatePath)
    )
    let adr2 = adrUtils.createNewAdr(
      'mytest2adr',
      'Supersedes',
      '0001-mytest1adr.md',
      path.join(rootPath, adrPath),
      path.join(rootPath, adrTemplatePath)
    )
    let adr3 = adrUtils.createNewAdr(
      'mytest3adr',
      'Amends',
      '0002-mytest2adr.md',
      path.join(rootPath, adrPath),
      path.join(rootPath, adrTemplatePath)
    )

    assert.equal(fs.existsSync(adr1), true)
    assert.equal(fs.existsSync(adr2), true)
    assert.equal(fs.existsSync(adr3), true)
  })

  test('adr link', function () {
    let rootPath = vscode.workspace.rootPath
    if (typeof rootPath === 'undefined') {
      rootPath = './testworkspace'
    }
    let srcFilePath = adrUtils.createNewAdr(
      'mytest4adr',
      null,
      null,
      path.join(rootPath, adrPath),
      path.join(rootPath, adrTemplatePath)
    )
    let tgtFilePath = adrUtils.createNewAdr(
      'mytest4adr',
      null,
      null,
      path.join(rootPath, adrPath),
      path.join(rootPath, adrTemplatePath)
    )

    adrUtils.addLink('0005-mytest4adr.md', srcFilePath, 'Amends')
    adrUtils.addLink('0004-mytest5adr.md', tgtFilePath, 'Amended by')
    assert.equal(fs.existsSync(srcFilePath), true)
    assert.equal(fs.existsSync(tgtFilePath), true)
    let data = fs.readFileSync(tgtFilePath)
    assert.equal(data.includes('Amended by 0004-mytest4adr.md') >= 0, true)
    data = fs.readFileSync(srcFilePath)
    assert.equal(data.includes('Amends 0005-mytest4adr.md') >= 0, true)
  })
})
