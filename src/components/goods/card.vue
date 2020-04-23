<template>
  <el-card>
    <div slot="header">
      <span>商品列表</span>
      <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
    </div>
    <!-- 搜索商品输入框   -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input placeholder="请输入商品名称" clearable v-model="params.name"
                  @clear="getGoodsList" @keyup.enter.native="getGoodsList">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="12">
        <router-link to="/goods/add"><el-button type="primary">添加商品</el-button></router-link>
      </el-col>
    </el-row>
    <!-- 表格显示   -->
    <el-table :data="goodsList" border stripe>
      <!--  索引列    -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="id" prop="id" width="80px"></el-table-column>
      <el-table-column label="创建时间" width="190px">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="190px">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.modify_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="单价" prop="price" width="60px"></el-table-column>
      <el-table-column label="数量" prop="number" width="60px"></el-table-column>
      <el-table-column label="重量" prop="weight" width="60px"></el-table-column>
      <el-table-column label="分类" prop="category"></el-table-column>
      <el-table-column label="状态" prop="goods_state" width="80px"></el-table-column>
      <el-table-column label="是否删除" width="80px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_delete" active-color="#13ce66" inactive-color="#ff4949"
          @change="isDeleteChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <!--  操作列    -->
      <el-table-column label="操作" width="128px" fixed="right">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
                       @click="handleUpdateGoods(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" circle size="mini"
                       @click="deleteGoodsById(scope.row.id)"></el-button>
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
    <!--  编辑商品对话框  -->
    <el-dialog
      title="修改商品"
      :visible.sync="updateGoodsDialogVisible" :lock-scroll="true" :close-on-click-modal="false"
      width="80%" @close="resetForm('updateGoodsFormRef')">
      <el-form :model="updateGoodsForm" ref="updateGoodsFormRef" :rules="rules">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="updateGoodsForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="updateGoodsForm.price" :precision="2" :step="0.01" :min="0.00"></el-input-number>
        </el-form-item>
        <el-form-item label="商品数量" prop="number">
          <el-input-number v-model="updateGoodsForm.number" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="商品重量" prop="weight">
          <el-input-number v-model="updateGoodsForm.weight" :min="0"></el-input-number>
        </el-form-item>
        <!--      富文本编辑器        -->
        <quill-editor ref="myQuillEditor" v-model="updateGoodsForm.introduce"/>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateGoodsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateGoodsById">修改</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'card',
  data () {
    return {
      params: {
        name: '',
        page: 1,
        per_page: 10
      },
      // 表格组件用到的数据
      goodsList: [],
      total: 0,
      // 编辑商品对话框
      updateGoodsDialogVisible: false,
      updateGoodsForm: {
        name: '',
        price: 0.00,
        number: 0,
        weight: 0,
        introduce: '',
        is_delete: null
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
      currentGoodsId: null
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 处理分页相关的三个函数
    async   getGoodsList () {
      const { data: res } = await this.$http.get('/goods', { params: this.params })
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods_list
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.params.per_page = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getGoodsList()
    },
    // 打开更新商品对话框，同时出入该行的参数
    handleUpdateGoods (index, row) {
      this.currentGoodsId = row.id
      this.updateGoodsForm.name = row.name
      this.updateGoodsForm.price = row.price
      this.updateGoodsForm.number = row.number
      this.updateGoodsForm.weight = row.weight
      this.updateGoodsForm.introduce = row.introduce
      this.updateGoodsDialogVisible = true
    },
    deleteGoodsById (id) {
      this.$confirm('删除操作不可逆，是否继续?', '商品', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('/goods/' + id)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        await this.getGoodsList()
      }).catch(() => {
        this.$message.info('删除操作已取消')
      })
    },
    isDeleteChange (row) {
      this.updateGoodsForm.is_delete = row.is_delete
      this.currentGoodsId = row.id
      this.updateGoodsById()
    },
    async updateGoodsById () {
      const { data: res } = await this.$http.put('/goods/' + this.currentGoodsId, this.updateGoodsForm)
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.$message.success('修改成功')
      await this.getGoodsList()
    },
    // 表单重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .el-table {
    margin: 20px 0;
  }
</style>
