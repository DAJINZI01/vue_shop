<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <my-breadcrumb :menu="'权限管理'" :submenu="'权限列表'"></my-breadcrumb>
    <!-- 卡片视图 -->
    <my-card></my-card>
  </div>
</template>

<script>
import breadcrumb from '../components/commons/breadcrumb.vue'
import myCard from '../components/rights/card.vue'
export default {
  name: 'rights',
  components: {
    'my-breadcrumb': breadcrumb,
    'my-card': myCard
  }
}
</script>

<style scoped>

</style>
