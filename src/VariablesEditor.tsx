import * as React from "react";
import * as monaco from "monaco-editor";
import GraphiQLContext from "./GraphiQLContext";
import { MonacoEditor } from "./MonacoEditor";

const { KeyMod: KM, KeyCode: KC } = monaco;

export type VariablesEditorProps = {
  variables?: string;
  onChangeVariables?: (variables: any) => void;
};
let editor;
export default function VariablesEditor(props: VariablesEditorProps) {
  const ctx = React.useContext(GraphiQLContext);
  const didMount = (editorInstance: monaco.editor.IStandaloneCodeEditor, context: typeof monaco) => {
    editor = editorInstance;
    editor.addCommand(KM.CtrlCmd | KC.Enter, async () => {
      await ctx.submitQuery();
    });
  };
  return (
    <MonacoEditor
      width="100%"
      height="30vh"
      language="json"
      value={props.variables || ctx.variables}
      onChange={props.onChangeVariables || ctx.updateVariables}
      editorDidMount={didMount}
    />
  );
}
