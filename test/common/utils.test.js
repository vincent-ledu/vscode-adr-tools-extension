const assert = require("assert");

// const myExtension = require('../extension');
const utils = require("../../common/utils");

const adrDir = "./testworkspace/";

// Defines a Mocha test suite to group tests of similar kind together
describe("Testing common utils functions", function() {

    it("List files", function() {
      assert.equal(typeof(utils.getADRFiles(adrDir)), typeof([]));
    });
});  