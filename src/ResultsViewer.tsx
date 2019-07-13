import * as React from "react";
import * as monaco from "monaco-editor";

import GraphiQLContext from "./GraphiQLContext";

import { MonacoEditor } from "./MonacoEditor";

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

export default function ResultsViewer(props: ResultsViewerProps) {
  const context = React.useContext(GraphiQLContext);
  return <MonacoEditor width="100%" height="90vh" language="json" value={context.results} options={options} />;
}
