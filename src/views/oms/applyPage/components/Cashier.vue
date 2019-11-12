<template>
    <div>
        <el-form :model="cashier" ref="reasonForm" label-width="80px">
          <el-form-item label="付款方式:">
            <el-radio-group v-model="cashier.req_payment_way">
              <el-radio :label="1">POS机</el-radio>
              <el-radio :label="2">银行转账</el-radio>
              <el-radio :label="3">微信</el-radio>
              <el-radio :label="4">支付宝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="收费情况:">
            <el-radio-group v-model="cashier.req_payment_flag" @change="changePayment">
              <el-radio :label="0">未收费</el-radio>
              <el-radio :label="1">全费</el-radio>
              <el-radio :label="2">免费</el-radio>
              <el-radio :label="3">优惠</el-radio>
              <el-radio :label="4">协议/合同</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="应收金额:">
            <el-input v-model="cashier.req_price" placeholder="请输入内容" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="实收金额:">
            <el-input v-model="cashier.req_payment_price" placeholder="请输入内容" :disabled="cashier.req_payment_flag==1||cashier.req_payment_flag==2?true:false"></el-input>
          </el-form-item>
          <el-form-item label="选择合同:" v-show="cashier.req_payment_flag==4">
            <el-select v-model="cashier.ContractNo" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="(item,index) in cashier.Agreement"
                :key="index"
                :label="item.context"
                :value="item.ID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联账单:">
            <el-select v-model="cashier.clientPayNo" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="(item,index) in cashier.clientPay"
                :key="index"
                :label="item.clientPay"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input type="textarea" v-model="payData.req_payment_remark"></el-input>
          </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
   data() {
      return {
       cashier:{
          Agreement:[],   //合同选项列表
          clientPay:[],   //关联账单列表
          grp_price:'',   //先证者价格
          req_payment_way:1,    //付款方式
          req_payment_flag:0,   //收费情况
          req_price:'',   //应收金额
          req_payment_price:'',   //实收金额
          ContractNo:'',  //选择合同
          clientPayNo:'',   //关联账单
          req_payment_remark:'',  //备注
        },
        options: [],
      }
   },
   activated() {
   },
   created(){
     console.log(this.payData)
   },
   mounted(){
      this.cashier = this.payData
   },
   methods:{
     changePayment(val){
       if(val==1){
         this.cashier.req_payment_price = this.cashier.req_disconut_price
       }else if(val==2){
         this.cashier.req_payment_price = '0.00'
       }else{
         this.cashier.req_payment_price = ''
       }
       console.log(val)
     },
     showPrice(){
       console.log(this.payData)
     },
   },
   props:["payData"]
}
</script>
<style>
</style>
