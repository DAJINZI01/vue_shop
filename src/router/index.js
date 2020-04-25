import Vue from 'vue'
import VueRouter from 'vue-router'

// import login from '../views/login.vue'
// import home from '../views/home.vue'
// import aside from '../components/home/aside.vue'
// import welcome from '../components/home/welcome.vue'
// import user from '../views/user.vue'
// import rights from '../views/rights.vue'
// import role from '../views/role.vue'
// import category from '../views/category.vue'
// import params from '../views/params.vue'
// import goods from '../views/goods.vue'
// import add from '../components/goods/add.vue'
// import orders from '../views/orders.vue'
// import report from '../views/report.vue'

const login = () => import(/* webpackChunkName: 'login-home-aside-welcome' */'../views/login.vue')
const home = () => import(/* webpackChunkName: 'login-home-aside-welcome' */'../views/home.vue')
const aside = () => import(/* webpackChunkName: 'login-home-aside-welcome' */'../components/home/aside.vue')
const welcome = () => import(/* webpackChunkName: 'login-home-aside-welcome' */'../components/home/welcome.vue')
const user = () => import(/* webpackChunkName: 'user-rights-role' */'../views/user.vue')
const rights = () => import(/* webpackChunkName: 'user-rights-role' */'../views/rights.vue')
const role = () => import(/* webpackChunkName: 'user-rights-role' */'../views/role.vue')
const category = () => import(/* webpackChunkName: 'category-params-goods-add' */'../views/category.vue')
const params = () => import(/* webpackChunkName: 'category-params-goods-add' */'../views/params.vue')
const goods = () => import(/* webpackChunkName: 'category-params-goods-add' */'../views/goods.vue')
const add = () => import(/* webpackChunkName: 'category-params-goods-add' */'../components/goods/add.vue')
const orders = () => import(/* webpackChunkName: 'orders-report' */'../views/orders.vue')
const report = () => import(/* webpackChunkName: 'orders-report' */'../views/report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    components: {
      default: home,
      aside: aside
    },
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/user', component: user },
      { path: '/rights', component: rights },
      { path: '/role', component: role },
      { path: '/goods/category', component: category },
      { path: '/goods/params', component: params },
      { path: '/goods', component: goods },
      { path: '/goods/add', component: add },
      { path: '/orders', component: orders },
      { path: '/report', component: report }
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
