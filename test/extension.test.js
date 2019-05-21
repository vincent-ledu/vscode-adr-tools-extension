/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
// const myExtension = require('../extension');
const adrUtils = require('../adr-utils');

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function() {
	let adrPath = vscode.workspace.rootPath + path.sep + 'adr';
	let adrTemplatePath = vscode.workspace.rootPath + path.sep + '.adr-templates';

	// Defines a Mocha unit test
	test("adr init", function() {
		fs.rmdir(adrPath, (err) => {
			if (err)
				console.log("directory " + adrPath + " does not exist.");
		});
		fs.rmdir(adrTemplatePath, (err) => {
			if (err)
				console.log("directory " + adrTemplatePath + " does not exist.");
		});
		
		assert.equal([1, 2, 3].indexOf(4), -1);

		// adrUtils.init(adrPath, adrTemplatePath);
		// assert.equal(fs.accessSync(adrPath, fs.constants.F_OK), undefined);
		// assert.equal(fs.accessSync(adrTemplatePath, fs.constants.F_OK), undefined);
		// assert.equal(typeof(adrUtils.getAllAdr(adrPath)), typeof([""]));
		
	});

	test("adr new", function() {
		// adrUtils.createNewAdr("mytest1adr", null , null, adrPath, adrTemplatePath);
		// adrUtils.createNewAdr("mytest2adr", "Supersedes", "0001-mytest1adr.md", adrPath, adrTemplatePath);
		// adrUtils.createNewAdr("mytest3adr", "Amends", "0002-mytest2adr.md", adrPath, adrTemplatePath);
		// assert.equal(fs.existsSync(adrPath + path.sep + "0001-mytest1adr.md"), true);
	});
});
