const vscode = require('vscode')

const outputChannelName = 'META'

const outputChannel = vscode.window.createOutputChannel(outputChannelName)
outputChannel.show(false)

function vsLog (msg) {
  outputChannel.appendLine('ADR-VSCode: ' + msg)
}

module.exports.vsLog = vsLog
