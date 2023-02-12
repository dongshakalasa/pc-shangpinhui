import { reqGoodsInfo, reqAddOrUpdateShopCart } from '@/api'
// 封装游客身份模块
import { getUUID } from '@/utils/uuid_token'

// state:仓库存储数据的地方
const state = {
    goodInfo: {},
    // 游客临时身份
    uuid_token: getUUID()
}
// mutations:修改state的唯一手段
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo
    }
}
// actions:处理astions,可以书写自己的业务逻辑，也可以处理异步
const actions = {
    // 获取产品信息
    async getGoodInfo({ commit }, skuId) {
        let result = await reqGoodsInfo(skuId)
        if (result.code == 200) {
            commit('GETGOODINFO', result.data)
        }
    },
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        // 服务器写入数据库成功，并没有返回其他的数据，只是返回code==200，代表此次操作成功
        let result = await reqAddOrUpdateShopCart(skuId, skuNum)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    }
}
// getters:理解为计算属性，简化仓库数据
const getters = {
    // 简化路径导航数据
    categoryView(state) {
        return state.goodInfo.categoryView || {}
    },
    // 简化产品信息数据
    skuInfo(state) {
        return state.goodInfo.skuInfo || {}
    },
    // 简化产品售卖属性
    spuSaleAttrList(state) {
        return state.goodInfo.spuSaleAttrList || []
    }
}

// 对外暴露Store类的一个实例
export default {
    state,
    mutations,
    actions,
    getters
}