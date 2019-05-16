import { SfdxCommand, core, flags } from '@salesforce/command';

// initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);
const messages = core.Messages.loadMessages('@mikeburr/sfdx-repl', 'repl');

export default class Repl extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `$ sfdx repl:repl --targetusername me@example.com
me@example.com> 
`,
    `$ sfdx repl:repl -e "1 + 2"
3
`,
    `Note that many interactions with Salesforce will return JavaScript Promises, which
can be difficult to work with in an interactive environment. Use --experimental-repl-await
to make things a bit easier:
`,
    `$ NODE_OPTIONS=--experimental-repl-await sfdx repl:repl -u me@example.com
me@example.com> (await $conn.identity()).username
'me@example.com'
`
  ];

  protected static supportsUsername = true;
  protected static supportsDevhubUsername = true;

  protected static flagsConfig = {
    execute: flags.string({
      char: 'e',
      description: messages.getMessage('eDescription'),
    }),
    help: flags.help({})
  }


  public async run(): Promise<any> { // tslint:disable-line:no-any

    const repl = require('repl');
    let replServer;


    // execute any commands supplied with -e flag
    if (this.flags.execute) {
      const { Readable } = require('stream');
      const s = new Readable();
      s.push(this.flags.execute);
      s.push(null);

      const { stdout } = require('process');
      replServer = repl.start({ prompt: '', input: s, output: stdout, terminal: false });
    }

    // no commands supplied, start interactive mode
    else {  
      const username = this.org ? this.org.getUsername() : messages.getMessage("notConnectedPrompt");
      replServer = repl.start({ prompt: `${username}> ` });
    }


    // some shortcuts
    replServer.context.$cmd = this;
    replServer.context.$conn = this.org && this.org.getConnection();
    replServer.context.$org = this.org;


    // keep the command running until the replServer exits
    return new Promise<any>((resolve) => {
      replServer.on('exit', () => resolve(replServer.context._));
    });
  }
}
