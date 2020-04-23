<template>
  <el-card>
    <div slot="header">
      <span>数据报表</span>
      <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
    </div>
    <!-- preparing a DOM with width and height for ECharts -->
    <div id="main" style="width:600px; height:400px;"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'card',
  // 当页面的dom元素渲染完成后执行
  mounted () {
    // based on prepared DOM, initialize echarts instance
    const myChart = echarts.init(document.getElementById('main'))
    // specify chart configuration item and data
    const option = {
      title: {
        text: 'ECharts entry example'
      },
      tooltip: {},
      legend: {
        data: ['Sales']
      },
      xAxis: {
        data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks']
      },
      yAxis: {},
      series: [{
        name: 'Sales',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }
    // use configuration item and data specified to show chart
    myChart.setOption(option)
  }
}
</script>

<style scoped>

</style>
