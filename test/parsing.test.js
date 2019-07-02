/* global suite, test */
const assert = require('assert')

const vscode = require('vscode')
const path = require('path')
const adrUtils = require('../adrfunc/adr-utils')
const parsingAdr = require('../parsing/parsingAdr')
const clean = require('../clean')

suite('Extension Tests', function () {
  let rootPath = path.join(process.env.TEMP, 'testworkspace', 'parse')
  let adrPath = path.join(rootPath, 'doc/adr')
  let adrTemplatePath = path.join(rootPath, '.adr-templates')

  this.beforeAll(function () {
    clean.deleteFolderRecursive(adrPath)
  })

  // Defines a Mocha unit test
  test('get status section', function () {
    this.timeout(10000)
    let d = new Date().toISOString().split('T')[0]
    adrUtils.init(adrPath, adrTemplatePath, vscode.workspace.getConfiguration().get('adr.templates.repo'))
    let adr1 = adrUtils.createNewAdr({ srcAdrName: 'parsing adr test1', status: 'Accepted' },
      adrPath,
      adrTemplatePath
    )
    let adr2 = adrUtils.createNewAdr({ srcAdrName: 'parsing adr test2', status: 'Proposal' },
      adrPath,
      adrTemplatePath
    )
    adrUtils.changeStatus(adr2, 'Accepted')
    let adr3 = adrUtils.createNewAdr({ srcAdrName: 'parsing adr test3',
      status: 'Accepted',
      linkType: 'Supersedes',
      tgtAdrName: adr1.replace(/^.*[\\/]/, '') },
    adrPath,
    adrTemplatePath
    )

    adrUtils.addLink(adr3.replace(/^.*[\\/]/, ''), adr2, 'Amends')
    adrUtils.addLink(adr2.replace(/^.*[\\/]/, ''), adr3, 'Amended by')

    let actual = parsingAdr.getStatusSection(adrPath, '0001-parsing-adr-test1.md')
    console.log('actual: ' + actual)
    assert.strictEqual(actual, 'Status: Superseded on ' + d +
    '  \nSuperseded by [0003-parsing-adr-test3.md](0003-parsing-adr-test3.md) on ' + d +
    '  \nPrevious status: Accepted on ' + d)
  })

  test('get adr status', function () {
    let d = Date.parse(new Date().toISOString().split('T')[0])
    console.log('expected date: ' + d)
    let actual = parsingAdr.getStatus(
      parsingAdr.getStatusSection(adrPath, '0001-parsing-adr-test1.md')
    )
    let expected = { status: 'Superseded', date: d }

    assert.deepStrictEqual(actual, expected)
  })

  test('get adr relations', function () {
    if (typeof rootPath === 'undefined') {
      rootPath = './testworkspace/parse'
    }
    let d = Date.parse(new Date().toISOString().split('T')[0])
    let expected = [{ link: 'Superseded by', adrFilename: '0003-parsing-adr-test3.md', date: d }]
    let actual = parsingAdr.getRelations(
      parsingAdr.getStatusSection(adrPath, '0001-parsing-adr-test1.md'))

    assert.deepStrictEqual(actual, expected)
  })
})
