<template>
  <div class='order-list'>
  <div class="menus">
    <div class="menu-item" v-for="(item,index) in menus" @click="showPannel(index)">
      <span>{{ item.text }}</span><img :src="sele"/>
    </div>
  </div>
  <div class="content" v-for="(item,index) in orderList">
    <header>
      <span class="statu" >{{item.statusValue}}</span>
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
          <img :src="showDetails?flwoUp:flwoDown"/>
        </div>
        <div class="flow-btn">
          <span @click="routeTo(item)">查看</span>
          <span>处理</span>
        </div>
      </div>
      <el-steps :active="1" v-if="showDetails" finish-status="success">
        <el-step title="创建" description="这是一段很长<br>很长很长的描述性文字"></el-step>
        <el-step title="客户审批" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="工作分配" description="这段就没那么长了"></el-step>
      </el-steps>
    </div>
  </div>
    <ma-select v-model="show" :properties="variable" @change="change"></ma-select>
    
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
        showDetails:false,
        active: 1,
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
            {name:'待办'},
            {name:'未完成'},
            {name:'已完成'},
            {name:'已超时'}
            
            
          ],
          2:[
            {name:'当日'},
            {name:'本周'},
            {name:'本月'}
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
        orderHistory:{}
      };
    },
    methods: {
      showPannel(i) {
        console.log(i);
        this.show = true;
        this.variable = this.properties[i];
      },
      showFlow(id){
        this.showDetails = !this.showDetails;
        console.log(id);
        this.getHistory(id);
      },
      change(obj){
        console.log(obj);
      },
      // 返回 Promise 获取工单列表
      getStatistic(params) {
        let _this = this;
        getStatistic.bind(this)(params).then(res=>{
          console.log(res);
          _this.orderList = res.data;
        })
        .catch(err=>{
          console.log(err);
        })
      },
      getHistory(id) {
        let _this = this;
        getHistory.bind(this)(id).then(res=>{
          console.log(res);
          _this.orderHistory = res;
        })
        .catch(err=>{
          console.log(err);
        })
      },
      routeTo(obj) {
        console.log(obj.id)
        this.$router.push({
          name:'order_detail',
          params: {
            _id:obj.id
          }
        })
      }
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
  }
   .van-step--horizontal .van-step__title{
    width:5.71rem;
    height: 1.5rem;
    border:1px solid #e0e7f3;
    border-radius: 1.79rem;
    display: inline-block;
    text-align: center;
    line-height: 1.5rem;
  }
  /* .van-step--horizontal.van-step--finish .van-step__circle, .van-step--horizontal.van-step--finish .van-step__line{
        border: 1px solid #eaeff7;
  }
  .van-step--horizontal .van-step__line{
    background-color: transparent;
    border: 1px dashed #eaeff7;
  }
  .van-step--horizontal .van-step__line{
    top:10px;
    z-index: -1;
  }  */
  .el-steps{
    padding:0 1rem;
  }
  .el-step__head.is-success{
    color:#8494ac;
    border-color: #8494ac;
  }
  .el-step__description.is-success,.el-step__title.is-success{
    color:#8494ac;
  }
  .el-step__title.is-process {
    font-weight: 700;
    color: #fff;
    background-color:#4a79df;
}
.el-step__icon.is-text{
  border-color: #4a79df;
  display: none;
}
.el-step__title{
  width:5.71rem;
    height: 1.9rem;
    border:1px solid #e0e7f3;
    border-radius: 1.79rem;
    display: inline-block;
    text-align: center;
    line-height: 1.7rem;
    font-size: 1rem;
}
.el-step__line{
background-color: transparent;
  border:1px dashed #eaeff7;
}
.is-success .el-step__line{
  background-color: #eaeff7;
}
.el-step__title.is-success{
  background-color:#eaeff7;
}
.el-step.is-horizontal .el-step__line{
  left: 5.71rem;
  width: 4.75rem;
}
.el-step__description.is-success,
.el-step__description.is-process,
.el-step__description.is-wait{
  color:#8494ac;
  margin-top: .5rem;
}
.el-step__title.is-wait{
  background: #fff;
}
</style>