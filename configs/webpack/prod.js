// production config
const { merge } = require("webpack-merge");
const { resolve } = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const commonConfig = require("./common");

module.exports = merge(commonConfig, {
  mode: "production",
  entry: ["regenerator-runtime/runtime", "./index.tsx"],
  output: {
    filename: "js/bundle.[contenthash].min.js",
    path: resolve(__dirname, "../../dist"),
    publicPath: "/",
  },
  devtool: "source-map",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from:  resolve(__dirname, "../../static"), to:  resolve(__dirname, "../../dist") },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.API_ENDPOINT": '"https://api.payments.dev.paltabrain.com"',
      "process.env.API_KEY": '"public-key-13"',
    }),
  ],
});
