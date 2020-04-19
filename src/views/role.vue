<template>
  <div class="role">
    <!-- 面包屑导航 -->
    <my-breadcrumb menu="权限" submenu="角色列表"></my-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>角色列表</span>
        <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
      </div>
      <my-role-table></my-role-table>
    </el-card>
  </div>
</template>

<script>
import myBreadcrumb from '../components/commons/breadcrumb.vue'
import myRoleTable from '../components/rights/roletable.vue'
export default {
  name: 'myRole',
  components: {
    'my-breadcrumb': myBreadcrumb,
    'my-role-table': myRoleTable
  }
}
</script>

<style scoped>

</style>
