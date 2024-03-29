sfdx-repl
=========

a simple REPL for the Salesforce CLI (Salesforce DX)

[![Version](https://img.shields.io/npm/v/sfdx-repl.svg)](https://npmjs.org/package/sfdx-repl)
[![CircleCI](https://circleci.com/gh/mburr-salesforce/sfdx-repl/tree/master.svg?style=shield)](https://circleci.com/gh/mburr-salesforce/sfdx-repl/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/mburr-salesforce/sfdx-repl?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-repl/branch/master)
[![Codecov](https://codecov.io/gh/mburr-salesforce/sfdx-repl/branch/master/graph/badge.svg)](https://codecov.io/gh/mburr-salesforce/sfdx-repl)
[![Greenkeeper](https://badges.greenkeeper.io/mburr-salesforce/sfdx-repl.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/mburr-salesforce/sfdx-repl/badge.svg)](https://snyk.io/test/github/mburr-salesforce/sfdx-repl)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-repl.svg)](https://npmjs.org/package/sfdx-repl)
[![License](https://img.shields.io/npm/l/sfdx-repl.svg)](https://github.com/mburr-salesforce/sfdx-repl/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g @mikeburr/sfdx-repl
$ @mikeburr/sfdx-repl COMMAND
running command...
$ @mikeburr/sfdx-repl (-v|--version|version)
@mikeburr/sfdx-repl/0.3.0 darwin-x64 node-v12.7.0
$ @mikeburr/sfdx-repl --help [COMMAND]
USAGE
  $ @mikeburr/sfdx-repl COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`@mikeburr/sfdx-repl repl:repl [-e <string>] [--help <help>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#mikeburrsfdx-repl-replrepl--e-string---help-help--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`@mikeburr/sfdx-repl repl:script [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#mikeburrsfdx-repl-replscript--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `@mikeburr/sfdx-repl repl:repl [-e <string>] [--help <help>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

runs an SFDX REPL

```
USAGE
  $ @mikeburr/sfdx-repl repl:repl [-e <string>] [--help <help>] [-v <string>] [-u <string>] [--apiversion <string>] 
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -e, --execute=execute                                                             command to be executed

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --help                                                                            show CLI help

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ sfdx repl:repl --targetusername me@example.com
  me@example.com> Math.sqrt(289)
  17
  me@example.com> $conn.identity().then(id => console.log('*** you are logged into Salesforce as: ' + id.username))
  Promise { _40: 0, _65: 0, _55: null, _72: null }
  me@example.com> *** you are logged into Salesforce as: me@example.com

  $ sfdx repl:repl -e "1 + 2"
  3

  Note that many interactions with Salesforce will return JavaScript Promises, which
  can be difficult to work with in an interactive environment. Use --experimental-repl-await
  to make things a bit easier:

  $ NODE_OPTIONS=--experimental-repl-await sfdx repl:repl -u me@example.com
  me@example.com> (await $conn.identity()).username
  'me@example.com'
```

_See code: [src/commands/repl/repl.ts](https://github.com/mburr-salesforce/sfdx-repl/blob/v0.3.0/src/commands/repl/repl.ts)_

## `@mikeburr/sfdx-repl repl:script [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

runs a script using the SFDX REPL

```
USAGE
  $ @mikeburr/sfdx-repl repl:script [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

ARGUMENTS
  SCRIPT  filename of script to run

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ cat example.sfdx
  #!/usr/bin/env sfdx repl:script

  let me = await $conn.identity();
  $cmd.ux.log(me.username + ' ran the example!');

  $ ./example.sfdx --targetusername me@example.com
  me@example.com ran the example!
```

_See code: [src/commands/repl/script.ts](https://github.com/mburr-salesforce/sfdx-repl/blob/v0.3.0/src/commands/repl/script.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
