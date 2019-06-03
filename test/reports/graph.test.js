const assert = require("assert");

// const myExtension = require('../extension');
const graphreport = require("../../reports/graph");

// Defines a Mocha test suite to group tests of similar kind together
describe("Graph report tests cases", function() {

  // Defines a Mocha unit test
  it("should create a node and return it", function() {
    let expected = new Object();
    expected =  {
        "index": "0001",
        "filename": "my_adr.md",
        "title": "My ADR",
        "statuses": [
          {"date": ""+new Date("2019-05-27")+"", "status": "Proposal"}
        ]
      };
    let actual = graphreport.createNode("0001", "my_adr.md", "My ADR", new Date("2019-05-27"), "Proposal");
    assert.deepStrictEqual(actual, expected);
    
  });

  it("should store then retrieve a graph", function() {
    let expected = new Object();
    expected.nodes = [];
    expected.nodes.push(graphreport.createNode("0001", "my_adr.md", "My ADR", new Date("2019-05-27"), "Proposal"));
    
    graphreport.writeGraph("./testworkspace", expected);
    let actual = graphreport.getGraph("./testworkspace");
    assert.deepStrictEqual(actual, expected);
  });

  it("should change status of a node", function() {
    let expected = "0001";
    let graph = graphreport.getGraph("./testworkspace");
    graphreport.addStatus("./testworkspace", "0001", "new status", new Date("2019-06-03"));
    graphreport.addStatus("./testworkspace", "0002", "new status", new Date("2019-06-03"));

  });
});
