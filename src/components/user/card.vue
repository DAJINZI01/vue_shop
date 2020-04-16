<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>用户列表</span>
      <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
    </div>
    <!-- 用户列表区域 -->
    <my-table class="table"></my-table>
  </el-card>
</template>

<script>
import table from './table.vue'

export default {
  components: {
    'my-table': table
  }
}
</script>

<style lang="less" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
