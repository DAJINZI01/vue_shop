<template>
  <div class="table">
    <!-- 数据展示的表格 -->
    <el-table :data="permissionList" stripe border>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.modify_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限名称" prop="control"></el-table-column>
      <el-table-column label="路由" prop="action"></el-table-column>
      <el-table-column label="等级" prop="level">
        <template slot-scope="scope">
          <el-tag :type="tagMap[scope.row.level].type">{{ tagMap[scope.row.level].levelName }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'myTable',
  data () {
    return {
      params: {
        page: 1,
        per_page: 10
      },
      total: 0,
      permissionList: [],
      // 等级字典
      tagMap: {
        0: { levelName: '零级', type: '' },
        1: { levelName: '一级', type: 'success' },
        2: { levelName: '二级', type: 'info' },
        3: { levelName: '三级', type: 'warning' },
        4: { levelName: '四级', type: 'danger' },
        5: { levelName: '五级', type: '' },
        null: { levelName: '无', type: '' }
      }
    }
  },
  created () {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList () {
      const { data: res } = await this.$http.get('/rights/', { params: this.params })
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.permissionList = res.data.rights_list
      this.total = res.data.total
    },
    handleSizeChange (val) {
      console.log(val)
      this.params.per_page = val
      this.getPermissionList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getPermissionList()
    }
  }
}
</script>

<style scoped>

</style>
