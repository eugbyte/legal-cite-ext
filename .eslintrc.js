module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest-dom", "prettier", "testing-library"],
  extends: [
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:testing-library/react",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
  ignorePatterns: [
    "webpack.config.js",
    "craco.config.js",
    "postcss.config.js",
    "tailwind.config.js",
    "jest.config.js",
    "build",
  ],
  env: {
    browser: true,
    amd: true,
    node: true,
  },
};
