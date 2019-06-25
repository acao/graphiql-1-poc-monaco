import * as React from "react";
import { render } from "react-dom";

import QueryEditor from "./QueryEditor";
import VariablesEditor from "./VariablesEditor";

export default class GraphiQL extends React.Component {
  render() {
    return <div>
        <h2>Monaco Editor Sample (controlled mode)</h2>
        <QueryEditor />
        <hr />
        <VariablesEditor />
        <h2>Another editor (uncontrolled mode)</h2>
      </div>
  }
}
