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

## Known Issues

This is a pre-release, for first users feedback.

## Release Notes

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