module.exports = {
    pluginOptions: {
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
