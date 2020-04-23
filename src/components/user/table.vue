<template>
  <div>
    <!-- 搜索框 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input placeholder="Please input" clearable v-model="params.username"
                  @clear="getUserList" @keyup.enter.native="searchUser">
          <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" @click="addDialogFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据显示 -->
    <el-table :data="userList" style="width: 100%" stripe border>
      <!-- 多选框 -->
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- 索引  -->
      <el-table-column type="index"></el-table-column>
      <!-- 数据行 -->
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="手机号" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role"></el-table-column>
      <el-table-column label="是否激活">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_active" @change="activeChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否删除">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_delete" @change="deleteChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <!--      <el-table-column :label="userMap[k].label" :width="userMap[k].width" v-for="k in Object.keys(userList[0])" :key="k">-->
      <!--        <template slot-scope="scope">-->
      <!--          <template v-if="k === 'is_active'">-->
      <!--            <el-switch v-model="scope.row[k]" @change="activeChange(scope.row)"></el-switch>-->
      <!--          </template>-->
      <!--          <template v-else-if="k === 'is_delete'">-->
      <!--            <el-switch v-model="scope.row[k]" @change="deleteChange(scope.row)"></el-switch>-->
      <!--          </template>-->
      <!--          <template v-else>{{ scope.row[k] }}</template>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!-- 操作按钮 区域 -->
      <el-table-column label="操作" fixed="right" width="126">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
                       @click="handleEdit(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" circle size="mini"
                       @click="deleteUserById(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" circle size="mini"
                       @click="handleRole(scope.$index, scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页显示 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[2, 4, 6, 8]"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible" width="40%" :lock-scroll="true"
               :close-on-click-modal="false" @close="resetForm('addUserForm', addDialogFormVisible)">
      <el-form :model="addUserForm" status-icon :rules="rules" ref="addUserForm" label-position="left" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
          <el-input type="password" v-model="addUserForm.confirm" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser('addUserForm')">添加</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogFormVisible" width="40%" :lock-scroll="true"
               :close-on-click-modal="false" @close="resetForm('editUserForm', editDialogFormVisible)">
      <el-form :model="editUserForm" status-icon :rules="rules" ref="editUserForm" label-position="left" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editUser('editUserForm')">修改</el-button>
      </span>
    </el-dialog>
    <!-- 设置角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="40%" :lock-scroll="true"
               :close-on-click-modal="false" @close="setRoleDialogVisibleClose">
      <div class="content">
        <p>当前用户: {{ currentUser.username }}</p>
        <p>所在角色: {{ currentUser.role || '无' }}</p>
        <!--  选择角色下拉框  -->
        <p>更改角色: </p>
        <el-select v-model="selectRoleId" placeholder="选择角色" clearable>
          <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left">{{ item.id }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              <el-tag type="success">{{ item.name }}</el-tag>
            </span>
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateRoleById()">分配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    const emailVerify = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!/^.+?@(\w+\.){1,2}(com|cn)$/.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    const mobileVerify = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!/^1[3578]\d{9}$/.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    const confirmVerify = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addUserForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // 查询字符串
      params: {
        username: '',
        page: 1,
        per_page: 2
      },
      // 用户列表
      userList: [],
      // 总的页数
      total: 0,
      // 配置 字典
      // userMap: {
      //   id: { label: 'id', width: '80' },
      //   username: { label: '用户名', width: '100' },
      //   mobile: { label: '手机号', width: '120' },
      //   email: { label: '邮箱', width: '120' },
      //   create_time: { label: '创建时间', width: '150' },
      //   modify_time: { label: '修改时间', width: '150' },
      //   is_active: { label: '是否激活', width: '100' },
      //   is_delete: { label: '是否删除', width: '100' }
      // }
      // 控制添加用户对话框显示
      addDialogFormVisible: false,
      // 控制修改用户对话框显示
      editDialogFormVisible: false,
      // 分配角色对话框显示
      setRoleDialogVisible: false,
      // 添加用户表单
      addUserForm: {
        username: '',
        email: '',
        mobile: '',
        password: '',
        confirm: ''
      },
      // 修改表单
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editUserId: null,
      currentUser: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 12, message: '长度需要在2-12之间', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: emailVerify, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: mobileVerify, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 12, message: '长度需要在2-12之间', trigger: 'blur' }
        ],
        confirm: [
          { required: true, validator: confirmVerify, trigger: 'blur' }
        ]
      },
      // 选择角色 数组
      roleOptions: [],
      // 选择的角色 id
      selectRoleId: null
    }
  },
  created: function () {
    // 保存到sessionStorage中
    // const data = JSON.stringify(
    //   [
    //     { id: 1, username: '张三', mobile: '13111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 2, username: '李四', mobile: '15111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 3, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 4, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 5, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 6, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 7, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 8, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 9, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 10, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 11, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 12, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 13, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false },
    //     { id: 14, username: '王五', mobile: '17111111111', email: '1@1.com', create_time: '2020-01-01 00:00:00', modify_time: '2020-01-01 00:00:00', is_active: true, is_delete: false }
    //   ]
    // )
    // window.sessionStorage.setItem('user_list', data)
    // 调用 API 获取 用户数据
    this.getUserList()
  },
  methods: {
    getUserList: async function () {
      // 这里采用查询本地的数据
      // const userList = JSON.parse(window.sessionStorage.getItem('user_list'))
      // this.total = userList.length
      // this.userList = userList.splice((this.params.page_num - 1) * this.params.page_size, this.params.page_size)
      // this.$message.error('获取用户列表信息失败，请求编写后端API接口')
      // 接口 参数 page_num , page_size query
      const { data: res } = await this.$http.get('/user', { params: this.params })
      // 验证失败
      if (res.meta.code) {
        this.$message.error(res.meta.msg)
        console.log(res.meta)
        await this.$router.push('/login')
      }
      // 验证成功
      this.userList = res.data.user_list
      this.total = res.data.total
    },
    handleSizeChange: function (val) {
      this.params.per_page = val
      this.getUserList()
    },
    handleCurrentChange: function (val) {
      this.params.page = val
      this.getUserList()
    },
    activeChange: async function (val) {
      // this._change(val, 'is_active')
      // 调用 API 修改状态
      const { data: res } = await this.$http.put('/user/' + val.id, { is_active: val.is_active })
      if (res.meta.code) {
        this.$message.error(res.meta.msg)
        await this.$router.push('/login')
      }
      return this.$message.success(res.meta.msg)
    },
    deleteChange: async function (val) {
      // this._change(val, 'is_delete')
      // 调用 API 修改状态
      const { data: res } = await this.$http.put('/user/' + val.id, { is_delete: val.is_delete })
      if (res.meta.code) {
        this.$message.error(res.meta.msg)
        await this.$router.push('/login')
      }
      return this.$message.success(res.meta.msg)
    },
    addUser (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false
        // 添加用户
        const { data: res } = await this.$http.post('/user/', this.addUserForm)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addDialogFormVisible = false
        // 重新获取用户列表
        await this.getUserList()
      })
    },
    resetForm (formName, dialogVisable) {
      dialogVisable = false
      this.$refs[formName].resetFields()
    },
    handleEdit (index, row) {
      // 显示 修改 对话框
      this.editDialogFormVisible = true
      // 显示 响应的数据
      this.editUserForm.username = row.username
      this.editUserForm.email = row.email
      this.editUserForm.mobile = row.mobile
      // 修改 用户的 id
      this.editUserId = row.id
    },
    editUser (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false
        // 添加用户
        const { data: res } = await this.$http.put('/user/' + this.editUserId, this.editUserForm)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogFormVisible = false
        // 重新获取用户列表
        await this.getUserList()
      })
    },
    deleteUserById (id) {
      this.$confirm('删除操作不可逆，是否继续?', '删除用户', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('/user/' + id)
        if (res.meta.code) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        await this.getUserList()
      }).catch(() => {
        this.$message.info('删除操作已取消')
      })
    },
    searchUser () {
      this.params.page = 1
      this.getUserList()
    },
    async handleRole (index, row) {
      this.setRoleDialogVisible = true
      this.currentUser = row
      // 获取角色列表
      const { data: res } = await this.$http.get('/role')
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.roleOptions = res.data.role_list
    },
    async updateRoleById () {
      if (!this.selectRoleId) return this.$message.info('请选择角色')
      const { data: res } = await this.$http.put('/user/' + this.currentUser.id, { role_id: this.selectRoleId })
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.$message.success('分配角色成功')
      // 关闭分配权限对话框
      this.setRoleDialogVisible = false
      // 刷新用户列表
      await this.getUserList()
    },
    setRoleDialogVisibleClose () {
      this.setRoleDialogVisible = false
      this.selectRoleId = null
      this.currentUser = {}
    }
  }
}
</script>

<style lang="less" scoped>
  .el-table {
    margin: 15px 0;
  }
</style>
