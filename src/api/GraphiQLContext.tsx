import * as React from "react";
import * as monaco from "monaco-editor";
import { getIntrospectionQuery, buildClientSchema, GraphQLSchema, printSchema } from "graphql";
// @ts-ignore,
import { getHoverInformation, getDiagnostics, getAutocompleteSuggestions } from "graphql-language-service-interface";
// @ts-ignore
// import { onlineParser } from "graphql-language-service-parser";
// @ts-ignore
import { Position } from "graphql-language-service-utils";

export interface IGraphQLQuery {
  url: string;
  variables: string;
  query: string;
}
export type TEditors = "query" | "variables" | "results";

export interface IGraphiQLBaseContext {
  setValue: (key: string, value: any) => React.SetStateAction<any>;
  updateQuery: (value: string) => React.SetStateAction<any>;
  updateVariables: (value: string) => React.SetStateAction<any>;
  submitQuery: () => Promise<string>;
  reloadSchema: () => Promise<GraphQLSchema | null>;
  updateResult: (result: string) => React.SetStateAction<any>;
  provideHoverInfo: (position: monaco.Position, token?: monaco.CancellationToken) => Promise<any>;
  provideCompletionItems: (
    position: monaco.Position,
    token?: monaco.CancellationToken
  ) => monaco.languages.ProviderResult<monaco.languages.CompletionList>;
  editorLoaded: (editorKey: TEditors, editor: monaco.editor.IStandaloneCodeEditor) => any;
}

export interface IEditorInstance {
  editor?: monaco.editor.IStandaloneCodeEditor;
  model?: monaco.editor.IEditorModel | null;
  titleKey?: string | null;
  theme?: string;
}

export interface IGraphiQLState {
  editors: { [E in TEditors]: IEditorInstance };
  error: string;
  results: string;
  hasError: boolean;
  schema: GraphQLSchema | null;
  introspectionJSON: any;
  schemaSDL: string | null;
  activeTab: string;
  queryValid: boolean;
}

export interface IGraphiQLContext extends IGraphQLQuery, IGraphiQLBaseContext, IGraphiQLState {}

const defaultQuery = `
query MyQuery {
  films: allFilms {
    id
    title
    planets {
      name
    }
    openingCrawl
  }
}
`;
const editorDefaults = {
  model: null
};

import { availablePlugins, pluginManagerState } from "../data/plugins";

export const defaults = {
  activeTab: "docs",
  error: "",
  editors: {
    query: {
      ...editorDefaults,
      titleKey: "editors.query.title"
    },
    variables: {
      ...editorDefaults,
      titleKey: "editors.variables.title"
    },
    results: {
      ...editorDefaults,
      titleKey: "editors.results.title"
    }
  },
  hasError: false,
  results: "",
  schema: null,
  schemaSDL: null,
  variables: '{ "skip": 3, "something": "else", "whoever": "bobobbbbobb2" }',
  query: defaultQuery,
  queryValid: true,
  introspectionJSON: null,
  url: "https://swapi.graph.cool",
  availablePlugins,
  pluginManagerState
};

const noOp = (returnVal: any = null) => async () => returnVal;

const GraphiQLContext = React.createContext<IGraphiQLContext>({
  ...defaults,
  updateQuery: noOp(),
  updateVariables: noOp(),
  submitQuery: noOp(""),
  updateResult: noOp(),
  reloadSchema: noOp(),
  provideHoverInfo: noOp(),
  provideCompletionItems: () => ({ suggestions: [] }),
  editorLoaded: noOp(),
  setValue: noOp()
});

export default GraphiQLContext;

const fetcher = (state: IGraphQLQuery): Promise<Response> => {
  return fetch(state.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      variables: state.variables,
      query: state.query
    }),
  });
};

interface GraphiQLProviderState extends IGraphiQLState, IGraphQLQuery {}

interface IGLSDiagnostic {
  severity: number;
  message: string;
  source: string;
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
}
export class GraphiQLProvider extends React.Component<{}, GraphiQLProviderState> {
  constructor(props: any) {
    super(props);
    this.state = defaults;
  }
  async componentDidMount() {
    console.log("hello. loading schema now");
    return this.reloadSchema();
  }
  // @ts-ignore
  public setValue = (key: string, value: any) => this.setState({ [key]: value });
  public updateQuery = (query: string) => {
    this.setState({ query });
    const diagnostics = getDiagnostics(query, this.state.schema);
    const formattedDiagnostics = diagnostics.map((d: IGLSDiagnostic) => ({
      startLineNumber: d.range.start.line + 1,
      endLineNumber: d.range.end.line + 1,
      startColumn: d.range.start.character + 1,
      endColumn: d.range.end.character + 1,
      message: d.message,
      severity: monaco.MarkerSeverity.Error
    }));
    if (diagnostics.length > 0) {
      this.setState({ queryValid: false });
    }
    this.setState({ queryValid: true });
    const editor = this.state.editors.query.editor as monaco.editor.IStandaloneCodeEditor;
    monaco.editor.setModelMarkers(editor.getModel() as monaco.editor.ITextModel, "linter", formattedDiagnostics);
  };
  public updateVariables = (variables: string) => this.setState({ variables });
  public updateResult = (results: string) => this.setState({ results });
  public editorLoaded = (editorKey: TEditors, editor: monaco.editor.IStandaloneCodeEditor) => {
    const currentEditor: IEditorInstance = this.state.editors && this.state.editors[editorKey];
    const editors = this.state.editors;
    editors[editorKey].editor = editor;
    this.setState({ editors });
  };
  public reloadSchema = async (): Promise<GraphQLSchema | null> => {
    try {
      // const { data: introspection } = require("./schema.json");
      const introspectionResult = await fetcher({
        url: this.state.url,
        query: getIntrospectionQuery(),
        variables: `{}`,
      });

      const { data: introspection } = await introspectionResult.json();
      const schema = buildClientSchema(introspection);
      // parse the schema only one time per load
      // this might be intensive for large schemas
      this.setState({
        hasError: false,
        introspectionJSON: introspection,
        schema,
        schemaSDL: printSchema(schema)
      });
      return schema;
    } catch (err) {
      this.setState({
        hasError: true,
        error: err,
        schema: null
      });
      return null;
    }
  };
  public provideHoverInfo = async (
    position: monaco.Position,
    token?: monaco.CancellationToken,
    editorType: string = "schema"
  ) => {
    const graphQLPosition = new Position({
      line: position.lineNumber - 1,
      character: position.column
    });
    graphQLPosition.setCharacter(position.column);
    graphQLPosition.line = position.lineNumber - 1;
    const hoverInfo = getHoverInformation(
      this.state.schema,
      editorType === "query" ? this.state.query : this.state.schemaSDL,
      graphQLPosition
    );
    const diagnostics = getDiagnostics(this.state.query, this.state.schema);
    console.log("diagnostics", diagnostics);
    if (!hoverInfo) {
      return;
    }
    return {
      contents: [{ value: `${hoverInfo}` }]
    };
  };
  public provideCompletionItems = (
    position: monaco.Position,
    token?: monaco.CancellationToken
  ): monaco.languages.ProviderResult<monaco.languages.CompletionList> => {
    const graphQLPosition = new Position({
      line: position.lineNumber - 1,
      character: position.column - 1
    });
    graphQLPosition.setCharacter(position.column - 1);
    graphQLPosition.line = position.lineNumber - 1;
    const suggestions = getAutocompleteSuggestions(this.state.schema, this.state.query, graphQLPosition);
    console.log('suggestions', suggestions)
    return {
      suggestions: suggestions.map((s: monaco.languages.CompletionItem) => ({ ...s, insertText: s.label, kind: 3, isDeprecated: undefined })),
    };
  };
  public submitQuery = async (): Promise<any> => {
    try {
      const result = await fetcher(this.state);
      const parsedResult = JSON.stringify(await result.json(), null, 2);
      this.setState({
        hasError: false,
        results: parsedResult
      });
    } catch (err) {
      console.error(err);
      this.setState({
        hasError: true,
        error: "Query Error",
        results: err.toString()
      });
      return err.toString();
    }
  };
  render() {
    return (
      <GraphiQLContext.Provider
        value={{
          ...this.state,
          updateQuery: this.updateQuery,
          updateVariables: this.updateVariables,
          submitQuery: this.submitQuery,
          updateResult: this.updateResult,
          reloadSchema: this.reloadSchema,
          provideHoverInfo: this.provideHoverInfo,
          provideCompletionItems: this.provideCompletionItems,
          editorLoaded: this.editorLoaded,
          setValue: this.setValue
        }}
      >
        {this.props.children}
      </GraphiQLContext.Provider>
    );
  }
}
