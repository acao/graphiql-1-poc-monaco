import * as React from "react";
import * as monaco from "monaco-editor";
import styled from "styled-components";
import { MonacoEditor } from "./MonacoEditor";
import GraphiQLContext, { IGraphiQLContext } from "./GraphiQLContext";
import Icon from "./components/Icon";

import { IoIosPlay, IoIosCheckmark } from "react-icons/io";

const { KeyMod: KM, KeyCode: KC } = monaco;

type QueryEditorProps = {
  query?: string;
  updateQuery?(value: string, event: monaco.editor.IModelContentChangedEvent): void;
};

const SubmitButton = styled(Icon)`
  z-index: 200;
  position: relative;
  width: 32px;
  height: 32px;
  text-align: right;
  display: inline-block;
  border-radius: 50%;
  padding: 6px;
  margin: 6px;
`;

const SubmitIcon = styled(IoIosPlay)`
  width: 32px;
  height: 32px;
  color: darkturquoise;
`;

const CheckIcon = styled(IoIosCheckmark)`
  width: 32px;
  height: 32px;
  color: green;
  text-align: right;
  display: inline-block;
  border-radius: 50%;
`;

const Input = styled.input`
  border: 0 none;
  font-size: ${props => props.theme.spacing * 2.5}px;
  padding: ${props => props.theme.spacing * 3}px;
  width: auto;
  &:hover {
    background-color: ${props => props.theme.primary};
  }
`;

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
    <div>
      <Input type="text" name="url" value={ctx.url} onChange={e => ctx.setValue("url", e.target.value)} />
      <div style={{ float: "right" }}>
        {ctx.schema && <CheckIcon />}
        <SubmitButton id="submitQuery" onClick={ctx.submitQuery}>
          <SubmitIcon />
        </SubmitButton>
      </div>
      <MonacoEditor
        height="60vh"
        width="100%"
        language={"graphql"}
        value={ctx.query}
        options={options}
        onChange={props.updateQuery || ctx.updateQuery}
        editorDidMount={didMount}
      />
    </div>
  );
}
