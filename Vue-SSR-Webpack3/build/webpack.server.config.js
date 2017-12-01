const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
//const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

let app = 'page1';
let entry = {
    [app]: `./web/pages/page1/entry-client.js`
};

module.exports = merge(base, {
    target: 'node',
    devtool: '#source-map',
    entry: entry,
    output: {
        filename: `[name].[hash:8].js`,
        libraryTarget: 'commonjs2'
    },
    // entry: {
    //     app: `./web/pages/page1/entry-server.js`
    // },
    // output: {
    //     filename: '[name]-server-bundle.js',
    //     libraryTarget: 'commonjs2'
    // },
    //// https://webpack.js.org/configuration/externals/#externals
    //// https://github.com/liady/webpack-node-externals
    //externals: nodeExternals({
    //    // do not externalize CSS files in case we need to import it from a dep
    //    whitelist: /\.css$/
    //}),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        new VueSSRServerPlugin({
            filename: `${app}/vue-ssr-server-bundle.json`
        })
    ]
})
