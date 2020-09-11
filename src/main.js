import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入全局样式
import "./assets/css/global.css"
//导入element
import "./plugin/element"
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入icon图标
import './assets/fonts/iconfont.css'
//导入axios并把其挂载到Vue原型上
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios拦截器,在每次请求之前都加上token
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
