<template>
  <el-card>
    <div slot="header">
      <span>订单列表</span>
      <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
    </div>
    <!-- 搜索商品输入框   -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input placeholder="请输入订单名称" clearable v-model="params.name"
                  @clear="getOrdersList" @keyup.enter.native="getOrdersList">
          <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="12">
        <router-link to="/goods/add"><el-button type="primary">添加订单</el-button></router-link>
      </el-col>
    </el-row>
    <!-- 表格显示   -->
    <el-table :data="ordersList" border stripe>
      <!--  索引列    -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="id" prop="id" width="80px"></el-table-column>
      <el-table-column label="创建时间" width="190px">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="190px">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.modify_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="number"></el-table-column>
      <el-table-column label="订单总金额" prop="price" width="100px"></el-table-column>
      <el-table-column label="支付宝交易流水号" prop="transaction_no"></el-table-column>
<!--      <el-table-column label="收货人地址" prop="consignee_address"></el-table-column>-->
      <el-table-column label="支付状态" width="80px">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.pay_status === '未付款'">{{ scope.row.pay_status }}</el-tag>
          <el-tag type="success" v-else-if="scope.row.pay_status === '已支付'">{{ scope.row.pay_status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="80px">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.pay_method === '未支付'">{{ scope.row.pay_method }}</el-tag>
          <el-tag type="info" v-else-if="scope.row.pay_method === '微信'">{{ scope.row.pay_method }}</el-tag>
          <el-tag type="success" v-else-if="scope.row.pay_method === '支付宝'">{{ scope.row.pay_method }}</el-tag>
          <el-tag type="warning" v-else-if="scope.row.pay_method === '银行卡'">{{ scope.row.pay_method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" width="80px">
        <template slot-scope="scope">
          <i class="el-icon-circle-check" style="color: green" v-if="scope.row.is_delivery"></i>
          <i class="el-icon-circle-close" style="color: red" v-else></i>
        </template>
      </el-table-column>
      <!--  操作列    -->
      <el-table-column label="操作" width="128px" fixed="right">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="修改地址" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
                       @click="handleUpdateOrders(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="查看物流" placement="top" :enterable="false">
            <el-button type="success" icon="el-icon-location" circle size="mini"
                       @click="checkDeliver(scope.row.id)"></el-button>
          </el-tooltip>
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
    <!-- 修改地址   -->
    <el-dialog
      title="修改商品"
      :visible.sync="updateOrdersDialogVisible" :lock-scroll="true" :close-on-click-modal="false"
      width="40%" @close="resetForm('consigneeAddressForm')">
      <!--  表单区域    -->
      <el-form :model="consigneeAddressForm" :rules="rules" ref="consigneeAddressForm" label-width="80px">
        <el-form-item label="省市区县" prop="address1">
          <el-cascader v-model="consigneeAddressForm.address1" :options="addressOptions" popper-class="height200" clearable
                       :props="{ expandTrigger: 'hover', value: 'id', label: 'name',
                             children: 'child_category', leaf: 'has_child'}" size="medium">
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.child_category.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="consigneeAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateOrdersDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateOrdersById">修改</el-button>
      </span>
    </el-dialog>
    <!-- 查看物流   -->
    <el-dialog
      title="查看物流"
      :visible.sync="checkDeliverDialogVisible" :lock-scroll="true" :close-on-click-modal="false"
      width="40%">
      <el-timeline>
        <el-timeline-item :timestamp="'2018/4/' + o" placement="top" v-for="o in 10" :key="o">
          <el-card>
            <h4>快递状态: {{ o }}</h4>
            <p>Tom committed 2018/4/12 20:46</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkDeliverDialogVisible = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'card',
  data () {
    return {
      params: {
        name: '',
        page: 1,
        per_page: 10
      },
      // 表格组件用到的数据
      ordersList: [],
      total: 0,
      // 修改订单对话框显示
      updateOrdersDialogVisible: false,
      // 查看物流对话框
      checkDeliverDialogVisible: false,
      consigneeAddressForm: {
        address1: [],
        address2: ''
      },
      // 表单验证规则
      rules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 省市区县数据
      addressOptions: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList () {
      const { data: res } = await this.$http.get('/orders', { params: this.params })
      if (res.meta.code) return this.$message.error(res.meta.msg)
      this.ordersList = res.data.orders_list
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.params.per_page = val
      this.getOrdersList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getOrdersList()
    },
    // 表单重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 打开修改订单对话框
    handleUpdateOrders (index, row) {
      this.updateOrdersDialogVisible = true
    },
    // 打开查看物流对话框
    checkDeliver (id) {
      this.checkDeliverDialogVisible = true
    },
    // 通过id更新订单
    updateOrdersById () {
    }
  }
}
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
  .el-timeline {
    padding: 0;
  }
</style>
