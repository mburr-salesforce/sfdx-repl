import { SfdxCommand, core } from '@salesforce/command';

// initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);
const messages = core.Messages.loadMessages('@mikeburr/sfdx-repl', 'script');

const fs = require('fs');

export default class Script extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');
  public static examples = [
    `$ cat example.sfdx
#!/usr/bin/env sfdx repl:script

let me = await $conn.identity();
$cmd.ux.log(me.username + ' ran the example!');
`,
    `$ ./example.sfdx --targetusername me@example.com
me@example.com ran the example!
`
  ];


  // needed so oclif can do variable length command line argument list
  static strict = false;

  // support connections to regular orgs & dev hubs
  protected static supportsUsername = true;
  protected static supportsDevhubUsername = true;

  // must have script name, but strict=false above will allow additional args
  static args = [
    {
      name: 'script',
      required: true,
      description: messages.getMessage('scriptDescription')
    }
  ];


  public async run(): Promise<any> { // tslint:disable-line:no-any

    // sfdx doesn't do variable length arguments so we drop back to oclif's parsing
    const { args, argv } = this.parse(Script);

    // temporarily swap sfdx's argv for the script's; note that very bad things happen if
    // don't swap these back before we return
    // TODO - would it make more sense to pass the args to the script as function parameters?
    let originalArgv = process.argv;
    process.argv = argv;

    try {
      return new Promise((resolve) => {
        fs.readFile(args.script, (err, data) => {
          // strip off the shebang line since it's not valid javascript
          data = data.toString().replace(/^#![^\n]*\n/, '');

          // build a new async function with the contents of the script; we pass in
          // various bits of context so the script can access them the same way as repl
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
          const runme = new AsyncFunction('require', '$cmd', '$conn', '$org', data);

          // return a Promise that resolves to the script's return value
          resolve(runme(require, this, this.org && this.org.getConnection(), this.org));
        });
      });
    }

    finally {
      process.argv = originalArgv;
    }
  }
}


