var vtkRules = require("vtk.js/Utilities/config/dependency.js").webpack.core
  .rules;

module.exports = {
  configureWebpack: (config) => {
    config.module.rules.push(...vtkRules);
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        files: [
          "**/*"
        ],
        "extraFiles": [
          {
            "from": "server",
            "to": "server",
            "filter": ["**/*"]
          }
        ]
      }
    }
  }
};
