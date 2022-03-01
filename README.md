[![Build Status](https://travis-ci.org/vincent-ledu/vscode-adr-tools-extension.svg?branch=master)](https://travis-ci.org/vincent-ledu/vscode-adr-tools-extension)
[![Known Vulnerabilities](https://snyk.io/test/github/vincent-ledu/vscode-adr-tools-extension/badge.svg)](https://snyk.io/test/github/vincent-ledu/vscode-adr-tools-extension)
[![Maintainability](https://api.codeclimate.com/v1/badges/57f0818005519ef011ae/maintainability)](https://codeclimate.com/github/vincent-ledu/vscode-adr-tools-extension/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/57f0818005519ef011ae/test_coverage)](https://codeclimate.com/github/vincent-ledu/vscode-adr-tools-extension/test_coverage)

# ADR tools for Visual Studio Code

This is an extension for Visual Studio Code, to apply Architecture Decision Records.

## Features

Some palette commands to help applying ADR.

## Requirements

Need git client installed.

## Extension Settings

This extension contributes the following settings:

* `adr.project.directory`: destination folder for ADR
* `adr.templates.directory`: source folder where template are git cloned
* `adr.templates.repo`: url from where templates are cloned.
* `adr.naming.timestamp`: If set to true, then adr file names will be prefixed with timestamp instead of index
* `adr.project.directory-choose-from-marked`: If set to true, then you can select which folder to use when you create a new adr. Theese folders will be listed if they contain .adr empty placeholder file to mark the folder as adr destination

## Known Issues

This is a pre-release, for first users feedback.

## Release Notes

### 0.0.5
New awesome features:

    optional timestamp based based prefix for template files (to prevent conflicts when working in team)
    support for multiple adr folders:
    if you add a placeholder file named .adr to the folder and you enable the new configuration property the New ADR command will ask which folder to create the adr

Both features are controlled by configuration:

    adr.naming.timestamp
    adr.project.directory-choose-from-marked

### 0.0.4

Adding logs and parameters to activate it:
* Logs will appear in Output windows of vscode.
* Parameter: adr.log.enable, to set in .

### 0.0.3

New features:
* new status: 'Proposal'
* adding date on each status change event
* adding command for generating doc (only flow chart for the moment)
  * generating docs will now parse ADRs, generating a json files of relation between ADR, and generate flow chart.
  * json file could be use for generating other documentation type.

Bug fixes:
* Remove git hard reset when .adrtemplate exists (very dangerous...)
* fix flow chart layout generator

Technical: 
* Adding full integration tests

### 0.0.2

Bugs fixes:
* Fix bugs on creating linked ADR.
Technical:
* Finalize travis CI/CD (build on linux, publish to marketplace)

### 0.0.1

Initial release.
Commands availables:
* ADR Init: create structures and clone templates
* ADR New: create a new ADR
* ADR Link: link 2 ADR
* ADR Config: change configuration