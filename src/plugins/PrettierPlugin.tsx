// import * as React from "react";
// import * as monaco from "monaco-editor";
// import { useGraphiQLContext, useEditor, useEditorCommand, useGraphiQLListener } from "../hooks";

// const { KeyMod: KM, KeyCode: KC } = monaco;
// type MODES = "vim" | "emacs" | "sublime";

// const CHANGE_MODE = KM.CtrlCmd | KC.KEY_M;

// const settings = {
//   "format-on-save": {
//     defaultLabel: "Format On Save",
//     type: "boolean",
//     widget: "checkbox"
//   },
//   "format-on-change": {
//     defaultLabel: "Format On Change",
//     type: "boolean",
//     widget: "checkbox"
//   }
// };

// const config = {
//   name: "prettier-plugin",
//   settings: {
//     ...settings
//   },
//   tabSettings: {
//     ...settings
//   }
// };
// const changeMode = (editor: monaco.editor.IStandaloneCodeEditor, mode: MODES) => {
//   editor;
// };

// const ModePlugin: React.FunctionComponent<{}> = () => {
//   const ctx = useGraphiQLContext();

//   const editor = useEditor("query");
//   useEditorCommand("query", {
//     id: "SUBMIT_QUERY",
//     defaultLabel: "Submit Query",
//     keybindings: [CHANGE_MODE],
//     run: changeMode
//   });
//   editor.addCommand(CHANGE_MODE, async (mode: MODES) => {
//     changeMode(editor, mode);
//   });
//   editor.addAction({
//     id: "SUBMIT_QUERY",
//     label: "Submit Query",
//     keybindings: [CHANGE_MODE],
//     run: async (_ed: monaco.editor.IStandaloneCodeEditor) => {
//       changeMode(editor, mode);
//     }
//   });

//   return <GraphiQLPlugin config={config} />;
// };

// export { ModePlugin as plugin, config };
