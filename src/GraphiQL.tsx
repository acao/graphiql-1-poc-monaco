import * as React from "react";

import QueryEditor from "./QueryEditor";
import VariablesEditor from "./VariablesEditor";
import { GraphiQLProvider } from "./GraphiQLContext";
import ResultsViewer from "./ResultsViewer";

const GraphiQL = () => {
  return (
    <GraphiQLProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "row"
        }}
      >
        <div style={{ display: "flex", width: "50%", flexDirection: "column" }}>
          <QueryEditor />
          <VariablesEditor  />
        </div>
        <div style={{ display: "flex", width: "50%" }}>
          <ResultsViewer />
        </div>
      </div>
    </GraphiQLProvider>
  );
};

export default GraphiQL;
