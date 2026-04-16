module.exports = {
    pluginOptions: {
        i18n: {
            enableInSFC: false,
        },
        gitDescribe: {
            variableName: 'GIT_DESCRIBE',
        },
    },
    css: {
        loaderOptions: {
            css: {
                url: false,
            },
        },
    },
    devServer: {
        historyApiFallback: true,
    },
};
