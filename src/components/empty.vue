<template>
  <div class="empty">
    <img :src="empty" />
    <span class="text">{{ message }}</span>
  </div>
</template>

<script>
  import empty from 'assets/img/empty.png'
  export default {
    name: 'empty',
    props: {
      message: {
        type:String,
        default: '暂无数据信息，到别的地方看看吧~'
      },
      icon: {
        type:String,
        default: this.empty
      }
    },

    data() {
      return {
        empty
      };
    },
    
    methods: {
      
    }
  }

</script>
<style lang="scss">
  .empty {
    height:100%;
    display:flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    .text {
      margin-top:1rem;
      color:#cccccc;
    }
  }
</style>
