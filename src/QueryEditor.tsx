import * as React from "react";
import * as monaco from "monaco-editor";
import { MonacoEditor } from "./MonacoEditor";
import GraphiQLContext, { IGraphiQLContext } from "./GraphiQLContext";

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

const SUBMIT_KEY = KM.CtrlCmd | KC.Enter;

const querySubmission = (ctx: IGraphiQLContext, editor: monaco.editor.IStandaloneCodeEditor): void => {
  editor.addAction({
    id: "editor.action.submitQuery",
    label: "Submit Query",
    keybindings: [SUBMIT_KEY],
    run: async (_ed: monaco.editor.IStandaloneCodeEditor) => {
      await ctx.submitQuery();
    }
  });
  editor.addAction({
    id: "editor.action.runQuery",
    label: "Run Query",
    keybindings: [SUBMIT_KEY],
    run: async (_ed: monaco.editor.IStandaloneCodeEditor) => {
      await ctx.submitQuery();
    }
  });
};

const queryHover = (ctx: IGraphiQLContext, editor: monaco.editor.IStandaloneCodeEditor): void => {
  // TODO: not yet working but close
  // monaco.languages.registerHoverProvider("graphql", {
  //   async provideHover(model, position, token) {
  //     return ctx.provideHoverInfo(position, token);
  //   }
  // });
};
// const queryEditor = useEditor("query", GraphiQLContext);
// useEditorCommand(queryEditor, KM.CtrlCmd | KC.Enter, async () => {
//   await ctx.submitQuery();
// });
let editor;
export default function(props: QueryEditorProps) {
  const ctx = React.useContext(GraphiQLContext);
  const didMount = async (editorInstance: monaco.editor.IStandaloneCodeEditor) => {
    editor = editorInstance;
    ctx.editorLoaded("query", editor);
    querySubmission(ctx, editor);
    queryHover(ctx, editor);
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
