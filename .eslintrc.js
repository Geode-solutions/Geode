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
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/return-in-computed-property": [
      "error",
      {
        treatUndefinedAsUnspecified: false,
      },
    ],
    "vuetify/grid-unknown-attributes": "error",
    "vuetify/no-deprecated-classes": "error",
    "no-undef": "warn",
    "no-console": "off",
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "lf",
      },
    ],
  },
  parserOptions: {
    parser: "babel-eslint",
  },
};
