import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css' // 全局样式表
import './assets/fonts/iconfont.css'// 导入字体图标
import axios from 'axios' // 发送ajax请求

Vue.config.productionTip = false
Vue.prototype.$http = axios
// 设置拦截器
axios.interceptors.request.use(config => {
  // 设置请求头
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须返回 config
  return config
})
// 配置请求的基地址
axios.defaults.baseURL = ''

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
