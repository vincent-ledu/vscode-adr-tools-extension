const fs = require('fs');
const path = require('path');

const adrFile = ".adr-persist.json";

function createNode(index, filename, title, date, status) {
    let node =     {
        "index": ""+index+"",
        "filename": ""+filename+"",
        "title": ""+title+"",
        "statuses": [
          {"date": ""+date+"", "status": ""+status+""}
        ]
      }
    return node;
}

function addStatus(adrDir, index, status, date) {
    let g = getGraph(adrDir);
    let node = g.nodes.find(function(element) {
        return element.index === index;
    });
    if (node === undefined) {
        console.log("node not found: " + index);
        // TODO: handle error
        return undefined;
    }
    node.statuses.push({"date": ""+date+"", "status": ""+status+""})
    return node;
}

function writeGraph(adrDir, graph) {
    fs.writeFile(path.join(adrDir, adrFile), JSON.stringify(graph), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing graph Object to File.");
            return console.log(err);
        }
     
        console.log("Graph file has been saved.");
    });
}

function getGraph(adrDir) {
    return JSON.parse(fs.readFileSync(path.join(adrDir, adrFile)));
}

module.exports.createNode = createNode;
module.exports.writeGraph = writeGraph;
module.exports.getGraph = getGraph;
module.exports.addStatus = addStatus;