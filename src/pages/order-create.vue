<template>
  <div class="order-create">
    <order-form
      :existList="existList"
      :readonlyList="readonlyList"
      :pickerList="pickerList"
      :modeView="'create'"
      :required="required"
      v-on:insest="insest"
    ></order-form>
  </div>
</template>

<script>
import { saveWorkflow } from "controller/order-create";
import orderForm from "components/order-form";
import {Dialog} from 'vant';
export default {
  components: { orderForm },
  data() {
    return {
      existList: [12, 13, 14, 15, 16],
      readonlyList: [0, 1, 2],
      pickerList: [3, 4, 5, 6, 9, 10, 11, 12],
      required: [3,4,7,8]
    };
  },
  methods: {
    insest(formData) {
      saveWorkflow
        .bind(this)(formData)
        .then(res => {
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
        }).catch(res=>{
          Dialog.alert({
            message: res.message
          })
        });
    }
  },
  mounted() {}
};
</script>
<style lang='scss'>
</style>