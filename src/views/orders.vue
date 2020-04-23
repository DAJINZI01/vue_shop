<template>
    <div class="orders">
      <!-- 面包屑导航     -->
      <my-breadcrumb menu="订单管理" submenu="订单列表"></my-breadcrumb>
      <!-- 卡片视图     -->
      <my-card></my-card>
    </div>
</template>

<script>
import breadcrumb from '../components/commons/breadcrumb'
import card from '../components/orders/card'
export default {
  name: 'orders',
  components: {
    'my-breadcrumb': breadcrumb,
    'my-card': card
  }
}
</script>

<style scoped>

</style>
