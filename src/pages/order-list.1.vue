<template>
  <div class='order-list'>
    <div class="menus">
      <div class="menu-item" v-for="(item,index) in menus" @click="showPannel(index)" :ref="flwoUp">
        <span>{{ getNameByKey(item) }}</span><img :src="sele"/>
        
      </div>
      <ma-select v-model="show" :current="current" :properties="variable" @change="change"></ma-select>
    </div>
    <load-more class="container" :onRefresh="onRefresh" :onInfinite="onInfinite" v-if="orderList.length>0">
      <div class="content" v-for="(item,index) in orderList">
        <header>
          <span :class="item.status==2?'overtime':'statu'" >{{item.statusValue}}</span>
          <h2>{{item.subject}}</h2>
        </header>
        <div class="body">
          <div class="set-time">
            <span>创建时间</span>
            <time>{{item.planStartTime}}</time>
          </div>
          <div class="flow">
            <div class="flow-details" @click="showFlow(item.id,index)">
              流转详情
              <img :src="showDetails[index]?flwoUp:flwoDown"/>
            </div>
            <div class="flow-btn">
              <span @click="routeTo('order_detail',item)">查看</span>
              <span @click="routeTo('order_resolver',item)">处理</span>
            </div>
          </div>
          <ul class="history-list" v-show="showDetails[index]">
            <li class="his-item" v-for="obj in orderHistoryList[index]">
              <div class="line"></div>
              <h2 class="m-b6">{{obj.actName}}</h2>
              <p class="m-b6">{{obj.endTime | timeFilter}}</p>
              <p class="m-b6">{{obj.assigneeValue}}</p>
            </li>
          </ul>
        </div>
      </div>
    <div v-if="finished" slot="infinite" class="text-center">没有更多数据</div>
    </load-more>
    <empty v-else></empty>
  </div>
</template>

<script>
  import maSelect from 'components/ma-select'
  import sele from 'assets/img/sele.png'
  import flwoUp from 'assets/img/flow-up.png'
  import flwoDown from 'assets/img/flow-down.png'
  import { getStatistic,getHistory } from 'controller/order-list' // 职务列表
  import loadMore from 'components/load-more'
  import empty from 'components/empty'
  import tool from 'utils/tool'
  export default {
    name:'order_list',
    components: { maSelect,empty,loadMore},
    data() {
      return {
        sele,flwoUp,flwoDown, // 图片
        menus:[], // tabs 显示
        value_list:['dataScope','mode','dateType'], // 为提交表单的字段建立一个字典，分别代表我的 时间 流程状态
        showDetails:[],
        show:false,
        variable:[],
        saveCurrent:[0,0,1],
        finished:false,
        properties:[
          [{name:'我的',value:'MyBill',tab:0 },
          {name:'全部',value:'AllBill',tab:0 }],
          [{name:'待办',value:'TODO',tab:1 },
          {name:'未完成',value:'UN_END',tab:1 },
          {name:'已完成',value:'END',tab:1 },
          {name:'已超时',value:'OUTTIME',tab:1 }],
          [{name:'当日',value:'Day',tab:2 },
          {name:'本周',value:'Week',tab:2},
          {name:'本月',value:'Month',tab:2}],
        ],
        defaultCon: {
          dataScope:'MyBill',
          dateType: 'Week',
          mode: 'TODO',
          pageRows:10,
          page:0,
        },
        getAll:{
          dataScope:'MyBill',
          dateType: 'Week',
          mode: 'TODO',
          pageRows:10,
          page:0,
        },
        orderList:[],
        orderHistoryList:[],
        current:0,
      };
    },
    filters: {
      timeFilter(time) {
        let newDate = new Date(time)
        return newDate.Format("MM-dd hh:mm")
      }
    },
    
    created() {
      
    },
    mounted() {
      this.getAll.dateType = this.$route.params._type
      this.getAll.mode = this.$route.params._mode
      this.getStatistic.bind(this)(this.getAll)
      // 设置默认menus
      this.menus = ['MyBill',this.$route.params._mode,this.$route.params._type]
    },
    methods: {
      showPannel(i) {
        this.show = true;
        this.current = this.saveCurrent[i];
        this.variable = this.properties[i];
      },
      showFlow(id,index){
        let result = this.showDetails[index]
        this.showDetails[index] = !result;
        this.$set(this.showDetails,index,!result)
        this.getHistory(id,index);
      },
      change(obj){
        this.getAll.page=0;
        // 保存当前tab下标
        this.saveCurrent[obj.tab] = obj.index;
        this.$set(this.saveCurrent,obj.tab,obj.index);
        // 设置当前选中下标
        this.current = obj.index
        // 改变表单中的选中值
        this.getAll[this.value_list[obj.tab]] = obj.value
        // 表单值变化后，menus变化，可做成监听表单（getAll）变化实现
        this.menus = [this.getAll.dataScope,this.getAll.mode,this.getAll.dateType]
        this.getStatistic.bind(this)(this.getAll)
      },
      // 返回 Promise 获取工单列表
      getStatistic(params) {
        getStatistic.bind(this)(params).then(res=>{
          this.orderList = res.data;
          this.totalCount = res.totalCount;
          res.data.forEach((item,index)=>{
            this.showDetails.push(false)
            this.orderHistoryList.push([])
          })
        })
        .catch(err=>{
          console.log(err);
        })
      },
      getHistory(id,index) {
        let _this = this;
        getHistory.bind(this)(id).then(res=>{
          _this.orderHistoryList[index] = res;
          console.log(res)
          this.$set(_this.orderHistoryList,index,res)
        })
        .catch(err=>{
          console.log(err);
        })
      },
      routeTo(name,item) {
        console.log(item)
        this.$router.push({
          name:name,
          params:{_id:item.id}
        })
      },
      // 通过类型获取当前tab显示的名字
      getNameByKey(str) {
        let result = ''
        this.properties.forEach((item,index)=>{
          item.forEach((o,i)=>{
            if(o.value === str) result = o.name
          })
        })
        return result
      },
      onRefresh(done) {
        this.getAll.page=0;
        getStatistic.bind(this)(this.getAll).then(res=>{
          this.orderList = res.data;
          res.data.forEach((item,index)=>{
            this.showDetails.push(false)
            this.orderHistoryList.push([])
          })
          done()
        })
        .catch(err=>{
          console.log(err);
        })
      },
      onInfinite(done) {
        if(this.totalCount==this.orderList.length){
          this.finished = true;
          return;
        }
        getStatistic.bind(this)(Object.assign({},this.getAll,{page:++this.getAll.page})).then(res=>{
          this.orderList = this.orderList.concat(res.data);
          this.totalCount = res.totalCount;
          res.data.forEach((item,index)=>{
            this.showDetails.push(false)
            this.orderHistoryList.push([])
          })
          done()
        })
        .catch(err=>{
          console.log(err);
        })
      }
    },
    activated() {
      if(this.$route.params._type !== this.getAll.dateType || this.$route.params._mode !== this.getAll.mode) {
          this.getAll.dateType = this.$route.params._type
          this.getAll.mode = this.$route.params._mode
          this.getStatistic(this.getAll)
          this.menus = ['MyBill',this.$route.params._mode,this.$route.params._type]
        }
    }
  }
</script>
<style lang='scss'>
  .order-list {
    height:calc(100% - 50px);
    overflow:scroll;
    background:#F2F2F2;
    .menus {
      position:fixed;
      width:100%;
      display:flex;
      z-index: 3014;
    }
    .menu-item {
      display:flex;
      justify-content: center;
      align-items: center;
      padding:.8rem 1rem;
      background:#fff;
      flex:1;
    }
    .menu-item img {
      width:8px;
      height:6px;
      margin-left:2px;
    }
    .container {
      padding-top:2.6rem;
    }
    .content {
      background:#fff;
      font-size: 1rem;
      margin-top: 1rem;
      header {
        display:flex;
        align-items: center;
        padding:1rem;
        h2 {
          font-size:1.1rem;
          font-weight: bold;
          margin-left:1rem;
        }
      }
      .statu {
        color:#fff;
        padding:.3rem .8rem;
        background:-webkit-linear-gradient(to left, #4a79df, #7db6ff);
        background: linear-gradient(to left, #4a79df, #7db6ff);
        border-radius: 5px;
      }
      .overtime {
        color:#fff;
        padding:.3rem .8rem;
        background: linear-gradient(to left, #ff322f, #ff6a2f);
        border-radius: 5px;
      }
      
      .set-time{
        color:#666;
        padding: 0 1rem;
        span{
          margin-right: 1rem;
        }
      }
      .flow{
        padding:1rem; 
        display: flex;
        justify-content: space-between;
        img{
          width:.54rem;
          height: .29rem;
          margin-left: .57rem;
          margin-bottom: 3px;
        }
      }
      .flow-details{
        color:#4b78df;
      }
      .flow-btn{
        span{
          padding:.29rem 1rem;
          border:1px solid #4f7fe2;
          border-radius: 4px;
          color:#5283e4;
        }
        span + span{
          margin-left: .54rem;
        }
      }
      .details{
        background: #fbfbfb;
      }
    }
    .content:last-child{
      margin-bottom:50px;
    }
    .history-list{
      display: flex;
      overflow-x: scroll;
      background:#fbfbfb;
      padding:1rem;
      color:#8494ac;
      .his-item {
        position:relative;
        display:flex;
        flex-flow: column;
        align-items: center;
        min-width:40%;
        padding-right:2rem;
        .line {
          position:absolute;
          top:1rem;
          right:0;
          width:100%;
          border-top:1px solid #eaeff7;
        }
        h2 {
          position:relative;
          border:1px solid #eaeff7;
          padding:.2rem 1rem;
          border-radius: 1rem;
          background:#eaeff7;
          z-index:2;
        }
        &:last-child {
          h2 {
            color:#fff;
            background:#4a79df;
          }
        }
      }
    }
    .m-b6 {
      margin-bottom:.6rem;
    }
  }
  
  
</style>