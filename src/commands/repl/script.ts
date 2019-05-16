import { SfdxCommand, core } from '@salesforce/command';

// initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);
const messages = core.Messages.loadMessages('@mikeburr/sfdx-repl', 'script');

const fs = require('fs');
const repl = require('repl');
const { Transform, Writable } = require('stream');


// a simple transform stream that strips out the #! line at the start of a script
const stripShebang = new Transform({
  transform(chunk, encoding, callback) {
    const s = chunk.toString();

    // strip off the opening #! line
    // NB this will fail if the initial chunk does not contain the full shebang line
    if (this.checkShebang === undefined && s.startsWith("#!")) {
      this.push(s.replace(/^#![^\n]*\n/, ''));
    }
    else {
      this.push(chunk);
    }

    this.checkShebang = false;
    callback();
  }
});


export default class Script extends SfdxCommand {

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
    debugger;
    const { args, argv } = this.parse(Script);
    // console.log(`args: ${JSON.stringify(args)}, argv: ${argv}`);

    // we cannot replace process.argv as that messes with SFDX, so we put the script's
    // args in process.scriptArgv
    let originalArgv = process.argv;
    process.argv = argv;

    try {
      // read the specified script but strip off the #! line since it isn't legal javascript
      const script = fs.createReadStream(args.script).pipe(stripShebang);

      // suppress all the output from the repl itself (prompts, command results, etc.); note
      // that this does not affect data written with console.xyz or oclif's log/warn/error
      // functions
      let nullOutputStream = new Writable({
        objectMode: true,
        write: ((data, _, done) => done())
      });

      // build a repl to parse the script
      const replServer = repl.start({ prompt: '', input: script, output: nullOutputStream,
                                      ignoreOutput: true});

      // some shortcuts
      replServer.context.$cmd = this;
      replServer.context.$conn = this.org && this.org.getConnection();
      replServer.context.$org = this.org;

      // keep the command running until the replServer exits
      return await new Promise<any>((resolve) => {
        replServer.on('exit', () => resolve(replServer.context._));
      });
    }
    finally {
      process.argv = originalArgv;
    }
  }
}


