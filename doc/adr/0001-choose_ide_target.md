# 1 . choose ide target

Date: Tuesday, May 21, 2019

## Status

Accepted  


## Context

As: 
- VS Code is a popular IDE in our company
- Nat Pryce's shell ADR tools is slow on our company's shell emulator (fault to our company security)
- Architecture decision must be documented all along the project and after

we need a integrated tools, with vizualisation to edit document.


## Decision

A Visual Studio Code extension seems to be the good option for starting.

## Consequences

Developers on others IDEs, such as eclipse, intellij, Visual Studio, won't have this extension.  
They could use VS Code aside their main IDE.
