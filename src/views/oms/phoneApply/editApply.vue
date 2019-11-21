<template>
    <div class="rex">
        <div class="main">
          <!-- 家系查询 -->
          <div class="pedigree" v-if="active=='pedigree'">
            <div>
              <h2 class="group-title">条件搜索</h2>
              <van-cell-group>
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="姓名"
                  placeholder="请输入姓名"
                />
                <van-field
                  v-model="pedigree.searchBarCode"
                  clearable
                  label="流水号"
                  placeholder="请输流水号"
                />
                <van-field
                  v-model="pedigree.searchFamilyNo"
                  clearable
                  label="家庭号"
                  placeholder="请输入家庭号"
                />
                <div style="text-align: center; padding:10px 40px;">
                  <van-button class="sm-btn" type="info" size="large" square @click="searchFamily()">搜 索</van-button>
                </div>
              </van-cell-group>
            </div>
            <div>
              <h2 class="group-title">搜索结果</h2>
              <el-table
                ref="patTable"
                class="pedigree-table"
                :data="tableData"
                border
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column
                  type="selection"
                  header-align = 'center'
                  align="center"
                  width="45">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="pat_name"
                  label="姓名"
                  header-align = 'center'
                  align="center"
                  width="100"
                  >
                </el-table-column>
                <el-table-column
                  prop="pat_id"
                  label="顾客编码"
                  header-align = 'center'
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="pat_familyno"
                  label="家庭号"
                  header-align = 'center'
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="grp_name"
                  label="项目"
                  header-align = 'center'
                  align="center"
                  width="160">
                </el-table-column>
                <el-table-column
                  prop="sp_name"
                  label="样本类型"
                  header-align = 'center'
                  align="center">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  header-align = 'center'
                  align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="CheckPosition(scope.row.bar_sn,payee.pat_relation_id)">获取位点</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                style="background:#fff"
                layout="prev, pager, next"
                :pager-count="5"
                v-model="patPage"
                :current-page.sync="currPage"
                @current-change="patChange"
                :total="patTotal">
              </el-pagination>
            </div>
            <div>
              <h2 class="group-title">选择信息</h2>
              <van-radio-group v-model="patRadio">
                <van-cell-group>
                  <van-cell title="复制信息">
                    <van-radio name="1">是</van-radio>
                    <van-radio name="2">否</van-radio>
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
              <van-cell-group>
                <van-field
                  readonly
                  clickable
                  label="与先证者关系"
                  :value="payee.pat_relation"
                  placeholder="请选择"
                  @click="selectPicker(0)"
                />
              </van-cell-group>
              <van-cell-group>
                <van-field
                  readonly
                  clickable
                  label="验证方式"
                  :value="payee.interest"
                  placeholder="请选择"
                  @click="selectPicker(1)"
                />
              </van-cell-group>
            </div>
            <div>
              <h2 class="group-title">位点选择</h2>
              <el-table
                class="pedigree-table"
                :data="PedigreeData"
                border
                style="width: 100%">
                <el-table-column
                  type="selection"
                  header-align = 'center'
                  align="center"
                  width="55">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="GeneName"
                  label="基因名称"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="Chr"
                  label="染色体"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="ChrPos"
                  label="染色体位置"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="RNAAccession"
                  label="转录本"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="Nucleotide"
                  label="核苷酸"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="AminoAcidChange"
                  label="核苷酸改变"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="BaseChange"
                  label="氨基酸改变"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="ZygoticState"
                  label="合子状态"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
              </el-table>
            </div>
            <div style="text-align: center; padding:40px;">
              <van-button class="sm-btn" type="info" size="large" square @click="submitPat">确 定</van-button>
            </div>
          </div>

          <!-- 申请单 -->
          <div v-if="active=='application'">
            <div>
              <h2 class="group-title">机构信息</h2>
              <van-cell-group class="top1">
                <van-field
                  readonly
                  clickable
                  required
                  label="开单机构"
                  :value="applyForm.req_org_name"
                  placeholder="请选择"
                  @click="selectPicker(2)"
                />
              </van-cell-group>
              <van-cell-group>
                <van-field
                  readonly
                  clickable
                  required
                  label="科室"
                  :value="applyForm.req_dept_name"
                  placeholder="请选择"
                  @click="selectPicker(3)"
                />
              </van-cell-group>
              <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="医生"
                  placeholder="请选择"
                />
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="医生电话"
                  placeholder="请选择"
                />
                <van-cell-group class="top-1">
                  <van-field
                    readonly
                    clickable
                    required
                    label="实验室"
                    :value="applyForm.req_labid_name"
                    placeholder="请选择"
                    @click="selectPicker(4)"
                  />
                </van-cell-group>
            </div>
            <div>
              <h2 class="group-title">患者信息</h2>
              <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  required
                  label="姓名"
                  placeholder="请选择"
                />
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="身份证"
                  placeholder="请选择"
                />
                <van-radio-group v-model="patRadio">
                  <van-cell-group class="width3">
                    <van-cell title="性别">
                      <van-radio name="1">女</van-radio>
                      <van-radio name="2">男</van-radio>
                      <van-radio name="3">未知</van-radio>
                    </van-cell>
                  </van-cell-group>
                </van-radio-group>
                <van-cell-group>
                  <van-field
                    readonly
                    clickable
                    label="出生日期"
                    :value="applyForm.pat_birthday"
                    placeholder="请选择"
                    @click="datePicker()"
                  />
                </van-cell-group>
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="年龄"
                  placeholder="例：1岁"
                />
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  required
                  label="联系电话"
                  placeholder="请选择"
                />
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="顾客编号"
                  placeholder="请选择"
                />
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="家庭号"
                  placeholder="请选择"
                />
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="就诊号"
                  placeholder="请选择"
                />
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="临床症状"
                  placeholder="请选择"
                />
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="备注"
                  placeholder="请选择"
                />
                <!-- 上传附件组件 -->
                  <upLoad ref="upLoadChild" />
            </div>
            <div>
              <h2 class="group-title">项目选择</h2>
              <van-radio-group v-model="patRadio">
                <van-cell-group>
                  <van-cell title="是否暂存">
                    <van-radio name="1">是</van-radio>
                    <van-radio name="2">否</van-radio>
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
              <van-radio-group v-model="patRadio">
                <van-cell-group>
                  <van-cell title="项目类型">
                    <van-radio name="1">是</van-radio>
                    <van-radio name="2">否</van-radio>
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
              <van-cell-group>
                <van-field
                  readonly
                  clickable
                  label="项目分类"
                  :value="applyForm.req_type_name"
                  placeholder="请选择"
                  @click="selectPicker(5)"
                />
              </van-cell-group>
              <van-cell-group>
                <van-field
                  readonly
                  clickable
                  label="项目名称"
                  :value="applyForm.pat_relation"
                  placeholder="请选择"
                  @click="selectPicker(6)"
                />
              </van-cell-group>
            </div>
          </div>
          <!-- 收银台 -->
          <div v-if="active=='cashier'">
            收银台
          </div>
        </div>
        <!-- 选择框弹窗 -->
        <van-popup v-model="showPicker" position="bottom" style="height:70%">
          <div class="popupSelect" v-show="typeSelect">
            <input id="telInput" ref='searchSelect' v-model="telInput" placeholder="请输入搜索条件"  @keyup="searchQuery"/>
          </div>
          <van-picker
            :title="pickerTitle"
            show-toolbar
            value-key="text"
            :columns="selectColumns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
        <!-- 选择框弹窗 end -->
        <!-- 选择框日期弹窗 -->
        <van-popup v-model="showPickerDate" position="bottom" style="height:70%">
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            @confirm="confirmFn()"
          />
        </van-popup>
        <!-- 选择框日期弹窗 end -->
        <!-- 底部切换 -->
        <van-tabbar v-model="active">
          <van-tabbar-item name="pedigree">家系查询</van-tabbar-item>
          <van-tabbar-item name="application">申请单</van-tabbar-item>
          <van-tabbar-item name="cashier">收银台</van-tabbar-item>
        </van-tabbar>

    </div>
</template>
<script>
import upLoad from '../applyPage/components/upLoad'
export default {
   data() {
      return {
        pickerTitle:'',
        showPicker:false,
        showPickerDate:false,
        show: false,
        typeSelect:false,
        telInput:'',
        active: 'application',
        patRadio:'2',
        patAllTable:[], //所有家系查询信息
        patSplitTable:[], //所有家系查询信息
        patTotal:0,
        patPage:1,
        currPage:1,
        selectColumns:[],
        selectColumnsAll:[],
        pedigree:{
          searchFamilyName:'',
          searchBarCode:'',
          searchFamilyNo:'',
        },
        tableData:[],
        payee:{
          interest:'',
        },
        PedigreeData:[],
        patRelation:[],
        pat_relation:"",
        pat_relation_id:"",
        multipleSelection:[],
        currentDate: new Date(),
        applyForm:{
          req_code: '',
          pat_tag_relation:'',
          pat_tag: '',
          req_org_id: '',
          req_org_name: '',
          req_org_dept: '',
          req_dept_name: '',
          req_doc_name: '',
          req_doc_phone: '',
          req_dest_labid: '1',
          req_labid_name: '广州总部',
          pat_name: '',
          pat_sex: '',
          pat_age_dec:'',
          pat_birthday: '',
          pat_IDcard: '',
          pat_phone: '',
          req_pat_id: '',
          pat_familyno: '',
          pat_family_relation: '',
          req_mr_num:'',
          pat_address: '',
          req_diag_info: '',
          req_remark: '',
          req_save:'',
          req_born_flag: '',
          req_type: '',
          req_type_name: '',
          itemName: '',
          LmUserSend: '',
          LmPhoneSend: '',
          LmAddressSend: '',
          LmInvoiceSend: '',
          LmEmailSend: '',
          LmNumberSend: '',
          LmCompanySend: '',
          req_note: '',
          LmUserReceive: '',
          LmPhoneReceive: '',
          LmAddressReceive: '',
          LmNumberReceive: '',
          LmCompanyReceive: '',
          req_payment_way: '',
          req_payment_flag: '',
          req_disconut_price:'',
          req_payment_price: '',
          ContractNo: '',
          clientPay: '',
          req_payment_remark: '',
          itemResult: '',
          req_file_id:'',
          position:'',
          LmSendList: '',
        },
        mechanismForm:{
          req_org_select:[],
          req_dept_select:[],
        },
        guid:'',
      }
   },
   mounted(){
     var _this = this
     $(document).on('input propertychange','#telInput',function (e) {
          if (e.type === "input" || e.orignalEvent.propertyName === "value") {
            _this.searchQuery(_this.telInput)
          }
      })

      this.itemini()
      this.$refs.upLoadChild.initFile()
   },
   activated() {
   },
   methods:{
     itemini(){
        var url = this.$path.itemini
        console.log(url)
        this.$axios.get(url)
        .then(res=>{
            var data = eval(res.data).result
            // this.projectForm.itemNameSelect = data.grpItem    //项目
            // this.projectForm.itemName = ''
            this.mechanismForm.req_org_select = data.orgItem  //机构
            this.mechanismForm.req_dept_select = data.part    //科室
            // this.projectForm.selSample = data.spec      //项目标本
            this.patRelation = data.patRelation     //先证者关系
            // this.Agreement = data.Agreement     //合同选项列表
            // this.clientPay = data.clientPay     //关联账单列表
        })
        .catch(err=>{
          console.log(err)
        })
     },
     //表格模拟单选框
     handleSelectionChange(val){
       if(val.length>1){
         this.$refs.patTable.clearSelection()
         this.$refs.patTable.toggleRowSelection(val.pop())
       }else{
         this.multipleSelection = val.pop()
       }
     },
     //选择框搜索功能
     searchQuery(val){
       if(typeof(val)=='string'){
         if(val==''){
           this.selectColumns = this.selectColumnsAll
         }else{
           var arr = []
           this.selectColumnsAll.forEach(item=>{
             let text = item.text
             if(text.indexOf(val) != -1){
               arr.push(item)
             }
           })
           this.selectColumns = arr
         }
       }

     },
     //选择弹窗确定按钮
     onConfirm(value, index) {
       //此时返回的value就是个对象了
        var keyId = value.keyId;
        var text= value.text;
        if(this.pickerTitle == '验证方式'){
          this.payee.interest = text
        }
        if(this.pickerTitle == '先证者关系'){
          this.payee.pat_relation = text
          this.payee.pat_relation_id = keyId
        }
        if(this.pickerTitle == '开单机构'){
          this.applyForm.req_org_name = text
          this.applyForm.req_org_id = keyId
        }
        if(this.pickerTitle == '科室'){
          this.applyForm.req_dept_name = text
          this.applyForm.req_org_dept = keyId
        }
        if(this.pickerTitle == '项目分类'){
          this.applyForm.req_type_name = text
          this.applyForm.req_type = keyId
        }
       this.showPicker = false
     },
     //选择弹窗
     selectPicker(type){
       let arr = []
       this.typeSelect = false
       this.telInput=''
       if(type ==0){
         this.pickerTitle = '先证者关系'
         let obj = this.patRelation
         Object.keys(obj).forEach(function(key){
            let o = {}
            o.keyId = key
            o.text = obj[key]
            arr.push(o)
         });
       }
       if(type ==1){
         this.pickerTitle = '验证方式'
         arr = [
            {"keyId":"先证者验证","text":"先证者验证"},
            {"keyId":"自定义验证","text":"自定义验证"}
          ]
       }
       if(type ==2){
         this.typeSelect = true
         this.pickerTitle = '开单机构'
         this.mechanismForm.req_org_select.forEach(item=>{
            let o = {}
            o.keyId = item.org_id
            o.text =  item.org_name
            arr.push(o)
         })
       }
       if(type == 3){
         this.typeSelect = true
         this.pickerTitle = '科室'
         this.mechanismForm.req_dept_select.forEach(item=>{
            let o = {}
            o.keyId = item.part_id
            o.text =  item.part_name
            arr.push(o)
         })
       }
       if(type ==4){
         this.pickerTitle = '实验室'
         arr = [
            {"keyId":"1","text":"广州总部"}
          ]
       }
       if(type ==5){
         this.pickerTitle = '项目分类'
         arr = [
            {"keyId":"0","text":"临床检测"},
            {"keyId":"1","text":"研发项目"},
            {"keyId":"2","text":"健康体检"}
          ]
       }
       if(type ==6){
         this.pickerTitle = '项目名称'

         arr = []
         return false;
       }
       console.log(this.selectColumns)
       this.showPicker = true
      //  this.typeSelect = true
       this.$nextTick(()=>{
         this.selectColumns = arr
         this.selectColumnsAll = arr
         this.$refs.searchSelect.focus();
       })
     },
     showPopup(){
       this.show = true;
     },
     //选择日期弹窗
     datePicker(type){
       this.showPickerDate = true
     },
     //选择日期格式化
     confirmFn(){
       this.applyForm.pat_birthday = this.timeFormat(this.currentDate);
       this.showPickerDate = false;
     },
     timeFormat(time) { // 时间格式化 2019-09-08
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        return year + '-' + month + '-' + day
      },
     //查询家系表格切换页数
     patChange(value){
        let _this = this
        _this.patPage = value
        let arr = []
        for(var i = (value-1)*10;i<value*10;i++){
         arr.push(_this.patAllTable[i])
        }
        _this.tableData = arr
     },
     //查询家系表格信息
     searchFamily(){
        this.$nextTick(()=>{
          this.currPage = 1
        })
        var _this = this
        this.$axios.get(_this.$path.CheckFamily,{
          params:{
            pat_name: _this.pedigree.searchFamilyName,
            pat_familyno: _this.pedigree.searchBarCode,
            barcode: _this.pedigree.searchFamilyNo,
          }
        })
        .then(res=>{
          var data = eval(res.data).result
          _this.patTotal = data.barcode.length
          _this.patAllTable = data.barcode
          var arr =[];
          for(var i=0;i<10;i++){
            if(data.barcode[i]){
              arr.push(data.barcode[i])
            }
          }
          _this.tableData = arr

        })
        .catch(err=>{

        })
     },
     //查询家系表格获取位点
      CheckPosition(bar_sn,relation){
        var _this = this
        if(!_this.payee.pat_relation){
          this.$message({
            message: '请选择先证者关系',
            type: 'warning'
          });
          return false;
        }
        this.$axios.get(_this.$path.CheckPosition,{
          params:{
            bar_sn: bar_sn,
            relation: relation,
          }
        })
        .then(res=>{
          var data = eval(res.data).result
          this.PedigreeData = data.position
          if(data.position==''){
            this.$message({ message: '当前没有位点信息，请联系管理员!', type: 'warning' });
            return false;
          }
          console.log(data)

        })
        .catch(err=>{
          console.log(err)
        })
      },
     //家系查询确定
     submitPat(){
      let bar_sn = this.$refs.patTable.selection[0].bar_sn
      if(!this.payee.pat_relation){
        this.$toast('请先选择与先证者关系!');
        return false;
      }
      if(!bar_sn){
        this.$toast('请勾选先证者!');
        return false;
      }
      this.$axios.post(this.$path.submitfamily+"?bar_sn="+bar_sn+"&pat_relation="+this.payee.pat_relation)
      .then(res=>{
        let data = eval(res.data).result.patient[0]
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
     },
   },
   components:{
     upLoad
   }
}
</script>
<style lang="scss">
  .main{
    padding-bottom:100px;
    .group-title{
      margin: 0;
      padding: 15px 15px 15px;
      color: rgba(69, 90, 100, 0.6);
      font-weight: normal;
      font-size: 14px;
    }
    .van-radio{
      float:right;
      width:50%;
    }
  }

  .sm-btn{
    height: 36px;
    line-height: 36px;
    span{
      font-size: 14px;
    }
  }
  .popupSelect{
    padding:5px;
    input{
      width:100%;
      border:1px solid #ddd;
      line-height:28px;
      padding:0 4px;
    }
  }


</style>
<style>
  html,body,#app{
    height:100%;overflow:auto;margin: 0;
  }
  /* .main::-webkit-scrollbar{
　  display:none;
  } */
  .main{
    -webkit-overflow-scrolling : touch
  }

  .el-table td, .el-table th{
    padding:5px 0 !important;
  }
  .pedigree-table .cell{
    padding-left:2px !important;
    padding-right:2px !important;
  }
  .fixedBtm{
    position:fixed;
    left:0;
    right:0;
    bottom:0;
    height:40px;
    background:red;
  }
  .showSelect{
    display: block;
  }
  .hideSelect{
    display: none;
  }
  .van-cell__title{
    width: 120px;
    flex:none;
  }
  .top1{
    top:1px;
  }
  .top-1{
    top:-1px;
  }
  .width3 .van-radio{
    width: 33%;
  }
  /*上传控件样式重构*/
  .file-input .input-group-btn{
    top: 0px;
  }
  .file-input .form-control{
    -webkit-box-shadow:none;
    box-shadow:none;
    -webkit-transition:none;
    transition:none;
    border: none;
  }
  .file-input .btn-file{
    border-radius: 0;
  }
  .loadFile .btn-file{
    width: 80px !important;
    background: #1989fa !important;
    border-color: #1989fa !important;
  }
  .file-preview{
    background: #fff;
  }
  .file-drop-zone-title{
    padding:10px !important;
    font-size: 14px;
  }
  .file-preview{
    border-radius: 0;
    border-top:1px solid #ddd;
    border-bottom:1px solid #ddd;
    border-left:none;
    border-right:none;
    margin-bottom:0;
  }
  /*上传控件样式重构 end*/
  .van-tabbar{
    z-index: 9999 !important;
  }
  .van-tabbar-item{
    font-size: 14px;
  }
  .form-group{
    margin-bottom: 0 !important;
  }
</style>
