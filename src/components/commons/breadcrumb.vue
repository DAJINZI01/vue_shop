<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ menu }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ submenu }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'breadcrumb',
  props: {
    menu: {
      type: String
    },
    submenu: {
      type: String
    }
  }
}
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
  }
</style>
