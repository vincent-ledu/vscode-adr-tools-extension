# 3 . choose templates repository

Date: Tuesday, May 21, 2019

## Status

Status: Accepted on 2019-05-21  
Amends [0002-choose-what-to-implement.md](0002-choose-what-to-implement.md) on 2019-05-21  

## Context

As I'm not a dictator (not every day), I choose to let users to customize their ADR templates. To fullfill this objective, I have to give the choice where to get ADR templates.  
This must:
* be compatible with companies infrastructures, such as http proxies
* be customizable by project
* be secure

## Decision

I choose:
* To host templates on git.

It is compatible with:
* My company infrastructure and security policy
  * proxy configuration is on git client configuration, not handle by my extension (I don't ask for proxy authentication)
  * git hosting could be on premise or on public hosting (such as github)

Default configuration bundled with this extension is hosted at: https://github.com/vincent-ledu/adr-template/

A command as ADR Config must be implemented, to ask where to find templates.

## Consequences

It lead to the following prerequisite:
* Git client must be installed on the user desktop, and configured for companies proxies by the user.

