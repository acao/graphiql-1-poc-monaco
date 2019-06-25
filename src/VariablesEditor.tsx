import * as React from "react";
import * as monaco from "monaco-editor";

import { MonacoEditor } from './MonacoEditor'

export type VariablesEditorProps = {};
export type VariablesEditorState = {
  value: string;
};
// Using with require.config
export default class VariablesEditor extends React.Component<VariablesEditorProps, VariablesEditorState> {
  constructor(props: VariablesEditorProps) {
    super(props);
    const jsonCode = ["{", '    "$schema": "http://myserver/foo-schema.json"', "}"].join("\n");
    this.state = {
      value: jsonCode
    };
  }

  editorWillMount = (monaco: any) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      schemas: [
        {
          uri: "http://myserver/foo-schema.json",
          schema: {
            type: "object",
            properties: {
              p1: {
                enum: ["v1", "v2"]
              },
              p2: {
                $ref: "http://myserver/bar-schema.json"
              }
            }
          }
        },
        {
          uri: "http://myserver/bar-schema.json",
          schema: {
            type: "object",
            properties: {
              q1: {
                enum: ["x1", "x2"]
              }
            }
          }
        }
      ]
    });
  };
  render() {
    const { value } = this.state;

    return (
      <div>
        <MonacoEditor
          width="800px"
          height="600px"
          language="json"
          defaultValue={value}
          editorWillMount={this.editorWillMount}
        />
      </div>
    );
  }
}
