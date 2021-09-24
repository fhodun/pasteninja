import * as vscode from "vscode";
import { window as Window } from "vscode";
// // import { readDocument, uploadToHastebin } from "./utils";
import { uploadToHastebin, getFromHastebin } from "./utils";

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
  const myCommandId = "pasteninja.upload";
  subscriptions.push(
    vscode.commands.registerCommand(myCommandId, async () => {
      setStatusBar(`Uploading$(more~spin)`);

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

  subscriptions.push(
    vscode.commands.registerCommand("pasteninja.fetch", async () => {
      setStatusBar(`Fetching$(more~spin)`);

      const quickPick = vscode.window.createQuickPick();
      quickPick.title = "Pasteninja: Fetch";
      quickPick.placeholder = "hastebin key";
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.onDidAccept(async () => {
        quickPick.busy = true;
        const hastebinKey = quickPick.value;
        const code = await getFromHastebin(hastebinKey);
        if (code) {
          if (!Window.activeTextEditor) {
            return vscode.window.showInformationMessage(
              "There is no active text editor document!"
            );
          }
          Window.activeTextEditor.edit((editBuilder) => {
            if (!Window.activeTextEditor) { // typescript want this to be here
              return vscode.window.showInformationMessage(
                "There is no active text editor document!"
              );
            }
            editBuilder.replace(Window.activeTextEditor.selection, code);
          });
        }
        quickPick.dispose();
      });
      quickPick.show();
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

async function showInputBox() {
  const result = await Window.showInputBox({
    value: "abcdef",
    valueSelection: [2, 4],
    placeHolder: "For example: fedcba. But not: 123",
    validateInput: (text) => {
      Window.showInformationMessage(`Validating: ${text}`);
      return text === "123" ? "Not 123!" : null;
    },
  });
  Window.showInformationMessage(`Got: ${result}`);
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
