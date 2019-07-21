import * as React from "react";
import * as monaco from "monaco-editor";

import GraphiQLContext, { TEditors, IGraphiQLContext } from "api/GraphiQLContext";

export function useGraphiQLContext(): IGraphiQLContext {
  return React.useContext(GraphiQLContext);
}

export function useEditor(editorKey: TEditors): monaco.editor.IStandaloneCodeEditor {
  const { editors } = useGraphiQLContext();
  const instance = editors[editorKey];
  if (instance && instance.editor) {
    return instance.editor;
  }
  throw Error(`Editor '${editorKey}' not found`);
}

interface EditorCommand {
  id: string;
  defaultLabel: string;
  run(editor: monaco.editor.ICodeEditor, ...args: any[]): void | Promise<void>;
  keybindings?: number[];
}

export function useEditorCommand(editorKey: TEditors, command: EditorCommand) {
  const editor = useEditor(editorKey);
  const action: monaco.editor.IActionDescriptor = {
    id: command.id,
    label: command.defaultLabel,
    run: editor => command.run(editor)
  };

  if (command.keybindings) {
    action["keybindings"] = command.keybindings;
    command.keybindings.map(key => editor.addCommand(key, command.run));
  }
  editor.addAction(action);
}

export function useQuery() {}
