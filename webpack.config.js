const webpack = require('webpack')
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: [
    "react-hot-loader/patch", // activate HMR for React
    "webpack-dev-server/client?http://localhost:8080", // bundle the client for webpack-dev-server and connect to the provided endpoint
    "webpack/hot/only-dev-server", // bundle the client for hot reloading, only- means to only hot reload for successful updates
    "./index.tsx" // the entry point of our app
  ],
  context: path.resolve(__dirname, "./src"),
  mode: "development",
  devtool: "inline-source-map",
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["file?name=[name].[ext]"]
      },
      {
        type: "javascript/auto",
        test: /\.mjs$/,
        use: [],
        include: /node_modules/
      },
      {
        test: /\.(ts|tsx)$/,
        use: [{ loader: "ts-loader" }]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx", ".jsx", ".css", ".mjs"]
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ["json", "graphql"]
    }),
    new HtmlWebpackPlugin({ template: "index.html.ejs" }),
    new webpack.ContextReplacementPlugin(
				/graphql-language-service-interface[\\/]dist$/,
				new RegExp(`^\\./.*\\.js$`)
			)
  ],
  devServer: {
    hot: true,
    allowedHosts: ["www.bob.autoparts.com", "autoparts.com"]
  },
  node: {
    fs: "empty"
  }
};
