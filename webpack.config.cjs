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
        test: /\.(ts|tsx|mts)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.wasm$/,
        loader: "wasm-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.js$/,
        exclude: ["/node_modules/"],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          {
            loader: "esbuild-loader",
            options: {
              target: "ESNext",
              format: "esm",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "./node_modules"),
      path.resolve(__dirname, "lib"),
    ],
    alias: {
      src: path.resolve(__dirname, "src"),
    },
    extensions: [".ts", ".js", ".cjs", ".mts", ".mjs", ".wasm"],
  },
  externals: {
    lodash: "_",
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
