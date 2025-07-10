import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				sourceType: "module"
			}
		}
	},
	{
		ignores: ["dist/**/*", "node_modules/**/*"],
		languageOptions: {
			globals: globals.node
		},
		rules: {
			"indent": ["error", "tab"],
			"semi": ["error", "always"],
			"no-trailing-spaces": "error",
			"eol-last": ["error", "always"],
			"quotes": ["error", "double"],
			"brace-style": ["error", "1tbs"],
			"comma-dangle": ["error", "never"],
			"object-curly-spacing": ["error", "always"],
			"comma-spacing": ["error", { before: false, after: true }],
			"key-spacing": ["error", { beforeColon: false, afterColon: true }]
		}
	}
]);
