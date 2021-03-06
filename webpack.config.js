const path = require("path")
// this is to load env vars for this config
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: "development", // By default mode is production, if we set mode to development it will stop minifying
    entry: "./src/app.js",
    output: {
        filename: "mainWebpack.js",
        path: path.resolve(__dirname, "webpackOutput") // resolves an absolute path to the code directory provided
        // It takes the current directory (__dirname) an places webpackOutput there
    },
    module: {
        rules: [
            {
                test: /\.css$/, // regular expression tests for the ending of the file
                use: [ "style-loader", "css-loader"],
                // css-loader takes your CSS file and turns it into JavaScript
                // style-loader then takes that translated code and inserts the css into the DOM
                // They have to be placed in the use array in reverse order because that's how they load!
            },
            {
                loader: 'shebang-loader'
            }
        ]
    },
    plugins: [
        new Dotenv({
            path: './dot.env'
        })
      ],
    target: 'web'
}