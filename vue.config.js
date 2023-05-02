const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // Allows debugging in browser dev tools
  configureWebpack: {
    devtool: 'source-map'
  },

  // Needed for github pages to work
  publicPath: process.env.NODE_ENV === 'production'
    ? '/batlleship/'
    : '/'

})
