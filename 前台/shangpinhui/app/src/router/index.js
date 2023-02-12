// 配置路由
import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

// 使用插件
Vue.use(VueRouter)
// 引入store
import store from '@/store'


// 获取VueRouter原型对象的push
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

// 重写push|replace
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}

// 对外暴露的VueRouter类的实例
let router = new VueRouter({
    // 配置对象
    routes,
    // 滚动行为
    scrollBehavior(to, from, savedPosition) {
        return { y: 0 }
    }
})

// 全局守卫：前置守卫（在路由跳转之前进行判断）
router.beforeEach(async (to, from, next) => {
    // to：可以获取到你要跳转到那个路由的信息
    // from：可以获取到你从那个路由而来的
    // next：放行函数 nex()放行 next(path)放行到指令路由
    // 获取token
    let token = store.state.user.token;
    // 用户信息
    let name = store.state.user.userInfo.name
    if (token) {
        // 用户已经登录,还想去login
        if (to.path == '/login') {
            next('/home')
        } else {
            // 登录了，去的不是login
            // 判断时候有用户名
            if (name) {
                next()
            } else {
                // 没有用户信息，派发action让仓库
                try {
                    await store.dispatch('getUserInfo')
                    next()
                } catch (error) {
                    // token失效了，获取不到用户信息，从新登录
                    await store.dispatch("userLogout")
                    next('/login')
                }
            }

        }
    } else {
        // 未登录:不能去交易相关、不能去支付相关【pay|paysuccess】、个人中心
        let toPath = to.path
        if (toPath.indexOf('/trade') !== -1 || toPath.indexOf('/pay') !== -1 || toPath.indexOf('/center') !== -1) {
            next('/login?redirect=' + toPath)
        }
        next()
    }
})




export default router;