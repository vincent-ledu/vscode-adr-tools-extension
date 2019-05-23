const vscode = require("vscode");
const adrUtils = require("../adrfunc/adr-utils");
const path = require("path");

function adrInit() {
  let configuredAdrProjectDirectory = path.normalize(vscode.workspace.getConfiguration().get("adr.project.directory"));
  vscode.window
    .showInputBox({
      value: configuredAdrProjectDirectory,
      prompt: "Enter your adr directory destination:",
      placeHolder: "Your ADR folder in this workspace"
    })
    .then(adrProjectDirectory => {
      if (!adrProjectDirectory) return;
      let configuredTemplateRepo = vscode.workspace.getConfiguration().get("adr.templates.repo");
      vscode.window
        .showInputBox({
          value: configuredTemplateRepo,
          prompt: "Enter your adr templates git repo url:",
          placeHolder: "https://yourGitRepoWithADRTemplates"
        })
        .then(adrTemplateGitRepo => {
          if (!adrTemplateGitRepo) return;
          let configuredTemplateDirectory = path.normalize(vscode.workspace.getConfiguration().get("adr.templates.directory"));
          vscode.window
            .showInputBox({
              value: configuredTemplateDirectory,
              prompt: "Enter your adr templates Directory path for this workspace:",
              placeHolder: ".adr-templates"
            })
            .then(adrTemplateDirectory => {
              if (!adrTemplateDirectory) return;
              console.log("adr.project.directory", adrProjectDirectory);
              console.log("adr.templates.directory", adrTemplateDirectory);
              console.log("adr.templates.repo", adrTemplateGitRepo);
              vscode.workspace.getConfiguration().update("adr.project.directory", adrProjectDirectory, vscode.ConfigurationTarget.Workspace);
              vscode.workspace.getConfiguration().update("adr.templates.directory", adrTemplateDirectory, vscode.ConfigurationTarget.Workspace);
              vscode.workspace.getConfiguration().update("adr.templates.repo", adrTemplateGitRepo, vscode.ConfigurationTarget.Workspace);
              let basedir = vscode.workspace.rootPath;
              adrUtils.init(basedir, adrProjectDirectory, adrTemplateDirectory, adrTemplateGitRepo);
              vscode.window.showInformationMessage("ADR Init");
            });
        });
    });
}

function adrNew() {
  let adrFolder = path.join(vscode.workspace.rootPath, vscode.workspace.getConfiguration().get("adr.project.directory"));
  let adrTemplateFolder = path.join(vscode.workspace.rootPath, vscode.workspace.getConfiguration().get("adr.templates.directory"));
  vscode.window
    .showInputBox({
      prompt: "Enter new ADR name",
      placeHolder: "Choose database"
    })
    .then(srcAdrName => {
      if (!srcAdrName) return;
      vscode.window
        .showQuickPick(["None", "Supersedes", "Amends"], {
          prompt: "Select if there is a relation with existing ADR"
        })
        .then(linkType => {
          if (!linkType) return;
          if (!(linkType === "None")) {
            vscode.window
              .showQuickPick(adrUtils.getAllAdr(adrFolder), {
                prompt: "Enter target ADR name",
                placeHolder: "Choose database"
              })
              .then(tgtAdrName => {
                if (!tgtAdrName) return;
                let filepath = adrUtils.createNewAdr(srcAdrName, linkType, tgtAdrName, adrFolder, adrTemplateFolder);
                vscode.workspace.openTextDocument(filepath).then(doc => vscode.window.showTextDocument(doc));
              });
          } else {
            let filepath = adrUtils.createNewAdr(srcAdrName, null, null, adrFolder, adrTemplateFolder);
            vscode.workspace.openTextDocument(filepath).then(doc => vscode.window.showTextDocument(doc));
          }
        });
    });
}

function adrLink() {
  let adrFolder = path.join(vscode.workspace.rootPath, vscode.workspace.getConfiguration().get("adr.project.directory"));
  vscode.window
    .showQuickPick(adrUtils.getAllAdr(adrFolder), {
      prompt: "Enter source ADR name",
      placeHolder: "Choose database"
    })
    .then(srcAdrName => {
      if (!srcAdrName) return;
      vscode.window
        .showQuickPick(["Supersedes", "Amends"], {
          prompt: "Select if there is a relation with existing ADR"
        })
        .then(linkType => {
          if (!linkType) return;
          vscode.window
            .showQuickPick(adrUtils.getAllAdr(adrFolder), {
              prompt: "Enter target ADR name",
              placeHolder: "Choose database"
            })
            .then(tgtAdrName => {
              if (!tgtAdrName) return;
              adrUtils.addLink(tgtAdrName, adrFolder + path.sep + srcAdrName, linkType);
              let linkedType = "";
              if (linkType === "Supersedes") {
                linkedType = "Superceded by";
              } else {
                linkedType = linkType.replace(/s$/, "ed by");
              }
              adrUtils.addLink(srcAdrName, adrFolder + path.sep + tgtAdrName, linkedType);
              vscode.window.showInformationMessage("ADR Link");
            });
        });
    });
}

module.exports.adrLink = adrLink;
module.exports.adrNew = adrNew;
module.exports.adrInit = adrInit;
