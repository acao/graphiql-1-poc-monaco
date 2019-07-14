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

export default function(props: QueryEditorProps) {
  let editor;
  const ctx = React.useContext(GraphiQLContext);
  const didMount = async (editorInstance: monaco.editor.IStandaloneCodeEditor, context: typeof monaco) => {
    editor = editorInstance;
    editor.addCommand(KM.CtrlCmd | KC.Enter, async () => {
      await ctx.submitQuery();
    });
    monaco.languages.registerHoverProvider("graphql", {
      async provideHover(model, position, token) {
        console.log(model, position, token);
        return ctx.provideHoverInfo(position, undefined);
      }
    });
  };
  return (
    <MonacoEditor
      height="60vh"
      width="100%"
      language={"graphql"}
      value={ctx.query}
      options={options}
      onChange={props.updateQuery || ctx.updateQuery}
      editorDidMount={didMount}
    />
  );
}
