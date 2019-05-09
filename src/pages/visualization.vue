<template>
  <div class='visualization'>
    <div class="content" v-if="source[0].length>0">
          <charts geom="pie" :source="source[0]" @chart_tap="tap"></charts>
          <header class="header">
            <div class="border-line"></div>
            <span>工单列表</span>
          </header>
            <load-more class="container list-con" :onInfinite="onInfinite" ref="scroll0" v-if="tableData[0].length>0">
              <li v-for="(item,index) in tableData[0]" :key="index">
                <div class="list">
                  <label>工单编号：</label>
                  <span>{{item.code}}</span>
                </div>
                <div class="list">
                  <label>工单主题：</label>
                  <span>{{item.subject}}</span>
                </div>
                <div class="list">
                  <label>客户名称：</label>
                  <span>{{item.customerOrgName}}</span>
                </div>
                <div class="list">
                  <label>创建时间：</label>
                  <span>{{item.createDate}}</span>
                </div>
              </li>
              <div v-if="finished" slot="infinite" class="text-center">没有更多数据</div>
            </load-more>
            <empty v-else></empty>
        </div>
        <empty v-else></empty>
    <!--<van-tabs v-model="active" @change="change">
      <van-tab title="本日工单">
        <div class="content" v-if="source[0].length>0">
          <charts geom="pie" :source="source[0]" @chart_tap="tap"></charts>
          <header class="header">
            <div class="border-line"></div>
            <span>工单列表</span>
          </header>
            <load-more class="container list-con" :onInfinite="onInfinite" ref="scroll0" v-if="tableData[0].length>0">
              <li v-for="(item,index) in tableData[0]" :key="index">
                <div class="list">
                  <label>工单编号：</label>
                  <span>{{item.code}}</span>
                </div>
                <div class="list">
                  <label>工单主题：</label>
                  <span>{{item.subject}}</span>
                </div>
                <div class="list">
                  <label>客户名称：</label>
                  <span>{{item.customerOrgName}}</span>
                </div>
                <div class="list">
                  <label>创建时间：</label>
                  <span>{{item.createDate}}</span>
                </div>
              </li>
              <div v-if="finished" slot="infinite" class="text-center">没有更多数据</div>
            </load-more>
            <empty v-else></empty>
        </div>
      </van-tab>
      <van-tab title="本周工单">
        <div class="content" v-if="source[1].length>0">
          <charts geom="pie" :source="source[1]" @chart_tap="tap"></charts>
          <header class="header">
            <div class="border-line"></div>
            <span>工单列表</span>
          </header>
          <load-more class="container list-con" :onInfinite="onInfinite" ref="scroll1" v-if="tableData[1].length>0">
            <li v-for="(item,index) in tableData[1]" :key="index">
              <div class="list">
                <label>工单编号：</label>
                <span>{{item.code}}</span>
              </div>
              <div class="list">
                <label>工单主题：</label>
                <span>{{item.subject}}</span>
              </div>
              <div class="list">
                <label>客户名称：</label>
                <span>{{item.customerOrgName}}</span>
              </div>
              <div class="list">
                <label>创建时间：</label>
                <span>{{item.createDate}}</span>
              </div>
              </li>
            <div v-if="finished" slot="infinite" class="text-center">没有更多数据</div>
          </load-more>
          <empty v-else></empty>
        </div>
      </van-tab>
      <van-tab title="本月工单">
        <div class="content" v-if="source[2].length>0">
          <charts geom="pie" :source="source[2]" @chart_tap="tap"></charts>
          <header class="header">
            <div class="border-line"></div>
            <span>工单列表</span>
          </header>
            <load-more class="container list-con" :onInfinite="onInfinite" ref="scroll2" v-if="tableData[2].length>0">
                <li v-for="(item,index) in tableData[2]" :key="index">
                  <div class="list">
                    <label>工单编号：</label>
                    <span>{{item.code}}</span>
                  </div>
                  <div class="list">
                    <label>工单主题：</label>
                    <span>{{item.subject}}</span>
                  </div>
                  <div class="list">
                    <label>客户名称：</label>
                    <span>{{item.customerOrgName}}</span>
                  </div>
                  <div class="list">
                    <label>创建时间：</label>
                    <span>{{item.createDate}}</span>
                  </div>
                </li>
              <div v-if="finished" slot="infinite" class="text-center">没有更多数据</div>
            </load-more>
            <empty v-else></empty>
        </div> 
      </van-tab>
    </van-tabs>-->
  </div>
</template>

<script>
  import charts from 'components/charts'
  import empty from 'components/empty'
  import loadMore from 'components/load-more'
  import { getStatistic,getStatisticCount } from 'controller/visualization' // 职务列表
  import getVariable from 'utils/getVariable'
  export default {
    name: 'visualization',
    components: { charts,empty,loadMore },
    data() {
      return {
        active:0, // tab 触发
        currentPie:'STA_CREATE',
        orderType:['Day','Week','Month'], // 工单类型
        canTouch: true, // 是否可以点击饼图
        sum: 0,
        source: [[],[],[]], // 为方便后续扩展路由及切换不请求接口，做此结构
        tableData: [[],[],[]],
        count:5,
        finished: false,
        page:0,
        totalCount:0,
        mode: 'STA_CREATE',
        modeList: 'STA_CREATE,STA_UN_END,STA_OUTTIME,STA_END',
        begin: null,
        end : null
      };
    },
    created() {
      // 初始化 table source 数据 
      /*
       @desc 19-05-06 改为只显示本日，本周，并增加开始结束时间参数，去掉类型参数
       * */
      this.begin = getVariable('planStartTimeBegin');
      this.end = getVariable('planStartTimeEnd');
      this.getAll({
//      modeList:'CREATE,UN_END,END,ALLOUTTIME',
        modeList: this.modeList,
        planStartTimeBegin: this.begin,
        planStartTimeEnd: this.end
//      dateType: 'Day',
      },{
//      dateType: 'Day',
        mode: 'STA_CREATE',
        planStartTimeBegin: this.begin,
        planStartTimeEnd: this.end,
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
      getAll(countParams,params,done) {
        // dateType = Week 本周，Month 本月，Day 本日
        let promiseGetStatistic = this.getStatistic(params)
        // modeList=CREATE,UN_END,END,ALLOUTTIME
        let promisegetStatisticCount = this.getStatisticCount(countParams)
        Promise.all([promiseGetStatistic,promisegetStatisticCount]).then(res=>{
          this.source[this.active] = this.setSource(res[1].STA_CREATE,res[1].STA_END,res[1].STA_UN_END,res[1].STA_OUTTIME)
          this.$set(this.source,this.active,this.setSource(res[1].STA_CREATE,res[1].STA_END,res[1].STA_UN_END,res[1].STA_OUTTIME))
          this.setTable(res[0])
          this.totalCount = res[0].totalCount
          this.canTouch = true 
          if(done){
            done();
          }
          if(this.totalCount==this.tableData[this.active].length){
            this.finished = true;
          }
        })
      },
      // 设置 table 格式
      setTable(res) {
        if(res.data&&res.data.length>0) {
            res.data.forEach((item,index)=>{
              let obj = {
                code:item.code,
                customerOrgName:item.customerOrgName,
                createDate:item.createDate,
                subject:item.subject,
              }
              this.tableData[this.active].push(obj) 
            })
        }
      },
      // 设置 source 格式
      setSource(create,end,un_end,outtime) {
        let source = null
        let sum = create + un_end + end + outtime
        source = [{
            name: '新建 ' + create, x:'1', y: create / sum, value:'STA_CREATE',count:create
        },{
            name: '完成 ' + end, x:'1', y: end / sum, value:'STA_END',count:end
        },{
            name: '在办 ' + un_end, x:'1', y: un_end / sum, value:'STA_UN_END',count:un_end
        },{
            name: '超时 ' + outtime, x:'1', y: outtime / sum, value:'STA_OUTTIME',count:outtime
        }]
        if(sum === 0) source = []
        return source
      },
      // tab 切换事件
      change(i) {
        this.page = 0;
        this.tableData = [[],[],[]];
        this.getAll({
          modeList:this.modeList,
          dateType: this.orderType[this.active],
        },{
          dateType: this.orderType[this.active],
          mode: this.currentPie,
          pageRows:this.count,
          page:this.page
        })
      },
      // 饼图点击事件
      tap(v) {
        if(v && v._origin) {
          if(this.canTouch) {
            this.canTouch = false
            this.page = 0;
            
            this.currentPie = v._origin.value
            if(this.$refs.scroll0){
              this.$refs.scroll0.infiniteLoading = false;
            }
            if(this.$refs.scroll1){
              this.$refs.scroll1.infiniteLoading = false;
            }
            if(this.$refs.scroll2){
              this.$refs.scroll2.infiniteLoading = false;
            }
          
            this.tableData = [[],[],[]];
            this.getAll({
              modeList:this.modeList,
              planStartTimeBegin: this.begin,
              planStartTimeEnd: this.end,
//            dateType: this.orderType[this.active],
            },{
//            dateType: this.orderType[this.active],
              planStartTimeBegin: this.begin,
              planStartTimeEnd: this.end,
              mode: this.currentPie,
              pageRows:this.count,
              page:this.page
            })
          }
        }
      },
      onInfinite(done) {
        if(this.totalCount==this.tableData[this.active].length){
          this.finished = true;
          return;
        }
        this.getAll({
          modeList:this.modeList,
          planStartTimeBegin: this.begin,
          planStartTimeEnd: this.end
//        dateType: this.orderType[this.active],
        },{
//        dateType: this.orderType[this.active],
          planStartTimeBegin: this.begin,
          planStartTimeEnd: this.end,
          mode: this.currentPie,
          pageRows:this.count,
          page:++this.page
        },done)
      }
    }
  }
</script>
<style lang='scss'>
  body{
    background:#F2F2F2;
  }
  .visualization {
    height: 100%;
    .content {
      .charts{
        background:#fff;
        padding: 0 1.07rem;
      }
    }
    .empty{
      margin-top:20%;
    }
    .scroll{
      top:19rem !important;
      bottom:0 !important;
    }
    .header {
      display:flex;
      align-items: center;
      margin-top: .71rem;
      background:#fff;
      height: 3.11rem;
      line-height: 3.11rem;
      padding: 0 1.07rem;
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
    .list-con{  
      li{
        padding: .71rem 1.07rem;
        margin-bottom: .71rem;
        background: #fff;
        /*background: #fff url("~@/assets/next.png") no-repeat;*/
        /*background-size: .43rem .79rem;
        background-position:calc(100% - 1.07rem) 50%;*/
        list-style:none;
        .list{
          line-height: 1.96rem;
        }
      }
    }
  }
</style>