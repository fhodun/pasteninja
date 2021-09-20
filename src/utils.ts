// import { window as Window } from "vscode";
const axios = require("axios");

// Read the text from the current window's open document, or selection
// const readDocument = (): string => {
//   let code;

//   if (!Window.activeTextEditor) {
//     console.error("There is no active text editor document!");
//     return ("There is no active text editor document!");
//   } else if (Window.activeTextEditor.selection.isEmpty) {
//     code = Window.activeTextEditor.document.getText();
//   } else {
//     code = Window.activeTextEditor.document.getText(
//       Window.activeTextEditor.selection
//     );
//   }

//   return code;
// };

const uploadToHastebin = async (code: string): Promise<string> => {
  return axios
    .post("https://hastebin.com/documents", code)
    .then((r: any) => {
      if (r.status === 200) {
        console.log(
          "Successfully uploaded document to hastebin with key: " + r.data.key
        );
        return r.data.key;
      } else {
        console.error("Uploading file failed with status " + r.status);
        return "Uploading file failed with status " + r.status;
      }
    })
    .catch((error: any) => {
      console.error(error);
      return "Uploading file failed with error: " + error;
    });
};

export {
  // readDocument,
  uploadToHastebin,
};
