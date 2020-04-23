<template>
    <div class="report">
      <!-- 面包屑导航   -->
      <my-breadcrumb menu="数据统计" submenu="数据报表"></my-breadcrumb>
      <!-- 卡片视图  -->
      <my-card></my-card>
    </div>
</template>

<script>
import breadcrumb from '../components/commons/breadcrumb'
import card from '../components/report/card'
export default {
  name: 'report',
  components: {
    'my-breadcrumb': breadcrumb,
    'my-card': card
  }
}
</script>

<style scoped>

</style>
