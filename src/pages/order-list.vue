<template>
  <div class='order-list'>
  <div class="menus">
    <div class="menu-item" v-for="(item,index) in menus" @click="showPannel(index)">
      <span>{{ item.text }}</span><img :src="sele"/>
    </div>
  </div>
  <div class="content">
    <header>
      <span class="statu">待处理</span>
      <h2>交通厅-打印机故障</h2>
    </header>
    <div class="body">
      <div>
        <span>创建时间</span>
        <time>2019.1.1</time>
      </div>
      <div>
        <div></div>
        <div>
          <span>查看</span>
          <span>处理</span>
        </div>
      </div>
    </div>
  </div>
    <ma-select v-model="show" :properties="properties"></ma-select>
  </div>
</template>

<script>
  import maSelect from 'components/ma-select'
  import sele from 'assets/img/sele.png'
  export default {
    name:'order_list',
    components: { maSelect },
    data() {
      return {
        sele,
        menus:[{
          text:'我的'
        },{
          text:'状态'
        },{
          text:'时间'
        }],
        order_list:[],
        show:false,
        properties:['全部','我的','代办']
      };
    },
    methods: {
      showPannel(i) {
        console.log(i)
        this.show = true
      }
    },
    created() {

    },
    mounted() {

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
    }
  }
</style>