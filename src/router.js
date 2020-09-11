import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/home", component: Home, redirect: '/welcome', children: [
        //component使用函数,路由按需加载.但import时,需写路径
        { path: '/welcome', component: () => import('./components/Welcome.vue') },
        {path:'/users',component:()=>import('./components/user/Users.vue')}
      ]
    }
  ]
})
//配置全局路由,参数是一个回调函数
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem("token")
  if (!tokenStr) return next('/login')
  next()
})
export default router
