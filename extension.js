/* eslint-disable space-before-function-paren */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const uiCommands = require('./ui/commands')
// const fs = require('fs');

// const adrPath = vscode.workspace.rootPath + path.sep + 'adr';
// const adrTemplatePath = vscode.workspace.rootPath + path.sep + '.adr-templates';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.adr-init', () => {
    uiCommands.adrInit()
  })

  context.subscriptions.push(disposable)

  disposable = vscode.commands.registerCommand('extension.adr-new', async () => {
    await uiCommands.adrNew()
  })
  context.subscriptions.push(disposable)

  disposable = vscode.commands.registerCommand('extension.adr-link', () => {
    uiCommands.adrLink()
  })
  context.subscriptions.push(disposable)

  disposable = vscode.commands.registerCommand('extension.adr-change-status', () => {
    uiCommands.adrChangeStatus()
  })
  context.subscriptions.push(disposable)

  disposable = vscode.commands.registerCommand('extension.adr-generate-doc', () => {
    uiCommands.adrGenerateDocs()
  })
  context.subscriptions.push(disposable)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
}
