const vscode = require('vscode')

const outputChannelName = 'META'

const outputChannel = vscode.window.createOutputChannel(outputChannelName)

function vsLog (msg) {
  if (vscode.workspace.getConfiguration().get('adr.log.enable')) {
    outputChannel.show(false)
    outputChannel.appendLine('ADR-VSCode: ' + msg)
  }
}

module.exports.vsLog = vsLog
