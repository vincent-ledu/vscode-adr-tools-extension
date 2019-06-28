const assert = require('assert')

// const myExtension = require('../extension');
const graphreport = require('../../reports/graph')

const adrDir = './testworkspace/'

// Defines a Mocha test suite to group tests of similar kind together
describe('Graph report tests cases', function () {
  it('should delete previous graph', function () {
    graphreport.deleteGraph(adrDir)
  })

  // Defines a Mocha unit test
  it('should create a node and return it', function () {
    let expected = {}
    expected = {
      'index': '0001',
      'filename': 'my-adr.md',
      'title': 'My ADR',
      'statuses': [
        { 'date': '' + new Date('2019-05-27') + '', 'status': 'Proposal' }
      ]
    }
    let actual = graphreport.createNode(adrDir, '0001', 'my-adr.md', 'My ADR', new Date('2019-05-27'), 'Proposal')
    assert.deepStrictEqual(actual, expected)
  })

  it('should change status of a node', function () {
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
    let actual = graphreport.addStatus('./testworkspace', '0001', 'new status', new Date('2019-06-03'))
    assert.deepStrictEqual(actual, expected)
    assert.deepStrictEqual(graphreport.addStatus('./testworkspace', '0002', 'new status', new Date('2019-06-03'), undefined))
  })

  it('should add link between 2 adr', function () {
    graphreport.createNode(adrDir, '0002', 'my-second-adr.md', 'My Second ADR', new Date('2019-06-04'))

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
    assert.deepStrictEqual(graphreport.addLink(adrDir, '0001', '0002', 'amends', new Date('2019-06-04')), expected1)
    assert.deepStrictEqual(graphreport.addLink(adrDir, '0002', '0001', 'amended by', new Date('2019-06-04')), expected2)
  })

  it('should generate mermaid flow chart', function () {
    graphreport.createNode(adrDir, '0003', 'my-third adr.md', 'My third ADR', new Date('2019-06-26'))
    graphreport.graphToFlowChart(adrDir)
  })
})
