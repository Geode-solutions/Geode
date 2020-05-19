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
            from: "server",
            to: "server",
            filter: ["**/*.py"],
          },
          {
            from: "wslink",
            to: "server",
            filter: ["**/*.so*", "**/*.dylib", "**/*.py", "**/*.pyd"],
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
        linux: {
          target: "AppImage",
          category: "Science",
        },
        win: {
          target: "portable",
        },
        portable: {
          unpackDirName: "unpackGeodeDirectory",
        },
      },
    },
  },
};
