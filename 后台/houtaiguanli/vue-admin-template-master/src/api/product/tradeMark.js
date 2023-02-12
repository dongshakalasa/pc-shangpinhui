// 这个模块主要获取的是品牌管理的数据模块
import request from '@/utils/request'
// 获取品牌列表接口
// /admin/acl/user/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 处理添加和修改品牌的接口
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        // 修改产品
        return request({ url: `/admin/product/baseTrademark/update`, method: 'post', data: tradeMark })
    } else {
        // 新增品牌
        return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data: tradeMark })
    }
}

// 删除产品接口
export const reqDeleteTradeMarkList = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
