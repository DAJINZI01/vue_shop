<template>
  <div  class="home-container">
    <el-container>
      <!-- 头部区域 -->
      <el-header><my-header></my-header></el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 左侧侧边栏 -->
        <el-aside :width="asideWidth"><my-aside @isCollapse="isCollapse"></my-aside></el-aside>
        <!-- 主体区域 -->
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import aside from '../components/home/aside.vue'
import header from '../components/home/header.vue'
export default {
  data: function () {
    return {
      // 默认的侧边栏 宽度 200px
      asideWidth: '200px'
    }
  },
  components: {
    'my-aside': aside,
    'my-header': header
  },
  methods: {
    isCollapse: function (flag) {
      this.asideWidth = flag ? '64px' : '200px'
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container, .el-container {
    height: 100%;
  }

  .el-header {
    width: 100%;
    background-color: #0077aa;
    padding-left: 10px;
  }

  .el-aside {
    background-color: #0077aa;
  }

  .el-main {
    background-color: #eaffea;
  }
</style>
