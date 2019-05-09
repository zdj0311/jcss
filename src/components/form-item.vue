<template>
  <div class="form-item">
    <!-- input -->
    <van-field v-if="type!=='select'" :type="type" v-model="inputValue" :placeholder="placeholder" :label="label" :required="required" :readonly="readonly"
       @input="input" :error-message="errorMessage"/>
    <!-- input -->
    <!-- select -->
    <van-field v-if="type==='select'" v-model="inputValue" :placeholder="placeholder" :label="label" :required="required" readonly 
      @click="showPicker(readonly)" right-icon="arrow" :error-message="errorMessage"/>
    <van-popup v-if="type==='select'" v-model="show" class="pop-container" position="bottom">
      <van-picker :columns="columns" @change="change" show-toolbar @cancel="cancel" @confirm="confirm"/>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: 'form_item',
    props: {
      value: String,
      type: {
        type:String,
        default: 'input',
        validate: val => ['input','textarea','select','number','text','tel'].indexOf(val) > -1
      },
      placeholder:{
        type:String,
        default: '请输入'
      },
      label: String,
      required: {
        type:Boolean,
        default:false
      },
      readonly: {
        type:Boolean,
        default:false
      },
      columns:Array,
      errorMessage:String
    },
    
    data() {
      return {
        show:false,
        inputValue:''
      };
    },
    
    created() {
      
    },
    watch:{
      value(v) {
        this.inputValue = v
      }
    },
    methods: {
      showPicker(readonly) {
        if(readonly) return 
        this.show = true
      },
      change() {
        
      },
      confirm(v) {
        this.inputValue = v.text
        this.show = false
        this.$emit('confirm',v)
      },
      cancel() {
        this.show = false
      },
      input(e) {
        this.$emit('input',this.inputValue)
      }
    }
  }

</script>
<style lang="scss">
  .form-item {
    .pop-container {
      width:100%;
    }
  }
</style>
