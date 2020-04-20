<template>
    <div>
      <!--  面包屑导航  -->
      <my-breadcrumb menu="商品管理" submenu="商品分类"></my-breadcrumb>
      <!--   卡片视图   -->
      <my-card></my-card>
    </div>
</template>

<script>
import breadcrumb from '../components/commons/breadcrumb.vue'
import myCard from '../components/goods/category/card.vue'
export default {
  name: 'category',
  components: {
    'my-breadcrumb': breadcrumb,
    'my-card': myCard
  }
}
</script>

<style scoped>

</style>
