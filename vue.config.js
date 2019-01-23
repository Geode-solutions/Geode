var vtkRules = require("vtk.js/Utilities/config/dependency.js").webpack.core
  .rules;

module.exports = {
  configureWebpack: config => {
    config.module.rules.push(...vtkRules);
  }
};
