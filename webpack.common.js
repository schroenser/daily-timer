const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

module.exports = {
    entry: path.join(SRC_DIR, 'main.js'),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }, {
                test: /\.vue$/,
                use: 'vue-loader',
            }
        ]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(DIST_DIR),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Daily Timer'
        }),
        new VueLoaderPlugin()
    ]
};
