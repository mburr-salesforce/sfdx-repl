import { SfdxCommand, core, flags } from '@salesforce/command';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// initialize Messages with the current plugin directory
const messages = core.Messages.loadMessages('sfdx-repl', 'repl');

export default class Repl extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `$ sfdx repl:repl --targetusername me@example.com
me@example.com> 
    `,
    `$ sfdx repl:repl -e "1 + 2"
3
    `
  ];

  protected static supportsUsername = true;
  protected static supportsDevhubUsername = true;

  protected static flagsConfig = {
    execute: flags.string({
      char: 'e',
      description: messages.getMessage('eDescription'),
    })
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
      replServer = repl.start(`${username}> `);
    }

    const conn = this.org && this.org.getConnection();
    replServer.context.conn = conn;
    replServer.context.replServer = replServer;

    return new Promise<any>((resolve, reject) => {
      replServer.on('exit', () => { resolve(replServer.context._); });
    });
  }
}
