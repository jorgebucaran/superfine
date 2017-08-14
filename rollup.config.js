import babel from 'rollup-plugin-babel';

export default {
  entry: "src/index.js",
  moduleName: "picodom",
  dest: "dist/picodom.js",
  format: "umd",
  plugins: [babel({
    exclude: 'node_modules/*'
  })],
  sourceMap: true
}