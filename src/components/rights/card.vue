<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>权限列表</span>
      <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
    </div>
    <!-- 用户列表区域 -->
    <my-table class="table"></my-table>
  </el-card>
</template>

<script>
import myTable from './table.vue'
export default {
  name: 'card',
  components: {
    'my-table': myTable
  }
}
</script>

<style scoped>

</style>
