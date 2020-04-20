<template>
  <div class="table">
    <!-- 按钮   -->
    <el-row><el-col><el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button></el-col></el-row>
    <!-- 表格   -->
    <el-table :data="roleList" stripe border>
      <!--  展开详细信息  -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!--  0级权限  -->
          <el-row v-for="r0 in scope.row.rights" :key="r0.id" class="center">
            <el-col :span="6">
              <el-tag closable type="success" @close="deleteRightsById(scope.row, r0.id)">{{ r0.name }}</el-tag><i class="el-icon-caret-right"></i>
            </el-col>
            <!--  1级权限  -->
            <el-col :span="18">
              <el-row  v-for="r1 in r0.child_rights" :key="r1.id" class="center">
                <el-col :span="8">
                  <el-tag closable type="info" @close="deleteRightsById(scope.row, r1.id)">{{ r1.name }}</el-tag><i class="el-icon-caret-right"></i>
                </el-col>
                <!--  2级权限  -->
                <el-col :span="16">
                  <el-row>
                    <el-tag closable type="warning" @close="deleteRightsById(scope.row, r2.id)" v-for="r2 in r1.child_rights" :key="r2.id">{{ r2.name }}</el-tag>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
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
      <el-table-column label="角色名称" prop="name"></el-table-column>
      <el-table-column label="角色描述" prop="description"></el-table-column>
      <el-table-column label="操作" width="128px" fixed="right">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
                       @click="handleEdit(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" circle size="mini"
                       @click="deleteRoleById(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="权限" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" circle size="mini"
                       @click="handleRights(scope.$index, scope.row)"></el-button>
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
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="40%" :lock-scroll="true"
               :close-on-click-modal="false" @close="resetForm('addRoleForm', addRoleDialogVisible)">
      <el-form :model="addRoleForm" status-icon :rules="rules" ref="addRoleForm" label-position="left" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input autosize type="textarea" placeholder="Please input description" v-model="addRoleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRole('addRoleForm')">添加</el-button>
      </span>
    </el-dialog>
    <!-- 添加编辑对话框 -->
    <el-dialog title="编辑角色" :visible.sync="updateRoleDialogVisible" width="40%" :lock-scroll="true"
               :close-on-click-modal="false" @close="resetForm('updateRoleForm', updateRoleDialogVisible)">
      <el-form :model="updateRoleForm" status-icon :rules="rules" ref="updateRoleForm" label-position="left" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="updateRoleForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input autosize type="textarea" placeholder="Please input description" v-model="updateRoleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateRoleById('updateRoleForm')">添加</el-button>
      </span>
    </el-dialog>
    <!-- 添加权限对话框 -->
    <el-dialog title="修改权限" :visible.sync="updateRightsDialogVisible" width="40%" :lock-scroll="true"
               :close-on-click-modal="false" @close="updateRightsDialogClose">
      <!--  表单区域    -->
      <el-tree :data="rights_check_list" :props="defaultProps" ref="treeRef" node-key="id"
               :default-expanded-keys="[]" :default-checked-keys="defaultCheckedKeys" show-checkbox accordion></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateRightsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateRightsById()">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roleTable',
  data () {
    return {
      params: {
        page: 1,
        per_page: 10
      },
      roleList: [],
      total: 0,
      // 控制添加角色对话框的显示
      addRoleDialogVisible: false,
      // 控制修改角色对话框的显示
      updateRoleDialogVisible: false,
      // 控制修改权限的对话框的显示
      updateRightsDialogVisible: false,
      // 添加角色表单
      addRoleForm: {
        name: '',
        description: ''
      },
      // 修改角色表单
      updateRoleForm: {
        name: '',
        description: ''
      },
      // 修改权限表单
      updateRightsForm: {},
      //
      rights_check_list: [],
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度需要在2-12之间', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 当前的role id
      roleId: null,
      // 展开的行的key数组
      expandRowKeys: [],
      // 默认选中的key
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'child_rights',
        label: 'name'
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('/role/', { params: this.params })
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.roleList = res.data.role_list
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.params.per_page = val
      this.getRoleList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getRoleList()
    },
    addRole (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post('/role/', this.addRoleForm)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.addRoleDialogVisible = false
        this.$message.success('添加角色成功')
        // 刷新列表
        await this.getRoleList()
      })
    },
    resetForm (formName, visible) {
      visible = false
      this.$refs[formName].resetFields()
    },
    async handleEdit (index, row) {
      this.updateRoleDialogVisible = true
      const { data: res } = await this.$http.get('/role/' + row.id)
      if (res.meta.data) return this.$message.error(res.meta.msg)
      this.updateRoleForm.name = res.data.name
      this.updateRoleForm.description = res.data.description
      // 要修改的角色id
      this.roleId = row.id
    },
    updateRoleById (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.put('/role/' + this.roleId, this.updateRoleForm)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.updateRoleDialogVisible = false
        this.$message.success('修改角色成功')
        // 刷新列表
        await this.getRoleList()
      })
    },
    deleteRoleById (id) {
      this.$confirm('删除操作不可逆，是否继续?', '删除角色', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('/role/' + id)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        await this.getRoleList()
      }).catch(() => {
        this.$message.info('删除操作已取消')
      })
    },
    async handleRights (index, row) {
      this.defaultCheckedKeys = []
      this.updateRightsDialogVisible = true
      this.roleId = row.id
      const { data: res } = await this.$http.get('/rights/level')
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.rights_check_list = res.data
      row.rights.forEach(item => {
        this.getLeafKeys(item, this.defaultCheckedKeys)
      })
    },
    deleteRightsById (role, rightsId) {
      this.$confirm('删除操作不可逆，是否继续?', '删除权限', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('/role/' + role.id + '/rights/' + rightsId)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 跟新权限视图
        role.rights = res.data
      }).catch(() => {
        this.$message.info('删除操作已取消')
      })
    },
    async updateRightsById () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const { data: res } = await this.$http.put('/role/' + this.roleId, { keys: keys })
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.$message.success('更新权限成功')
      this.updateRightsDialogVisible = false
      // 刷新角色列表
      await this.getRoleList()
    },
    handleNodeClick () {
    },
    getCheckedKeys () {},
    // 获取三级结点 递归函数
    getLeafKeys (node, arr) {
      if (!node.child_rights.length) {
        return arr.push(node.id)
      }
      node.child_rights.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    updateRightsDialogClose () {
      this.updateRoleDialogVisible = false
      this.rights_check_list = []
    }
  }
}
</script>

<style scoped>
  .center {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
  }
</style>
