import typescript from "rollup-plugin-typescript2"
import { terser } from "rollup-plugin-terser"
import filesize from "rollup-plugin-filesize"

export default [
  {
    input: "src/superfine.ts",
    output: {
      file: "dist/superfine.mjs",
      format: "es"
    },
    plugins: [
      typescript({ tsconfigOverride: { include: ["src"] } }),
      filesize()
    ]
  },
  {
    input: "src/superfine.ts",
    output: {
      file: "dist/superfine.js",
      format: "umd",
      name: "superfine"
    },
    plugins: [
      typescript({ tsconfigOverride: { include: ["src"] } }),
      terser(),
      filesize()
    ]
  }
]
