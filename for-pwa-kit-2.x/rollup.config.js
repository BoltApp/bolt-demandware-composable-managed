import glob from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

var MODE = [
  {
    fomart: "cjs",
  },
  {
    fomart: "es",
  },
];

var config = [];

MODE.map((m) => {
  var conf = {
    input: Object.fromEntries(
      glob
        .sync("src/**/*.{jsx,js,ts}", { ignore: ["src/index.test.js"] })
        .map((file) => [
          // This remove `src/` as well as the file extension from each
          // file, so e.g. src/nested/foo.js becomes nested/foo
          path.relative(
            "src",
            file.slice(0, file.length - path.extname(file).length)
          ),
          // This expands the relative paths to absolute paths, so e.g.
          // src/nested/foo becomes /project/src/nested/foo.js
          fileURLToPath(new URL(file, import.meta.url)),
        ])
    ),
    output: {
      // then name of your package
      name: "@npm-pwa-test/bolt2.x",
      dir: "dist",
      //file: `dist/index.${m.fomart}.js`,
      format: m.fomart,
      exports: "auto",
    },
    // this externelizes react to prevent rollup from compiling it
    external: ["react", /@babel\/runtime/],
    plugins: [
      // these are babel comfigurations
      babel({
        exclude: ["node_modules/**", "**/*.test.js"],
        plugins: ["@babel/transform-runtime"],
        extensions: [".js", ".jsx", ".ts"],
        babelHelpers: "runtime",
      }),
      resolve({
        extensions: [".js", ".jsx", ".ts"],
      }),
      commonjs({
        exclude: [
          // include using a glob pattern (either a string or an array of strings)
          "src/index.test.js",
        ],
      }),
      typescript(),
      json(),
    ],
  };
  config.push(conf);
});

export default [...config];
