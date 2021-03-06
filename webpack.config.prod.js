const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const src = path.resolve(__dirname, "src")
const dist = path.resolve(__dirname)

module.exports = {
  mode: "production",

  context: src,

  entry: "./main.ts",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false },
          },
        ]
      }
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  externals: {
    'pixi.js': 'PIXI',
  },

  output: {
    filename: "bundle.js",
    path: dist,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html"
    })
  ],
}