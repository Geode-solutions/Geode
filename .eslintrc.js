module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "prettier/vue",
    "plugin:prettier/recommended"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/return-in-computed-property": [
      "error",
      {
        treatUndefinedAsUnspecified: false
      }
    ]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
