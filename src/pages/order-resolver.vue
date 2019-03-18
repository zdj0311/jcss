<template>
    <div class="order-resolver">
      <order-form :existList="existList" :readonlyList="readonlyList" :modeView="'edit'" v-on:update="update"></order-form>
    </div>
</template>

<script>
import {updateWorkflow}
 from 'controller/order-create'
import orderForm from 'components/order-form'
import {Dialog} from 'vant';
export default {
  components: {orderForm},
  data() {
    return {
        existList:[2],
        readonlyList:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    };
  },
  methods: {
    update(formData){
      updateWorkflow.bind(this)(formData).then(res=>{
        if(res=='success'){
          Dialog.alert({
            message: "提交成功"
          }).then(() => {
            this.$router.push({name:'order_list',params:{
            _type:'Week',
            _mode:'TODO'
          }})
          });
        }
      })
    }
  },
  created(){  
    console.log(this.$route.params.id)
  },
  mounted() {
  }
};
</script>
<style lang='scss'>
</style>