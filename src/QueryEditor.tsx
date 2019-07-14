import * as React from "react";
import * as monaco from "monaco-editor";
import { MonacoEditor } from "./MonacoEditor";
import GraphiQLContext from "./GraphiQLContext";

const { KeyMod: KM, KeyCode: KC } = monaco;

type QueryEditorProps = {
  query?: string;
  updateQuery?(value: string, event: monaco.editor.IModelContentChangedEvent): void;
};

const options = {
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: "line",
  automaticLayout: false,
  formatOnType: true
};
// const queryEditor = useEditor("query", GraphiQLContext);
// useEditorCommand(queryEditor, KM.CtrlCmd | KC.Enter, async () => {
//   await ctx.submitQuery();
// });
export default function(props: QueryEditorProps) {
  let editor;
  const ctx = React.useContext(GraphiQLContext);
  const didMount = async (editorInstance: monaco.editor.IStandaloneCodeEditor) => {
    editor = editorInstance;
    ctx.editorLoaded("query", editor);
    editor.addCommand(KM.CtrlCmd | KC.Enter, async () => {
      console.log("did this happen");
      await ctx.submitQuery();
    });
    // TODO: not yet working but close
    // monaco.languages.registerHoverProvider("graphql", {
    //   async provideHover(model, position, token) {
    //     return ctx.provideHoverInfo(position, token);
    //   }
    // });
  };
  return (
    <MonacoEditor
      height="70vh"
      width="100%"
      language={"graphql"}
      value={ctx.query}
      options={options}
      onChange={props.updateQuery || ctx.updateQuery}
      editorDidMount={didMount}
    />
  );
}
