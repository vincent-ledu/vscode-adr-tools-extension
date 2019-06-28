/* eslint-disable no-undef */
const assert = require('chai').assert

const adr = require('../../adrFunc/adr-utils')
const path = require('path')
const fs = require('fs')
const clean = require('../../clean')

const basedir = './testtemp/'
const adrDir = 'docs/adr'
const templateDir = '.adr-templates'

describe('Testing adr functions', function () {
  it('should clean temp dir', function () {
    clean.deleteFolderRecursive(path.join(basedir, adrDir))
  })

  it('should create dirs, git clone adr template, create first ADR', function () {
    this.timeout(10000)
    adr.init(basedir, adrDir, templateDir, 'https://github.com/vincent-ledu/adr-template.git')
    assert.strictEqual(fs.existsSync(path.normalize(basedir)), true)
    assert.strictEqual(fs.existsSync(path.join(basedir, adrDir)), true)
    assert.strictEqual(fs.existsSync(path.join(basedir, adrDir, '0000-record_architecture_decisions.md')), true)
  })

  it('should get all adr from adr folder', function () {
    assert.deepStrictEqual(adr.getAllAdr(path.join(basedir, adrDir)).includes('0000-record_architecture_decisions.md'), true)
  })
  it('should create some adr and exists in adrdir', function () {
    let actual = adr.createNewAdr({ srcAdrName: 'My ADR1', status: 'Accepted' },
      path.join(basedir, adrDir),
      path.join(basedir, templateDir))
    assert.include(actual, 'my_adr1.md')
    actual = adr.createNewAdr({ srcAdrName: 'My ADR2', status: 'Accepted' },
      path.join(basedir, adrDir),
      path.join(basedir, templateDir))
    assert.include(actual, 'my_adr2.md')
    actual = adr.createNewAdr({ srcAdrName: 'My ADR3', status: 'Proposal' },
      path.join(basedir, adrDir),
      path.join(basedir, templateDir))
    assert.include(actual, 'my_adr3.md')
    actual = adr.createNewAdr(
      {
        srcAdrName: 'My ADR4',
        status: 'Accepted',
        tgtAdrName: '0003-my_adr3.md',
        linkType: 'Supersedes'
      },
      path.join(basedir, adrDir),
      path.join(basedir, templateDir))
    assert.include(actual, 'my_adr4.md')
  })

  it('should add link between adr', function () {
    adr.createNewAdr({ srcAdrName: 'My ADR with relation', status: 'Proposal' }, 
      path.join(basedir, adrDir), path.join(basedir, templateDir))
    adr.createNewAdr(
      {
        srcAdrName: 'My Adr with relation2',
        status: 'Proposal',
        linkType: 'Amends',
        tgtAdrName: '0005-my_adr_with_relation.md'
      },
      path.join(basedir, adrDir),
      path.join(basedir, templateDir))
    adr.createNewAdr(
      {
        srcAdrName: 'My Adr with relation3',
        status: 'Proposal',
        linkType: 'Amends',
        tgtAdrName: '0005-my_adr_with_relation.md'
      },
      path.join(basedir, adrDir),
      path.join(basedir, templateDir))
  })

  it('should change status of adr', function () {
    adr.changeStatus(path.join(basedir, adrDir, '0005-my_adr_with_relation.md'), 'Accepted')
  })
})
