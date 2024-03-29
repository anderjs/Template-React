const { merge } = require("webpack-merge");
const { DefinePlugin } = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

const path = require("path");

const dotenv = require("dotenv");

const getEnvPath = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return path.resolve(__dirname, ".env.production");

    case "staging":
      return path.resolve(__dirname, ".env.staging");

    case "development":
      return path.resolve(__dirname, ".env.development");

    default:
      return path.resolve(__dirname, ".env");
  }
};

dotenv.config({
  path: getEnvPath(),
});

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    argv,
    orgName: "learlify",
    projectName: "template",
    webpackConfigEnv,
  });

  return merge(defaultConfig, {
    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
    plugins: [
      new DefinePlugin({
        "process.env": JSON.stringify(process.env),
      }),
      new ModuleFederationPlugin({
        name: "template",
        filename: "remoteEntry.js",
        remotes: {
          components: "components@http://localhost:8080/remoteEntry.js",
        },
        shared: ["react", "react-dom"],
      }),
    ],
  });
};
