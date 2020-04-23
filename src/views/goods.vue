<template>
  <div class="goods">
    <!--  面包屑导航  -->
    <my-breadcrumb menu="商品管理" submenu="商品列表"></my-breadcrumb>
    <!--  卡片视图  -->
    <my-card></my-card>
  </div>
</template>

<script>
import breadcrumb from '../components/commons/breadcrumb.vue'
import card from '../components/goods/card.vue'
export default {
  name: 'goods',
  data () {
    return {}
  },
  components: {
    'my-breadcrumb': breadcrumb,
    'my-card': card
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
