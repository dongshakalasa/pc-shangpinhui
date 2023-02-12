<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <!-- SPU名称 -->
      <el-form-item label="SPU名称" >
        <el-input placeholder="SPU的名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <!-- 品牌 -->
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <!-- <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option> -->
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 品牌描述 -->
      <el-form-item label="品牌描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>
      <!-- SPU图片 -->
      <el-form-item label="SPU图片">
        <!-- 
          file-list:照片墙需要展示的数据
          on-preview=：图片预览功能
          on-remove：照片墙删除某一个图片的时候会触发
         -->
        <el-upload
          action="http://gmall-h5-api.atguigu.cn/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="unselect in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px;margin-left:10px" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示当前spu属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName"  label="属性名" width="width">
          </el-table-column>
          <el-table-column label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)"> {{tag.saleAttrValueName}}</el-tag>
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)" >
              </el-input>
              <!--  @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column  label="操作" width="width">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 保存|取消 -->
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 上传图片
      dialogImageUrl: "",
      dialogVisible: false,
      // 存储spu信息属性
      spu:{
        // 三级分类的id
        category3Id:0,
        // 描述
        description:"",
        // spu名称
        spuName:'',
        // 平台的id
        tmId:'',
        // 收集SPU图片的信息
        spuImageList:[],
        // 平台属性与属性值收集
        spuSaleAttrList:[]
      },
      // 存储品牌信息
      tradeMarkList:[],
      // 存储spu图片的数据
      spuImageList:[],
      // 销售属性的数据
      saleAttrList:[],
      // 收集为选择的销售属性的id
      attrIdAndAttrName:''
    };
  },
  methods: {
    // 照片墙删除图片的回调函数
    handleRemove(file, fileList) {
      // file：删除的图片
      // fileList：照片墙删除某一张图片后，剩余的图片
      // 收集照片墙图片的数据
      // 对于已有的图片【照片墙中的现实的图片。有name、url字段的】
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      // 对话框显示与隐藏
      this.dialogVisible = true;
    },
    // 照片墙上传成功的回调
    handlerSuccess(response,file,fileList){
      this.spuImageList = fileList
    },
    // 点击修改按钮，初始化SpuForm数据
    async initSpuDate(spu){
      // 获取Spu信息数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if(spuResult.code == 200){
        this.spu = spuResult.data
      }
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if(tradeMarkResult.code == 200){
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if(spuImageResult.code == 200){
        let listAttr = spuImageResult.data
        listAttr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        });
        this.spuImageList = listAttr
      }
      // 获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if(saleResult.code == 200){
        this.saleAttrList = saleResult.data
      }
    },
    // 添加新的销售属性
    addSaleAttr(){
      // 将收集到的数据添加到销售属性里面
      // 处理数据
      const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向spu对象的spuSaleAttrList属性里面添加新的销售属性
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空数据
      this.attrIdAndAttrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row){
      // 给销售属性身上挂在响应式数据
      this.$set(row,'inputVisible',true)
      // 通过响应式数据inputValue字段收集新增的响应式属性值
      this.$set(row,'inputValue','')
    },
    // el-input失去焦点的事件
    handleInputConfirm(row){
      // 结构出销售属性中收集到的数据
      const {baseSaleAttrId,inputValue} = row
      // 新增的销售属性值的名称不能为空
      if(inputValue.trim()==''){
        this.$message('属性值不能为空')
        this.$refs.saveTagInput.focus()
        return;
      }
      // 属性值不能重复
      let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
      if(!result){
        this.$message('不能重复')
        return;
      }
      // 新增的销售属性值
      let newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName:inputValue
      }
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 修改inputVisible的状态
      row.inputVisible = false
    },
    // 保存按钮的回到
    async addOrUpdateSpu(){
      // 整理参数：照片墙的数据
      this.spu.spuImageList = this.spuImageList.map(item=>{
        return {
          imgName:item.name,
          imgUrl:(item.response&&item.response.data)||item.url
        }
      })
      // 发情请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code == 200){
        // 保存成功后，切换到0
        this.$message({type:'success',message:'保存成功'})
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
      }
      // 清除数据
      Object.assign(this._data,this.$options.data())
    },
    // 点击添加SPU按钮的时候，发送的请求
    async addSpuDate(category3Id){
      // 添加spu的时候收集三级分类的id
      this.category3Id = category3Id
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if(tradeMarkResult.code == 200){
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if(saleResult.code == 200){
        this.saleAttrList = saleResult.data
      }
    },
    // 取消按钮的回调函数
    cancel(){
      // 通知父组件切换
      this.$emit('changeScene',{scene:0,flag:''})
      // 清理数据
      // this.$$options可以获取配置对象
      Object.assign(this._data,this.$options.data())
    }
  },
  computed:{
    // 计算出还未选择的属性
    unSelectSaleAttr(){
      let result = this.saleAttrList.filter(item=>{
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name!=item1.saleAttrName
        })
      })
      return result
    }
  }
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>