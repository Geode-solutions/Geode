module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "prettier/vue",
    "plugin:prettier/recommended",
  ],
  plugins: ["vuetify"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/return-in-computed-property": [
      "error",
      {
        treatUndefinedAsUnspecified: false,
      },
    ],
    "vuetify/grid-unknown-attributes": "error",
    "vuetify/no-deprecated-classes": "error",
  },
  parserOptions: {
    parser: "babel-eslint",
  },
};
