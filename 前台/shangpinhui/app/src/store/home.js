import { reqCategoryList, reqGetBannerList, reqFloorList } from '@/api'

// state:仓库存储数据的地方
const state = {
    categoryList: [],
    bannerList: [],
    floorList: []
}
// mutations:修改state的唯一手段
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
    },
    GETBANNERLIST(state, bannerList) {
        state.bannerList = bannerList
    },
    GETFLOORLIST(state, floorList) {
        state.floorList = floorList
    }
}
// actions:处理astions,可以书写自己的业务逻辑，也可以处理异步
const actions = {
    // 获取三级联动的数据
    async categoryList({ commit }) {
        let result = await reqCategoryList()
        if (result.code == 200)
            commit('CATEGORYLIST', result.data)
    },
    // 获取banner的数据
    async getBannerList({ commit }) {
        let result = await reqGetBannerList()
        if (result.code == 200)
            commit('GETBANNERLIST', result.data)
    },
    // 获取floor的数据
    async getFloorList({ commit }) {
        let result = await reqFloorList()
        if (result.code == 200)
            commit('GETFLOORLIST', result.data)
    }
}
// getters:理解为计算属性，简化仓库数据
const getters = {}

// 对外暴露Store类的一个实例
export default {
    state,
    mutations,
    actions,
    getters
}