// development config
const { merge } = require("webpack-merge");
const commonConfig = require("./common");
const webpack = require("webpack");
const path = require("path");

module.exports = merge(commonConfig, {
  mode: "development",
  entry: [
    "regenerator-runtime/runtime",
    "webpack-dev-server/client?http://localhost:8080", // bundle the client for webpack-dev-server and connect to the provided endpoint
    "./index.tsx", // the entry point of our app
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "../../static"),
    },
    historyApiFallback: true, // fixes error 404-ish errors when using react router :see this SO question: https://stackoverflow.com/questions/43209666/react-router-v4-cannot-get-url
  },
  devtool: "cheap-module-source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.API_ENDPOINT": '"http://localhost:8080"',
      "process.env.API_KEY": '"public-key-13"',
    }),
  ],
});
