// 对axios进行二次封装
import axios from 'axios'
// 引入进度条插件
import nProgress from 'nprogress';
// 引入store模块
import store from '@/store'
// 引入进度条的样式
import 'nprogress/nprogress.css'

// 利用axios对象的方法create，去创建一个axios实例
const requests = axios.create({
    baseURL: "/api/api",
    timeout: 5000,
})
// 请求拦截器
requests.interceptors.request.use((config) => {
    // config:配置对象，对象里面有一个属性很重要，headers请求头
    // 进度条开始
    if (store.state.detail.uuid_token) {
        config.headers.userTempId = store.state.detail.uuid_token
    }
    // 需要携带token给服务器
    if (store.state.user.token != '') {
        config.headers.token = store.state.user.token
    }
    nProgress.start()
    return config;
})
//响应拦截器
requests.interceptors.response.use((res) => {
    // 成功的回调函数
    // 进度条结束
    nProgress.done()
    return res.data;
}, (error) => {
    // 失败的回调函数
    return Promise.reject(new Error('faile'))
})

// 对外暴露
export default requests;