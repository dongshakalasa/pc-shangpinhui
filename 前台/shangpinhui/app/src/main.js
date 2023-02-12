import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from '@/router'
// 引入仓库
import store from '@/store'
// 全局组件 --三级联动
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import { MessageBox } from 'element-ui';
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
// 引入MockServer.js
import '@/mock/mockServe'
// 引入swiper样式
import "swiper/css/swiper.min.css";

Vue.config.productionTip = false

// 统一接口api文件夹里面全部请求函数
import * as API from '@/api'
import jz from '@/assets/images/1.gif'
// 引入插件 --懒加载图片
import VueLazyload from 'vue-lazyload'
// 注册插件
Vue.use(VueLazyload, {
    loading: jz,
})

/* // 引入自定义插件
import myPlugins from './plugins/myPlugins'
Vue.use(myPlugins) */
// 引入表单验证插件
import '@/plugins/validate'

new Vue({
    render: h => h(App),
    beforeCreate() {
        Vue.prototype.$bus = this
        Vue.prototype.$API = API
    },
    // 注册路由：KV一致，简写
    // 注册路由信息：当这里书写router的时候,组件身上都拥有$route,$router属性
    router,
    // 注册仓库
    store
}).$mount('#app')