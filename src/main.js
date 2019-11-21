import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

//新引入
import Path from './apiPath/path'			//导入请求地址
import Axios from 'axios'		
import echarts from 'echarts'
import directive from 'element-ui/packages/popover/src/directive';

Vue.directive('popover', directive);
Vue.prototype.$axios = Axios
Vue.prototype.$path = Path
Vue.prototype.$echarts = echarts

Vue.use(ElementUI, { locale })
Vue.use(VCharts)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
