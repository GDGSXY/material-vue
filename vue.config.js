module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: '/material-vue/',
  devServer: {
    port: 8080,
    host: '127.0.0.1',
    https: false,
    open: true,
    proxy: {
      '/api': {
        target: 'http://192.168.8.122:18080/v1',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
