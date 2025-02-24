const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088', // 后端地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // 去掉 /api 前缀
        },
      },
    },
    allowedHosts: ['.koyeb.app'],
  },
};