const prod = process.env.NODE_ENV === "production";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  mode: prod ? "production" : "development",
  entry: {
    // pop-up ui
    'index': './src/index.tsx',
    // polyfill
    'browser-polyfill': '../../node_modules/webextension-polyfill/dist/browser-polyfill.js',
    // background script
    'background-scripts/index': './src/background-scripts/index.ts',
    // content-script - statutes 
    'content-scripts/statutes/index': './src/content-scripts/statutes/index.ts',
  },
  output: {
    path: __dirname + "/build/",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: [".ts", ".tsx", ".js", ".json"],
        },
        use: "ts-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  devtool: prod ? undefined : "source-map",
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      template: "./src/public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/public",
          globOptions: {
            ignore: ["**/public/index.html"],
          },
        },
      ],
    }),
  ],
};
