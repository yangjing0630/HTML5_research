const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

let app = 'page1';
let entry = {
    [app]: `./web/pages/page1/entry-client.js`
};

const config = merge(base, {
    entry: entry,
    output: {
        filename: `${app}/[name].[hash:8].js`
    },
    plugins: [
        // strip dev-only code in Vue source
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        // extract vendor chunks for better caching
        new webpack.optimize.CommonsChunkPlugin({
            name: `vendor`,
            minChunks: function (module) {
                // a module is extracted into the vendor chunk if...
                return (
                    // it's inside node_modules
                    /node_modules/.test(module.context) &&
                        // and not a CSS file (due to extract-text-webpack-plugin limitation)
                    !/\.css$/.test(module.request)
                )
            }
        }),
        // extract webpack runtime & manifest to avoid vendor chunk hash changing
        // on every build.
        new webpack.optimize.CommonsChunkPlugin({
            name: `manifest`        //自动生成在跟output.filename 同一层目录
        }),
        // 用于控制文件名等等，代码不多
        new VueSSRClientPlugin({
            filename: `${app}/vue-ssr-client-manifest.json`
        })
    ]
})

module.exports = config
