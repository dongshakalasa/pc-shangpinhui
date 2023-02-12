<template>
  <div>
    <!-- 三级联动 -->
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0" />
    </el-card>
    <!-- 底部有三部分进行切换 -->
    <el-card>
      <!-- 展示SPU列表的结构 -->
      <div v-show="scene == 0">
        <!-- 按钮 -->
        <el-button type="primary" icon="el-icon-plus" @click="addSpu" :disabled="!category3Id">添加SPU</el-button>
        <!-- 表格展示SPU数据 -->
        <el-table  border style="width: 100%" :data="records">
          <el-table-column type="index" label="序号" width="180" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="180">
          </el-table-column>
          <el-table-column prop="description"  label="spu描述"> </el-table-column>
          <el-table-column prop="index" label="操作">
            <!-- 四个按钮 -->
            <template slot-scope="{row,$index}">
              <!-- 添加sku -->
                <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></HintButton>
              <!-- 修改spu -->
                <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></HintButton>
              <!-- 查看所有spu的sku -->
                <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu的所有sku" @click="handler(row)"></HintButton>
              <!-- 删除spu -->
                <el-popconfirm title="确定要删除吗？" :ref="$index" @onConfirm="deleteSpu(row)">
                  <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></HintButton>
                </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="margin-top: 20px; textAlign: center"
          :current-page="page"
          :total="total"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          layout=" prev, pager, next, jumper,->,sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- 添加SPU|修改SPU -->
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"/>
      <!-- 添加SKU -->
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"/> 
    </el-card>
    <!-- 展示所有sku对话框 -->
    <el-dialog :title="`${spu.spuName}的列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" border style="width:100%" v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="150"></el-table-column>
        <el-table-column prop="price" label="价格(￥)" width="200"></el-table-column>
        <el-table-column prop="weight" label="重量(kg)"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import SpuForm from '@/views/product/Spu/SpuForm'
import SkuForm from '@/views/product/Spu/SkuForm'

export default {
  name: "Spu",
  components:{
    SpuForm,
    SkuForm
  },
  data() {
    return {
      // 分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 分页器
      page:1,
      limit:3,
      total:0,
      // 列表数据
      records:[],
      // 底部三种状态的切换
      scene:0, //0 代表展示spu  1 代表添加spu|修改spu  2 代表添加sku
      // 控制对话框的现实与隐藏
      dialogTableVisible:false,
      spu:{},
      // sku列表的数据
      skuList:[],
      loading:true

    };
  },
  methods:{
    // 三级联动的自定义事件 
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 发请求获取平台属性
        this.category3Id = categoryId;
        // 获取SPU列表数据进行展示
        this.getSpuList();
      }
    },
    // 获取spu的列表数据
    async getSpuList(pager = 1){
      this.page = pager
      const {page,limit,category3Id} = this
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code == 200){
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 分页器更改数据条数回调函数
    handleSizeChange(limit){
      this.limit = limit
      this.getSpuList()
    },
    // 添加SPU按钮的回调
    addSpu(){
      this.scene = 1
      // 通知子组件SpuForm发请求
      this.$refs.spu.addSpuDate()
    },
    // 修改某一个spu
    updateSpu(row){
      this.scene = 1
      // 获取spu子组件
      this.$refs.spu.initSpuDate(row)
    },
    // 自定义事件（SpuForm）
    changeScene({scene,flag}){
      this.scene = scene
      // 重新获取数据,并停留在修改SPU页
      if(flag=='修改'){
        this.getSpuList(this.page)
      }else{
        this.getSpuList()
      }
    },
    // 自定义事件（SkuForm）
    changeScenes(scene){
      this.scene = scene
    },
    // 删除按钮的回调
    async deleteSpu(row){
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code == 200){
        this.$message({type:'success',message:'删除成功'})
        // 判断当前也是否还有spu
        this.getSpuList(this.records.length>1?this.page:this.page-1)
      }
    },
    // 添加sku的回调
    addSku(row){
      // 切换场景 2
      this.scene = 2 
      // 父组件调用子组件的方法
      this.$refs.sku.getDate(this.category1Id,this.category2Id,row)
    },
    // 查看sku的按钮回调
    async handler(spu){
      // 现实对话框
      this.dialogTableVisible = true
      // 保存spu的信息
      this.spu = spu
      // 获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id)
      if(result.code == 200){
        this.skuList = result.data
        // loading隐藏
        this.loading = false
      }
    },
    // 对话框关闭回调
    close(done){
      // loading属性再次变为真
      this.loading = true
      // 清除sku列表的数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  }
};
</script>

<style>
</style>