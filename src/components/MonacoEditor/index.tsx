import * as monaco from "monaco-editor";
import * as React from "react";

import * as parserGraphql from "prettier/parser-graphql";
// import * as parserJSON from "prettier/parser-json";

const parsers = {
  // json: parserJSON,
  graphql: parserGraphql
};

// heavily adapted from
// https://github.com/nikeee/react-monaco-editor-ts

export interface EditorProps {
  defaultValue?: string;
  value: string;
  width: number | string;
  height: number | string;
  theme: string;
  options?: monaco.editor.IEditorOverrideServices;
  editorWillMount?(context: typeof monaco): void;
  original?: string;
  language?: string;
  model?: monaco.editor.IModel;

  editorDidMount?(editor: monaco.editor.IStandaloneCodeEditor, context: typeof monaco): void;
  onChange?(value: string, event: monaco.editor.IModelContentChangedEvent): void;
}
export class MonacoEditor extends React.Component<EditorProps> {
  static defaultProps = {
    width: "100%",
    height: "100%",
    value: undefined,
    defaultValue: "",
    theme: undefined,
    options: {},
    editorDidMount: undefined,
    editorWillMount: undefined,
    onChange: undefined
  };

  private _currentValue: string;
  private _preventTriggerChangeEvent: boolean = false;

  private containerElement: React.RefObject<HTMLDivElement>;
  private editor: monaco.editor.IStandaloneCodeEditor | undefined;

  constructor(props: Partial<EditorProps>) {
    super(props as EditorProps);
    this.containerElement = React.createRef<HTMLDivElement>();
    this._currentValue = props.value || "";
  }

  componentDidMount() {
    this.initMonaco();
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (this.props.value !== this._currentValue) {
      // Always refer to the latest value
      this._currentValue = this.props.value || "";
      // Consider the situation of rendering 1+ times before the editor mounted
      if (this.editor) {
        this._preventTriggerChangeEvent = true;
        this.editor.setValue(this._currentValue);
        this._preventTriggerChangeEvent = false;
      }
    }
    const e = this.editor;
    if (this.props.language && e && prevProps.language !== this.props.language) {
      monaco.editor.setModelLanguage(e.getModel() as monaco.editor.ITextModel, this.props.language);
    }
    if (prevProps.theme !== this.props.theme) {
      monaco.editor.setTheme(this.props.theme);
    }
    if (e && (this.props.width !== prevProps.width || this.props.height !== prevProps.height)) {
      e.layout();
    }
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  editorWillMount() {
    const { editorWillMount } = this.props;
    if (editorWillMount) {
      editorWillMount(monaco);
    }
  }

  async editorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    const { editorDidMount } = this.props;
    if (editorDidMount) {
      editorDidMount(editor, monaco);
    }

    editor.onDidChangeModelContent(event => {
      const value = editor.getValue();

      // Always refer to the latest value
      this._currentValue = value;

      const onChange = this.props.onChange;
      // Only invoking when user input changed
      if (onChange && !this._preventTriggerChangeEvent) {
        onChange(value, event);
      }
    });
  }

  initMonaco() {
    const value = this.props.value !== null ? this.props.value : this.props.defaultValue;
    const { language, model, theme, options } = this.props;
    const container = this.containerElement.current;

    const createOpts: monaco.editor.IEditorConstructionOptions = {
      value,
      ...options
    };
    if (language) {
      createOpts.language = language;
    }
    if (model) {
      createOpts.model = model;
    }
    if (container) {
      // Before initializing monaco editor
      this.editorWillMount();
      this.editor = monaco.editor.create(container, createOpts);
      if (theme) {
        monaco.editor.setTheme(theme);
      }
      window.addEventListener("resize", this.resize);
      // After initializing monaco editor
      this.editorDidMount(this.editor);
      setTimeout(() => {
        if (this.editor) {
          this.editor.trigger("anyString", "editor.action.formatDocument", {});
        }
      }, 300);
    }
  }
  public getEditor() {
    return this.editor;
  }
  public resize = (e: UIEvent) => {
    this.editor && this.editor.layout();
  };

  destroyMonaco() {
    window.removeEventListener("resize", this.resize);
    const e = this.editor;
    if (e !== undefined) {
      e.dispose();
    }
  }

  render() {
    const style = getSize(this.props);

    return <div ref={this.containerElement} style={style} className="react-monaco-editor-container" />;
  }
}

export const getSize = (props: EditorProps) => {
  const { width, height } = props;
  return {
    height: typeof height !== "number" && height.indexOf("%") ? height : `${height}px`,
    width: typeof width !== "number" && width.indexOf("%") ? width : `${width}px`
  };
};
