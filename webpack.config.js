import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

module.exports = {
    mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
  },
  target: "node",
  resolve: {
    alias: {
      '@_koii/namespace-wrapper': path.resolve(__dirname, 'node_modules/@_koii/namespace-wrapper')
    },
    extensions: ['.ts', '.js'],
  },
  
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "source-map",
  
  resolve: {
    fallback: {
      fs: false, // If using Node modules that reference fs in the browser
    },
  },
  module: {
    rules: [
      // Ensure dependencies are resolved correctly
      {
        test: /express\/lib\/view\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
};
