<template>
  <div class='visualization'>
    <van-tabs v-model="active" @change="change">
      <van-tab title="本日工单">
        <div class="content" v-if="source[0].length>0">
          <charts geom="pie" :source="source[0]" @chart_tap="tap"></charts>
          <header class="header">
            <div class="border-line"></div>
            <span>工单列表</span>
          </header>
          <el-table class="table" :data="tableData[0]" size="mini" border style="width: 100%">
            <el-table-column prop="orgName" label="客户" width="80"></el-table-column>
            <el-table-column prop="userName" label="姓名" width="80"></el-table-column>
            <el-table-column prop="createUser" label="创建人"></el-table-column>
            <el-table-column prop="resolveUser" label="处理人"></el-table-column>
          </el-table>
          <el-pagination @current-change="changePage" small :current-page.sync="currentPage" class="pagination" background layout="pager" :page-size="count" :total="total"></el-pagination>
        </div>
        <empty v-else></empty>
      </van-tab>
      <van-tab title="本周工单">
        <div class="content" v-if="source[1].length>0">
          <charts geom="pie" :source="source[1]" @chart_tap="tap"></charts>
          <header class="header">
            <div class="border-line"></div>
            <span>工单列表</span>
          </header>
          <el-table class="table" :data="tableData[1]" size="mini" border style="width: 100%">
            <el-table-column prop="orgName" label="客户" width="80"></el-table-column>
            <el-table-column prop="userName" label="姓名" width="80"></el-table-column>
            <el-table-column prop="createUser" label="创建人"></el-table-column>
            <el-table-column prop="resolveUser" label="处理人"></el-table-column>
          </el-table>
          <el-pagination @current-change="changePage" small :current-page.sync="currentPage" class="pagination" background layout="pager" :page-size="count" :total="total"></el-pagination>
        </div>
        <empty v-else></empty>
      </van-tab>
      <van-tab title="本月工单">
        <div class="content" v-if="source[2].length>0">
          <charts geom="pie" :source="source[2]" @chart_tap="tap"></charts>
          <header class="header">
            <div class="border-line"></div>
            <span>工单列表</span>
          </header>
          <el-table class="table" :data="tableData[2]" size="mini" border style="width: 100%">
            <el-table-column prop="orgName" label="客户" width="80"></el-table-column>
            <el-table-column prop="userName" label="姓名" width="80"></el-table-column>
            <el-table-column prop="createUser" label="创建人"></el-table-column>
            <el-table-column prop="resolveUser" label="处理人"></el-table-column>
          </el-table>
          <el-pagination @current-change="changePage" small :current-page.sync="currentPage" class="pagination" background layout="pager" :page-size="count" :total="total"></el-pagination>
        </div>
        <empty v-else></empty>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import charts from 'components/charts'
  import empty from 'components/empty'
  import { getStatistic,getStatisticCount } from 'controller/visualization' // 职务列表
  export default {
    name: 'visualization',
    components: { charts,empty },
    data() {
      return {
        active:0, // tab 触发
        currentPie:null,
        currentPage:0,
        orderType:['Day','Week','Month'], // 工单类型
        canTouch: true, // 是否可以点击饼图
        sum: 0,
        source: [[],[],[]], // 为方便后续扩展路由及切换不请求接口，做此结构
        tableData: [[],[],[]],
        count:5,
        total:0,
      };
    },
    created() {
      // 初始化 table source 数据
      this.getAll({
        modeList:'CREATE,UN_END,END,OUTTIME',
        dateType: 'Day',
      },{
        dateType: 'Day',
        mode: 'CREATE',
        pageRows:this.count,
        page:0
      })
    },
    methods: {
      // 返回 Promise 获取工单列表
      getStatistic(params) {
        return getStatistic.bind(this)(params)
      },
      // 返回 Promise 获取工单数量
      getStatisticCount(params) {
        return getStatisticCount.bind(this)(params)
      },
      // 封装 获取数量和列表 设置 source 及 table 的值
      getAll(countParams,params) {
        // dateType = Week 本周，Month 本月，Day 本日
        let promiseGetStatistic = this.getStatistic(params)
        // modeList=CREATE,UN_END,END,OUTTIME
        let promisegetStatisticCount = this.getStatisticCount(countParams)
        Promise.all([promiseGetStatistic,promisegetStatisticCount]).then(res=>{
          this.source[this.active] = this.setSource(res[1].CREATE,res[1].END,res[1].UN_END,res[1].OUTTIME)
          this.$set(this.source,this.active,this.setSource(res[1].CREATE,res[1].END,res[1].UN_END,res[1].OUTTIME))
          this.setTable(res[0])
          this.currentPie = 'CREATE'
          this.currentPage = 0
        })
      },
      // 设置 table 格式
      setTable(res) {
        let newArr = []
        if(res.data&&res.data.length>0) {
            res.data.forEach((item,index)=>{
              newArr.push({
                orgName:item.customerOrgName,
                userName:item.assetTypeName,
                createUser:item.appUserName,
                resolveUser:item.customerName,
              })
            })
          this.tableData[this.active] = newArr
          this.$set(this.tableData,this.active,newArr)
          this.total = res.totalCount
        }
      },
      // 设置 source 格式
      setSource(create,end,un_end,outtime) {
        let source = null
        let sum = create + un_end + end + outtime
        source = [{
            name: '新建 ' + create, x:'1', y: create / sum, value:'CREATE',count:create
        },{
            name: '完成 ' + end, x:'1', y: end / sum, value:'END',count:end
        },{
            name: '未完成 ' + un_end, x:'1', y: un_end / sum, value:'UN_END',count:un_end
        },{
            name: '超时 ' + outtime, x:'1', y: outtime / sum, value:'OUTTIME',count:outtime
        }]
        if(sum === 0) source = []
        return source
      },
      // tab 切换事件
      change(i) {
        this.getAll({
          modeList:'CREATE,UN_END,END,OUTTIME',
          dateType: this.orderType[this.active],
        },{
          dateType: this.orderType[this.active],
          mode: 'CREATE',
          pageRows:this.count,
          page:0
        })
      },
      // 饼图点击事件
      tap(v) {
        if(v && v._origin) {
          if(this.canTouch) {
            this.canTouch = false
            this.getStatistic({
              dateType: this.orderType[this.active],
              mode: v._origin.value,
              pageRows:this.count,
              page:0
            }).then(res=>{
              this.currentPie = v._origin.value
              // customerOrgName assetTypeName appUserName nowUserValue@desc[Array]
              this.canTouch = true
              this.setTable(res)
              this.currentPage = 0
            })
          }
        }
      },
      changePage(i) {
        this.getStatistic({
          dateType: this.orderType[this.active],
            mode: this.currentPie,
            pageRows:this.count,
            page:i-1
          }).then(res=>{
            this.currentPage = i
            console.log(res.data)
            // customerOrgName assetTypeName appUserName nowUserValue@desc[Array]
            this.setTable(res)
          })
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
    .van-tabs, .van-tabs__content, .van-tab__pane {
      height:100%;
    }
    .van-tabs__line {
      background:#5889e6;
    }
    .pagination {
      text-align: center;
      margin-top:1rem;
    }
  }
</style>