import * as React from "react";
import * as monaco from "monaco-editor";
import { printSchema, GraphQLSchema } from "graphql";
import { useGraphiQLContext } from "api/hooks";
// import GraphiQLPlugin from "../GraphiQLPlugin";
// @ts-ignore

import { MonacoEditor } from "../../components/MonacoEditor";

export type SchemaViewerProps = {
  schema?: string;
};

const options = {
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: true,
  cursorStyle: "line",
  automaticLayout: false,
  wordWrap: "off",
  lineNumbers: false,
  minimap: false
};


export function SchemaViewer(props: SchemaViewerProps) {
  const ctx = useGraphiQLContext();
  const editorLoaded = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.updateOptions({
      minimap: {
        enabled: false
      }
    });
  };
  return (
    <MonacoEditor
      width="100%"
      height="80vh"
      language="graphql"
      value={ctx.schemaSDL as string}
      options={options}
      editorDidMount={editorLoaded}
    />
  );
}

// const RawSchemaViewerPlugin: React.SFC = props => {
//   return (
//     <GraphiQLPlugin
//       config={{
//         name: "schemaViewer",
//         defaultLabel: "Raw Schema Viewer",
//         description: `View Schema in GraphQL's Interface Definition Language, aka Schema Design Language (SDL)`,
        // panels: [
        //       {
        //         location: "side",
        //         PanelComponent: SchemaViewer,
        //         tab: {
        //           label: "Raw Schema Viewer",
        //           icon: IoMdCode
        //         }
        //       }
        //     ]
//       }}
//     />
//   );
// };

// export default RawSchemaViewerPlugin;
