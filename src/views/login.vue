<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头衔区域 -->
      <div class="avatar_box">
        <router-link to="/home">
          <img src="../assets/images/logo_login.png" alt="">
        </router-link>
      </div>
      <!-- 登录表单区域 -->
      <div class="form_box">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" status-icon>
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-lock" type="password"></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="submitForm('loginFormRef')">登录</el-button>
            <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '张三',
        password: '123456'
      },
      // 表单的验证规则对象
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 12, message: '长度需要在2-12之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度需要在6-15之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单提交函数
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        // 验证失败
        if (!valid) return false
        // 调用 API 接口
        const { data: res } = await this.$http.post('/user/login', this.loginForm)
        // 登录失败 显示提示框
        if (res.meta.code) return this.$message.error(res.meta.msg)
        // 登录成功 保存token 到 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转主页
        await this.$router.push('/home')
      })
    },
    // 表单重置函数
    resetForm (formName) {
      // 通过 $refs 取值，所以需要给form绑定一个 :ref 属性
      // 用于需要清空表单，所以这里还需要拿到表单的数据
      // 所以需要绑定 model 属性 data of form component
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>

  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ccc;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }
  .avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .form_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

</style>
