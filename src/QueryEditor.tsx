import * as React from "react";
import * as monaco from "monaco-editor";
import { MonacoEditor } from "./MonacoEditor";

type GraphiQLProps = {};

type GraphiQLState = {
  code: string;
};

// Using with webpack
export default class QueryEditor extends React.Component<GraphiQLProps, GraphiQLState> {
  editor!: monaco.editor.IStandaloneCodeEditor;
  constructor(props: GraphiQLProps) {
    super(props);
    this.state = {
      code: "// type your code... \n"
    };
  }

  onChange = (newValue: string, e: any) => {
    console.log("onChange", newValue, e); // eslint-disable-line no-console
  };

  editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    // eslint-disable-next-line no-console
    console.log("editorDidMount", editor, editor.getValue(), editor.getModel());
    this.editor = editor;
  };

  changeEditorValue = () => {
    if (this.editor) {
      this.editor.setValue("// code changed! \n");
    }
  };

  changeBySetState = () => {
    this.setState({ code: "// code changed by setState! \n" });
  };

  render() {
    const { code } = this.state;
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: "line",
      automaticLayout: false
    };
    return (
      <div>
        <div>
          <button onClick={this.changeEditorValue}>Change value</button>
          <button onClick={this.changeBySetState}>Change by setState</button>
        </div>
        <hr />
        <MonacoEditor
          height="500px"
          language="graphql"
          value={code}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
        />
      </div>
    );
  }
}
