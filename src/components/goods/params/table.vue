<template>
  <div class="table">
    <!--  表格  -->
    <el-table :data="tableData" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-tag :key="tag.id" v-for="tag in scope.row.values" closable :disable-transitions="false"
                  @close="deleteAttributeValueById(scope.row, tag.id)">
            {{ tag.name }}
          </el-tag>
          <el-input
            class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
            ref="saveTagInput" size="mini"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
        </template>
      </el-table-column>
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
      <el-table-column label="属性名称" prop="name"></el-table-column>
      <el-table-column label="sel" prop="sel"></el-table-column>
      <el-table-column label="录入方式" prop="write"></el-table-column>
      <el-table-column label="分类id" prop="category_id"></el-table-column>
      <!--  操作列    -->
      <el-table-column label="操作" width="128px" fixed="right">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
                       @click="handleUpdateAttribute(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" circle size="mini"
                       @click="deleteAttributeById(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"></el-pagination>
    <!-- 修改属性对话框 -->
    <el-dialog
      title="修改属性"
      :visible.sync="updateAttributeDialogVisible"
      width="30%"
      :lock-scroll="true"
      :close-on-click-modal="false"
      @close="handleDialogClose('updateAttributeForm')">
      <el-form :model="updateAttributeForm" ref="updateAttributeForm" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="updateAttributeForm.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateAttributeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateAttribute">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'myTable',
  props: {
    url: {
      type: String
    },
    sel: {
      type: String
    }
  },
  data () {
    return {
      params: {
        sel: this.sel || 'only',
        page: 1,
        per_page: 10
      },
      tableData: [],
      total: 0,
      updateAttributeDialogVisible: false,
      updateAttributeForm: {
        name: ''
      },
      updateAttributeId: null,
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度需要在3-12之间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getTableData()
  },
  watch: {
    url () {
      this.getTableData()
    }
  },
  methods: {
    handleSizeChange (val) {
      this.params.per_page = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getTableData()
    },
    async getTableData () {
      const { data: res } = await this.$http.get(this.url, { params: this.params })
      if (res.meta.code) return this.$message.error(res.meta.msg)
      // 更新数据
      res.data.attribute_list.forEach((item) => {
        item.inputVisible = false
        item.inputValue = ''
        return item
      })
      this.tableData = res.data.attribute_list
      this.total = res.data.total
    },
    handleDialogClose (formName) {
      this.$refs[formName].resetFields()
    },
    handleUpdateAttribute (index, row) {
      this.updateAttributeId = row.id
      this.updateAttributeForm.name = row.name
      this.updateAttributeDialogVisible = true
    },
    updateAttribute () {
      this.$refs.updateAttributeForm.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.put('/goods/attribute/' + this.updateAttributeId, this.updateAttributeForm)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        // 更新成功
        this.$message.success('更新数据成功')
        this.updateAttributeDialogVisible = false
        await this.getTableData()
      })
    },
    async deleteAttributeById (id) {
      this.$confirm('删除操作不可逆，是否继续?', '删除属性', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('/goods/attribute/' + id)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        await this.getTableData()
      }).catch(() => {
        this.$message.info('删除操作已取消')
      })
    },
    // 添加动态标签功能
    deleteAttributeValueById (row, attributeValueId) {
      this.$confirm('删除操作不可逆，是否继续?', '删除属性-值', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('/goods/attribute_value/' + attributeValueId)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        row.values = res.data.values
      }).catch(() => {
        this.$message.info('删除操作已取消')
      })
    },
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      // $nextTick 当页面上的元素被重新渲染之后，才会执行的回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length) {
        const { data: res } = await this.$http.post('/goods/attribute_value', {
          attribute_id: row.id,
          name: row.inputValue
        })
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        row.values = res.data.values
      }
      // 清空输入框
      row.inputValue = ''
      row.inputVisible = false
    }
  }
}
</script>

<style scoped>
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
