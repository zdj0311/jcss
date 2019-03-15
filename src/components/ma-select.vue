<template>
  <div class="ma-select">
    <van-popup v-model="isShow" @close="close" position="top">
      <div class="properties">
        <div class="property-item" :class="active===index?'check':'uncheck'" v-for="(item,index) in arr" @click="select(item,index)">
          {{item.name}}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: 'ma-select',
    props: {
      value: Boolean,
      properties: {
        type:Array,
        default() {
          return []
        }
      },
      current: Number
    },
    
    data() {
      return {
        isShow: false,
        arr: [],
        active:''
      };
    },
    
    created() {
      this.arr = this.properties
      this.active = this.current
    },
    watch:{
      value(n) {
        this.isShow = n
      },
      properties(n) {
        this.arr = n
      },
      current(n) {
        this.active = n
      }
    },
    methods: {
      close() {
        this.$emit('input',this.isShow)
      },
      select(item,index) {
        this.active = index
        this.$emit('change',Object.assign({},item,{index:index}))
        this.isShow = false
      }
    }
  }

</script>
<style lang="scss">
  .ma-select {
    .van-overlay {
      top:3rem;
    }
    .van-popup--top {
      top:3rem;
    }
    .properties {
      display:flex;
      background:#f5f5f5;
      padding:1rem;
    }
    .property-item {
      display:flex;
      justify-content: center;
      flex:1;
      border-radius: 5px;
      background:#fff;
      margin-right:1rem;
      padding:.6rem;
    }
    .check {
      color:#fff;
      background:#4a79df;
    }
    .uncheck {
      
    }
  }
</style>
