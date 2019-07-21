import * as React from "react";
import * as ReactDOM from "react-dom";
import GraphiQLContext from "./api/GraphiQLContext";

import GraphiQL from "./GraphiQL";

export {
  GraphiQLContext
}

ReactDOM.render(
  React.createElement(GraphiQL), 
  document.getElementById("root")
);
