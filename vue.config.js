const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');

module.exports = {
    configureWebpack: {
        plugins: [new ImageminWebpWebpackPlugin()],
    },
    pluginOptions: {
        i18n: {
            enableInSFC: true,
        },
        gitDescribe: {
            variableName: 'GIT_DESCRIBE',
        },
    },
    pwa: {
        iconPaths: {
            favicon32: null,
            favicon16: null,
            appleTouchIcon: null,
            maskIcon: null,
            msTileImage: null,
        },
    },
};
