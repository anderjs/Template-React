const { merge } = require("webpack-merge");
const { ModuleFederationPlugin } = require("webpack").container;
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const DotenvWebpackPlugin = require("dotenv-webpack");
const loadEnv = require("./env");

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
      new DotenvWebpackPlugin({
        safe: true,
        path: loadEnv(process.env),
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
