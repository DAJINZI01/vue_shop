<template>
    <el-card>
      <div slot="header" class="clearfix">
        <span>商品分类</span>
        <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
      </div>
      <!-- 分类显示区域 -->
      <!--  添加分类按钮  -->
      <el-row>
        <el-col :span="8"><el-button type="primary" @click="openAddCategoryDialog">添加分类</el-button></el-col>
      </el-row>
      <!--  分类表格  -->
      <el-table :data="categoryList" stripe border row-key="id"
                lazy :load="loadChildCategory" :tree-props="{children: 'child_category', hasChildren: 'has_children'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.modify_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="name"></el-table-column>
        <el-table-column label="分类等级">
          <template slot-scope="scope">
            <el-tag :type="tagMap[scope.row.level_id].type">{{ tagMap[scope.row.level_id].levelName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否删除">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_delete" @change="deleteChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="128px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle size="mini"
                         @click="handleEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle size="mini"
                         @click="deleteCategoryById(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--  操作列   -->
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"></el-pagination>
      <!--  添加分类对话框  -->
      <el-dialog title="添加分类" :visible.sync="addCategoryDialogVisible" width="40%" :lock-scroll="true"
                 :close-on-click-modal="false" @close="restAddCategoryForm('addCategoryForm')">
        <!--  表单区域    -->
        <el-form :model="addCategoryForm" ref="addCategoryForm" :rules="rules" label-width="80px" status-icon>
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="addCategoryForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader v-model="selectKeys" :options="categoryOptions" popper-class="height200"
                         clearable :show-all-levels="true"
                         :props="{ expandTrigger: 'hover', value: 'id', label: 'name',
                         children: 'child_category', leaf: 'has_child', checkStrictly: true}"
                         @change="handleChange">
              <template slot-scope="{ node, data }">
                <span>{{ data.name }}</span>
                <span v-if="!node.isLeaf"> ({{ data.child_category.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCategory">添加</el-button>
      </span>
      </el-dialog>
      <!--  添加编辑分类对话框  -->
      <el-dialog title="添加分类" :visible.sync="updateCategoryDialogVisible" width="40%" :lock-scroll="true"
                 :close-on-click-modal="false" @close="restUpdateCategoryForm('updateCategoryForm')">
        <el-form :model="updateCategoryForm" ref="updateCategoryForm" :rules="rules" label-width="80px" status-icon>
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="updateCategoryForm.name"></el-input>
          </el-form-item>
          <el-form-item label="分类等级">
            <el-tag :type="tagMap[updateCategoryForm.level_id].type">{{ tagMap[updateCategoryForm.level_id].levelName }}</el-tag>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateCategoryDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateCategoryById">修改</el-button>
        </span>
      </el-dialog>
    </el-card>
</template>

<script>
export default {
  name: 'myCard',
  data () {
    return {
      params: {
        pid: null,
        page: 1,
        per_page: 10
      },
      categoryList: [],
      total: 0,
      // 等级字典
      tagMap: {
        1: { levelName: '一级', type: 'success' },
        2: { levelName: '二级', type: 'info' },
        3: { levelName: '三级', type: 'warning' },
        null: { levelName: '无', type: '' }
      },
      // 控制分类对话框的显示
      addCategoryDialogVisible: false,
      // 控制编辑分类对话框的显示
      updateCategoryDialogVisible: false,
      // 添加分类表单
      addCategoryForm: {
        name: '',
        parentCategoryId: null
      },
      // 编辑分类表单
      updateCategoryForm: {
        name: '',
        level_id: null,
        is_delete: null
      },
      updateCategoryId: null,
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度需要在3-12之间', trigger: 'blur' }
        ]
      },
      // 选择的父级分类
      categoryOptions: [],
      // 选择的父级id数组
      selectKeys: []
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    handleSizeChange (val) {
      this.params.per_page = val
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getCategoryList()
    },
    async getCategoryList () {
      const { data: res } = await this.$http.get('/goods/category/', { params: this.params })
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.categoryList = res.data.category_list
      this.total = res.data.total
    },
    // 子商品分类懒惰加载
    async loadChildCategory (tree, treeNode, resolve) {
      this.params.pid = tree.id
      const { data: res } = await this.$http.get('/goods/category/', { params: this.params })
      if (res.meta.code) return this.$message.error(res.meta.msg)
      resolve(res.data.child_category)
    },
    restAddCategoryForm (formName) {
      this.$refs[formName].resetFields()
      this.selectKeys = []
      this.addCategoryForm.parentCategoryId = null
    },
    restUpdateCategoryForm (formName) {
      this.$refs[formName].resetFields()
      this.updateCategoryId = null
    },
    handleEdit (index, row) {
      // 加载分类数据
      this.updateCategoryForm.name = row.name
      this.updateCategoryForm.level_id = row.level_id
      this.updateCategoryId = row.id
      // 显示编辑分类对话框
      this.updateCategoryDialogVisible = true
    },
    handleChange () {
      this.addCategoryForm.parentCategoryId = this.selectKeys.length ? this.selectKeys.pop() : null
    },
    // 打开添加分类对话框
    async openAddCategoryDialog () {
      this.addCategoryDialogVisible = true
      if (this.categoryOptions.length) return
      this.params.page = this.params.per_page = this.params.pid = null
      const { data: res } = await this.$http.get('/goods/category/', { params: this.params })
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
    addCategory () {
      this.$refs.addCategoryForm.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post('/goods/category/', this.addCategoryForm)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success('添加商品分类成功')
        this.addCategoryDialogVisible = false
        await this.getCategoryList()
      })
    },
    async updateCategoryById () {
      const { data: res } = await this.$http.put('/goods/category/' + this.updateCategoryId, this.updateCategoryForm)
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.$message.success('修改商品分类成功')
      this.updateCategoryDialogVisible = false
      await this.getCategoryList()
    },
    deleteChange (row) {
      this.updateCategoryId = row.id
      this.updateCategoryForm.is_delete = row.is_delete
      this.updateCategoryById()
    },
    deleteCategoryById (id) {
      this.$confirm('删除操作不可逆，是否继续?', '删除商品分类', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('/goods/category/' + id)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.params.pid = null
        await this.getCategoryList()
      }).catch(() => {
        this.$message.info('删除操作已取消')
      })
    }
  }
}
</script>

<style scoped>
  .el-table {
    margin: 10px 0;
  }
  .height200 {
    height: 200px;
  }
</style>
