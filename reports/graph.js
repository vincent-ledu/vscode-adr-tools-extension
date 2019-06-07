const fs = require('fs');
const path = require('path');

const adrFile = ".adr-persist.json";

function createNode(adrDir, index, filename, title, date, status) {
    let g = getGraph(adrDir);
    
    let node =     {
        "index": ""+index+"",
        "filename": ""+filename+"",
        "title": ""+title+"",
        "statuses": [
          {"date": ""+date+"", "status": ""+status+""}
        ]
      }
    g.nodes.push(node);
    writeGraph(adrDir, g);
    return node;
}

function addLink(adrDir, indexSrc, indexDst, link, date) {
    let g = getGraph(adrDir);
    let linkObj = {
        "src": ""+indexSrc+"",
        "dst": ""+indexDst+"",
        "link": ""+link+"",
        "createdDate": ""+date+""
    }
    g.links.push(linkObj);
    writeGraph(adrDir, g);
    return linkObj;
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
    writeGraph(adrDir, g);
    return node;
}

function writeGraph(adrDir, graph) {
    try {
        fs.writeFileSync(path.join(adrDir, adrFile), JSON.stringify(graph), 'utf8');
    } catch (err) {
        console.log("An error occured while writing graph Object to File.");
        return console.log(err);
    }
    console.log("Graph file has been saved.");
}

function getGraph(adrDir) {
    let data;
    try {
        data = fs.readFileSync(path.join(adrDir, adrFile));
    } catch (err) {
        if (err.code === 'ENOENT') {
            data = "{}";
        } else {
            throw err;
        }
    }
    let g = JSON.parse(data);
    if (g === undefined) {
        g = new Object();
    }
    if (g.nodes === undefined) {
        g.nodes = [];
    }
    if (g.links === undefined) {
        g.links = [];
    }

    return g;
}

function deleteGraph(adrDir) {
    try {
        fs.unlinkSync(path.join(adrDir, adrFile));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return console.log("While trying to delete file " + path.join(adrDir, adrFile) + ", the file was not found");
        }
        throw err;
    }
}

module.exports.createNode = createNode;
module.exports.writeGraph = writeGraph;
module.exports.getGraph = getGraph;
module.exports.addStatus = addStatus;
module.exports.addLink = addLink;
module.exports.deleteGraph = deleteGraph;