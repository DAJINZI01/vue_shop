<template>
  <div  class="home-container">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <router-link to="/home">
            <img src="../assets/images/logo.png" alt="">
          </router-link>
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 左侧侧边栏 -->
        <el-aside :width="asideWidth">
          <!-- 侧边栏 折叠按钮 -->
          <el-button icon="el-icon-notebook-2" @click="toggle_collapse"></el-button>
          <!-- 侧边栏 菜单区域 -->
          <el-menu
            @open="handleOpen"
            @close="handleClose"
            background-color="#007799"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            :collapse="isCollapse"
            class="el-menu-vertical-demo"
            router>
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
              <el-menu-item :index="submenu.path" v-for="submenu in menu.children" :key="submenu.id">
                <!-- 图标 -->
                <i :class="submenu.className"></i>
                <!-- 文本标题 -->
                <span>{{ submenu.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

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
      // 侧边栏宽度 默认 300px
      asideWidth: '300'
    }
  },
  created: function () {
    this.getMenuList()
  },
  methods: {
    logout: function () {
      // 清空 token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },
    getMenuList: async function () {
      // 调用API获取接口菜单数据
      this.$message.error('获取菜单失败')
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
            { id: 5001, order: null, path: '/', authName: '角色列表', className: 'el-icon-collection-tag', children: null },
            { id: 5002, order: null, path: '/', authName: '权限列表', className: 'el-icon-collection-tag', children: null }
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
      this.asideWidth = this.isCollapse ? '' : '300'
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-container {
    height: 100%;
  }

  .el-header {
    background-color: #0077aa;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
  }

  .el-header div {
    height: 60px;
    display: flex;
    justify-content: center;
  }

  .el-header img{
    height: 60px;
  }

  .el-header span{
    font-size: 28px;
    line-height: 60px;
    color: #ffffff;
  }

  .el-aside {
    background-color: #0077aa;
  }

  .el-aside .el-button {
    width: 100%;
    background-color: #0077aa;
    color: #ffffff;
    border-right: none;
    border-left: none;
  }

  .el-menu {
    border-right: none;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }

  .el-main {
    background-color: #eaffea;
  }
</style>
