<template>
    <div class="vMain">
        <div class="mMechanism">
          <el-divider content-position="left">样本进度</el-divider>
          <el-form ref="mechanismForm" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="申请时间:">
                  <el-input v-model="reqList.req_date" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="接收时间:">
                  <el-input v-model="reqList.ReceiveTime" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="签收时间:">
                  <el-input v-model="reqList.SignTime" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数据处理:">
                  <el-input v-model="reqList.DataProcessFinalTime" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报告完成:">
                  <el-input v-model="reqList.FinalReportTime" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预计完成:">
                  <el-input v-model="reqList.RepData" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </div>
        <div class="mMechanism">
          <el-divider content-position="left">付费信息</el-divider>
          <el-form ref="mechanismForm" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="付费情况:">
                  <el-input v-model="reqList.PaymentStatus" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="付费方式:">
                  <el-input v-model="reqList.PaymentWayStatus" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="应收金额:">
                  <el-input v-model="reqList.req_price" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实收金额:">
                  <el-input v-model="reqList.req_payment_price" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收费备注:">
                  <el-input v-model="reqList.req_payment_remark" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </div>
        <div class="mMechanism">
          <el-divider content-position="left">机构信息</el-divider>
          <el-form ref="mechanismForm" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="开单机构:">
                  <el-input v-model="reqList.org_name" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="科室:">
                  <el-input v-model="reqList.req_depart_name" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="医生:">
                  <el-input v-model="reqList.req_doc_name" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="医生电话:">
                  <el-input v-model="reqList.req_doc_phone" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实验室:">
                  <el-input v-model="shiyanshi" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="mMechanism">
          <el-divider content-position="left">患者信息</el-divider>
          <el-form ref="mechanismForm" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名:">
                  <el-input v-model="reqList.pat_name" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别:">
                  <el-input v-model="reqList.PatSex_Display" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年龄:">
                  <el-input v-model="reqList.pat_age_dec" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证:">
                  <el-input v-model="reqList.pat_IDcard" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系电话:">
                  <el-input v-model="reqList.pat_phone" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出生日期:">
                  <el-input v-model="reqList.pat_birthday" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="顾客编号:">
                  <el-input v-model="reqList.req_pat_id" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="家庭号:">
                  <el-input v-model="reqList.pat_familyno" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="就诊号:">
                  <el-input v-model="reqList.req_mr_num" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="家庭住址:" class="w-100">
                  <el-input v-model="reqList.pat_address" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="临床症状:" class="w-100">
                  <el-input v-model="reqList.req_diag_info" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注:" class="w-100">
                  <el-input v-model="reqList.req_remark" readonly="readonly"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="附件:" class="w-100">
                  <upLoad ref="upLoadChild" :guid="guid"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 位点表格 -->
        <div class="mPatient" v-if="siteData!=''">
          <el-divider content-position="left">位点信息</el-divider>
          <div>
              <SiteTable :siteData="siteData" siteDisabled="true"></SiteTable>
          </div>
        </div>
        <!-- 位点表格 end -->

        <div class="mMechanism">
          <el-divider content-position="left">项目选择</el-divider>
          <div>
            <el-table
              :data="itemResult"
              stripe
              >
              <el-table-column
                label="条码"
                fixed
                prop="bar_serial_num"
                width="100px"
                >
              </el-table-column>
              <el-table-column
                label="采样日期"
                prop="bar_sampling_time"
                width="100px"
                >
              </el-table-column>
              <el-table-column
                prop="grp_name"
                label="项目"
                width="200px"
                >
              </el-table-column>
              <el-table-column
                prop="pat_family_relation"
                label="对象">
                  <template slot-scope="scope">
                      <span v-if="scope.row.pat_family_relation == '0'" style="color:#f22346">先证者</span>
                      <span v-if="scope.row.pat_family_relation == '1'" style="color:#3e9af2">父</span>
                      <span v-if="scope.row.pat_family_relation == '2'" style="color:#3e9af2">母</span>
                      <span v-if="scope.row.pat_family_relation == '3'" style="color:#3e9af2">夫</span>
                      <span v-if="scope.row.pat_family_relation == '4'" style="color:#3e9af2">妻</span>
                  </template>
              </el-table-column>
              <el-table-column
                prop="req_born_flag"
                label="类型">
                  <template slot-scope="scope">
                      <span v-if="scope.row.req_born_flag == '0'" style="color:#f22346">产前</span>
                      <span v-if="scope.row.req_born_flag == '1'" style="color:#4df268">产后</span>
                  </template>
              </el-table-column>
              <el-table-column
                prop="grp_price"
                label="价格">
              </el-table-column>
              <el-table-column
                prop="grp_custom_price"
                label="定制价格">
              </el-table-column>
              <el-table-column
                prop="paymen_price"
                label="实收">
              </el-table-column>
              <el-table-column
                prop="spec_name"
                label="标本">
              </el-table-column>
              <el-table-column
                prop="bar_con_num"
                label="数量">
              </el-table-column>
              <el-table-column
                prop="grp_index_num"
                label="主项目数">
              </el-table-column>
              <el-table-column
                prop="grp_custom_num"
                label="定制项目数">
              </el-table-column>
              <el-table-column
                prop="bar_item_goal"
                label="送检目的"
                width="250px"
                >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.bar_item_goal" placeholder="请选择">
                      <el-option label="A.怀疑送检者是遗传病患者，明确诊断" value="0"></el-option>
                      <el-option label="B.送检者不一定是遗传病，排除遗传因素" value="1"></el-option>
                      <el-option label="C.携带者筛查" value="2"></el-option>
                      <el-option label="D.送检者亲属被怀疑为遗传病患者" value="3"></el-option>
                    </el-select>
                  </template>
              </el-table-column>
              <el-table-column
                prop="req_file_id"
                label="附件">
              </el-table-column>
              <!-- <el-table-column
                fixed="right"
                width="120"
                label="操作">
                  <template slot-scope="scope">
                      <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, projectForm.repTable)">删除</el-button>
                      <el-button type="text" size="small">选中附件</el-button>
                  </template>
              </el-table-column> -->
            </el-table>
          </div>
          <div style="margin-top:15px;">
            <el-form label-width="100px">
              <el-row>
                <el-col :span="12">
                    <el-form-item label="项目数:">
                      <el-input v-model="editChir.XiangMuShu" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="样本数:">
                      <el-input v-model="editChir.sampleNum" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="总价:">
                      <el-input v-model="editChir.ZongJiaGe" disabled></el-input>
                    </el-form-item>
                  </el-col>
                <el-col :span="12">
                    <el-form-item label="是否暂存:">
                      <el-radio-group v-model="reqList.req_save">
                        <el-radio :label="1" disabled >是</el-radio>
                        <el-radio :label="0" disabled >否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <!-- 交付信息 -->
        <div class="mDeliver">
          <el-divider content-position="left">交付信息</el-divider>
          <div>
            <el-tabs>
              <el-tab-pane label="报告交付">
                <el-card v-for="(item,index) in LmSendList" :key="index"  class="box-card" style="margin-bottom:20px;">
                  <div class="item">
                    <el-form label-width="100px">
                      <el-row>
                        <el-col :span="8">
                          <el-form-item class="start" label="收件人:" prop="LmUser">
                            <el-input v-model="item.LmUser" placeholder="收件人" readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item class="start" label="收件电话:" prop="LmPhone">
                            <el-input v-model="item.LmPhone" placeholder="收件电话" readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item class="start" label="快递地址:" prop="LmAddress">
                            <el-input v-model="item.LmAddress" placeholder="快递地址" readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item class="start" label="E-mail:">
                            <el-input v-model="item.LmEmail" placeholder="E-mail" readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="发票抬头:" prop="LmInvoice">
                            <el-input v-model="item.LmInvoice" placeholder="发票抬头" readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="物流单号:">
                            <el-input v-model="item.LmNumber" placeholder="物流单号" readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="物流公司:">
                            <el-input v-model="item.LmCompany" placeholder="物流公司" readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="index==0">
                          <el-form-item label="寄送发票:">
                            <el-radio-group v-model="req_note">
                              <el-radio label="1">是</el-radio>
                              <el-radio label="0">否</el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="样本交付">
                <el-card class="box-card" style="margin-bottom:20px;">
                  <div class="item">
                    <el-form ref="deliverForm.sample" :model="deliverForm" label-width="80px">
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="寄件人:">
                            <el-input v-model="deliverForm.LmUserReceive" placeholder="寄件人"  readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="寄件电话:">
                            <el-input v-model="deliverForm.LmPhoneReceive" placeholder="寄件电话"  readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="寄件地址:">
                            <el-input v-model="deliverForm.LmAddressReceive" placeholder="寄件地址"  readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="物流单号:">
                            <el-input v-model="deliverForm.LmNumberReceive" placeholder="物流单号"  readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="物流公司:">
                            <el-input v-model="deliverForm.LmCompanyReceive" placeholder="物流公司"  readonly="readonly"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- 交付信息end -->

        <div class="mMechanism">
          <el-divider content-position="left">样本日志</el-divider>
          <el-table
            :data="sampleDetail"
            border
            stripe
            style="width: 100%">
            <el-table-column
              prop="LogDes"
              label="节点">
            </el-table-column>
            <el-table-column
              prop="log_bar_sn"
              label="项目">
            </el-table-column>
            <el-table-column
              prop="log_user_name"
              label="操作人">
            </el-table-column>
            <el-table-column
              prop="log_remark"
              label="详情"
              width="700px"
              >
            </el-table-column>
            <el-table-column
              prop="log_date"
              label="操作时间">
            </el-table-column>
          </el-table>
        </div>
    </div>
</template>
<script>
import upLoad from './components/upLoad'
import SiteTable from './components/siteTable'
export default {
   data() {
      return {
        reqList:[],
        guid:'',
        itemResult:[],
        LmSendList:[{
          LmUser:'',
          LmPhone:'',
          LmAddress:'',
          LmEmail:'',
          LmInvoice:'',
          LmNumber:'',
          LmCompany:'',
        }],
        req_note:'',
        shiyanshi:'广州总部',
        deliverForm:{
          LmUserReceive:'',
          LmPhoneReceive:'',
          LmAddressReceive:'',
          LmNumberReceive:'',
          LmCompanyReceive:'',
        },     //样本信息
        editChir:{
          XiangMuShu:'',
          sampleNum:'',
          ZongJiaGe:'',
        },
        sampleDetail:[],
        siteData:[],
      }
   },
   activated() {
   },
   created(){
     this.initView()
     this.getstatus()
     console.log(this.req_code)
   },
   methods:{
     //加载详情数据
     initView(){
       var _this = this
       this.$axios.get(this.$path.getformCode1+'?req_code='+this.req_code)
       .then(res=>{
         var data = eval(res.data)
         console.log(data.code)
         if(data.code == '1004'){
           this.$message({ message: data.result.msg, type: 'warning' });
           return false
         }
         var data = eval(res.data)
         let itemResult = data.result.itemResult
         let bar_id = itemResult[0].bar_sn
         _this.reqList = data.result.reqList[0]
         _this.guid = data.result.reqList[0].req_file_id
         _this.itemResult = data.result.itemResult
         _this.editChir.XiangMuShu = itemResult.length
         _this.editChir.sampleNum = itemResult.length
         var sumPrice = 0;
         itemResult.forEach((item,index)=>{
            // _this.payData.grp_price += parseFloat(item.grp_price)
            sumPrice +=(item.grp_price*item.grp_index_num)+(item.grp_custom_price*item.grp_custom_num)
         })
         _this.editChir.ZongJiaGe = sumPrice
         if(JSON.parse(data.result.reqList[0].LmSendList)!='')  _this.LmSendList = JSON.parse(data.result.reqList[0].LmSendList)
         _this.req_note = JSON.stringify(data.result.reqList[0].req_note)
         _this.deliverForm.LmUserReceive = data.result.reqList[0].LmUserReceive
         _this.deliverForm.LmPhoneReceive = data.result.reqList[0].LmPhoneReceive
         _this.deliverForm.LmAddressReceive = data.result.reqList[0].LmAddressReceive
         _this.deliverForm.LmNumberReceive = data.result.reqList[0].LmNumberReceive
         _this.deliverForm.LmCompanyReceive = data.result.reqList[0].LmCompanyReceive
         _this.siteData = JSON.parse(data.result[bar_id][0].position)
         if(_this.guid=='' || _this.guid==null){
            console.log('获取文件ID为空')
            this.$refs.upLoadChild.initFile()
          }else{
            console.log('获取文件ID')
            this.$refs.upLoadChild.GetFileByGuid(_this.guid)
          }

       })
       .catch(err=>{
         console.log(err)
       })
     },
     //获取样本日志列表
     getstatus(){
       var _this = this
       this.$axios.get(this.$path.getstatus+'?SearchField={"log_req_code":'+this.req_code+',"log_bar_sn":"","log_sam_id":"","log_pat_id":""}')
       .then(res=>{
         console.log(res)
         _this.sampleDetail = res.data
       })
       .catch(err=>{

       })
     },
   },
   components:{
     upLoad,
     SiteTable
   },
   props:['req_code']
}
</script>
<style lang="scss">
  .vMain{
    max-height: 600px;
    overflow-y: auto;
    .w-100{
      .el-form-item__content{
        width: 90%;
      }
    }
    .file-caption-main{
      display: none;
    }
  }

</style>

