<template>
    <div>
      <!--  面包屑导航    -->
      <my-breadcrumb menu="商品管理" submenu="分类参数"></my-breadcrumb>
      <!--  卡片视图    -->
      <my-card></my-card>
    </div>
</template>

<script>
import breadcrumb from '../components/commons/breadcrumb.vue'
import card from '../components/goods/params/card.vue'
export default {
  name: 'params',
  components: {
    'my-breadcrumb': breadcrumb,
    'my-card': card
  }
}
</script>

<style scoped>

</style>
