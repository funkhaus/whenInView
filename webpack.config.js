var WriteFilePlugin = require( 'write-file-webpack-plugin' );

module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname + '/dist/',
        filename: "wheninview.min.js"
    },
    plugins: [
        new WriteFilePlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};
