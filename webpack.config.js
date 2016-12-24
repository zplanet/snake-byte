
module.exports = {
  entry: {
    app: "./react"
  },
  output: {
    filename: "[name].js",
    path: "./js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx*$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["es2015", "react"]
        }
      }
    ]
  }
}
