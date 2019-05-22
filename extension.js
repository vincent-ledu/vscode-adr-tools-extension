// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const adrUtils = require('./adr-utils');
const path = require('path');
//const fs = require('fs');

//const adrPath = vscode.workspace.rootPath + path.sep + 'adr';
//const adrTemplatePath = vscode.workspace.rootPath + path.sep + '.adr-templates';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('extension.adr-init', () => {

		let configuredAdrProjectDirectory = path.normalize(vscode.workspace.getConfiguration().get("adr.project.directory"));
		vscode.window.showInputBox( {value: configuredAdrProjectDirectory, 
			prompt: 'Enter your adr directory destination:', 
			placeHolder: 'Your ADR folder in this workspace'})
			.then(adrProjectDirectory => {
				if (!adrProjectDirectory) return ;
				let configuredTemplateRepo = vscode.workspace.getConfiguration().get("adr.templates.repo");
				vscode.window.showInputBox({ value: configuredTemplateRepo, 
					prompt: 'Enter your adr templates git repo url:', 
					placeHolder: 'https://yourGitRepoWithADRTemplates'})
					.then(adrTemplateGitRepo => {
						if (!adrTemplateGitRepo) return ;
						let configuredTemplateDirectory = path.normalize(vscode.workspace.getConfiguration().get("adr.templates.directory"));
						vscode.window.showInputBox({value:configuredTemplateDirectory, 
							prompt: 'Enter your adr templates Directory path for this workspace:', 
							placeHolder: '.adr-templates'})
							.then(adrTemplateDirectory => {
								if (!adrTemplateDirectory) return ;
								console.log("adr.project.directory", adrProjectDirectory);
								console.log("adr.templates.directory", adrTemplateDirectory);
								console.log("adr.templates.repo", adrTemplateGitRepo);
								vscode.workspace.getConfiguration().update("adr.project.directory", adrProjectDirectory, vscode.ConfigurationTarget.Workspace);
								vscode.workspace.getConfiguration().update("adr.templates.directory", adrTemplateDirectory, vscode.ConfigurationTarget.Workspace);
								vscode.workspace.getConfiguration().update("adr.templates.repo", adrTemplateGitRepo, vscode.ConfigurationTarget.Workspace);
								let basedir = vscode.workspace.rootPath;
								adrUtils.init(basedir, adrProjectDirectory,
												adrTemplateDirectory, 
												adrTemplateGitRepo);
								vscode.window.showInformationMessage('ADR Init');
							});
					});
			});
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('extension.adr-new', () => {

		let adrFolder = path.join(vscode.workspace.rootPath, vscode.workspace.getConfiguration().get("adr.project.directory"));
		let adrTemplateFolder = path.join(vscode.workspace.rootPath, vscode.workspace.getConfiguration().get("adr.templates.directory"));
		vscode.window.showInputBox({prompt: 'Enter new ADR name', placeHolder: 'Choose database'}).then(srcAdrName => {
			if (!srcAdrName) return;
			vscode.window.showQuickPick(["None", "Supersedes", "Amends"], { prompt: 'Select if there is a relation with existing ADR' }).then(linkType => {
				if (!linkType) return;
				if (!(linkType === "None")) {
					vscode.window.showQuickPick(adrUtils.getAllAdr(adrFolder), {prompt: 'Enter target ADR name', placeHolder: 'Choose database'}).then(tgtAdrName => {
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
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('extension.adr-link', () => {

		let adrFolder = path.join(vscode.workspace.rootPath, vscode.workspace.getConfiguration().get("adr.project.directory"));
		vscode.window.showQuickPick(adrUtils.getAllAdr(adrFolder), {prompt: 'Enter source ADR name', placeHolder: 'Choose database'}).then(srcAdrName => {
			if (!srcAdrName) return ;
			vscode.window.showQuickPick(["Supersedes", "Amends"], { prompt: 'Select if there is a relation with existing ADR' }).then(linkType => {
				if (!linkType) return ;
				vscode.window.showQuickPick(adrUtils.getAllAdr(adrFolder), {prompt: 'Enter target ADR name', placeHolder: 'Choose database'}).then(tgtAdrName => {
					if (!tgtAdrName) return ;
					adrUtils.addLink(tgtAdrName, adrFolder + path.sep + srcAdrName, linkType);
					let linkedType = "";
					if (linkType === "Supersedes") {
						linkedType = "Superceded by";
					} else {
						linkedType = linkType.replace(/s$/, "ed by");
					}
					adrUtils.addLink(srcAdrName, adrFolder + path.sep + tgtAdrName, linkedType);
					vscode.window.showInformationMessage('ADR Link');	
				});
	
			});
	
		});
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('extension.adr-help', () => {
		vscode.window.showInformationMessage('ADR Help: Not yet implemented');
	});
	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
