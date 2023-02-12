import { reqGetSearchInfo } from "@/api"
// state:仓库存储数据的地方
const state = {
    searchList: {}
}
// mutations:修改state的唯一手段
const mutations = {
    GETSEARCHLIST(state, searchList) {
        state.searchList = searchList
    }
}
// action:处理astions,可以书写自己的业务逻辑，也可以处理异步
const actions = {
    async getSearchList({ commit }, params) {
        // reqGetSearchInfo这个函数在调用获取服务器数据的时候，至少传递一个参数（空对象）
        let result = await reqGetSearchInfo(params)
        if (result.code == 200) {
            commit('GETSEARCHLIST', result.data)
        }
    }
}
// getters:理解为计算属性，简化仓库数据
const getters = {
    goodsList(state) {
        return state.searchList.goodsList || []
    },
    trademarkList(state) {
        return state.searchList.trademarkList || []
    },
    attrsList(state) {
        return state.searchList.attrsList || []
    },

}

export default {
    state,
    mutations,
    actions,
    getters
}