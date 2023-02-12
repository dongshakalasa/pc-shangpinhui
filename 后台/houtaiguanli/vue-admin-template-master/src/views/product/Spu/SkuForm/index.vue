<template>
  <div>
    <el-form ref="form"  label-width="80px">
      <!-- SPU名称 -->
        <el-form-item label="SPU名称"> {{spu.spuName}} </el-form-item>
      <!-- SKU名称 -->
        <el-form-item label="SKU名称">
          <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
        </el-form-item>
      <!-- 价格 -->
        <el-form-item label="价格(元)">
          <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
        </el-form-item>
      <!-- 重量 -->
        <el-form-item label="重量(千克)">
          <el-input placeholder="重量(千克)" v-model="skuInfo.weigth"></el-input>
        </el-form-item>
      <!-- 规格描述 -->
        <el-form-item label="规格描述">
          <el-input placeholder="SKU名称" type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
        </el-form-item>
      <!-- 平台属性 -->
        <el-form-item label="平台属性">
          <el-form :inline="true" ref="form"  label-width="80px">
            <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
              <el-select  placeholder="请选择" v-model="attr.attrIdAndAttrValueId" style="margin-bottom:10px">
                <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
      <!-- 销售属性 -->
        <el-form-item label="销售属性">
          <el-form :inline="true" ref="form"  label-width="80px">
            <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
              <el-select  placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
                <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
      <!-- 图片列表 -->
        <el-form-item label="图片列表">
          <el-table tyle="width: 100%" border :data="spuImageList"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" prop="prop" label="label" width="80" align="center">
            </el-table-column>
            <el-table-column label="图片" width="width">
              <template slot-scope="{row}">
                <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
              </template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称" width="width">
            </el-table-column>
            <el-table-column prop="操作" label="操作" width="width">
              <template slot-scope="{row}">
                <el-button type="primary"  v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
                <el-button v-else>默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      <!-- 操作 -->
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Alert } from 'element-ui'
export default {
  name:'',
  data(){
    return{
      // 存储图片的信息
      spuImageList:[],
      // 存储销售属性的数据
      spuSaleAttrList:[],
      // 存储平台属性的数据
      attrInfoList:[],
      // 收集sku数据的字段
      skuInfo:{
        // 第一类：父组件给的数据
        category3Id:0,
        spuId:0,
        tmId:0,
        // 第二类：需要通过v-model数据双向绑定获取
        skuName:"",
        price:0,
        weigth:0,
        skuDesc:'',
        // 第三类：需要自己书写代码
          // 默认图片
        skuDefaultImg:'',
          // 收集图片数据
        skuImageList:[],
          // 收集平台属性
        skuAttrValueList:[],
          // 收集销售属性
        skuSaleAttrValueList:[]
      },
      spu:{},
      // 收集图片数据
      imgeList:[]
    }
  },
  methods:{
    // 获取SkuForm的数据
    async getDate(category1Id,category2Id,spu){
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片的数据
      let SpuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if(SpuImageResult.code == 200){
        let list = SpuImageResult.data
        list.forEach(item => {
          item.isDefault = 0
        });
        this.spuImageList = list
      }
      // 获取销售属性的数据
      let SpuSaleAttrResult = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if(SpuSaleAttrResult.code == 200){
        this.spuSaleAttrList = SpuSaleAttrResult.data
      }
      // 获取平台属性的数据
      let AttrInfoListResult = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id)
      if(AttrInfoListResult.code == 200){
        this.attrInfoList = AttrInfoListResult.data
      }
    },
    // table表格复选框
    handleSelectionChange(params){
      this.imgeList = params
    },
    // 排他操作
    changeDefault(row){
      // 让所有的isDefault = 0
      this.spuImageList.forEach(item=>{
        item.isDefault = 0
      })
      // 设置选中的
      row.isDefault = 1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮回调
    cancel(){
      // 自定义事件，让父组件切换场景0
      this.$emit('changeScenes',0)
      // 清除数据
      Object.assign(this._data,this.$options.data())
    },
    // 保存按钮的回调
    async save(){
      // 整理平台属性
      const {attrInfoList,skuInfo,spuSaleAttrList,imgeList} = this
      // 整理平台属性的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
        if(item.attrIdAndAttrValueId){
          const [attrId,valueId] = item.attrIdAndAttrValueId.split(':')
          prev.push({attrId,valueId})
        }
        return prev
      },[])
      // 整理销售属性的数据
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])
      // 整理图片的数据
      skuInfo.skuImageList = imgeList.map(item=>{
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if(result.code == 200){
        this.$message({type:'success',message:'保存成功'})
        this.$emit('changeScenes',0)
      }
    }
  }
}
</script>

<style>

</style>