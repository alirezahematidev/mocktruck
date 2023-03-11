const path = require("path");
const pkg = require("./package.json");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  name: pkg.name,
  entry: {
    main: path.resolve(__dirname, "./src/index"),
  },

  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js",
    library: pkg.name,
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/i,
        loader: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.(js|mjs)$/,
        exclude: ["/node_modules/"],
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".mts", ".mjs"],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
