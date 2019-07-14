import * as React from "react";
import * as ReactDOM from "react-dom";
import GraphiQLContext from "./GraphiQLContext";
// import GraphiQLPlugin from './GraphiQLPlugin';

import GraphiQL from "./GraphiQL";

export {
  GraphiQLContext,
  // GraphiQLPlugin
}

ReactDOM.render(
  React.createElement(GraphiQL), 
  document.getElementById("root")
);
