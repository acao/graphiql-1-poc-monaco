// import * as React from "react";
// import * as monaco from "monaco-editor";

// import { useGraphiQLContext, useEditor, useEditorOn, useGraphiQLListener } from "graphiql";

// const config = {
//   name: "my-custom-plugin",
//   settings: {
//     "editor-mode": {
//       type: "options",
//       options: ["vim", "emacs", "sublime"]
//     }
//   }
// };
// export default function PluginExample() {
//   const ctx = useGraphiQLContext();

//   useEditor("query", (editor: monaco.editor.IStandaloneCodeEditor) => {
//     editor.addCommand("my-custom-command", () => {
//       ctx.executeMyCustomCommand(ctx.schemaAST, ctx.queryAST);
//     });
//     editor.addCommand("change editor mode", mode => {
//       changeMode(mode);
//     });
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
