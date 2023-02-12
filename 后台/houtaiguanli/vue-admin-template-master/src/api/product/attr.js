// 平台属性管理模块请求文件
import request from '@/utils/request'

// 获取一级分类的接口
export const reqCategory1List = ()=>request({url:'/admin/product/getCategory1',method:'get'})

// 获取二级分类的接口
export const reqCategory2List = (getCategory1) => request({ url: `/admin/product/getCategory2/${getCategory1}`, method: 'get' })

// 获取三级分类的接口
export const reqCategory3List = (getCategory2) => request({ url: `/admin/product/getCategory3/${getCategory2}`, method: 'get' })

// 获取平台属性的接口
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加属性与属性值的接口
export const reqAddOrUpdateAttr =(data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data})