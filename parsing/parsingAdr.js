const fs = require('fs');
const path = require('path');
const utils = require('../common/utils');

/**
 * Get content of the Status section
 * @param {String} adrDir adr folder
 * @param {String} file ADR filename
 */
function getStatusSection(adrDir, file) {
    let data = fs.readFileSync(path.join(adrDir, file), 'utf8');
    let res = data.match(/^## Status\s*([\w\W]*)^## Context/m);
    if (res.length == 2) {
        return res[1];
    }
}

/**
 * Get the actual status from the status section
 * @param {String} data content in the status section
 */
function getStatus(data) {
    
    let res = data.match(/^Status:[ \t]*([\w \t]+)/m);
    if (res.length > 1) {
        return res[1];
    } else {
        console.log("error, no status found");
    }
}


function getRelations(data) {
    let res = data.match(/^([\w \t\-]+\.md[\t ]*)/gm);
    if (res != null && res.length > 0) {
        return res;
    } else {
        console.log("error, no relations found");
    }
}

module.exports.getStatusSection = getStatusSection;
module.exports.getStatus = getStatus;
module.exports.getRelations = getRelations;