const assert = require('assert')

// const myExtension = require('../extension');
const parsingAdr = require('../../parsing/parsingAdr')
const utils = require('../../common/utils')

const adrDir = './testworkspace/'

// Defines a Mocha test suite to group tests of similar kind together
describe('Parsing ADR', function () {
  it('get status section', function () {
    utils.getADRFiles(adrDir).forEach(function (file) {
      let actual = parsingAdr.getStatusSection(adrDir, file)
      // console.log("Section: " + actual);
      assert.notEqual(typeof actual, typeof undefined)
      assert.equal(typeof actual, typeof '')
    })
  })

  it('get adr status', function () {
    utils.getADRFiles(adrDir).forEach(function (file) {
      console.log('Status: ' + parsingAdr.getStatus(parsingAdr.getStatusSection(adrDir, file)))
    })
  })

  it('get adr relations', function () {
    utils.getADRFiles(adrDir).forEach(function (file) {
      console.log('Relations: ' + parsingAdr.getRelations(parsingAdr.getStatusSection(adrDir, file)))
    })
  })

})
