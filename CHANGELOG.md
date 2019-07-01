# Change Log

## [0.0.3]

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

## [0.0.2]

Bugs fixes:  
* Fix bugs on creating linked ADR.  

Technical:  
* Finalize travis CI/CD (build on linux, publish to marketplace)

## [0.0.1]

Initial release.  
Commands availables:
* ADR Init: create structures and clone templates
* ADR New: create a new ADR
* ADR Link: link 2 ADR
* ADR Config: change configuration