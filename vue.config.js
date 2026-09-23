module.exports = {
    // 打包配置
    // defineConfig: {
    transpileDependencies: true,
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    // },
    // 其他配置项
    devServer: {
        proxy: {
             
            '/movie': {
                target: 'https://test-open.xuankua.cn',
                // target: 'https://open.xuankua.cn',   // 正式环境
                changeOrigin: true,
                pathRewrite: { '^/movie': '' },
            },
            '/api': {

                target: 'https://scapi.bjyxfl.com',
                changeOrigin: true,

            },
        },
        client: {
            overlay: false,
        },
    },
    configureWebpack: {
        externals: {
            "BMap": "BMap"
        }
    }
};
