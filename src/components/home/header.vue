<template >
  <div class="header">
    <div>
      <router-link to="/home">
        <img src="../../assets/images/logo.png" alt="">
      </router-link>
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data: function () {
    return {}
  },
  methods: {
    logout: function () {
      // 清空 token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lange="less" scoped>

  .header {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header div {
    height: 100%;
    display: flex;
    justify-content: center;
  }

  .header img{
    height: 60px;
  }

  .header span{
    font-size: 28px;
    line-height: 60px;
    color: #ffffff;
  }
</style>
