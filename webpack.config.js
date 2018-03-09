/**
 * Adapted from angular2-webpack-starter
 */

const helpers = require('./config/helpers'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js', '.html']
    },

    entry: helpers.root('index.ts'),

    output: {
        path: helpers.root('bundles'),
        publicPath: '/',
        filename: 'bd-form-utilities.umd.js',
        library: 'bd-form-utilities',
        libraryTarget: 'umd'
    },

    // require those dependencies but don't bundle them
    externals: [/^\@angular\//, /^rxjs\//, /^moment\//],

    module: {
        rules: [{
            test: /\.ts$/,
            loaders: ['awesome-typescript-loader', 'angular2-template-loader?keepUrl=true'],
            exclude: [/\.spec\.ts$/]
        },
        {
            test: /\.js/,
            loaders: ['angular2-template-loader'],
            exclude: []
        },
        /* Embed files. */
        {
            test: /\.(html|css)$/,
            loader: 'raw-loader',
            exclude: /\.async\.(html|css)$/
        },
        /* Async loading. */
        {
            test: /\.async\.(html|css)$/,
            loaders: ['file?name=[name].[hash].[ext]', 'extract']
        }]
    },

    plugins: [
        // fix the warning in ./~/@angular/webpack.config.js/src/linker/system_js_ng_module_factory_loader.js
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./src')
        ),

        new webpack.LoaderOptionsPlugin({
            options: {
                tslintLoader: {
                    emitErrors: false,
                    failOnHint: false
                }
            }
        }),

        // Reference: https://github.com/johnagan/clean-webpack-plugin
        // Removes the bundle folder before the build
        new CleanWebpackPlugin(['bundles'], {
            root: helpers.root(),
            verbose: false,
            dry: false
        })
    ]
};
