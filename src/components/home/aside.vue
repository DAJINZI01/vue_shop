<template>
  <div class="asider">
    <!-- 侧边栏 折叠按钮 -->
    <el-button icon="el-icon-notebook-2" @click="toggle_collapse"></el-button>
    <!-- 侧边栏 菜单区域 -->
    <el-menu
      background-color="#0077aa"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :collapse="isCollapse"
      router
      :collapse-transition="false"
      :default-active="$route.path">
      <!-- 一级菜单 -->
      <el-submenu :index="menu.id.toString()" v-for="menu in menuList" :key="menu.id">
        <!-- 一级菜单 模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="menu.className"></i>
          <!-- 文本标题 -->
          <span>{{ menu.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="submenu.path" v-for="submenu in menu.children" :key="submenu.id" @click="handleActive">
          <!-- 图标 -->
          <i :class="submenu.className"></i>
          <!-- 文本标题 -->
          <span>{{ submenu.authName }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 菜单列表 包含子菜单
      menuList: [],
      // 左侧菜单列表是否折叠 默认为 不折叠
      isCollapse: false,
      // 菜单显示激活状态 从 sessionStorage 中取出
      defaultActive: ''
    }
  },
  created: function () {
    this.getMenuList()
    this.defaultActive = window.sessionStorage.getItem('defaultActive')
  },
  methods: {
    getMenuList: async function () {
      // 调用API获取接口菜单数据
      this.$message.error('获取菜单失败，请别写后端API接口')
      this.menuList = [
        {
          id: 1,
          order: null,
          path: '',
          authName: '用户管理',
          className: 'el-icon-user-solid',
          children: [
            { id: 1001, order: null, path: '/user_list', authName: '用户列表', className: 'el-icon-s-home', children: null }
          ]
        },
        {
          id: 2,
          order: null,
          path: '',
          authName: '权限管理',
          className: 'el-icon-setting',
          children: [
            { id: 2001, order: null, path: '/role_list', authName: '角色列表', className: 'el-icon-edit', children: null },
            { id: 2002, order: null, path: '/privilege_list', authName: '权限列表', className: 'el-icon-edit', children: null }
          ]
        },
        {
          id: 3,
          order: null,
          path: '',
          authName: '商品管理',
          className: 'el-icon-goods',
          children: [
            { id: 3001, order: null, path: '/goods_list', authName: '商品列表', className: 'el-icon-edit', children: null },
            { id: 3002, order: null, path: '/', authName: '分类参数', className: 'el-icon-edit', children: null },
            { id: 3003, order: null, path: '/goods_category', authName: '商品分类', className: 'el-icon-edit', children: null }
          ]
        },
        {
          id: 4,
          order: null,
          path: '',
          authName: '订单管理',
          className: 'el-icon-s-order',
          children: [
            { id: 4001, order: null, path: '/order_list', authName: '订单列表', className: 'el-icon-collection-tag', children: null }
          ]
        },
        {
          id: 5,
          order: null,
          path: '',
          authName: '数据统计',
          className: 'el-icon-pie-chart',
          children: [
            { id: 5001, order: null, path: '/report', authName: '分析报告', className: 'el-icon-collection-tag', children: null }
          ]
        }
      ]

      // 调用api的部分，后面在写
      // const { data: res } = await this.$http.get('/menu') // 解包
      // if (res.meta.code !== 0) return this.$message.error('获取菜单失败')
      // this.menuList = res.data
    },
    // 折叠菜单功能
    toggle_collapse: function () {
      // 间接 设置menu组件的collpase属性
      this.isCollapse = !this.isCollapse
      // 改变侧边栏宽度 由内部的图标样式宽度撑开
      // this.asideWidth = this.isCollapse ? '' : '300'
      this.$emit('isCollapse', this.isCollapse)
    },
    handleActive: function (menuItem) {
      this.defaultActive = menuItem.index
      // 保存到 sessionStorage 方便 属性的时候也保持激活状态
      window.sessionStorage.setItem('defaultActive', menuItem.index)
    }
  }
}
</script>

<style lang="less" scoped>
  .el-menu {
    border-right: none;
  }
  .asider  button {
    width: 100%;
    background-color: #0077aa;
    color: #ffffff;
    border-right: none;
    border-left: none;
  }
</style>
