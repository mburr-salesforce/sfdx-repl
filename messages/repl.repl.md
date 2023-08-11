# summary

Runs a REPL, optionally connected to an org.

# description

Starts an interactive REPL (read-evaluate-print loop) that allows you to
interact with a Salesforce org. Within the REPL, the following variables
are defined:

- $org
- $conn
- $cmd - the `SfCommand`

See https://www.salesforcereader.com/2023/01/building-salesforce-cli-plug-in-julian.html

# flags.execute.summary

command to be executed

# flags.execute.description

Suppresses the interactive REPL and executes the supplied command instead.

# flags.targetorg.summary

org to connect to

# flags.targetorg.description

Specifies the username or alias of an org to which the REPL will connect.
Within the repl, the following global variables are defined:

- $conn a connection to the
  If no value is supplied, the REPL will run in a disconnected mode with
  undefined values for $org and $conn.

# examples

- Start an interactive REPL

<%= config.bin %> <%= command.id %> --target-org me@example.com
me@example.com> Math.sqrt(289)
17
me@example.com> (await $conn.identity()).username
'me@example.com'

- Specify a command

<%= config.bin %> <%= command.id %> -e "1 + 2"
3

- Get results as JSON:

<%= config.bin %> <%= command.id %> --target-org me@exmaple.com -e '(await $conn.identity()).username' --json
'me@example.com'
{
"status": 0,
"result": "me@example.com",
"warnings": []
}

# notConnectedPrompt

(not connected)
