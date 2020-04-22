<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>分类参数</span>
      <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
    </div>
    <!-- 警告提示框   -->
    <el-alert title="注意只允许设置第三级的分类参数" type="warning" closable show-icon></el-alert>
    <!-- 选择商品分类   -->
    <el-row>
      <el-col :span="3">选择商品分类: </el-col>
      <el-col :span="8">
        <el-cascader v-model="selectKeys" :options="categoryOptions" popper-class="height200" clearable
                     :props="{ expandTrigger: 'hover', value: 'id', label: 'name',
                         children: 'child_category', leaf: 'has_child'}"
                     @change="handleChange">
          <template slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
            <span v-if="!node.isLeaf"> ({{ data.child_category.length }}) </span>
          </template>
        </el-cascader>
      </el-col>
    </el-row>
    <!-- 标签页 tab-bar   -->
    <el-tabs type="border-card" v-model="addAttributeForm.sel" @tab-click="handleTabClick">
      <!--  动态参数面板  -->
      <el-tab-pane name="only">
        <span slot="label"><i class="el-icon-coin"></i>动态参数</span>
        <el-button type="primary" :disabled="isBtnDisabled" @click="addAttributeDialogVisible = true">添加参数</el-button>
        <my-table :url="tableUrl" v-if="onlyTableShowAble"></my-table>
      </el-tab-pane>
      <!--  静态属性  -->
      <el-tab-pane name="many">
        <span slot="label"><i class="el-icon-coin"></i>静态属性</span>
        <el-button type="primary" :disabled="isBtnDisabled" @click="addAttributeDialogVisible = true">添加参数</el-button>
        <my-table :url="tableUrl" sel="many" v-if="manyTableShowAble"></my-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加属性对话框 -->
    <el-dialog
      :title="currentTitle"
      :visible.sync="addAttributeDialogVisible"
      width="30%"
      :lock-scroll="true"
      :close-on-click-modal="false"
      @close="handleDialogClose('addAttributeForm')">
      <el-form :model="addAttributeForm" ref="addAttributeForm" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="addAttributeForm.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttributeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addAttribute">添加</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
import table from './table.vue'
export default {
  name: 'card',
  data () {
    return {
      selectKeys: [],
      categoryOptions: [],
      onlyTableShowAble: false,
      manyTableShowAble: false,
      tableUrl: '',
      addAttributeDialogVisible: false,
      addAttributeForm: {
        name: '',
        sel: 'only',
        category_id: null
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度需要在3-12之间', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    'my-table': table
  },
  created () {
    this.getCategoryList()
  },
  computed: {
    isBtnDisabled () {
      return this.selectKeys.length !== 3
    },
    currentTitle () {
      return this.addAttributeForm.sel === 'only' ? '添加动态参数' : '添加静态属性'
    },
    categoryId () {
      return this.selectKeys.length === 3 ? this.selectKeys[2] : null
    }
  },
  methods: {
    async getCategoryList () {
      const { data: res } = await this.$http.get('/goods/category/')
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.formatData(res.data)
      this.categoryOptions = res.data
    },
    formatData (data) {
      data.forEach((item) => {
        if (!item.child_category.length) delete item.child_category
        else this.formatData(item.child_category)
      })
    },
    handleChange () {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.onlyTableShowAble = false
      } else {
        this.tableUrl = '/goods/category/' + this.categoryId + '/attribute'
        this.onlyTableShowAble = true
      }
    },
    handleTabClick (tab, event) {
      if (this.addAttributeForm.sel === 'many' && (this.categoryId !== null)) {
        this.tableUrl = '/goods/category/' + this.categoryId + '/attribute'
        this.manyTableShowAble = true
      } else {
        this.manyTableShowAble = false
      }
    },
    handleDialogClose (formName) {
      this.$refs[formName].resetFields()
    },
    // 添加属性
    addAttribute () {
      this.$refs.addAttributeForm.validate(async (valid) => {
        if (!valid) return false
        this.addAttributeForm.category_id = this.categoryId
        const { data: res } = await this.$http.post('/goods/attribute', this.addAttributeForm)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        // 添加属性成功
        this.$message.success('添加属性成功')
        this.addAttributeDialogVisible = false
        this.tableUrl = '/goods/category/' + this.categoryId + '/attribute?_=' + new Date().getTime()
      })
    }
  }
}
</script>

<style scoped>
  .height200 {
    height: 200px;
  }
  .el-row {
    margin: 20px 0;
  }
</style>
