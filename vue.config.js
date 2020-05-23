const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
    configureWebpack: {
        plugins: [
            new ImageminPlugin({
                disable: process.env.NODE_ENV !== 'production',
            }),
        ],
    },
    pluginOptions: {
        i18n: {
            enableInSFC: true,
        },
        gitDescribe: {
            variableName: 'GIT_DESCRIBE',
        },
    },
};
