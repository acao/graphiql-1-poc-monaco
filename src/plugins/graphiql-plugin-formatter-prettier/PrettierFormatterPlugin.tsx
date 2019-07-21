// import * as React from "react";
// import * as monaco from "monaco-editor";
// import * as prettier from "prettier";
// import * as prettierStandalone from "prettier/standalone";
// import * as parserGraphql from "prettier/parser-graphql"

// import { useGraphiQLContext, useEditor, useEditorCommand } from "../../hooks";

// const { KeyMod: KM, KeyCode: KC } = monaco;
// type MODES = "vim" | "emacs" | "sublime";

// const settings = {
//   "format-on-save": {
//     defaultLabel: "Format On Save",
//     type: "boolean",
//     widget: "checkbox",
//     scope: ["global", "tab"]
//   },
//   "format-on-change": {
//     t: 'formatOnChange',
//     defaultLabel: "Format On Change",
//     type: "boolean",
//     widget: "checkbox",
//     scope: {
//       state: ["global", "tab"],
//     }
//   }
// };

// const config = {
//   name: "prettier",
//   settingScope: ["global", "state"],
//   settings: {
//     ...settings
//   },
//   tabSettings: {
//     ...settings
//   }
// };

// const ModePlugin: React.FunctionComponent<{}> = () => {
//   const ctx = useGraphiQLContext();

//   const editor = useEditor("query");
//   const createFormatter = (parser: "graphql"): monaco.languages.DocumentFormattingEditProvider => {
//     monaco.languages.registerDocumentFormattingEditProvider("graphql", createFormatter("graphql"));
//     return {
//       provideDocumentFormattingEdits: function(
//         document: monaco.editor.ITextModel,
//         options: monaco.languages.FormattingOptions,
//         token: monaco.CancellationToken
//       ): monaco.languages.TextEdit[] {
//         const text = document.getValue();

//         const formatted = prettierStandalone.format(text, { parser: parser, plugins: [parserGraphql] });
//         return [
//           {
//             range: document.getFullModelRange(),
//             text: formatted
//           }
//         ];
//       }
//     };
//   };

//   return <GraphiQLPlugin config={config} />;
// };

// export { ModePlugin as plugin, config };
