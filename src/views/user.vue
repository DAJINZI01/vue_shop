<template>
  <div>
    <!-- 面包屑导航 -->
    <my-breadcrumb :menu="'用户管理'" :submenu="'用户列表'"></my-breadcrumb>
    <!-- 卡片视图 -->
    <my-card></my-card>

  </div>
</template>

<script>
import breadcrumb from '../components/commons/breadcrumb.vue'
import card from '../components/user/card.vue'
export default {
  data: function () {
    return {}
  },
  components: {
    'my-breadcrumb': breadcrumb,
    'my-card': card
  }
}
</script>
