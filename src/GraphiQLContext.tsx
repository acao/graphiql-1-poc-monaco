import * as React from "react";
import * as monaco from "monaco-editor";
import { getIntrospectionQuery, buildClientSchema, GraphQLSchema } from "graphql";
// @ts-ignore
import { getHoverInformation } from "graphql-language-service-interface";

export interface GraphQLQuery {
  url: string;
  variables: string;
  query: string;
}

export interface GraphiQLBase {
  updateQuery: (value: string) => React.SetStateAction<any>;
  updateVariables: (value: string) => React.SetStateAction<any>;
  submitQuery: () => Promise<string>;
  reloadSchema: () => Promise<GraphQLSchema | null>;
  updateResult: (result: string) => React.SetStateAction<any>;
  provideHoverInfo: (position: monaco.Position, token: monaco.CancellationToken) => Promise<any>;
}

export interface GraphiQLBaseComponent extends GraphiQLBase, React.Component {}

export interface IGraphiQLState {
  error: string;
  results: string;
  hasError: boolean;
  schema: GraphQLSchema | null;
  introspectionJSON: any;
}

export interface IGraphiQLContext extends GraphQLQuery, GraphiQLBase, IGraphiQLState {}

export const defaults = {
  error: "",
  hasError: false,
  results: "",
  schema: null,
  variables: "{}",
  query: "query { allFilms { id title }}",
  introspectionJSON: null,
  url: "https://swapi.graph.cool"
};

const GraphiQLContext = React.createContext<IGraphiQLContext>({
  ...defaults,
  updateQuery: (value: string) => "",
  updateVariables: (value: string) => "",
  submitQuery: async () => "",
  updateResult: (result: string) => "",
  reloadSchema: async () => null,
  provideHoverInfo: async () => null
});

export default GraphiQLContext;

const fetcher = (state: GraphQLQuery): Promise<Response> => {
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

interface GraphiQLProviderState extends IGraphiQLState, GraphQLQuery {}

export class GraphiQLProvider extends React.Component<{}, GraphiQLProviderState> {
  constructor(props: any) {
    super(props);
    this.state = defaults;
  }
  async componentDidMount() {
    console.log("hello. loading schema now");
    return this.reloadSchema();
  }
  updateQuery = (query: string) => this.setState({ query });
  updateVariables = (variables: string) => this.setState({ variables });
  updateResult = (results: string) => this.setState({ results });
  reloadSchema = async (): Promise<GraphQLSchema | null> => {
    try {
      const introspection = require("./schema.json");
      // console.time("introspectionQuery");
      // const introspectionResult = await fetcher({
      //   ...this.state,
      //   query: getIntrospectionQuery(),
      //   variables: "{}"
      // });
      // console.log(introspectionResult);

      // const introspection = await introspectionResult.json();
      const schema = buildClientSchema(introspection.data);
      this.setState({
        hasError: false,
        introspectionJSON: introspection.data,
        schema
      });
      console.timeEnd("introspectionQuery");
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
  provideHoverInfo = async (position: monaco.Position, token?: monaco.CancellationToken) => {
    return getHoverInformation(this.state.schema, this.state.query, position);
  };
  submitQuery = async (): Promise<any> => {
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
          provideHoverInfo: this.provideHoverInfo
        }}
      >
        {this.props.children}
      </GraphiQLContext.Provider>
    );
  }
}
