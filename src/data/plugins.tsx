import * as React from "react";
import { useGraphiQLContext } from "api/hooks";
import { IoMdBook, IoMdOptions, IoMdRewind } from "react-icons/io";

export const DocsPanel = () => {
  const ctx = useGraphiQLContext();
  return <div>{JSON.stringify(ctx.introspectionJSON, null, 2)}</div>;
};

export const PluginsPanel = () => {
  const ctx = useGraphiQLContext();
  // @ts-ignore
  return <div>{JSON.stringify(ctx.availablePlugins, null, 2)}</div>;
};

export const OperationHistoryPanel = () => {
  const ctx = useGraphiQLContext();
  // @ts-ignore
  return <div>{JSON.stringify(ctx.availablePlugins, null, 2)}</div>;
};

export const availablePlugins = [
  {
    id: "doc-explorer",
    title: "Doc Explorer",
    description: "A tool for looking up values by and searching through the GraphQL Document Explorer.",
    panels: [
      {
        location: "side",
        PanelComponent: DocsPanel,
        tab: {
          label: "Docs",
          icon: IoMdBook
        }
      }
    ],
    settings: [
      {
        id: "open-by-default",
        label: "Doc Explorer Open by Default",
        type: "boolean"
      }
    ]
  },
  {
    id: "raw-doc-explorer",
    title: "Raw Doc Explorer",
    description: "A tool for looking up values by and searching through the GraphQL Document Explorer.",
    panels: [
      {
        location: "side",
        PanelComponent: DocsPanel,
        tab: {
          label: "Docs",
          icon: IoMdBook
        }
      }
    ],
    settings: [
      {
        id: "open-by-default",
        label: "Doc Explorer Open by Default",
        type: "boolean"
      }
    ]
  },
  {
    id: "plugin-manager",
    title: "Plugin Manager",
    description: "A tool for managing GraphQL IDE plugins",
    panels: [
      {
        location: "side",
        PanelComponent: PluginsPanel,
        tab: {
          label: "Plugins",
          icon: IoMdOptions
        }
      }
    ]
  },
  {
    id: "operation-history",
    title: "Operation History",
    description: "A tool for viewing past GraphQL Operations",
    panels: [
      {
        location: "side",
        PanelComponent: OperationHistoryPanel,
        tab: {
          label: "Op History",
          icon: IoMdRewind
        }
      }
    ]
  }
];

export const pluginManagerState = [
  {
    "doc-explorer": {
      enabled: false,
      installed: true,
      state: {
        currentSearch: "last search",
        currentType: "SomeInput"
      }
    },
    "raw-doc-explorer": {
      enabled: true
    }
  }
];
