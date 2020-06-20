// const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');

module.exports = {
    // configureWebpack: {
    //     plugins: [new ImageminWebpWebpackPlugin()],
    // },
    runtimeCompiler: true,
    pluginOptions: {
        i18n: {
            enableInSFC: true,
        },
        gitDescribe: {
            variableName: 'GIT_DESCRIBE',
        },
    },
    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'service-worker.js',
        },
        iconPaths: {
            favicon32: null,
            favicon16: null,
            appleTouchIcon: null,
            maskIcon: null,
            msTileImage: null,
        },
    },
};
