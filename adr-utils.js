const fs = require('fs');
const path = require('path');

function sanitizedAdrName(adrName) {
    return adrName.toLowerCase().replace(/ /g, '_').replace(/'/, '_').replace(/-/g, '_');
}

function getAllAdr(adrPath) {
    var files = fs.readdirSync(adrPath);
    return files;
}

function createNewAdr(basedir, srcAdrName, linkType, tgtAdrName, adrPath, adrTemplatePath) {
    const mustache = require('mustache');
    adrPath = path.join(basedir, adrPath);
    adrTemplatePath = path.join(basedir, adrTemplatePath);
    console.log("create new adr " + srcAdrName + " in " + adrPath + " from templatepath " + adrTemplatePath);
    var lastIndex = -1;
    let srcAdrSanitizeName = "";
    let files = fs.readdirSync(adrPath);//, function (err, files) {
        // if (err) {
        //     console.log("error reading directory "+ adrPath + ": " + err);
        // }
    files.forEach(file => {
        var index = parseInt(file.split('-')[0]);
        if (isNaN(index)) {
            index = 0;
        }
        lastIndex = Math.max(lastIndex, index);
    });
    console.log("lastindex:" + lastIndex);
    lastIndex = "" + (lastIndex + 1);
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var data = ""
    let d = new Date();
    data = { 
        "date": d.toLocaleDateString('en-EN', options), 
        "status": "Accepted",
        "adr-index": lastIndex,
        "adr-name" : ""+ srcAdrName +""
    }
    srcAdrSanitizeName = lastIndex.padStart(4, '0') + "-" + sanitizedAdrName(srcAdrName) + ".md";
    if (linkType === "Supersedes" && tgtAdrName != null) {
        data['links'] = linkType + " " + tgtAdrName;
        let tgtFilePath = adrPath + path.sep + tgtAdrName;
        let linkedType = "Superseded by";
        addLink(srcAdrSanitizeName, tgtFilePath, linkedType);
        addRelation(adrPath, srcAdrSanitizeName, tgtAdrName, linkType);
    } else if (linkType != null && tgtAdrName != null) {
        data['links'] = linkType + " " + tgtAdrName;
        let tgtFilePath = adrPath + path.sep + tgtAdrName;
        let linkedType = linkType.replace(/s$/, "ed by");
        addLink(srcAdrSanitizeName, tgtFilePath, linkedType);
        addRelation(adrPath, srcAdrSanitizeName, tgtAdrName, linkType);
    } else {
        addNode(adrPath, srcAdrSanitizeName);
    }
    let templateContent = fs.readFileSync(adrTemplatePath + path.sep + 'index-recordname.md', 'utf8');
    
    let output = mustache.render(templateContent, data);
    fs.writeFileSync(adrPath + path.sep + srcAdrSanitizeName, output);
    console.log("new adr srcname: " + adrPath + path.sep + srcAdrSanitizeName);
//    });
    console.log("befole return: "+ adrPath + path.sep + srcAdrSanitizeName);
    return adrPath + path.sep + srcAdrSanitizeName;
}

function addLink(srcAdrName, tgtFilePath, linkType) {
    console.log("add link "+ linkType + " " + srcAdrName + " to " + tgtFilePath + "")
    fs.readFile(tgtFilePath, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var result = "";
        if (linkType === "Superseded by") {
            result = data.replace(/## Status([\s\S])*Accepted(\s)/,  "## Status\n$1" + linkType + " " + srcAdrName);
        } else {
            result = data.replace(/## Status([\s\S])*Accepted(\s)/,  "## Status\n$1Accepted  \n" + linkType  + " " + srcAdrName);
        }
        fs.writeFile(tgtFilePath, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

function addNode(adrPath, src) {
    let srcIndex = src.split('-')[0];
    let srcName = src.split('-')[1].split('.')[0];
    let output = srcIndex + '['+srcName+']\n';
    output += 'click ' + srcIndex + ' "' + src + '"\n';

    fs.appendFile(adrPath + path.sep + 'adr_flow_chart.md', output, (err) => {
        if (err) {
            console.log("addRelation error: " + err);
        }
    });
}

function addRelation(adrPath, src, tgt, linkType) {
    let srcIndex = src.split('-')[0];
    let srcName = src.split('-')[1].split('.')[0];
    let tgtIndex = tgt.split('-')[0];
    let tgtName = tgt.split('-')[1].split('.')[0];
    let output = srcIndex + '['+srcName+']' + ' --> |' + linkType + '|' + tgtIndex + '(' + tgtName + ')\n';
    output += 'click ' + srcIndex + ' "' + src + '"\n';

    fs.appendFile(adrPath + path.sep + 'adr_flow_chart.md', output, (err) => {
        if (err) {
            console.log("addRelation error: " + err);
        }
    });
}

function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';
  
    return targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir);
      try {
        fs.mkdirSync(curDir);
      } catch (err) {
        if (err.code === 'EEXIST') { // curDir already exists!
          return curDir;
        }
  
        // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
        if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
          throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
        }
  
        const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
        if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
          throw err; // Throw if it's just the last created dir.
        }
      }
  
      return curDir;
    }, initDir);
}

function init(basedir, adrPath, adrTemplatePath, gitRepo) {
    const mustach = require('mustache');
    adrPath = path.join(basedir, adrPath);
    adrTemplatePath = path.join(basedir, adrTemplatePath);
    if (!fs.existsSync(adrPath)) {
        mkDirByPathSync(adrPath);
        fs.writeFileSync(adrPath + path.sep + "adr_flow_chart.md", "graph LR\n");
    }
    if (!fs.existsSync(adrTemplatePath)) {
        mkDirByPathSync(adrTemplatePath);
        
        const cp = require('child_process')
        cp.execSync('git clone '+gitRepo + ' ' + adrTemplatePath, function(err, stdout, stderr) {
            if (err) {
                console.log("error while cloning adr template: " + err);
            } 
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    }

    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var data = ""
    let d = new Date();
    data = { 
        "date": d.toLocaleDateString('en-EN', options), 
        "status": "Accepted"
    }
    let output = mustach.render(
        fs.readFileSync(adrTemplatePath + path.sep + "0000-record_architecture_decisions.md", 
        'utf8'), data);
    fs.writeFile(adrPath + path.sep + "0000-record_architecture_decisions.md", output, (err) => {
        if (err) {
            console.log("error while creating first adr: " + err);
        }
    });
    addNode(adrPath, "0000-record_architecture_decisions.md");
}

exports.init = init;
exports.getAllAdr = getAllAdr;
exports.createNewAdr = createNewAdr;
exports.addLink = addLink;