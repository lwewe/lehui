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
            // '/movie': {
            //     target: 'https://test-open.xuankua.cn', // 目标服务器地址
            //     // target: 'https://open.xuankua.cn', // 目标服务器地址
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/movie': '', // 将请求路径中的 '/api' 替换为空
            //     },
            // },
            '/api': {
                // target: 'http://192.168.3.7', // 目标服务器地址
               // target: 'https://sc.bjyxfl.com', // 目标服务器地址
                target:'https://scapi.bjyxfl.com',
                changeOrigin: true,
                // pathRewrite: {
                //     '^/api': '', // 将请求路径中的 '/api' 替换为空
                // },
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
