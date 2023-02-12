<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"> </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" alt="" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{row}">
          <!-- 上架|下架 -->
          <el-button icon="el-icon-bottom" size="mini" v-if="row.isSale==0" @click="sale(row)"></el-button>
          <el-button type="success" icon="el-icon-top" size="mini" v-else @click="cancel(row)"></el-button>
          <!-- 修改sku -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="$message('正在开发中......')"></el-button>
          <!-- 查看sku -->
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <!-- 删除 -->
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 3, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total "
      :total="total"
      style="text-align:center"
      @current-change="getSkuList"
      @size-change="handleSizeChange">
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="40%">
      <el-row>
        <el-col :span="3">名称</el-col>
        <el-col :span="17">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">描述</el-col>
        <el-col :span="17">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">价格(￥)</el-col>
        <el-col :span="17">{{skuInfo.price}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">平台属性</el-col>
        <el-col :span="17">
            <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin-left:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">商品图片</el-col>
        <el-col :span="17">
          <el-carousel trigger="click" height="400px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="width:500px;height:400px">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data(){
    return {
      page:1,  // 代表当前第几页
      limit:3, // 代表当前页面有几条数据
      records:[], //存储SKU列表的数据
      total:0,   // 存储分页器一共展示的数据
      skuInfo:{},// 存储sku信息
      drawer:false,// 抽屉显示与隐藏
    }
  },
  mounted(){
    this.getSkuList()
  },
  methods:{
    // 获取sku列表数据
    async getSkuList(pager = 1){
      this.page = pager
      // 解构数据
      const {page,limit} = this
      let result = await this.$API.sku.reqSkuList(page,limit)
      if(result.code == 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // 分页器展示条数设置
    handleSizeChange(limit){
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async sale(row){
      let result = await this.$API.sku.reqSale(row.id)
      if(result.code == 200){
        row.isSale = 1
        this.$message({type:'success',message:'上架成功'})
      }
    },
    // 下架
    async cancel(row){
      let result = await this.$API.sku.reqCancel(row.id)
      if(result.code == 200){
        row.isSale = 0
        this.$message({type:'success',message:'下架成功'})
      }
    },
    // 查看SKU详情按钮
    async getSkuInfo(sku){
      // 展示抽屉
      this.drawer = true
      // 获取SKU的数据
      let result = await this.$API.sku.reqSkuById(sku.id)
      if(result.code == 200){
        this.skuInfo = result.data
      }
    }
  }
};
</script>

<style scoped>
  .el-row .el-col-3{
    font-size: 17px;
    text-align: right;
    font-weight: 700;
    text-align-last:justify
  }
  .el-col {
    margin:10px 10px;
    margin-left: 30px;
  }
</style>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  .el-carousel__button{
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: red;
  }
</style>