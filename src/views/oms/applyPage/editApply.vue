<template>
    <div class="mMain editMain" v-loading="loading">
        <!-- 顶部按钮区域 -->
        <div class="mHeader clearfix">
          <!-- <div class="h_left fLeft">
            <a href="javascript:;">我的申请单</a>
             |
            <a href="javascript:;">新增申请单</a>
          </div> -->
          <div class="h_right" style="padding:15px">
            <el-button type="success" size="small" @click="backApply">我的申请单</el-button>
            <el-button type="primary" size="small" @click="dialogVisible=!dialogVisible">家系查询</el-button>
            <el-button type="primary" size="small" @click="dialogVisible2=!dialogVisible2">位点录入</el-button>
            <el-button type="primary" size="small" @click="showPay">收银台</el-button>
          </div>
        </div>
        <!-- 机构信息 -->
        <div class="mMechanism">
          <el-divider content-position="left">机构信息</el-divider>
          <el-form ref="mechanismForm" :model="mechanismForm" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item class="start" label="开单机构:" prop="req_org_id">
                  <el-select @change='itemini(1)' :disabled="req_submit_flag" class="w100" v-model="mechanismForm.req_org_id" filterable placeholder="请选择开单机构">
                    <el-option :label="item.org_name" :value="item.org_id+''" v-for="(item,index) in mechanismForm.req_org_select" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="start" label="科室:" prop="req_org_dept">
                  <el-select @change='itemini(1)' :disabled="req_submit_flag" class="w100" v-model="mechanismForm.req_org_dept" filterable placeholder="请选择科室">
                    <el-option :label="item.part_name" :value="item.part_id" v-for="(item,index) in mechanismForm.req_dept_select" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="start" label="医生:" prop="req_doc_name">
                  <el-input :disabled="req_submit_flag" placeholder="请输入内容" v-model="mechanismForm.req_doc_name" class="input-with-select">
                    <el-select :disabled="req_submit_flag" v-model="mechanismForm.req_doc_name_select" slot="append" placeholder="请选择医生">
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="医生电话:">
                  <el-input :disabled="req_submit_flag" v-model="mechanismForm.req_doc_phone" placeholder="医生电话"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实验室:">
                  <el-select :disabled="req_submit_flag" class="w100" v-model="mechanismForm.req_dest_labid" placeholder="请选择实验室">
                    <el-option label="广州总部" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 机构信息end -->

        <!-- 患者信息 -->
        <div class="mPatient">
          <el-divider content-position="left">患者信息</el-divider>
          <el-form ref="patientForm" :model="patientForm" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item class="start" label="姓名:" prop="pat_name">
                  <el-input  :disabled="req_submit_flag" @change="changeName(0,patientForm.pat_name)" v-model="patientForm.pat_name" placeholder="姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="start" label="性别:" prop="pat_sex">
                  <el-radio-group v-model="patientForm.pat_sex" :disabled="req_submit_flag">
                    <el-radio label="0">未知</el-radio>
                    <el-radio label="1">男</el-radio>
                    <el-radio label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="start" label="年龄:" prop="pat_age_dec">
                  <el-input :disabled="req_submit_flag" v-model="patientForm.pat_age_dec" placeholder="例：1岁"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出生日期:">
                  <el-date-picker  :disabled="req_submit_flag"
                    size="large"
                    value-format="yyyy-MM-dd"
                    v-model="patientForm.pat_birthday"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证:">
                  <el-input :disabled="req_submit_flag" v-model="patientForm.pat_IDcard" placeholder="身份证"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="start" label="联系电话:" prop="pat_phone">
                  <el-input :disabled="req_submit_flag" @change="changeName(1,patientForm.pat_phone)" v-model="patientForm.pat_phone" placeholder="联系电话"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="顾客编号:">
                  <el-input v-model="patientForm.req_pat_id" placeholder="顾客编号" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="家庭号:">
                  <el-input v-model="patientForm.pat_familyno" placeholder="家庭号" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="就诊号:">
                  <el-input :disabled="req_submit_flag" v-model="patientForm.req_mr_num" placeholder="就诊号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="家庭住址:">
                  <el-input type="textarea" @change="changeName(2,patientForm.pat_address)" v-model="patientForm.pat_address" placeholder="家庭住址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item class="start" label="临床症状:">
                  <el-input type="textarea" v-model="patientForm.req_diag_info" placeholder="请输入临床医生主观判断的结论和客观证据，具体的症状以及相关检查结果。例如：“精神发育迟缓”需补充发病年龄、持续时间、智力测评的分数、具体的症状等。“癫痫”或“抽搐”需补充发作次数，发作年龄等"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注:">
                  <el-input type="textarea" v-model="patientForm.req_remark" placeholder="请输入补充说明，如家系标本未同时送检说明，产后单据送产前标本（羊水、脐血、绒毛）说明等"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item class="start" label="上传附件:">
                  <!-- 上传附件组件 -->
                  <upLoad ref="upLoadChild" />
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </div>
        <!-- 患者信息 end-->

        <!-- 位点表格 -->
        <div class="mPatient" v-if="siteData!=''">
          <el-divider content-position="left">位点信息</el-divider>
          <div>
              <SiteTable ref="siteTableChild" :siteDisabled="siteDisabled" :siteData="siteData"></SiteTable>
          </div>
        </div>
        <!-- 位点表格 end -->

        <!-- 项目信息 -->
        <div class="mProject">
          <el-divider content-position="left">项目信息</el-divider>
          <el-row>
            <el-form ref="projectForm" :model="projectForm" label-width="100px">
              <el-col :span="5">
                <el-form-item label="是否暂存:">
                  <el-radio-group v-model="projectForm.req_save">
                    <el-radio label="0">否</el-radio>
                    <el-radio label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="项目类型:">
                  <el-radio-group v-model="projectForm.req_born_flag" :disabled="req_submit_flag || projectForm.repTable.length>0">
                    <el-radio label="0">产前</el-radio>
                    <el-radio label="1">产后</el-radio>
                  </el-radio-group>
                  <el-select v-model="projectForm.req_type"  :disabled="req_submit_flag">
                    <el-option label="临床检测" value="0"></el-option>
                    <el-option label="研发项目" value="1"></el-option>
                    <el-option label="健康检测" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="项目名称:">
                  <el-select :disabled="req_submit_flag" v-model="projectForm.itemName" filterable placeholder="项目名称">
                    <el-option v-for="(item,index) in projectForm.itemNameSelect" :key="index" :label="item.grp_name" :value="item.grp_id"></el-option>
                  </el-select>
                  <el-button :disabled="req_submit_flag" type="primary" @click="addProject" size="small" v-if="showAddPro">添 加</el-button>
                  <el-button :disabled="req_submit_flag" type="primary" @click="clearProject" size="small" v-if="showAddPro">清 空</el-button>
                </el-form-item>
              </el-col>
            </el-form>
            <!-- 已选项目表格 -->
            <p class="repTitle">已选项目</p>
            <el-col :span="24">
              <el-table
                :data="projectForm.repTable"
                stripe
                >
                <el-table-column
                  label="条码"
                  fixed
                  prop="bar_serial_num"
                  width="180">
                    <template slot-scope="scope">
                        <el-input @change="checkCode(scope.row.bar_serial_num)" v-model="scope.row.bar_serial_num" placeholder="请输入条码"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                  label="采样日期"
                  prop="bar_sampling_time"
                  width="180">
                    <template slot-scope="scope">
                        <el-date-picker
                          size="large"
                          v-model="scope.row.bar_sampling_time"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="grp_name"
                  label="项目">
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
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.paymen_price" placeholder="请输入实收金额"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="spec_id"
                  label="标本">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.spec_id" placeholder="请选择">
                          <el-option v-for="(item,index) in projectForm.selSample" :key="index" :label="item.sp_name" :value="item.sp_id"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="bar_con_num"
                  label="数量">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.bar_con_num" placeholder="">
                        <el-option :label="index" :value="index" v-for="index of 10" :key='index'></el-option>
                      </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="grp_index_num"
                  label="主项目数">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.grp_index_num" placeholder="">
                        <el-option :label="index" :value="index" v-for="index of 10" :key='index'></el-option>
                      </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="grp_custom_num"
                  label="定制项目数">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.grp_custom_num" placeholder="">
                        <el-option label="0" value="0"></el-option>
                        <el-option :label="index" :value="index" v-for="index of 10" :key='index'></el-option>
                      </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="bar_item_goal"
                  label="送检目的">
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
                <el-table-column
                  fixed="right"
                  width="120"
                  label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="showAddPro" type="text" size="small" @click.native.prevent="deleteRow(scope.$index, projectForm.repTable)">删除</el-button>
                        <el-button type="text" size="small">选中附件</el-button>
                    </template>
                </el-table-column>
              </el-table>
            </el-col>

          </el-row>
            <!-- 已选项目表格end -->
          <div style="margin-top:20px;" v-if="editChirld">
            <el-row>
              <el-form v-model="editChir" label-width="100px">
                <el-col :span="12">
                  <el-form-item label="项目数:">
                    <el-input v-model="editChir.XiangMuShu" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="样本数:">
                    <el-input v-model="editChir.sampleNum" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="总价:">
                    <el-input v-model="editChir.ZongJiaGe" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </div>

        </div>
        <!-- 项目信息 end-->

        <!-- 交付信息 -->
        <div class="mDeliver">
          <el-divider content-position="left">交付信息</el-divider>
          <div>
            <el-tabs>
              <el-tab-pane label="报告交付">
                <el-card v-for="(item,index) in deliverForm.report" :key="index"  class="box-card" style="margin-bottom:20px;">
                  <div style="margin-bottom:10px;text-align: right;">
                    <el-button type="primary" size="mini" @click="addRep" v-if="index==0">添加</el-button>
                    <el-button size="mini" @click="delRep(index)" v-else>删除</el-button>
                  </div>
                  <div class="item">
                    <el-form ref="deliverForm.report[0]" :model="deliverForm.report[0]" label-width="100px">
                      <el-row>
                        <el-col :span="6">
                          <el-form-item class="start" label="收件人:" prop="LmUser">
                            <el-input v-model="item.LmUser" placeholder="收件人"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item class="start" label="收件电话:" prop="LmPhone">
                            <el-input v-model="item.LmPhone" placeholder="收件电话"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item class="start" label="快递地址:" prop="LmAddress">
                            <el-input v-model="item.LmAddress" placeholder="快递地址"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item class="start" label="E-mail:">
                            <el-input v-model="item.LmEmail" placeholder="E-mail"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="发票抬头:" prop="LmInvoice">
                            <el-input v-model="item.LmInvoice" placeholder="发票抬头"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="物流单号:">
                            <el-input readonly="readonly" v-model="item.LmNumber" placeholder="物流单号"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="物流公司:">
                            <el-input readonly="readonly" v-model="item.LmCompany" placeholder="物流公司"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="index==0">
                          <el-form-item label="寄送发票:">
                            <el-radio v-model="req_note" label="1">是</el-radio>
                            <el-radio v-model="req_note" label="0">否</el-radio>
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
                    <el-form ref="deliverForm.sample" :model="deliverForm.sample" label-width="80px">
                      <el-row>
                        <el-col :span="6">
                          <el-form-item label="寄件人:">
                            <el-input v-model="deliverForm.sample.LmUserReceive" placeholder="寄件人"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="寄件电话:">
                            <el-input v-model="deliverForm.sample.LmPhoneReceive" placeholder="寄件电话"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="寄件地址:">
                            <el-input v-model="deliverForm.sample.LmAddressReceive" placeholder="寄件地址"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="物流单号:">
                            <el-input v-model="deliverForm.sample.LmNumberReceive" placeholder="物流单号"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="物流公司:">
                            <el-input v-model="deliverForm.sample.LmCompanyReceive" placeholder="物流公司"></el-input>
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

        <!-- 家系查询 -->
        <el-dialog
          title="家系查询"
          :visible.sync="dialogVisible"
          :close-on-click-modal='false'
          :close-on-press-escape='false'
          width="60%"
          top="4vh"
          >
          <Pedigree v-if="dialogVisible" ref="patRelationChild" :patRelation="patRelation"></Pedigree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="patRelationSumbie">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 家系查询 end -->
        <!-- 位点信息 -->
        <el-dialog
          title="位点录入"
          :visible.sync="dialogVisible2"
          :close-on-click-modal='false'
          :close-on-press-escape='false'
          width="60%"
          top="4vh"
          >
          <siteEdit ref="siteEditChild" v-if="dialogVisible2"></siteEdit>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="siteEditSumbit">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 位点信息 end -->
        <!-- 付款信息 -->
        <el-dialog
          title="付款信息"
          :visible.sync="dialogVisible3"
          :close-on-click-modal='false'
          :close-on-press-escape='false'
          width="50%"
          top="3vh"
          >
          <Cashier ref="cashierChild" :payData="payData" v-if="dialogVisible3"></Cashier>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="payDataBtn">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 付款信息 end -->
        <div style=" text-align: center;">
            <el-button type="primary" style="width:200px;" class="sumbitAll" @click="submitForm()">提 交</el-button>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
import upLoad from './components/upLoad'
import SiteTable from './components/siteTable'
import Pedigree from './components/Pedigree'
import siteEdit from './components/siteEdit'
import Cashier from './components/Cashier'
//import {itemini} from '@/api/editApply'
export default {
   data() {
      return {
        dialogVisible:false,    //家系查询弹窗
        dialogVisible2:false,   //位点录入弹窗
        dialogVisible3:false,   //付款信息弹窗
        req_submit_flag:false,      //是否已完成状态
        showAddPro:true,
        loading:false,    //加载
        editChirld:false,
        req_note:'0',
        editRun:'',
        editChir:{
          XiangMuShu:'',
          sampleNum:'',
          ZongJiaGe:'',
        },
        mechanismForm: {    //机构信息
          req_org_id: '',
          req_org_select:[],  //开单机构列表
          req_org_dept: '',
          req_dept_select:[],  //科室列表
          req_doc_name: '',
          req_doc_name_select: '',
          req_doc_phone: '',
          req_dest_labid: '1'
        },
        patientForm:{       //患者信息
          pat_name: '',
          pat_sex: '',
          pat_age_dec: '',
          pat_birthday: '',
          pat_IDcard: '',
          pat_phone: '',
          req_pat_id: '',
          pat_familyno: '',
          req_mr_num: '',
          pat_address: '',
          req_diag_info: '',
          req_remark: '',
        },
        projectForm:{       //项目信息
          req_save:'0',
          req_born_flag:'1',
          req_type:'0',
          itemName:'',
          itemNameSelect:[],
          selSample:[],
          repTable:[],      //添加项目表格
        },
        deliverForm:{       //交付信息
          report:[          //报告交付
            {
              LmId:'0',
              LmNumber:'',
              LmUser:'',
              LmPhone:'',
              LmCompany:'',
              LmAddress:'',
              LmInvoice:'',
              LmEmail:'',
            }
          ],
          sample:{          //样本交付
              LmUserReceive:'',
              LmPhoneReceive:'',
              LmAddressReceive:'',
              LmNumberReceive:'',
              LmCompanyReceive:'',
          }
        },
        siteData:[],    //位點表格數據
        patRelation:[], //先证者关系
        patient:[],     //先证者获取全部数据
        status:'',      //与先证者关系
        bar_sn:'',
        payData:{
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
        cashier:[],         //收银台数据
        siteDisabled:false,
        guid:'',    //获取上传文件ID
      }
   },
   activated() {
   },
   //页面加载请求
   mounted(){
      if(this.data=='1'){
        this.$nextTick(()=>{
          // var sider = document.getElementsByClassName("scroll-container")
          // var navbar = document.getElementsByClassName("navbar")
          var main = document.getElementsByClassName("main-container")
          var h_right = document.getElementsByClassName("h_right")
          var max_height = document.getElementsByClassName("mMain")
          var sumbitAll = document.getElementsByClassName("sumbitAll")
          // sider[0].style.display="none"
          // navbar[0].style.display="none"
          h_right[0].style.display="none"
          sumbitAll[0].style.display="none"
          // main[0].style.marginLeft="0"
          max_height[0].style.maxHeight='600px'
          max_height[0].style.overflowY='auto'

        })
      }else{
        this.$refs.upLoadChild.initFile()
      }
      this.itemini()
   },
   methods:{
      //初数化数据
      itemini(type){
        if(type){
          var url = this.$path.itemini + '?org_id='+this.mechanismForm.req_org_id+'&part_id='+this.mechanismForm.req_org_dept
        }else{
          var url = this.$path.itemini
        }
        this.$axios.get(url)
        .then(res=>{
           var data = eval(res.data).result
          // if(type){
          //   this.projectForm.itemNameSelect = data.grpItem    //项目
          //   this.projectForm.itemName = ''
          // }else{
            this.projectForm.itemNameSelect = data.grpItem    //项目
            this.projectForm.itemName = ''
            this.mechanismForm.req_org_select = data.orgItem  //机构
            this.mechanismForm.req_dept_select = data.part    //科室
            this.projectForm.selSample = data.spec      //项目标本
            this.patRelation = data.patRelation     //先证者关系
            this.Agreement = data.Agreement     //合同选项列表
            this.clientPay = data.clientPay     //关联账单列表
          // }

        })
        .catch(err=>{
          console.log(err)
        })
      },
      //添加报告交付信息
      addRep(){
        let obj = {
          LmId:'0',
          LmNumber:'',
          LmUser:'',
          LmPhone:'',
          LmCompany:'',
          LmAddress:'',
          LmInvoice:'',
          LmEmail:'',
        }
        this.deliverForm.report.push(obj)
      },
      //删除添加的项目
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      //删除报告交付信息
      delRep(index){
        this.deliverForm.report.splice(index, 1)
      },
      //提交表单信息
      submitForm(code,payData){
        var _this = this
        var fileData = this.$refs.upLoadChild.uploadFileId
        var type = 1
        if(this.mechanismForm.req_org_id==''){
          this.$message({ message: '请先选择开单机构!', type: 'warning' });
          return false
        }
        if(this.mechanismForm.req_org_dept==''){
          this.$message({ message: '请先选择科室!', type: 'warning' });
          return false
        }
        if(this.mechanismForm.req_doc_name==''){
          this.$message({ message: '请先选择医生!', type: 'warning' });
          return false
        }
        if(this.patientForm.pat_name==''){
          this.$message({ message: '请先输入患者姓名!', type: 'warning' });
          return false
        }
        if(this.patientForm.pat_sex==''){
          this.$message({ message: '请先选择患者性别!', type: 'warning' });
          return false
        }
        if(this.patientForm.pat_age_dec==''){
          this.$message({ message: '请输入患者年龄!', type: 'warning' });
          return false
        }
        if(this.patientForm.pat_phone==''){
          this.$message({ message: '请输入患者联系电话!', type: 'warning' });
          return false
        }
        if(this.patientForm.req_diag_info==''){
          this.$message({ message: '请填写临床症状，若无临床症状请填写“ 患者无症状”！', type: 'warning' });
          return false
        }
        if(this.projectForm.repTable == ''){
          this.$message({ message: '请先添加项目!', type: 'warning' });
          return false
        }else{
          this.projectForm.repTable.every((item,index)=>{
            if(item.bar_serial_num=='' || item.bar_serial_num==null){
              this.$message({ message: '请填写项目条码!', type: 'warning' });
              type = 2
              return false
            }
            if(item.paymen_price=='' || item.paymen_price==null){
              this.$message({ message: '请填写实收价格!', type: 'warning' });
              type = 2
              return false
            }
            if(item.spec_id===''){
              this.$message({ message: '请选择项目标本!', type: 'warning' });
              type = 2
              return false
            }
            if(item.bar_item_goal=='' || item.bar_item_goal==null){
              this.$message({ message: '请现在送检目的!', type: 'warning' });
              type = 2
              return false
            }
          })
        }

        //交付信息校验
        this.deliverForm.report.forEach(item=>{
          if(item.LmUser=='' || item.LmUser==null){
            this.$message({ message: '请填写收件人姓名!', type: 'warning' });
            type = 2
            return false
          }
          if(item.LmPhone=='' || item.LmPhone==null){
            this.$message({ message: '请填写收件人电话!', type: 'warning' });
            type = 2
            return false
          }
          if((item.LmAddress=='' || item.LmAddress==null)&&(item.LmEmail=='' || item.LmEmail==null)){
            this.$message({ message: '快递地址和E-mail请至少填写一个!', type: 'warning' });
            type = 2
            return false
          }
        });
        if(type == 2){
          return false
        }


        if(code){
          var proData = qs.stringify({
            req_code: code,
            pat_tag: (_this.status=='0'?'':_this.bar_sn),
            req_org_id: _this.mechanismForm.req_org_id,
            req_org_dept: _this.mechanismForm.req_org_dept,
            req_doc_name: _this.mechanismForm.req_doc_name,
            req_doc_phone: _this.mechanismForm.req_doc_phone,
            req_dest_labid: _this.mechanismForm.req_dest_labid,
            pat_name: _this.patientForm.pat_name,
            pat_sex: _this.patientForm.pat_sex,
            pat_age_dec: _this.patientForm.pat_age_dec,
            pat_birthday: _this.patientForm.pat_birthday,
            pat_IDcard: _this.patientForm.pat_IDcard,
            pat_phone: _this.patientForm.pat_phone,
            req_pat_id: _this.patientForm.req_pat_id,
            pat_familyno: _this.patientForm.pat_familyno,
            pat_family_relation: _this.status,
            req_mr_num: _this.patientForm.req_mr_num,
            pat_address: _this.patientForm.pat_address,
            req_diag_info: _this.patientForm.req_diag_info,
            req_remark: _this.patientForm.req_remark,
            req_save: _this.projectForm.req_save,
            req_born_flag: _this.projectForm.req_born_flag,
            req_type: _this.projectForm.req_type,
            itemName: _this.projectForm.itemName,
            LmUserSend: '',
            LmPhoneSend: '',
            LmAddressSend: '',
            LmInvoiceSend: '',
            LmEmailSend: '',
            LmNumberSend: '',
            LmCompanySend: '',
            req_note: _this.req_note,
            LmUserReceive: _this.deliverForm.sample.LmUserReceive,
            LmPhoneReceive: _this.deliverForm.sample.LmPhoneReceive,
            LmAddressReceive: _this.deliverForm.sample.LmAddressReceive,
            LmNumberReceive: _this.deliverForm.sample.LmNumberReceive,
            LmCompanyReceive: _this.deliverForm.sample.LmCompanyReceive,
            req_payment_way: payData.req_payment_way,
            req_payment_flag: payData.req_payment_flag,
            req_disconut_price:payData.req_disconut_price,
            req_payment_price: payData.req_payment_price,
            ContractNo: payData.ContractNo,
            clientPay:payData.clientPayNo,
            req_payment_remark: payData.req_payment_remark,
            itemResult: JSON.stringify(_this.projectForm.repTable),
            req_file_id: fileData.join(','),
            position:_this.siteData==''?'': JSON.stringify(_this.siteData),
            LmSendList: JSON.stringify(_this.deliverForm.report),
          })
        }else{
          var proData = qs.stringify({
            pat_tag: (_this.status=='0'?'':_this.bar_sn),
            req_org_id: _this.mechanismForm.req_org_id,
            req_org_dept: _this.mechanismForm.req_org_dept,
            req_doc_name: _this.mechanismForm.req_doc_name,
            req_doc_phone: _this.mechanismForm.req_doc_phone,
            req_dest_labid: _this.mechanismForm.req_dest_labid,
            pat_name: _this.patientForm.pat_name,
            pat_sex: _this.patientForm.pat_sex,
            pat_age_dec: _this.patientForm.pat_age_dec,
            pat_birthday: _this.patientForm.pat_birthday,
            pat_IDcard: _this.patientForm.pat_IDcard,
            pat_phone: _this.patientForm.pat_phone,
            req_pat_id: _this.patientForm.req_pat_id,
            pat_familyno: _this.patientForm.pat_familyno,
            pat_family_relation: _this.status,
            req_mr_num: _this.patientForm.req_mr_num,
            pat_address: _this.patientForm.pat_address,
            req_diag_info: _this.patientForm.req_diag_info,
            req_remark: _this.patientForm.req_remark,
            req_save: _this.projectForm.req_save,
            req_born_flag: _this.projectForm.req_born_flag,
            req_type: _this.projectForm.req_type,
            itemName: _this.projectForm.itemName,
            LmUserSend: '',
            LmPhoneSend: '',
            LmAddressSend: '',
            LmInvoiceSend: '',
            LmEmailSend: '',
            LmNumberSend: '',
            LmCompanySend: '',
            req_note: _this.req_note,
            LmUserReceive: _this.deliverForm.sample.LmUserReceive,
            LmPhoneReceive: _this.deliverForm.sample.LmPhoneReceive,
            LmAddressReceive: _this.deliverForm.sample.LmAddressReceive,
            LmNumberReceive: _this.deliverForm.sample.LmNumberReceive,
            LmCompanyReceive: _this.deliverForm.sample.LmCompanyReceive,
            req_payment_way: (_this.cashier==''?'':_this.cashier.req_payment_way),
            req_payment_flag: (_this.cashier==''?'':_this.cashier.req_payment_flag),
            req_disconut_price:(_this.cashier==''?'':_this.payData.req_price),
            req_payment_price: (_this.cashier==''?'':_this.cashier.req_payment_price),
            ContractNo: (_this.cashier==''?'':_this.cashier.ContractNo),
            clientPay: (_this.cashier==''?'':_this.cashier.clientPayNo),
            req_payment_remark: (_this.cashier==''?'':_this.cashier.req_payment_remark),
            itemResult: JSON.stringify(_this.projectForm.repTable),
            req_file_id: fileData.join(','),
            position:_this.siteData==''?'': JSON.stringify(_this.siteData),
            LmSendList: JSON.stringify(_this.deliverForm.report),
          })
        }
        this.loading = true
        this.$axios.post(this.$path.formcomplete,proData)
        .then(res=>{
            var data = eval(res.data)
            if(data.code==1004){
               _this.loading = false
              _this.$message({ message: data.result.msg, type: 'warning' })
              return false
            }else{
              _this.$message({ message: '提交申请单成功', type: 'success' })
              if(_this.editRun == ''){
                _this.$router.push({ path:'/Vue_OmsAndRmsTest/#/oms/applyPage' })
              }else{
                _this.$nextTick(()=>{
                  _this.$parent.activeName2 = 'first'
                  $("#tab-first").trigger("click")
                })

                //this.$parent.dialogVisible = false
              }
              _this.loading = false
            }
          console.log(res)
        })
        .catch(err=>{
           _this.loading = false
          console.log(res)
        })
      },
      //添加项目请求
      BarcodeList(){
        let _this = this
        if(_this.mechanismForm.req_org_id=='' || _this.mechanismForm.req_org_dept==''){
          this.$message({
            message: '请先选择开单机构和科室!',
            type: 'warning'
          });
          return false;
        }
        if(_this.projectForm.itemName==''){
          this.$message({
            message: '请先选择项目!',
            type: 'warning'
          });
          return false;
        }
        this.$axios.get(_this.$path.BarcodeList,{
          params: {
              grp_id: _this.projectForm.itemName,
              req_born_flag: _this.projectForm.req_born_flag,
              org_id: _this.mechanismForm.req_org_id,
              part_id: _this.mechanismForm.req_org_dept
          }
        })
        .then(res=>{
          console.log(res)
          _this.projectForm.itemName = ''
          var data = eval(res.data).result
          var grp_id = data.grpList[0].grp_id
          _this.projectForm.repTable = _this.projectForm.repTable.concat(data.grpList);

          if(grp_id=="228"||grp_id=="229"||grp_id=="1994"){
              this.$message({
                message: '这是特殊项目，需要点击最上面“位点录入”按钮新增位点信息，开单才能成功!',
                type: 'warning'
              });
          }
        })
        .catch(err=>{
          console.log(err)
        })

      },
      //添加项目
      addProject(){
        let _this = this
        let req_org_id = this.mechanismForm.req_org_id
        let req_org_dept = this.mechanismForm.req_org_dept
        if(this.projectForm.req_born_flag == 0){
          this.$confirm('你申请的是产前检测，务必上传以下资料供医学部评估审核，详见《嘉检医学产前基因检测流程》：1.胎儿临床资料(超声)，孕周，医院，医生；2.先证者基因检测结果(阳性)；3.先证者临床资料(临床检查，临床诊断)。评估结果为‘’通过‘’才能采集样本，并且《遗传基因检测专用申请单》、《单基因遗传病基因检测知情同意书 》、《基因检测委托书》的患者及医生签名务必完整!评估结果为‘’不通过‘’则拒绝送检！', '提示', {
            }).then(() => {
              this.BarcodeList()
            })
        }else{
          this.BarcodeList()
        }
      },
      //清空已选项目
      clearProject(){
         this.projectForm.repTable = []
      },
      //点击位点录入确定
      siteEditSumbit(){
        this.siteData= this.$refs.siteEditChild.siteData
        if(this.$refs.siteEditChild.checkSite()!=false){
          this.dialogVisible2 = false
        }
      },
      //家系查询提交
      patRelationSumbie(){
        var _this = this
        if(this.$refs.patRelationChild.submitfamily()==1) return false
        var bar_sn = this.$refs.patRelationChild.currentRow       //获取选中家系
        var status = this.$refs.patRelationChild.listSearch.status      //获取先证者关系
        var position = this.$refs.patRelationChild.position  //获取位点
        var tempNameText = this.$refs.patRelationChild.tempNameText  //获取先证者关系名称

        // return false
        _this.siteData = position
        _this.bar_sn = bar_sn.bar_sn
        console.log(position)
        this.$axios.get(_this.$path.submitfamily,{
          params:{
            bar_sn: bar_sn.bar_sn,
            pat_relation: status,
          }
        })
        .then(res=>{
          var data = eval(res.data).result
          _this.patient = data
          _this.mechanismForm.req_org_id = data.patient[0].org_id +''
          _this.mechanismForm.req_org_dept= data.patient[0].part_id
          _this.patientForm.pat_name= data.patient[0].pat_name + tempNameText
          _this.mechanismForm.req_doc_name= data.patient[0].req_doc_name
          _this.mechanismForm.req_doc_phone= data.patient[0].req_doc_phone
          _this.patientForm.req_pat_id= data.patient[0].pat_id
          _this.patientForm.pat_familyno= data.patient[0].pat_familyno
          _this.status = data.patient[0].pat_family_relation
          this.dialogVisible = false
        })
        .catch(err=>{
          console.log(err)
        })
      },
      //付款信息提交
      payDataBtn(){
        this.cashier = this.$refs.cashierChild.cashier
        console.log(this.cashier)
        this.dialogVisible3 = false
      },
      showPay(){
        if(this.projectForm.repTable.length<1){
          this.$message({ message: '请先确认项目!', type: 'warning' });
          return false
        }
        this.dialogVisible3=!this.dialogVisible3
        var repTable = this.projectForm.repTable
        this.countMoney(repTable)

      },
      //计算收银台应收金额
     countMoney(repTable){
        var sumPrice = 0;
        repTable.forEach((item,index)=>{
            sumPrice +=(item.grp_price*item.grp_index_num)+(item.grp_custom_price*item.grp_custom_num)
        })
        this.payData.req_price = sumPrice
     },
      changeName(type,value){
        var _this = this
        this.$nextTick(() => {
          if(type==0){
            _this.deliverForm.report[0].LmUser = value
          }else if(type==1){
            _this.deliverForm.report[0].LmPhone = value
          }else if(type==2){
            _this.deliverForm.report[0].LmAddress = value
          }

        })
      },
      //申请单信息回显
      applyEcho(data){
        this.editRun = data
        var _this = this
          var data = data
          let itemResult = data.result.itemResult
          let reqList = data.result.reqList   //报告信息
          let bar_id = itemResult[0].bar_sn
          _this.mechanismForm.req_org_id = reqList[0].req_org_id
          _this.mechanismForm.req_org_dept = parseInt(reqList[0].req_org_dept)
          _this.mechanismForm.req_doc_name = reqList[0].req_doc_name
          _this.mechanismForm.req_doc_phone = reqList[0].req_doc_phone
          _this.mechanismForm.req_dest_labid = reqList[0].req_dest_labid
          _this.patientForm.pat_name = reqList[0].pat_name
          _this.patientForm.pat_sex = reqList[0].pat_sex +''
          _this.patientForm.pat_age_dec = reqList[0].pat_age_dec
          _this.patientForm.pat_birthday = reqList[0].pat_birthday
          _this.patientForm.pat_IDcard = reqList[0].pat_IDcard
          _this.patientForm.pat_phone = reqList[0].pat_phone
          _this.patientForm.req_pat_id = reqList[0].req_pat_id
          _this.patientForm.pat_familyno = reqList[0].pat_familyno
          _this.patientForm.req_mr_num = reqList[0].req_mr_num
          _this.patientForm.pat_address = reqList[0].pat_address
          _this.patientForm.req_diag_info = reqList[0].req_diag_info
          _this.patientForm.req_remark = reqList[0].req_remark
          _this.guid = reqList[0].req_file_id
          _this.projectForm.req_save = reqList[0].req_save + ''
          _this.projectForm.req_born_flag = reqList[0].req_born_flag + ''
          // _this.projectForm.req_born_flag = reqList[0].req_born_flag
          _this.projectForm.repTable = itemResult
          if(JSON.parse(reqList[0].LmSendList)!=''){
            _this.deliverForm.report = JSON.parse(reqList[0].LmSendList)
          }
          _this.req_note = reqList[0].req_note + ''
          _this.deliverForm.sample.LmUserReceive = reqList[0].LmUserReceive
          _this.deliverForm.sample.LmPhoneReceive = reqList[0].LmPhoneReceive
          _this.deliverForm.sample.LmAddressReceive = reqList[0].LmAddressReceive
          _this.deliverForm.sample.LmNumberReceive = reqList[0].LmNumberReceive
          _this.deliverForm.sample.LmCompanyReceive = reqList[0].LmCompanyReceive
          _this.payData.req_payment_way = parseInt(reqList[0].req_payment_way)
          _this.payData.req_payment_flag =parseInt(reqList[0].req_payment_flag)
          _this.payData.req_price = reqList[0].req_price
          _this.payData.req_payment_price = reqList[0].req_payment_price
          _this.payData.ContractNo = reqList[0].ContractNo
          _this.payData.clientPay = reqList[0].clientPay
          _this.payData.req_payment_remark = reqList[0].req_payment_remark
          _this.siteData = JSON.parse(data.result[bar_id][0].position)
          //console.log(reqList[0].req_file_id)
          if(_this.guid==''){
            this.$refs.upLoadChild.initFile()
          }else{
            this.$refs.upLoadChild.GetFileByGuid(_this.guid)
          }

          if(reqList[0].req_submit_flag == '1'){
            _this.req_submit_flag = true
            _this.siteDisabled = true
            _this.hideProBtn()
          }
          //项目样本总价控制
          _this.editChirld = true
          _this.editChir.XiangMuShu = _this.projectForm.repTable.length
          _this.editChir.sampleNum = _this.projectForm.repTable.length
          _this.countMoney(_this.projectForm.repTable)
          _this.editChir.ZongJiaGe = _this.payData.req_price
      },
      //隐藏添加项目按钮
      hideProBtn(type){
        //样本管理可修改
        if(type){
          this.req_submit_flag = false
        }
        this.showAddPro = false
      },
      //条码校验
      checkCode(code){
        if(!code.match(/^0\d{7}$/)){
            this.$message({ message: '请输入正确的条码!', type: 'warning' });
            return false;
        }
      },
      //返回申请单管理
      backApply(){
        this.$router.push({ path:'/oms/applyPage'})
      },
   },
   components:{
     upLoad,
     Pedigree,
     siteEdit,
     Cashier,
     SiteTable
   },
   props:['data']
}
</script>

<style lang="scss">
.mMain{
  padding-bottom:100px;
  .el-dialog__body{
    padding: 10px 20px;
  }
  .mMechanism,.mPatient,.mProject,.mDeliver{
    padding: 0 10px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
  .start{
    label{
      color: #f56c6c;
      span{
        color: #606266;
      }
    }
  }
}
.repTitle{
  padding-bottom: 10px;
  font-size: 14px;
  color: #606266;
}
.el-dialog__wrapper>div{
  z-index: 99999;
}
.editMain .el-card__body{
    background: #fff !important;
}
.editMain{
    background: #fff;
}
.btn-file{
  width: 120px !important;
}
</style>

