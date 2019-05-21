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

### 0.0.1

Initial release.
Commands availables:
* ADR Init: create structures and clone templates
* ADR New: create a new ADR
* ADR Link: link 2 ADR
* ADR Config: change configuration