const fs = require('fs');
const path = require('path');

const utils = require('../common/utils');


let dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

/**
 * Clean ADR name user input to make a filename
 * @param {String} adrName the ADR name typed by the user
 */
function sanitizedAdrName(adrName) {
  return adrName
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/'/, '_')
    .replace(/-/g, '_');
}


/**
 * return list of ADR files
 * @param {String} adrPath path where ADR are stored
 */
function getAllAdr(adrPath) {
  return utils.getADRFiles(adrPath);
}

/**
 * Return the last index
 * @param {String} adrPath Folder where are stored ADR
 */
function getLastIndex(adrPath) {
  var lastIndex = -1;
  let files = utils.getADRFiles(adrPath);
  files.forEach(file => {
    var index = parseInt(file.split('-')[0]);
    if (isNaN(index)) {
      index = 0;
    }
    lastIndex = Math.max(lastIndex, index);
  });
  return lastIndex;
}

/**
 * Create new ADR
 * @param {String} srcAdrName Name of the ADR to create
 * @param {String} linkType link to add between 2 ADR if provided
 * @param {String} tgtAdrName filename of the ADR to link to
 * @param {String} adrPath Folder where to store ADR
 * @param {String} adrTemplatePath Folder where are stored ADR templates
 */
function createNewAdr(srcAdrName, linkType, tgtAdrName, adrPath, adrTemplatePath) {
  const mustache = require('mustache');
  console.log(
    'create new adr ' + srcAdrName + ' in ' + adrPath + ' from templatepath ' + adrTemplatePath
  );
  let srcAdrSanitizeName = '';
  let lastIndex = getLastIndex(adrPath);
  lastIndex = '' + (lastIndex + 1);
  var data = '';
  let d = new Date();
  data = {
    date: d.toLocaleDateString('en-EN', dateOptions),
    status: 'Accepted',
    'adr-index': lastIndex,
    'adr-name': '' + srcAdrName + '',
  };
  srcAdrSanitizeName = lastIndex.padStart(4, '0') + '-' + sanitizedAdrName(srcAdrName) + '.md';
  if (linkType === 'Supersedes' && tgtAdrName != null) {
    data['links'] = linkType + ' ' + tgtAdrName;
    let tgtFilePath = adrPath + path.sep + tgtAdrName;
    let linkedType = 'Superseded by';
    addLink(srcAdrSanitizeName, tgtFilePath, linkedType);
    addRelation(adrPath, srcAdrSanitizeName, tgtAdrName, linkType);
  } else if (linkType != null && tgtAdrName != null) {
    data['links'] = linkType + ' ' + tgtAdrName;
    let tgtFilePath = adrPath + path.sep + tgtAdrName;
    let linkedType = linkType.replace(/s$/, 'ed by');
    addLink(srcAdrSanitizeName, tgtFilePath, linkedType);
    addRelation(adrPath, srcAdrSanitizeName, tgtAdrName, linkType);
  } else {
    addNode(adrPath, srcAdrSanitizeName, srcAdrName);
  }
  let templateContent = fs.readFileSync(adrTemplatePath + path.sep + 'index-recordname.md', 'utf8');

  let output = mustache.render(templateContent, data);
  fs.writeFileSync(adrPath + path.sep + srcAdrSanitizeName, output);
  return adrPath + path.sep + srcAdrSanitizeName;
}

/**
 * add a relation between 2 ADR. 
 * A special case for "supersed" relation: 
 *  * it replace the current status instead of adding a new relation.
 * @param {String} srcAdrName adr source
 * @param {String} tgtFilePath file path of targeted adr
 * @param {String} linkType link type for linking the 2 ADR
 */
function addLink(srcAdrName, tgtFilePath, linkType) {
  console.log('add link ' + linkType + ' ' + srcAdrName + ' to ' + tgtFilePath);
  fs.readFile(tgtFilePath, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var result = '';
    if (linkType === 'Superseded by') {
      result = data.replace(
        /## Status([\s\S]+)Status: ([\w\s]+\n)(\s*)/,
        '## Status$1Status: Superseded  \n' + linkType + ' ' + srcAdrName + '\n$3'
      );
    } else {
      result = data.replace(
        /## Status([\s\S]+)Status: ([\w\s]+\n)(\s*)/,
        '## Status$1Status: $2  \n' + linkType + ' ' + srcAdrName + '\n$3'
      );
    }
    fs.writeFile(tgtFilePath, result, 'utf8', function(err) {
      if (err) return console.log(err);
    });
  });
}

/**
 * Update file that keep track of relation between ADR. It construct a memaid flow chart.
 * @param {String} adrPath path to adr folder
 * @param {String} output content to append to the file
 */
function updateFlowChart(adrPath, output) {
  fs.appendFile(adrPath + path.sep + 'adr_flow_chart.md', output, err => {
    if (err) {
      console.log('updateFlowChart: ' + err);
    }
  });
}


function addNode(adrPath, name, title) {
  let srcIndex = name.split('-')[0];
  let srcName = name.split('-')[1].split('.')[0];
  let output = srcIndex + '[' + srcName + ']\n';
  output += 'click ' + srcIndex + ' "' + name + '"\n';
  updateFlowChart(adrPath, output);

}

function addRelation(adrPath, src, tgt, linkType) {
  let srcIndex = src.split('-')[0];
  let srcName = src.split('-')[1].split('.')[0];
  let tgtIndex = tgt.split('-')[0];
  let tgtName = tgt.split('-')[1].split('.')[0];
  let output =
    srcIndex + '[' + srcName + ']' + ' --> |' + linkType + '|' + tgtIndex + '(' + tgtName + ')\n';
  output += 'click ' + srcIndex + ' "' + src + '"\n';
  updateFlowChart(adrPath, output);
}

function init(basedir, adrPath, adrTemplatePath, gitRepo) {
  const mustach = require('mustache');
  adrPath = path.join(basedir, adrPath);
  adrTemplatePath = path.join(basedir, adrTemplatePath);
  if (!fs.existsSync(adrPath)) {
    utils.mkDirByPathSync(adrPath);
    fs.writeFileSync(adrPath + path.sep + 'adr_flow_chart.md', '```\ngraph LR\n```\n');
  }
  if (!fs.existsSync(adrTemplatePath)) {
    utils.mkDirByPathSync(adrTemplatePath);

    const cp = require('child_process');
    cp.execSync('git clone ' + gitRepo + ' ' + adrTemplatePath, function(err, stdout, stderr) {
        if (err) {
        console.log('error while cloning adr template: ' + err);
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  } else {
    const cp = require('child_process');
    cp.execSync('git reset --hard origin/master', {cwd: adrTemplatePath}, function(err, stdout, stderr) {
      if (err) {
        console.log('error while updating adr template: ' + err);
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }

  var data = '';
  let d = new Date();
  data = {
    date: d.toLocaleDateString('en-EN', dateOptions),
    status: 'Accepted',
  };
  let output = mustach.render(
    fs.readFileSync(adrTemplatePath + path.sep + '0000-record_architecture_decisions.md', 'utf8'),
    data
  );
  fs.writeFile(adrPath + path.sep + '0000-record_architecture_decisions.md', output, err => {
    if (err) {
      console.log('error while creating first adr: ' + err);
    }
  });
  addNode(adrPath, '0000-record_architecture_decisions.md');
}

exports.init = init;
exports.getAllAdr = getAllAdr;
exports.createNewAdr = createNewAdr;
exports.addLink = addLink;
