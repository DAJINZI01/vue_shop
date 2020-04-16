<template>
  <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="600px">
    <el-form :model="addUserForm" :rules="rules" ref="addUserForm" label-position="left" label-width="100px">
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
        <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm">
        <el-input v-model="addUserForm.confirm" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'myDialog',
  data () {
    const emailVerify = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (/^.+?@(\w+\.){1,2}{com|cn}$/.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    const mobileVerify = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (/^1[3578]\d{9}$/.test(value)) {
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
      // 控制对话框显示
      dialogFormVisible: true,
      // 添加用户表单
      addUserForm: {
        username: '',
        email: '',
        mobile: '',
        password: '',
        confirm: ''
      },
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
      }
    }
  }
}
</script>

<style scoped>

</style>
