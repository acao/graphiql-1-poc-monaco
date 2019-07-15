import * as React from "react";
import * as monaco from "monaco-editor";
import { getIntrospectionQuery, buildClientSchema, GraphQLSchema } from "graphql";
// @ts-ignore
import { getHoverInformation } from "graphql-language-service-interface";
// @ts-ignore
import { g } from "graphql-language-service-parser";
// @ts-ignore
import { Position } from "graphql-language-service-utils";

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
}

export interface IGraphiQLContext extends IGraphQLQuery, IGraphiQLBaseContext, IGraphiQLState {}

const editorDefaults = {
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
  editorLoaded: noOp()
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
  public editorLoaded = (editorKey: TEditors, editor: monaco.editor.IStandaloneCodeEditor) => {
    const currentEditor: IEditorInstance = this.state.editors && this.state.editors[editorKey];
    const editors = this.state.editors;
    editors[editorKey].editor = editor
    this.setState({ editors });
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
    const graphQLPosition = new Position({
      line: position.lineNumber,
      character: position.column
    });
    console.log("hoverInfo", getHoverInformation(this.state.schema, this.state.query, graphQLPosition));

    return getHoverInformation(this.state.schema, this.state.query, graphQLPosition);

    // export interface Position {
    //   line: number;
    //   character: number;
    //   lessThanOrEqualTo: (position: Position) => boolean;
    // }
    // export class Position {
    // /**
    //  * line number (starts at 1)
    //  */
    // readonly lineNumber: number;
    // /**
    //  * column (the first character in a line is between column 1 and column 2)
    //  */
    // readonly column: number;
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
