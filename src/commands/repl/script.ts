/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as fs from 'fs';
import { Args } from '@oclif/core';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@mikeburr/sf-repl', 'repl.script');

export type ReplScriptResult = unknown;

type AsyncFunctionConstructor = {
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  new (functionBody: string): () => Promise<unknown>;
};

// eslint-disable-next-line
const AsyncFunction: AsyncFunctionConstructor = Object.getPrototypeOf(async function () {}).constructor;

export default class ReplScript extends SfCommand<ReplScriptResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly args = {
    script: Args.file({
      required: true,
      description: messages.getMessage('args.script.summary'),
    }),
  };

  public static readonly flags = {
    'target-org': Flags.optionalOrg({
      summary: messages.getMessage('flags.targetorg.summary'),
      description: messages.getMessage('flags.targetorg.description'),
      char: 'o',
    }),
  };

  // allow vararg parsing
  public static readonly strict = false;

  public async run(): Promise<ReplScriptResult> {
    const { args, argv, flags } = await this.parse(ReplScript);

    return (
      fs.promises
        .readFile(args.script)
        .then(async (data) => {
          // strip off the shebang line since it's not valid javascript
          const scriptString = data.toString().replace(/^#![^\n]*\n/, '');

          // build a new async function with the contents of the script; use an
          // async function so the script can use await
          const runme = new AsyncFunction(scriptString);

          // attach relevant globals to the global object so they are available
          // throughout entirety of script execution
          global['require'] = require;
          (global as any)['$cmd'] = this; // eslint-disable-line
          const org = ((global as any)['$org'] = flags['target-org']); // eslint-disable-line
          (global as any)['$conn'] = org?.getConnection(); // eslint-disable-line
          (global as any)['$argv'] = argv; // eslint-disable-line

          return runme();
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          this.error(error instanceof Error ? error : new Error(JSON.stringify(error)), { exit: 1 });
        })
    );
  }
}
