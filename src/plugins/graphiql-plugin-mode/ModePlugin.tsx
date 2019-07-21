// import * as React from "react";
// import * as monaco from "monaco-editor";
// import { useGraphiQLContext, useEditor } from "../hooks";
// const { KeyMod: KM, KeyCode: KC } = monaco;
// type MODES = "vim" | "emacs" | "sublime";

// //
// const CHANGE_MODE = KM.CtrlCmd | KC.KEY_M;

// const config = {
//   name: "my-custom-plugin",
//   settings: {
//     "editor-mode": {
//       type: "options",
//       options: ["vim", "emacs", "sublime"]
//     }
//   }
// };

// class EditorMode {
//   constructor() {

//   }
//   install = async () => {

//   };
// }

// export default function ModePlugin() {
//   const settings = useGraphiQLContext("settings");
//   const ctx = useGraphiQLContext();

//   useEditor("query", (editor: monaco.editor.IStandaloneCodeEditor) => {
//     settings.addSetting("editor-mode");
//   });

//   return <GraphiQLPlugin config={config} />;
// }
