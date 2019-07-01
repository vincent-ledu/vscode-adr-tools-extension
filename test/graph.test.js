/* global suite, test */
const assert = require('assert')

const vscode = require('vscode')
const path = require('path')
const adrUtils = require('../adrfunc/adr-utils')
const graphreport = require('../reports/graph')
const clean = require('../clean')

// Defines a Mocha test suite to group tests of similar kind together
suite('Graph report tests cases', function () {
  let adrPath = 'doc/adr'
  let adrTemplatePath = '.adr-templates'
  let rootPath = path.join(vscode.workspace.rootPath, 'graph')

  test('should delete previous graph', function () {
    this.timeout = 10000
    if (typeof rootPath === 'undefined') {
      rootPath = './testworkspace/graph'
    }
    clean.deleteFolderRecursive(path.join(rootPath, adrPath))
    adrUtils.init(rootPath, adrPath, adrTemplatePath, vscode.workspace.getConfiguration().get('adr.templates.repo'))
    let adr1 = adrUtils.createNewAdr({ srcAdrName: 'parsing adr test1', status: 'Accepted' },
      path.join(rootPath, adrPath),
      path.join(rootPath, adrTemplatePath)
    )
    let adr2 = adrUtils.createNewAdr({ srcAdrName: 'parsing adr test2', status: 'Proposal' },
      path.join(rootPath, adrPath),
      path.join(rootPath, adrTemplatePath)
    )
    adrUtils.changeStatus(adr2, 'Accepted')
    let adr3 = adrUtils.createNewAdr({ srcAdrName: 'parsing adr test3',
      status: 'Accepted',
      linkType: 'Supersedes',
      tgtAdrName: adr1.replace(/^.*[\\/]/, '') },
    path.join(rootPath, adrPath),
    path.join(rootPath, adrTemplatePath)
    )

    adrUtils.addLink(adr3.replace(/^.*[\\/]/, ''), adr2, 'Amends')
    adrUtils.addLink(adr2.replace(/^.*[\\/]/, ''), adr3, 'Amended by')

    graphreport.deleteGraph(path.join(rootPath, adrPath))
  })

  test('should create a node and return it', function () {
    if (typeof rootPath === 'undefined') {
      rootPath = './testworkspace/graph'
    }

    let expected = {}
    expected = {
      'index': '0001',
      'filename': 'my-adr.md',
      'title': 'My ADR',
      'statuses': [
        { 'date': '' + new Date('2019-05-27') + '', 'status': 'Proposal' }
      ]
    }
    let actual = graphreport.createNode(path.join(rootPath, adrPath), '0001', 'my-adr.md', 'My ADR', new Date('2019-05-27'), 'Proposal')
    assert.deepStrictEqual(actual, expected)
  })

  test('should change status of a node', function () {
    if (typeof rootPath === 'undefined') {
      rootPath = './testworkspace/graph'
    }
    let expected = {}
    expected = {
      'index': '0001',
      'filename': 'my-adr.md',
      'title': 'My ADR',
      'statuses': [
        { 'date': '' + new Date('2019-05-27') + '', 'status': 'Proposal' },
        { 'date': '' + new Date('2019-06-03') + '', 'status': 'new status' }
      ]
    }
    let actual = graphreport.addStatus(path.join(rootPath, adrPath), '0001', 'new status', new Date('2019-06-03'))
    assert.deepStrictEqual(actual, expected)
    assert.deepStrictEqual(graphreport.addStatus(path.join(rootPath, adrPath), '0002', 'new status', new Date('2019-06-03'), undefined))
  })

  test('should add link between 2 adr', function () {
    if (typeof rootPath === 'undefined') {
      rootPath = './testworkspace'
    }
    graphreport.createNode(path.join(rootPath, adrPath), '0002', 'my-second-adr.md', 'My Second ADR', new Date('2019-06-04'))

    let expected1 = {
      'src': '0001',
      'dst': '0002',
      'link': 'amends',
      'createdDate': '' + new Date('2019-06-04') + ''
    }
    let expected2 = {
      'src': '0002',
      'dst': '0001',
      'link': 'amended by',
      'createdDate': '' + new Date('2019-06-04') + ''
    }
    assert.deepStrictEqual(graphreport.addLink(path.join(rootPath, adrPath), '0001', '0002', 'amends', new Date('2019-06-04')), expected1)
    assert.deepStrictEqual(graphreport.addLink(path.join(rootPath, adrPath), '0002', '0001', 'amended by', new Date('2019-06-04')), expected2)
  })

  test('should generate mermaid flow chart', function () {
    if (typeof rootPath === 'undefined') {
      rootPath = './testworkspace'
    }

    graphreport.createNode(path.join(rootPath, adrPath), '0003', 'my-third adr.md', 'My third ADR', new Date('2019-06-26'))
    graphreport.graphToFlowChart(path.join(rootPath, adrPath))
  })
})
