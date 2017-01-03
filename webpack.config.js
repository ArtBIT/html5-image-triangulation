var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');
var path = require('path');
var should_minify = process.argv.indexOf('--minify') !== -1;
var plugins = [
    new webpack.optimize.LimitChunkCountPlugin({maxChunks:1}),
    new ExtractTextPlugin('[name].bundle.css')
];

if (should_minify) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        })
    );
}

module.exports = {
    entry: {
        triangulate: './src/js/main.js'
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
        }]
    },
    plugins: plugins,
    resolve: {
        root: [
            path.resolve( __dirname, 'src', 'js', 'modules')
        ],
        alias: {
            '~': path.resolve( __dirname, 'src')
        },
        extensions: ['', '.js']
    }
};
