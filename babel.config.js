// 项目发布阶段需要用到的插件
const proPlugin = []
if (process.env.NODE_ENV === 'production') {
  proPlugin.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...proPlugin,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
