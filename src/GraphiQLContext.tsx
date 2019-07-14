import * as React from "react";
import * as monaco from "monaco-editor";
import { getIntrospectionQuery, buildClientSchema, GraphQLSchema } from "graphql";
// @ts-ignore
import { getHoverInformation } from "graphql-language-service-interface";

export interface IGraphQLQuery {
  url: string;
  variables: string;
  query: string;
}
export type TEditors = "query" | "variables" | "results";

export interface IGraphiQLBaseContext {
  updateQuery: (value: string) => React.SetStateAction<any>;
  updateVariables: (value: string) => React.SetStateAction<any>;
  submitQuery: () => Promise<string>;
  reloadSchema: () => Promise<GraphQLSchema | null>;
  updateResult: (result: string) => React.SetStateAction<any>;
  provideHoverInfo: (position: monaco.Position, token?: monaco.CancellationToken) => Promise<any>;
  editorLoaded: (editorKey: TEditors, editor: monaco.editor.IStandaloneCodeEditor) => Promise<void>;
}

export interface IEditorInstance {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  model?: monaco.editor.IEditorModel | null;
  titleKey?: string | null;
}

export interface IGraphiQLState {
  editors: { [E in TEditors]: IEditorInstance };
  error: string;
  results: string;
  hasError: boolean;
  schema: GraphQLSchema | null;
  introspectionJSON: any;
}

export interface IGraphiQLContext extends IGraphQLQuery, IGraphiQLBaseContext, IGraphiQLState {}

const editorDefaults = {
  editor: null,
  model: null
};

export const defaults = {
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
  variables: '{ "skip": 3, "something": "else", "whoever": "bobobbbbobb2" }',
  query: "query { allFilms { id title }}",
  introspectionJSON: null,
  url: "https://swapi.graph.cool"
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
  editorLoaded: noOp(),
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
    })
  });
};

interface GraphiQLProviderState extends IGraphiQLState, IGraphQLQuery {}

export class GraphiQLProvider extends React.Component<{}, GraphiQLProviderState> {
  constructor(props: any) {
    super(props);
    this.state = defaults;
  }
  async componentDidMount() {
    console.log("hello. loading schema now");
    return this.reloadSchema();
  }
  public updateQuery = (query: string) => this.setState({ query });
  public updateVariables = (variables: string) => this.setState({ variables });
  public updateResult = (results: string) => this.setState({ results });
  public editorLoaded = async (editorKey: TEditors, editor: monaco.editor.IStandaloneCodeEditor) => {
    const currentEditor: IEditorInstance = this.state.editors && this.state.editors[editorKey];
    const editors = {
      ...this.state.editors,
      [editorKey]: {
        ...currentEditor,
        editor
      }
    };

    this.setState({ editors: editors });
  };
  public reloadSchema = async (): Promise<GraphQLSchema | null> => {
    try {
      // const { data: introspection } = require("./schema.json");
      const introspectionResult = await fetcher({
        ...this.state,
        query: getIntrospectionQuery(),
        variables: `{}`
      });

      const { data: introspection } = await introspectionResult.json();
      const schema = buildClientSchema(introspection);
      this.setState({
        hasError: false,
        introspectionJSON: introspection,
        schema
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
  public provideHoverInfo = async (position: monaco.Position, token?: monaco.CancellationToken) => {
    return getHoverInformation(this.state.schema, this.state.query, position);
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
          editorLoaded: this.editorLoaded
        }}
      >
        {this.props.children}
      </GraphiQLContext.Provider>
    );
  }
}
