import * as vscode from "vscode";
import { window as Window } from "vscode";
// // import { readDocument, uploadToHastebin } from "./utils";
import { uploadToHastebin } from "./utils";

let myStatusBarItem: vscode.StatusBarItem;

export function activate(
  { subscriptions }: vscode.ExtensionContext
) {
  const myCommandId = "pasteninja.upload";
  subscriptions.push(
    vscode.commands.registerCommand(myCommandId, async () => {
      setStatusBar(
        `Uploading$(more~spin)`
      );

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
      setStatusBar(hastebinKey);
    })
  );

  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  myStatusBarItem.command = myCommandId;

  subscriptions.push(myStatusBarItem);
  subscriptions.push(vscode.window.onDidChangeActiveTextEditor(resetStatusBar));

  resetStatusBar();
}

const resetStatusBar = (): void => {
  myStatusBarItem.text = `$(cloud-upload) Pasteninja`;
  myStatusBarItem.show();
};

const setStatusBar = (text: string): void => {
  myStatusBarItem.text = text;
  myStatusBarItem.show();
};

export function deactivate() {}
