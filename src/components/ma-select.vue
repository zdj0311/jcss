<template>
  <div class="ma-select">
    <van-popup v-model="isShow" @close="close" position="top">
      <div class="properties">
        <div class="property-item" v-for="(item,index) in arr">
          {{item}}
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
      }
    },
    
    data() {
      return {
        isShow: false,
        arr: []
      };
    },
    
    created() {
      this.arr = this.properties
    },
    watch:{
      value(n) {
        this.isShow = n
      },
      properties(n) {
        this.arr = n
      }
    },
    methods: {
      close() {
        this.$emit('input',this.isShow)
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
  }
</style>
