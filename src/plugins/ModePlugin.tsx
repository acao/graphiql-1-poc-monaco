// import * as React from "react";
// import * as monaco from "monaco-editor";
// import { useGraphiQLContext, useEditor, useEditorOn, useGraphiQLListener } from "graphiql";

// const { KeyMod: KM, KeyCode: KC } = monaco;
// type MODES = "vim" | "emacs" | "sublime"


// const CHANGE_MODE = KM.CtrlCmd | KC.KEY_M

// const config = {
//   name: "my-custom-plugin",
//   settings: {
//     "editor-mode": {
//       type: "options",
//       options: ["vim", "emacs", "sublime"]
//     }
//   }
// };

// export default function ModePlugin() {
//   const ctx = useGraphiQLContext();

//   useEditor("query", (editor: monaco.editor.IStandaloneCodeEditor) => {
//      editor.addCommand(CHANGE_MODE, async (mode: MODES) => {
//         await ctx.submitQuery(mode);
//       });
//     editor.addAction({
//       id: "SUBMIT_QUERY",
//       label: "Submit Query",
//       keybindings: [CHANGE_MODE],
//       run: async (_ed: monaco.editor.IStandaloneCodeEditor) => {
//         await ctx.submitQuery();
//       }
//   });

//   useEditor("variables", (editor: monaco.editor.IStandaloneCodeEditor) => {
//     editor.addCommand("my-custom-command", () => {
//       ctx.executeMyCustomCommand(ctx.schemaAST, ctx.queryAST);
//     });
//     editor.addCommand("change editor mode", mode => {
//       changeMode(mode);
//     });
//   });

//   useEditorOn("loaded", (editor: monaco.editor.IStandaloneCodeEditor) => {
//     editor.onMouseMove(() => {});
//   });

//   useGraphiQLListener("hover", "query", (editor: monaco.editor.IStandaloneCodeEditor) => {
//     console.log("all editors have loaded");
//   });

//   return <GraphiQLPlugin config={config} />;
// }
