import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development", // Set to 'production' for production builds
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2", // Necessary for Node.js modules
  },
  target: "node", // For Node.js environment
  resolve: {
    alias: {
      '@_koii/namespace-wrapper': path.resolve(__dirname, 'node_modules/@_koii/namespace-wrapper'),
    },
    extensions: [".ts", ".js"], // Resolve .ts and .js files
    fallback: {
      fs: false, // Prevents Webpack from bundling `fs` for non-Node.js environments
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader", // Compile TypeScript files
        exclude: /node_modules/, // Ignore node_modules folder
      },
      {
        test: /express\/lib\/view\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"], // Transpile to ES5
            },
          },
        ],
      },
    ],
  },
  devtool: "source-map", // Generate source maps for easier debugging
};
