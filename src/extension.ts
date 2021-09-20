import * as vscode from "vscode";
import { window as Window } from "vscode";
// import { readDocument, uploadToHastebin } from "./utils";
import { uploadToHastebin } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "pasteninja" is now active!');

  const disposable = vscode.commands.registerCommand(
    "pasteninja.upload",
    async () => {
      // const code = readDocument();
      let code;

      if (!Window.activeTextEditor) {
        console.error("There is no active text editor document!");
        return vscode.window.showInformationMessage(
          "There is no active text editor document!"
        );
      } else if (Window.activeTextEditor.selection.isEmpty) {
        code = Window.activeTextEditor.document.getText();
      } else {
        code = Window.activeTextEditor.document.getText(
          Window.activeTextEditor.selection
        );
      }
      const hastebinKey = await uploadToHastebin(code);
      vscode.window.showInformationMessage(
        "https://hastebin.com/" + hastebinKey
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
