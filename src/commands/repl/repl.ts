/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { REPLServer } from 'repl';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@mikeburr/sfdx-repl', 'repl.repl');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReplReplResult = any;

export default class Repl extends SfCommand<ReplReplResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    execute: Flags.string({
      summary: messages.getMessage('flags.execute.summary'),
      description: messages.getMessage('flags.execute.description'),
      char: 'e',
    }),

    'target-org': Flags.optionalOrg({
      summary: messages.getMessage('flags.targetorg.summary'),
      description: messages.getMessage('flags.targetorg.description'),
    }),
  };

  public async run(): Promise<ReplReplResult> {
    const { flags } = await this.parse(Repl);
    const org = flags['target-org'];
    const conn = org?.getConnection(undefined);

    const repl = await import('repl');
    let replServer: REPLServer;

    // execute any commands supplied with -e flag
    if (flags.execute) {
      const { Readable } = await import('stream');
      const s = new Readable();
      s.push(flags.execute);
      s.push(null);

      const { stdout } = await import('process');
      replServer = repl.start({ prompt: '', input: s, output: stdout, terminal: false });
    }

    // no commands supplied, start interactive mode
    else {
      const username = conn?.getUsername() ?? messages.getMessage('notConnectedPrompt');
      replServer = repl.start({ prompt: `${username}> ` });
    }

    replServer.context.$cmd = this;
    replServer.context.$conn = conn;
    replServer.context.$org = org;

    return new Promise<ReplReplResult>((resolve) => {
      replServer.on('exit', () => resolve(replServer.context._));
    });
  }
}
