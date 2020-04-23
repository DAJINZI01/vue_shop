<template>
    <div class="add">
      <!--  面包屑导航    -->
      <my-breadcrumb menu="商品管理" submenu="添加商品"></my-breadcrumb>
      <!--  卡片视图    -->
      <el-card>
        <div slot="header">
          <span>添加商品</span>
          <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
        </div>
        <!--  添加商品提示框      -->
        <el-alert title="添加商品" type="info" center show-icon :closable="false"></el-alert>
        <!--  步骤条    -->
        <el-steps :active="stepActiveIndex" finish-status="success" align-center>
          <el-step title="基本信息" icon="el-icon-edit"></el-step>
<!--          <el-step title="商品参数" icon="el-icon-setting"></el-step>-->
<!--          <el-step title="商品属性" icon="el-icon-edit"></el-step>-->
          <el-step title="商品图片" icon="el-icon-picture"></el-step>
          <el-step title="商品内容" icon="el-icon-edit"></el-step>
          <el-step title="完成添加" icon="el-icon-upload"></el-step>
        </el-steps>
        <!--  添加商品的表单  -->
        <el-form :model="addGoodsForm" ref="addGoodsFormRef" :rules="rules">
          <!--  tab栏    -->
          <el-tabs tab-position="left" @tab-click="handleTabsClick" :before-leave="tapsBeforeLeave">
            <el-tab-pane label="基本信息">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="addGoodsForm.name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="price">
                <el-input-number v-model="addGoodsForm.price" :precision="2" :step="0.01" :min="0.00"></el-input-number>
              </el-form-item>
              <el-form-item label="商品数量" prop="number">
                <el-input-number v-model="addGoodsForm.number" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="商品重量" prop="weight">
                <el-input-number v-model="addGoodsForm.weight" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="商品分类" prop="category_id">
                <el-cascader v-model="selectKeys" :options="categoryOptions" popper-class="height200" clearable
                             :props="{ expandTrigger: 'hover', value: 'id', label: 'name',
                             children: 'child_category', leaf: 'has_child'}" size="medium"
                             @change="cascaderChange">
                  <template slot-scope="{ node, data }">
                    <span>{{ data.name }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.child_category.length }}) </span>
                  </template>
                </el-cascader>
              </el-form-item>
            </el-tab-pane>
<!--            <el-tab-pane label="商品参数"></el-tab-pane>-->
<!--            <el-tab-pane label="商品属性">Role</el-tab-pane>-->
            <el-tab-pane label="商品图片">
              <el-upload
                drag
                :action="uploadUrl"
                :on-preview="handlePicturePreview"
                :on-remove="handlePictureRemove"
                list-type="picture"
                :headers="uploadHeaders"
                :on-success="handlePictureUpload"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容">
              <!--      富文本编辑器        -->
              <quill-editor ref="myQuillEditor" v-model="addGoodsForm.introduce"/>
            </el-tab-pane>
            <el-tab-pane label="完成添加">
              <el-button type="primary" @click="addGoods">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <!--  图片预览对话框  -->
        <el-dialog
          title="图片预览"
          :visible.sync="picturePreviewDialogVisible"
          width="40%">
          <img :src="picturePreviewPath" alt="">
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
import breadcrumb from '../commons/breadcrumb'
export default {
  name: 'add',
  components: {
    'my-breadcrumb': breadcrumb
  },
  data () {
    return {
      // 默认激活的 步骤索引
      stepActiveIndex: 0,
      // 添加商品的表单
      addGoodsForm: {
        name: '',
        price: 0.00,
        number: 0,
        weight: 0,
        introduce: '',
        category_id: null,
        pictures: []
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, message: '长度需大于2', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      selectKeys: [],
      categoryOptions: [],
      // 图片预览对话框显示
      picturePreviewDialogVisible: false,
      // 图片预览地址
      picturePreviewPath: '',
      // 图片上传地址
      uploadUrl: 'http://localhost:5000/api/v1.0/goods/picture/upload'
    }
  },
  computed: {
    uploadHeaders () {
      return {
        Authorization: 'Bearer ' + window.sessionStorage.getItem('token')
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    // 获取商品分类
    async getCategoryList () {
      const { data: res } = await this.$http.get('/goods/category')
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.formatData(res.data)
      this.categoryOptions = res.data
    },
    // 格式化数据
    formatData (data) {
      data.forEach((item) => {
        if (!item.child_category.length) delete item.child_category
        else this.formatData(item.child_category)
      })
    },
    // 级联选择框
    cascaderChange () {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
      } else {
        this.addGoodsForm.category_id = this.selectKeys[2]
      }
    },
    // 处理tabs栏的切换
    handleTabsClick (tab, event) {

    },
    // 处理tabs栏离开
    tapsBeforeLeave (activeName) {
      if (activeName === '0' || this.addGoodsForm.category_id !== null) {
        // 实现tab栏和步骤条的联动效果
        this.stepActiveIndex = parseInt(activeName)
        return true
      }
      this.$message.error('请选择商品分类')
      return false
    },
    // 表单重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 添加商品
    addGoods () {
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('信息不完整，请检查必填项。')
        const { data: res } = await this.$http.post('/goods', this.addGoodsForm)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success('添加商品成功')
        await this.$router.push('/goods')
      })
    },
    handlePicturePreview (file) {
      this.picturePreviewPath = 'http://localhost:5000/static/upload/goods_pic/' + file.response.data.filename
      // 打开图片预览对话框
      this.picturePreviewDialogVisible = true
    },
    // 处理移除图片
    async handlePictureRemove (file, fileList) {
      const { data: res } = await this.$http.delete('/goods/picture/delete/' + file.response.data.filename)
      if (res.meta.code) return this.$message.error(res.meta.msg)
    },
    // 处理图片上传
    handlePictureUpload (response, file, fileList) {
      this.addGoodsForm.pictures.push(response.data.filename)
    }
  }
}
</script>

<style scoped>
  .el-steps {
    margin: 20px 0;
  }
  .height200 {
    height: 200px !important;
  }
</style>
