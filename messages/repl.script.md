# summary

Runs a REPL script, optionally connected to an org.

# description

TODO - add details here

# args.script.summary

filename of script to run

# args.script.description

TODO - add details here

# flags.targetorg.summary

org to connect to

# flags.targetorg.description

Specifies the username or alias of an org to which the REPL will connect.
Within the repl, the following global variables are defined:

- $conn a connection to the
  If no value is supplied, the REPL will run in a disconnected mode with
  undefined values for $org and $conn.

# examples

    `$ cat example.sfdx

#!/usr/bin/env sfdx repl:script

let me = await $conn.identity();
$cmd.ux.log(me.username + ' ran the example!');
`,
    `$ ./example.sfdx --targetusername me@example.com
me@example.com ran the example!
`,

- <%= config.bin %> <%= command.id %>
