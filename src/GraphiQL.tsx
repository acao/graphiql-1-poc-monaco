import * as React from "react";
import styled, { ThemeProvider } from "styled-components";
import QueryEditor from "components/QueryEditor";
import VariablesEditor from "components/VariablesEditor";
import { GraphiQLProvider } from "api/GraphiQLContext";
import ResultsViewer from "components/ResultsViewer";
import SidePanel from "components/SidePanel";
import { tabs } from "data/tabs";

const LayoutRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const LayoutColumn = styled.div<{ width: string | number }>`
  display: flex;
  width: ${props => (props.width ? props.width : "auto")};
  flex-direction: column;
`;

const QueryTabs = styled.div`
  display: block;
  width: 100%;
  height: 2rem;
  text-align: left;
  font-size: ${props => props.theme.spacing * 2}px;
`;

const QueryTab = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing}px;
  height: ${props => props.theme.spacing * 1.5}px;
`;

const theme: any = {
  dark: false,
  primary: "paleturquoise",
  secondary: "palegreen",
  fontFamily: "Helvetica, Arial, sans",
  spacing: 6
};

theme.text = theme.dark ? "white" : "#444";

const AppTheme = styled.div`
  body {
    margin: 0;
  }
  color: ${props => props.theme.text};
  font-family: ${props => props.theme.fontFamily};
  h1,
  h2,
  h3,
  h4 {
    text-decoration: small-caps;
    font-family: ${props => props.theme.fontFamily};
  }
`;

const GraphiQL = () => {
  return (
    <GraphiQLProvider>
        <ThemeProvider theme={theme}>
          <AppTheme id="app">
            <LayoutRow>
              <LayoutColumn width="396px">
                <SidePanel tabs={tabs} open={true} activeTab={"docs"} />
              </LayoutColumn>
              <LayoutColumn width="100%">
                <LayoutRow>
                  <LayoutColumn width="50%">
                    <QueryEditor />
                    <VariablesEditor />
                  </LayoutColumn>
                  <LayoutColumn width="50%">
                    <ResultsViewer />
                  </LayoutColumn>
                </LayoutRow>
              </LayoutColumn>
            </LayoutRow>
          </AppTheme>
        </ThemeProvider>
    </GraphiQLProvider>
  );
};

export default GraphiQL;
