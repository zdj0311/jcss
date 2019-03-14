<template>
    <div class='evaluation'>
        <order-form :mode="'evaluation'" v-on:update="update"></order-form>
    </div>
</template>

<script>
import {updateWorkflow}
 from 'controller/order-create'
import orderForm from 'components/order-form'
export default {
components: {orderForm},
data() {
return {

};
},
methods: {
    update(formData){
      updateWorkflow.bind(this)(formData).then(res=>{
        console.log(res)
      })
    }
},
created() {

},
mounted() {

},
}
</script>
<style lang='scss' scoped>

</style>