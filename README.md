# vbot

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
TODO: Put more badges here.

> The Hubot implementation for the Vlabs team.

This repo houses the Slack//Hubot integration in order to support some of the teams devops activities. Note that, over time, this repo may be broken out into their smaller parts.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [List Release Versions](#list-release-versions)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

Currently, the repo is pretty much hard coded for our use case, however, should you fork it and want to modify it for your own room, you will need to set the following two environment vars:

HUBOT_SLACK_TOKEN: the token created for you on Slack.
SUPERUSERS: A list of Slack user names (comma separated with no spaces), that have the permission to deply using the vbot.

## Usage

The API supports the following calls:

### List Release Versions

The following call will look at the docker hub and print out the 3 last release versions of the software.

The call is:
```
vbot <REPONAME> versions
```

Where REPONAME is one of the following
  * venueui
  * venueserver

## Maintainers

[@realrhys](https://github.com/realrhys)

## Contribute

See [the contribute file](contribute.md)!

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 volentixlabs
