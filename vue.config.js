var vtkRules = require("vtk.js/Utilities/config/dependency.js").webpack.core
  .rules;

module.exports = {
  configureWebpack: (config) => {
    config.module.rules.push(...vtkRules);
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        files: ["**/*"],
        extraFiles: [
          {
            from: "server/protocols",
            to: "server",
            filter: ["!**/__pycache__"],
          },
          {
            from: "server",
            to: "server",
            filter: ["!**/protocols", "!**/pip"],
          },
          {
            from: "node_modules/@geode/geode-tools/server",
            to: "server",
            filter: ["**/*.py"],
          },
          {
            from: "node_modules/@geode/geode-tools/build/vtk/install",
            to: "server/vtk",
            filter: [
              "**/*.so*",
              "**/*.dylib",
              "**/*.dll",
              "**/*.py",
              "**/*.pyd",
              "**/vtkpython*",
            ],
          },
        ],
        artifactName: "${productName}-${env.VERSION}-${env.PLATFORM}.${ext}",
        publish: null,
        linux: {
          target: "zip",
          category: "Science",
        },
        mac: {
          target: "zip",
        },
        win: {
          target: "zip",
        },
      },
    },
  },
};
