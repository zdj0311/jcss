<template>
  <div class='visualization'>
    <van-tabs v-model="active">
      <van-tab title="本日工单">
        <div class="content" v-if="source.length>0">
          <charts geom="pie" :source="source" @chart_tap="tap"></charts>
          <header class="header">
            <div class="border-line"></div>
            <span>资产分类</span>
          </header>
          <el-table class="table"
            :data="tableData" size="mini"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="80">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="80">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
            </el-table-column>
          </el-table>
        </div>
      </van-tab>
      <van-tab title="本周工单">
        <div class="content">
          <charts geom="pie" :source="source1"></charts>
        </div>
      </van-tab>
      <van-tab title="本月工单">
        <div class="content">
          <charts geom="pie" :source="source2"></charts>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import charts from 'components/charts'
  import { getStatistic,getStatisticCount } from 'controller/visualization' // 职务列表
  export default {
    name: 'visualization',
    components: { charts },
    data() {
      return {
        active:0,
        source: [],
        source1: [
          { name: '李', x:'1', y: 0.1 },
          { name: '王', x:'1', y: 0.1 },
          { name: '夏侯', x:'1', y: 0.1 },
          { name: '知乎', x:'1', y: 0.1 },
          { name: '掘金', x:'1', y: 0.6 },
        ],
        source2: [
          { name: '李', x:'1', y: 0.2 },
          { name: '王', x:'1', y: 0.2 },
          { name: '夏侯', x:'1', y: 0.4 },
          { name: '知乎', x:'1', y: 0.1 },
          { name: '掘金', x:'1', y: 0.1 },
        ],
        tableData: [{
          date: '2016',
          name: '王小虎',
          address: '上海弄'
        }, {
          date: '2016',
          name: '阿斯顿撒多',
          address: '金沙江路'
        }, {
          date: '2016',
          name: '王小虎',
          address: '普陀区'
        }, {
          date: '2016',
          name: '王小虎',
          address: '上海市'
        }]
      };
    },
    created() {
      let promiseGetStatistic = 
      // dateType = Week 本周，Month 本月，Day 本日
      getStatistic.bind(this)({
        dateType: 'Day',
        mode: 'CREATE'
      }).then(res=>{
        
      })
      // modeList=CREATE,UN_END,END,OUTTIME
      getStatisticCount.bind(this)({
        modeList:'CREATE,UN_END,END,OUTTIME',
        dateType: 'Day',
      }).then(res=>{
        this.source = this.setSource(res.CREATE,res.END,res.UN_END,res.OUTTIME)
      })
    },
    methods: {
      getStatistic() {
        console.log(111)
      },
      getStatisticCount() {
        
      },
      setSource(create,un_end,end,outtime) {
        let source = null
        let sum = create + un_end + end + outtime
        source = [{
            name: '新建 ' + create, x:'1', y: create / sum, value:'create'
        },{
            name: '完成 ' + end, x:'1', y: end / sum, value:'end'
        },{
            name: '未完成 ' + un_end, x:'1', y: un_end / sum, value:'un_end'
        },{
            name: '超时 ' + outtime, x:'1', y: outtime / sum, value:'outtime'
        }]
        return source
      },
      tap(v) {
        if(v._origin && v._origin.value) {
          this.getStatistic()
        }
      }
    }
  }
</script>
<style lang='scss'>
  .visualization {
    height:100%;
    background:#F2F2F2;
    .content {
      background:#fff;
      padding:0 1rem 1rem 1rem;
    }
    .header {
      display:flex;
      align-items: center;
      margin-bottom:1rem;
    }
    .table th {
      background:#fbfbfb;
    }
    .border-line {
      border-left:4px solid #5889e6;
      height:1.1rem;
      margin-right:.4rem;
    }
    .van-tabs__line {
      background:#5889e6;
    }
  }
</style>