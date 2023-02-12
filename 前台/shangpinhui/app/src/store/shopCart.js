import { reqCartList, reqDeleteCartById, reqUpdateCheckedById } from "@/api"
// state:仓库存储数据的地方
const state = {
    carList: []
}
// mutations:修改state的唯一手段
const mutations = {
    GETCARTLIST(state, carList) {
        state.carList = carList
    }
}
// action:处理astions,可以书写自己的业务逻辑，也可以处理异步
const actions = {
    // 获取购物车列表数据
    async getCartList({ commit }) {
        let result = await reqCartList()
        if (result.code == 200) {
            commit('GETCARTLIST', result.data)
        }
    },
    // 删除购物车某一个产品
    async deleteCartListBySkuId({ commit }, skuId) {
        let result = await reqDeleteCartById(skuId)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 修改产品选中状态
    async updateCheckedById({ commit }, { skuId, isChecked }) {
        let result = await reqUpdateCheckedById(skuId, isChecked)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 删除全部勾选的产品
    deleteAllCheckedCart({ dispatch, getters }) {
        let PromiseAll = []
        getters.cartList.cartInfoList.forEach(item => {
            let promise = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : ''
            PromiseAll.push(promise)
        });
        return Promise.all(PromiseAll)
    },
    // 修改全部产品的
    updateAllCartIsChecked({ dispatch, state }, isChecked) {
        let promiseAll = []
        state.carList[0].cartInfoList.forEach(item => {
            let promise = dispatch('updateCheckedById', { skuId: item.skuId, isChecked })
            promiseAll.push(promise)
        })
        return Promise.all(promiseAll)

    }
}
// getters:理解为计算属性，简化仓库数据
const getters = {
    cartList(state) {
        return state.carList[0] || {}
    },
}

export default {
    state,
    mutations,
    actions,
    getters
}