import { SfdxCommand } from '@salesforce/command';

const fs = require('fs');
const process = require('process');
const repl = require('repl');
const { Transform } = require('stream');


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

  // needed so oclif can do variable length command line argument list
  static strict = false;

  // support connections to regular orgs
  protected static supportsUsername = true;


  public async run(): Promise<any> { // tslint:disable-line:no-any

    // sfdx doesn't do variable length arguments so we drop back to oclif's parsing
    const { argv } = this.parse(Script);

    // as in vanilla node, scripts look for their arguments in process.argv but we don't
    // want them seeing all the node/sfdx/repl:script entries
    process.argv = argv;

    // read the specified script but strip off the #! line since it isn't legal javascript
    const script = fs.createReadStream(argv[0]).pipe(stripShebang);

    // build a repl to parse the script
    const replServer = repl.start({ prompt: '', input: script, output: process.stdout,
                                    terminal: false, writer: output => undefined, ignoreUndefined: true });

    // add some convenience entries to the repl's context
    const conn = this.org && this.org.getConnection();
    replServer.context.conn = conn;
    replServer.context.replServer = replServer;

    /// wait for the repl to finish running the script, then return the last value from the script
    return new Promise<any>((resolve, reject) => {
      replServer.on('exit', () => { resolve(replServer.context._); });
    });
  }
}


