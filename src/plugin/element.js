import Vue from "vue"
import {Button, Form,FormItem,Input,Message} from "element-ui"
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//Message需挂载到Vue.prototype上
Vue.prototype.$message = Message