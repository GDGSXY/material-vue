module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  assetsDir: 'static',
  publicPath: '/',
  devServer: {
    port: 8080,
    host: '127.0.0.1',
    https: false,
    open: true,
    proxy: {
      '/': {
        target: 'http://192.168.8.122:18080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
