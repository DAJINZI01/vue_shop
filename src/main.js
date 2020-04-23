import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css' // 全局样式表
import './assets/fonts/iconfont.css'// 导入字体图标
import axios from 'axios' // 发送ajax请求
import VueQuillEditor from 'vue-quill-editor' // 导入富文本编辑器

// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor) /* { default global options } */

Vue.config.productionTip = false
Vue.prototype.$http = axios
// 设置拦截器
axios.interceptors.request.use(config => {
  // 设置请求头
  config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
  // 最后必须返回 config
  return config
})
// 配置请求的基地址
axios.defaults.baseURL = 'http://localhost:5000/api/v1.0'
// 配置过滤器
Vue.filter('dateFormat', function (oldValue) {
  const dt = new Date(oldValue)
  const y = dt.getFullYear()
  const m = dt.getMonth()
  const d = dt.getDate()
  const H = dt.getHours()
  const M = dt.getMinutes()
  const S = dt.getSeconds()
  return y + '-' + m + '-' + d + ' ' + H + ':' + M + ':' + S
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
