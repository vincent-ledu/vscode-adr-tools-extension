const fs = require('fs')
const path = require('path')

const graphFile = '.adr-persist.json'

const flowChartFileName = 'flowChart.md'

function createNode (adrDir, index, filename, title, date, status) {
  let g = getGraph(adrDir)

  let node = {
    'index': '' + index + '',
    'filename': '' + filename + '',
    'title': '' + title + '',
    'statuses': [
      { 'date': '' + date + '', 'status': '' + status + '' }
    ]
  }
  g.nodes.push(node)
  writeGraph(adrDir, g)
  return node
}

function addLink (adrDir, indexSrc, indexDst, link, date) {
  let g = getGraph(adrDir)
  let linkObj = {
    'src': '' + indexSrc + '',
    'dst': '' + indexDst + '',
    'link': '' + link + '',
    'createdDate': '' + date + ''
  }
  g.links.push(linkObj)
  writeGraph(adrDir, g)
  return linkObj
}

function addStatus (adrDir, index, status, date) {
  let g = getGraph(adrDir)
  let node = g.nodes.find(function (element) {
    return element.index === index
  })
  if (node === undefined) {
    console.log('node not found: ' + index)
    // TODO: handle error
    return undefined
  }
  node.statuses.push({ 'date': '' + date + '', 'status': '' + status + '' })
  writeGraph(adrDir, g)
  return node
}

function writeGraph (adrDir, graph) {
  try {
    fs.writeFileSync(path.join(adrDir, graphFile), JSON.stringify(graph), 'utf8')
  } catch (err) {
    console.log('An error occured while writing graph Object to File.')
    return console.log(err)
  }
  console.log('Graph file has been saved.')
}

function getGraph (adrDir) {
  let data
  try {
    data = fs.readFileSync(path.join(adrDir, graphFile))
  } catch (err) {
    if (err.code === 'ENOENT') {
      data = '{}'
    } else {
      throw err
    }
  }
  let g = JSON.parse(data)
  if (g === undefined) {
    g = {}
  }
  if (g.nodes === undefined) {
    g.nodes = []
  }
  if (g.links === undefined) {
    g.links = []
  }

  return g
}

function deleteGraph (adrDir) {
  try {
    fs.unlinkSync(path.join(adrDir, graphFile))
  } catch (err) {
    if (err.code === 'ENOENT') {
      return console.log('While trying to delete file ' + path.join(adrDir, graphFile) + ', the file was not found')
    }
    throw err
  }
}

function graphToFlowChart (adrDir) {
  let g = getGraph(adrDir)
  console.log('g: ' + g)
  console.log('g.nodes.length: ' + g.nodes.length)
  console.log('g.links.length: ' + g.links.length)
  let output = ''
  output += '```mermaid\n'
  output += 'graph LR\n'
  g.nodes.forEach(node => {
    output += node.index + '[' + node.title.trim() + ']\n'
    output += 'click ' + node.index + ' "' + node.filename + '"\n'
  })
  g.links.forEach(link => {
    output += link.src + ' --> |' + link.link + '|' + link.dst + '\n'
  })
  output += '```\n'
  let fd = fs.openSync(path.join(adrDir, flowChartFileName), 'w')
  fs.writeFileSync(fd, output, 'utf8')
  fs.closeSync(fd)
}

module.exports.createNode = createNode
module.exports.addStatus = addStatus
module.exports.addLink = addLink
module.exports.writeGraph = writeGraph
module.exports.getGraph = getGraph
module.exports.deleteGraph = deleteGraph
module.exports.graphToFlowChart = graphToFlowChart
