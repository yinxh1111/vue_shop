import Vue from "vue"
// import {Button, Form,FormItem,Input,Message} from "element-ui"
// Vue.use(Button)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)
//全局引入elementui
import ElementUi from 'element-ui'
//Message需挂载到Vue.prototype上
Vue.use(ElementUi)
Vue.prototype.$message = ElementUi.Message
// Vue.prototype.$confirm = ElementUi.MessageBox.confirm