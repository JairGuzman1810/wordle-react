// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "react-hooks", "react-native"], // Add "react-native" plugin
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        trailingComma: "es5", // Ensure this matches your intended style
      },
    ],
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    "react-native/no-unused-styles": "warn", // Warn for unused styles
  },
  globals: {
    __dirname: true,
  },
};
