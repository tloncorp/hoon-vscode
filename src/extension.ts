/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { window, workspace, ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  Executable,
} from "vscode-languageclient";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  const configuration = workspace.getConfiguration("hoon.languageServer");

  const url: string = configuration.get("url");
  const port: number = configuration.get("port");
  const delay: number = configuration.get("delay");
  const enabled: boolean = configuration.get("enabled");
  const code: string = configuration.get("code");
  const ship: string = configuration.get("ship");

  if (!enabled) {
    return;
  }
  // Server must be in $PATH
  let serverExecutable: Executable = {
    command: "hoon-language-server",
    args: [`-u=${url}`, `-p=${port}`, `-d=${delay}`, `-s=${ship}`, `-c=${code}`],
  };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = serverExecutable;

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for documents
    documentSelector: [{ language: "hoon", scheme: "file" }],
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "hoon",
    "Hoon Language Server",
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
