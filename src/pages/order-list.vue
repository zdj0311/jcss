<template>
  <div class='order-list'>
  <div class="menus">
    <div class="menu-item" v-for="(item,index) in menus" @click="showPannel(index)" :ref="flwoUp">
      <span>{{ item.text }}{{index}}</span><img :src="sele"/>
      
    </div>
    <ma-select v-model="show" :properties="variable" @change="change"></ma-select>
  </div>
  <div class="content" v-for="(item,index) in orderList">
    <header>
      <span :class="item.status==0?'statu':'overtime'" >{{item.statusValue}}</span>
      <h2>{{item.subject}}</h2>
    </header>
    <div class="body">
      <div class="set-time">
        <span>创建时间</span>
        <time>{{item.planStartTime}}</time>
      </div>
      <div class="flow">
        <div class="flow-details" @click="showFlow(item.id)">
          流转详情
          <img :src="showDetails[item.id]?flwoUp:flwoDown"/>
        </div>
        <div class="flow-btn">
          <span>查看</span>
          <span>处理</span>
        </div>
      </div>
      <ul class="history-list" v-show="showDetails[item.id]">
          <li v-for="obj in orderHistoryList">
            <h2>{{obj.actName}}</h2>
            <p>{{obj.endTime}}</p>
            <p>{{obj.assigneeValue}}</p>
          </li>
          <div></div>
      </ul>
    </div>
  </div>
    
  </div>
</template>

<script>
  import maSelect from 'components/ma-select'
  import sele from 'assets/img/sele.png'
  import flwoUp from 'assets/img/flow-up.png'
  import flwoDown from 'assets/img/flow-down.png'
  import { getStatistic,getHistory } from 'controller/order-list' // 职务列表
  export default {
    name:'order_list',
    components: { maSelect },
    data() {
      return {
        sele,
        flwoUp,
        flwoDown,
        menus:[{
          text:'我的'
        },{
          text:'状态'
        },{
          text:'时间'
        }],
        order_list:[],
        showDetails:[],
        show:false,
        variable:[
          {name:'我的',dataScope:'MyBill'},
          {name:'全部',dataScope:'AllBill'}
        ],
        properties:{
          0:[
            {name:'我的',dataScope:'MyBill' },
            {name:'全部',dataScope:'AllBill'}
            
          ],
          1:[
            {name:'待办',mode:'create'},
            {name:'未完成',mode:'un_end'},
            {name:'已完成',mode:'end'},
            {name:'已超时',mode:'outtime'}
          ],
          2:[
            {name:'当日',dateType:'week'},
            {name:'本周',dateType:'month'},
            {name:'本月',dateType:'day'}
          ],
        },
        getAll:{
          dateType: 'Week',
          mode: 'CREATE',
          pageRows:10,
          page:0,
          dataScope:'MyBill'
        },
        orderList:[],
        orderHistoryList:[]
      };
    },
    methods: {
      showPannel(i) {
        this.show = true;
        this.variable = this.properties[i];
      },
      showFlow(id){
        this.showDetails[id] = !this.showDetails[id];
        this.getHistory(id);
      },
      change(obj){
        console.log(obj)
        for (var key in obj) {
          if(key == 'mode' || key ==  'dateType' || key ==  'dataScope'){
              this.getAll[key] = obj[key]
          }
      }
        console.log(this.getAll);
      },
      // 返回 Promise 获取工单列表
      getStatistic(params) {
        let _this = this;
        getStatistic.bind(this)(params).then(res=>{
          _this.orderList = res.data;
          console.log(_this.orderList);
        })
        .catch(err=>{
          console.log(err);
        })
      },
      getHistory(id) {
        let _this = this;
        getHistory.bind(this)(id).then(res=>{
          _this.orderHistoryList = res;
          console.log(_this.orderHistoryList);
        })
        .catch(err=>{
          console.log(err);
        })
      },
    },
    created() {

    },
    mounted() {
        this.getStatistic(this.getAll);
    },
  }
</script>
<style lang='scss'>
  .order-list {
    .menus {
      position:relative;
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
    .content {
      background:#fff;
      font-size: 1rem;
      header {
        display:flex;
        align-items: center;
        padding:1rem;
      }
      .statu {
        color:#fff;
        padding:.3rem .8rem;
        background: linear-gradient(left, #4a79df, #7db6ff);
        border-radius: 5px;
      }
      .overtime {
        color:#fff;
        padding:.3rem .8rem;
        background: linear-gradient(left, #ff322f, #ff6a2f);
        border-radius: 5px;
      }
      h2 {
        font-size:1.1rem;
        font-weight: bold;
        margin-left:1rem;
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
          border:2px solid #4f7fe2;
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
    .history-list{
      display: flex;
      justify-content: space-between;
      padding:0 1rem;
      position: relative;
      color:#8494ac;
      overflow-x: scroll;
      width:100%;
      li{
        position: relative;
        z-index: 1;
      }
      li h2{
        width:5.71rem;
        height: 1.5rem;
        border:1px solid #e0e7f3;
        border-radius: 1.79rem;
        display: inline-block;
        text-align: center;
        line-height: 1.5rem;
        background-color:#eaeff7;
        margin:0 ;
      }
      p{
        margin:0.5rem 0;
      }
      li:last-child h2{
        color: #fff;
        background-color:#4a79df;
      }
      div{
        position:absolute;
        left:0;
        top:10px;
        height: 1px;
        background: #eaeff7;
        width: 100%;
        z-index: 0;
      }
    }
  }
  
</style>