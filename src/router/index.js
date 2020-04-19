import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import aside from '../components/home/aside.vue'
import welcome from '../components/home/welcome.vue'
import user from '../views/user.vue'
import rights from '../views/rights.vue'
import role from '../views/role.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    // component: home,
    components: {
      default: home,
      aside: aside
    },
    // redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/user', component: user },
      { path: '/rights', component: rights },
      { path: '/role', component: role }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示将要访问的路径
  // from 表示重哪一个路径跳转而来
  // next 是一个函数，表示放行

  // 1. 访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 2. 获取token
  const token = window.sessionStorage.getItem('token')
  // 3. 验证token
  if (!token) return next('/login')
  // 4. 验证成功
  return next()
})

export default router
