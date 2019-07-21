import * as React from "react";
import * as monaco from "monaco-editor";
import GraphiQLContext from "api/GraphiQLContext";

import { MonacoEditor } from "components/MonacoEditor";

export type ResultsViewerProps = {
  results?: string;
};

const options = {
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: true,
  cursorStyle: "line",
  automaticLayout: false,
  wordWrap: "on"
};

let editor;

export default function ResultsViewer(props: ResultsViewerProps) {
  const ctx = React.useContext(GraphiQLContext);
  const didMount = (editorInstance: monaco.editor.IStandaloneCodeEditor) => {
    editor = editorInstance;
    ctx.editorLoaded("results", editor);
  };
  return (
    <MonacoEditor
      width="100%"
      height="90vh"
      language="json"
      value={ctx.results}
      options={options}
      editorDidMount={didMount}
    />
  );
}
