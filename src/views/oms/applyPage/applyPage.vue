<template>
    <div class="queryMain app-container">
      <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float:right"
            size="small"
            @click="showHideSeach = !showHideSeach"
            >
            {{ showHideSeach?'收起':'展开' }}
          </el-button>
          <el-button
            style="float:right;margin-right: 15px"
            type="primary"
            @click="search()"
             v-show="showHideSeach"
            size="small">
            查询搜索
          </el-button>
        </div>
        <div style="margin-top: 15px" class="search-box" v-show="showHideSeach">
          <el-form :inline="true" :model="listQuery" size="small" label-width="130px">
            <el-form-item v-for="(item,index) in searchSelect" :key="index":label="item.name+':'">
              <el-select v-model="listQuery[item.id]" placeholder="请选择">
                <el-option v-for="(items,index) in item.data" :key='items.options_id' :label="items.options_id" :value="items.options_name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-for="(item,index) in searchText" :key="item.name":label="item.name+':'">
                <el-input v-model="listQuery[item.id]" class="input-width" :placeholder="item.name"></el-input>
            </el-form-item>
            <el-form-item v-for="(item,index) in searchDate" :key="item.name":label="item.name+':'">
                <el-date-picker
                v-model="listQuery[item.id]"
                type="daterange"
                range-separator="至"
                unlink-panels
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card class="filter-container" shadow="never" style="margin-top:15px;">
        <div style="margin-bottom:25px;">
          <el-button type="success" @click="addApply">新 增</el-button>
          <el-button type="primary" @click="clickModify('',0)">修 改</el-button>
          <el-button type="info" @click="clickModify('')">详 情</el-button>
          <el-button type="danger" @click="delApplication()">删 除</el-button>
          <el-button @click="upload()">上 传</el-button>
          <el-button @click="report()">数据申请</el-button>
          <el-button @click="exportData()">导出</el-button>

          <div :inline="true" class="demo-form-inline float_right">
            <el-input style="width:auto;" placeholder="搜索" v-model="searchTable"  @keyup.enter.native="searchFrom" ></el-input>
            <el-button v-popover:popover2><i class="el-icon-menu"></i></el-button>
            <el-popover
              ref="popover2"
              placement="bottom"
              width="100"
              trigger="click">
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(item,index) in menuList" :key="index" :label="item.name" :disabled="item.name=='状态'?true:false" ></el-checkbox>
              </el-checkbox-group>
            </el-popover>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="row"
          stripe
          tooltip-effect="dark"
          style="width:100%"
          :row-class-name="tableRowClassName"
          @row-click = "selectRowChange"
          v-loading="loading"
          >
          <el-table-column
            type="selection"
            fixed
            width="55">
          </el-table-column>
          <el-table-column
            sortable
            v-for="(item,index) in menuList" :key="index"
            :label="item.name"
            :prop="item.id"
            v-if="checkedCities.indexOf(item.name) != -1"
            :width="!isPhone?'120px':''"
            >
             <!-- :fixed="index==0||index==1?true:false" -->
          </el-table-column>

          <el-table-column
            prop="address"
            label="操作"
            fixed="right"
            :width="!isPhone?'400px':''"
            >
            <template slot-scope="scope">
              <el-button type="primary" @click="clickModify(scope.row.req_code,0,scope.row)" size="small">修改</el-button>
              <el-button @click="clickModify(scope.row.req_code,1,scope.row)" size="small">详情</el-button>
              <el-button @click="upload(scope.row.req_code)" size="small">上传</el-button>
              <el-button @click="report(scope.row.req_code)" size="small">数据申请</el-button>
              <!-- <el-button @click="batchApplication(scope.row.req_code)" type="text" size="small">批量录单</el-button> -->
              <el-button type="danger" @click="delApplication(scope.row.req_code)" size="small">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="" style="margin-top:15px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagination.pageSize"
            :layout=" isPhone?'prev, pager, next': 'total, sizes, prev, pager, next, jumper'"
            :total="pagination.total">
          </el-pagination>
          <!-- layout="prev, pager, next" -->
        </div>
      </el-card>
      <!-- 修改选项弹窗 -->
      <el-dialog
        title="修改"
        :visible.sync="dialogVisible"
        width="80%"
        top="3vh"
        >
        <div class="editTopBtn" v-if="activeName2 != 'first'">
           <el-button size="mini" v-if="volatile" @click="onfirm(2)">补样</el-button>
           <el-button size="mini" v-if="volatile" @click="onfirm(1)">试做</el-button>
           <el-button size="mini" @click="onfirm(3)">退样</el-button>
           <el-button size="mini" v-if="!req_submit_flag" @click="showPayee">收银台</el-button>
           <el-button size="mini" v-if="!req_submit_flag" @click="innerVisible5 = true">位点录入</el-button>
           <el-button size="mini" v-if="req_submit_flag" @click="EditApplySample()">申请修改项目</el-button>
           <!-- <el-button size="mini" @click="innerVisible = true">保存</el-button> -->
        </div>
        <!-- 样本补样处理弹窗 -->
        <el-dialog
          width="30%"
          title="样本补样处理"
          :visible.sync="innerVisible"
          append-to-body>
          <el-form ref="form" label-width="100px" class="wForm">
            <el-form-item label="补样原因：">
              <el-input type="textarea" v-model="sample.applyRemark"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="onfirmApply(2)">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 样本补样处理弹窗 end-->
        <!-- 样本试做处理弹窗 -->
        <el-dialog
          width="30%"
          title="样本试做处理"
          :visible.sync="innerVisible2"
          append-to-body>
          <el-form ref="form" label-width="100px" class="wForm">
            <el-form-item label="试做原因：">
              <el-input type="textarea" v-model="sample.applyRemark"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="innerVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="onfirmApply(1)">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 样本试做处理弹窗 end-->
        <!-- 样本申请退样处理弹窗 -->
        <el-dialog
          width="50%"
          title="样本申请退样处理"
          :visible.sync="innerVisible3"
          append-to-body>
          <el-form ref="form" label-width="100px" class="wForm" v-if="innerVisible3">
            <el-form-item label="退样原因：">
              <el-input type="textarea" v-model="sample.applyRemark"></el-input>
            </el-form-item>
            <el-form-item label="上传附件：">
              <!-- 上传附件组件 -->
              <upload ref="upLoadChild" :guid='0'/>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="innerVisible3 = false">取 消</el-button>
            <el-button type="primary" @click="onfirmApply(3)">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 样本申请退样处理弹窗 end-->

        <!-- 申请修改项目弹窗 -->
        <el-dialog
          width="50%"
          title="申请修改项目"
          :visible.sync="innerVisible6"
          append-to-body>
          <el-form ref="form" label-width="100px" class="wForm w100">
            <el-form-item label="修改项目：">
              <el-select v-model="editApplySample.itemSelect" placeholder="请选择">
                <el-option
                  v-for="(item,index) in itemNameSelect"
                  :key="index"
                  :label="item.grp_name"
                  :value="item.grp_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="差价：">
              <el-input type="text" v-model="editApplySample.change_price"></el-input>
            </el-form-item>
            <el-form-item label="修改原因：">
              <el-input type="textarea" v-model="editApplySample.reason" placeholder="请输入修改原因..."></el-input>
            </el-form-item>
            <el-form-item label="上传附件：">
              <!-- 上传附件组件 -->
              <upload ref="upLoadChild" :guid='0'/>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="innerVisible6 = false">取 消</el-button>
            <el-button type="primary" @click="ItemEditApplySample()">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 申请修改项目弹窗 end-->

        <!-- 收银台弹窗 -->
        <el-dialog
          width="50%"
          title="收银台"
          :visible.sync="innerVisible4"
          :close-on-click-modal='false'
          :close-on-press-escape='false'
          append-to-body>
          <Cashier ref="cashierChild" :payData="payData"></Cashier>
          <span slot="footer" class="dialog-footer">
            <el-button @click="innerVisible4 = false">取 消</el-button>
            <el-button type="primary" @click="innerVisible4 = false">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 收银台弹窗 end-->
        <!-- 位点录入弹窗 -->
        <el-dialog
          width="50%"
          title="位点录入"
          :visible.sync="innerVisible5"
          :close-on-click-modal='false'
          :close-on-press-escape='false'
          append-to-body>
          <siteEdit ref="siteEditChild" v-if="innerVisible5"></siteEdit>
          <span slot="footer" class="dialog-footer">
            <el-button @click="innerVisible5 = false">取 消</el-button>
            <el-button type="primary" @click="siteEditSumbit">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 位点录入弹窗 end-->
        <el-tabs v-model="activeName2" type="card" v-if="dialogVisible" @tab-click="handleClick(activeName2)">
          <el-tab-pane label="详 情" name="first">
            <ViewApply v-if="activeName2=='first'" :req_code="req_code"></ViewApply>
          </el-tab-pane>
          <el-tab-pane label="修 改" name="second">
            <!-- <iframe ref="editApply" v-if="activeName2=='second'" style="width:100%;height:600px;" class="ifa" scrolling=auto :src="path+req_code" frameborder="0"></iframe> -->
            <editApply ref="editApplyChild" v-if="activeName2=='second'" :data="1"></editApply>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitModify" v-if="activeName2=='second'">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改选项弹窗 end-->

      <!-- 上传文件弹窗 -->
      <el-dialog
        title="上传文件"
        :visible.sync="dialogVisible2"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        width="50%"
        top="7vh"
        >
        <el-tabs type="card" v-if="dialogVisible2">
          <upload ref="upLoadChild" :guid="guid"></upload>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="upLoadSumbit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 上传文件弹窗 end-->

      <!-- 数据申请弹窗 -->
      <el-dialog
        title="数据申请"
        :visible.sync="dialogVisible3"
        width="40%"
        top="7vh"
        class="applyModel"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        >
        <el-form ref="form" label-width="120px" class="w-100">
          <el-form-item label="联系方式：">
            <el-input v-model="applyForm.tdr_phone"></el-input>
          </el-form-item>
          <el-form-item label="数据类型：">
            <el-select v-model="applyForm.tdr_type" placeholder="请选择活动区域">
              <el-option label="其他" value="0"></el-option>
              <el-option label="变异列表" value="1"></el-option>
              <el-option label="VCF" value="2"></el-option>
              <el-option label="FASTQ" value="3"></el-option>
              <el-option label="测序图" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址：">
            <el-input v-model="applyForm.tdr_address"></el-input>
          </el-form-item>
          <el-form-item label="申请理由：">
            <el-input v-model="applyForm.tdr_remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="reportSumbit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 数据申请弹窗 end-->

      <!-- 批量开单弹窗 -->
      <el-dialog
        title="批量开单"
        :visible.sync="dialogVisible4"
        width="40%"
        top="7vh"
        class="applyModel"
        :close-on-click-modal='false'
          :close-on-press-escape='false'
        >
        <div>

        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible4 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible4 = true">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 批量开单弹窗 end-->

    </div>
</template>
<script>
import siteEdit from './components/siteEdit'
import editApply from './editApply'
import ViewApply from './viewApply'
import Upload from './components/upLoad'
import Cashier from './components/Cashier'
import XLSX from 'xlsx'
import qs from 'qs'
export default {
   data() {
      return {
        searchTable:'',
        showHideSeach:false,
        loading:true,     //加载loading
        outerVisible: false,
        innerVisible: false,  //补样弹窗
        innerVisible2: false,  //试做弹窗
        innerVisible3: false,  //退样弹窗
        innerVisible4: false,  //收银台弹窗
        innerVisible5: false,   //位点录入弹窗
        innerVisible6: false,   //申请修改项目弹窗
        volatile:false,   //是否拒收
        req_submit_flag:false,    //是否已完成
        siteData:[],  //位点信息
        payData:{     //收银台信息
          Agreement:[],   //合同选项列表
          clientPay:[],   //关联账单列表
          grp_price:'',   //先证者价格
          req_payment_way:1,    //付款方式
          req_payment_flag:0,   //收费情况
          req_price:'',   //应收金额
          req_payment_price:'',   //实收金额
          ContractNo:'',  //选择合同
          clientPay:'',   //关联账单
          req_payment_remark:'',  //备注
        },
        sample:{
          applyRemark:'', //补样原因
          tryRemark:'',   //试做原因
        },
        applyForm: {    //数据申请弹窗
          tdr_phone: '',
          tdr_type: '',
          tdr_address: '',
          tdr_remark: '',
          reqList:'',
        },
        editApplySample:{   //申请修改项目
          itemSelect:'',
          change_price:'',
          reason:'',
        },
        itemNameSelect:[],
        path:'#/oms/modifyApply/1/',
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3:false,
        dialogVisible4:false,
        checked:true,
        activeName2:'second',
        checkedCities:[],
        req_code:'',    //表格选中的code
        listQuery:{},
        pagination:{
          pageSize:10,    //每页显示条数
          total:0,        //总页数
          currentPage:1,    //当前页数
        },
        menuList:[],
        options: [],  //状态筛选列表
        value6: '',
        row: [],
        multipleSelection: [],
        guid:'0',
        ReqCode:'',
        selectRowsData:'',
        OutField:[],
        searchSelect:[],
        searchText:[],
        searchDate:[],
        isPhone:false,
      }
   },
   activated() {
   },
   created(){

    //判断是否是移动端
    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        this.isPhone = true
    }else{
        this.isPhone = false
    }


     this.GetMenuFieldList()
     this.getErpUserOperation()
     this.getform()
   },
   mounted(){
     console.log(this.$refs.upLoadChild)
    //  this.$refs.upLoadChild.initFile()
   },
   methods:{
     //确定时间周期
     dateTime(value){
       this.listQuery.req_date = '>'+value[0]+'<'+value[1]
       console.log(this.listQuery.req_date)
     },
     //查询搜索按钮
     search(){
       this.searchTable = ''
       this.pagination.currentPage = 1
       this.pagination.pageSize = 10
       this.getform(1)
     },
     //切换tab页
      handleClick(name) {
        if(name=='second'){
          this.clickModify(this.req_code,0,99)
        }
      },
     //获取表格头部列表
     GetMenuFieldList(){
      console.log(333)
      var _this = this
      this.$axios.get(this.$path.GetMenuFieldList)
      .then(res=>{
        // _this.menuList = res.data.data
        // let datas = medical_dis_report()
        let datas = eval(res.data)
        console.log(datas)
        _this.menuList = datas.data
        _this.menuList.forEach((item,index) => {
          _this.checkedCities.push(item.name)
          if(item.id=="RequestStatus"){
            _this.options = item.data
          }
          var outArray = {}
          var outArray2 = {}
          var searchSelect = [];
          var searchText = [];
          var searchDate = [];
          _this.menuList.forEach(item=>{
          if(item.data!=''){
            searchSelect.push(item)
          }else if(item.name.indexOf("时间") > 0){
            searchDate.push(item)
          }else{
            searchText.push(item)
          }
          if(outArray[item.id]){
              if(!outArray[item.id].push){
                  outArray[item.id] = [outArray[item.name]]
                  outArray2[item.id] = ''
              }
              outArray[item.id].push(item.name || '')
              outArray2[item.id].push('')
          }else{
              outArray[item.id] = item.name || ''
              outArray2[item.id] = ''
          }
        })
        _this.OutField = outArray
        _this.listQuery = outArray2
        _this.searchSelect = searchSelect
        _this.searchText = searchText
        _this.searchDate = searchDate
        });
      })
      .catch(err=>{
       //conosle.log(err)
      })
     },
     //获取表头按钮
     getErpUserOperation(){
      var _this = this
      //通过用户获取按钮列表
      this.$axios.get(this.$path.GetLoginUserInfo)
      .then(res=>{
        let data = eval(res.data)
        let user_data = data.data;
				let userId = user_data.user_loginid;
        if (data.status == '1') {
          _this.$axios.get(_this.$path.getErpUserOperation1+'?user_loginid='+userId+'&AppCodeList=ERP_MAIN')
          .then(res=>{
            var data = res.data
            if(data.errorcode=='002'){
              _this.$message({ message: data.errormsg, type: 'warning' });
            }else{
              _this.headerBtnList = data.data
            }
          })
          .catch(err=>{
            this.$message({ message: '加载异常，请重试！', type: 'warning' });
          })
        }
      })
      .catch(err=>{
        this.$message({ message:'获取用户信息失败！', type: 'warning' });
      })

     },
     //获取表格信息
     getform(type){
      this.loading = true
      var _this = this
      var obj = encodeURI(JSON.stringify(this.listQuery))
      var url = type==1?this.$path.getform+'&searchField='+obj:this.$path.getform
      this.$axios.post(url,{
      // this.$axios.post(this.$path.getform+'?posttype=1&searchField='+obj,{
        pageIndex:this.pagination.currentPage,
        pageSize:this.pagination.pageSize,
        sortOrder:"desc",
        sortvalue:this.searchTable==''?undefined:this.searchTable,
      })
      .then(res=>{
        _this.row=res.data.rows
        _this.pagination.total = res.data.total
        _this.loading = false
        console.log(res.data.rows)
      })
      .catch(err=>{
        _this.loading = false
      })
     },
     //显示表格头部列
     handleCheckedCitiesChange(){
       console.log(this.checkedCities)
     },
     handleSizeChange(value){
       this.pagination.pageSize = value
       this.getform()
     },
     handleCurrentChange(value){
       this.pagination.currentPage = value
       this.getform()
     },
     //新增按钮点击
     addApply(){
       if(this.isPhone){
        window.open(this.$path.urlPath+"/mgene/page/application_model/phoneAddApply2.html?req_code=10044783","_blank");
        return false;
       }else{
        //  window.open(this.$path.urlPath+"/Vue_OmsAndRmsTest/#/oms/editApply","_blank");
         this.$router.push({ path:'/oms/editApply'})
       }

     },
     //点击修改按钮
     clickModify(code,type,row){

        if(code==''){
          if(row){
            var row = row  //获取选中行数据
          }else{
            var row = this.$refs.multipleTable.selection  //获取选中行数据
          }
          console.log(row)
          if(row.length!=1){
            this.$message({ message: '请选中一行数据!', type: 'warning' });
            return false;
          }else{
            code = row[0].req_code
          }
        }
        if(row.req_submit_flag == '1' && row !=99 && type==0){
          this.$confirm('申请单已经签收，只能修改部分信息！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(this.isPhone){
              window.open(this.$path.urlPath+"/mgene/page/application_model/phoneEditApplyOnly2.html?req_code="+code,"_blank");
              return false;
            }
            this.showEditMoble(type,code)
          }).catch(() => {});
        }else{
          if(this.isPhone){
            window.open(this.$path.urlPath+"/mgene/page/application_model/phoneEditApply2.html?req_code="+code,"_blank");
            return false;
          }

          this.showEditMoble(type,code)
        }



     },

     //显示修改弹窗
     showEditMoble(type,code){
       this.dialogVisible = true
       this.req_code = code
       var _this = this
       if(type==0){
         this.activeName2 = 'second'
         this.$nextTick(()=>{
          // this.$refs.editApplyChild.applyEcho(code)
           this.$axios.get(this.$path.getformCode1+'?req_code='+code)
           .then(res=>{
              var data = eval(res.data)
              _this.selectRowsData = data
              let reqList = data.result.reqList   //报告信息
              _this.payData.req_payment_way = parseInt(reqList[0].req_payment_way)
              _this.payData.req_payment_flag = parseInt(reqList[0].req_payment_flag)
              // _this.payData.req_price = reqList[0].req_price
              _this.volatile = reqList[0].RequestStatus == '拒收' ? true : false
              _this.req_submit_flag = reqList[0].req_submit_flag == '1' ? true : false
              _this.payData.req_payment_price = reqList[0].req_payment_price
              _this.payData.ContractNo = reqList[0].ContractNo
              _this.payData.clientPay = reqList[0].clientPay
              _this.payData.req_payment_remark = reqList[0].req_payment_remark
              _this.$refs.editApplyChild.applyEcho(data)
              _this.$nextTick(()=>{
                _this.itemNameSelect = this.$refs.editApplyChild.projectForm.itemNameSelect
                _this.countMoney(data.result.itemResult)
              })

           })
           .catch(err=>{

           })
         })
       }else{
         this.activeName2 = 'first'
       }

       console.log(this.req_code)
     },

     //修改提交按钮
     submitModify(){
       console.log(this.payData)
       this.$refs.editApplyChild.submitForm(this.req_code,this.payData)
       //this.dialogVisible = false
     },

     //申请单删除按钮
     delApplication(code){
       var _this = this
       if(!code){
          var row = this.$refs.multipleTable.selection  //获取选中行数据
          console.log(row)
          if(row.length!=1){
            this.$message({ message: '只能删除单个!', type: 'warning' });
            return false;
          }else{
            code = row[0].req_code
          }
        }

        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.get(_this.$path.deleteform+'?req_code='+code)
          .then(res=>{
            var data = eval(res.data)
            if(data.code == 1000){
                _this.$message({ message: data.result.msg, type: 'success' });
                _this.getform()
            }else{
                _this.$message({ message: data.result.msg, type: 'warning' });
            }
            console.log(res)
          })
          .catch(err=>{
            _this.$message({ message: err, type: 'success' });
          })
        }).catch(() => {});


     },
     //申请单上传按钮
     upload(code){
       if(!code){
          var row = this.$refs.multipleTable.selection  //获取选中行数据
          console.log(row)
          if(row.length!=1){
            this.$message({ message: '请选择一条数据上传!', type: 'warning' });
            return false;
          }else{
            code = row[0].req_code
          }
        }
       this.dialogVisible2 = true
       this.ReqCode = code
     },
     //上传按钮点击确定
     upLoadSumbit(){
        var _this = this
        console.log(this.$refs.upLoadChild.uploadFileId)
        console.log(this.ReqCode)
        var uploadFileId = this.$refs.upLoadChild.uploadFileId
        if(uploadFileId==''){
            _this.$message({
              message: '请先确定上传文件！',
              type: 'warning'
            });
            return false;
        }
        this.$axios.post(this.$path.Attachment+'?type=0&ReqCode='+this.ReqCode+'&reqfileid='+uploadFileId.join(','))
        .then(res=>{
          let data = eavl(res.data)
          if(data.code==1000){
            _this.$message({
              message: '上传文件成功！',
              type: 'success'
            });
          }else{
            _this.$message({
              message: '上传文件失败！！',
              type: 'warning'
            });
          }
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
        this.dialogVisible2 = false
     },
     //申请单申请按钮
     report(code){
        if(!code){
          var row = this.$refs.multipleTable.selection  //获取选中行数据
          console.log(row)
          if(row.length<1){
            this.$message({ message: '请选择要查看的申请单!', type: 'warning' });
            return false;
          }else{
            var arr = Array()
            row.forEach(item=>{
              var obj = {
                req_code:item.req_code
              }
              arr.push(obj)
            })
          }
        }
       this.applyForm.reqList = arr
       this.applyForm.tdr_phone =  ''
       this.applyForm.tdr_type =  ''
       this.applyForm.tdr_address =  ''
       this.applyForm.tdr_remark =  ''
       this.dialogVisible3 = true
     },
     //申请单申请提交按钮
     reportSumbit(){
       var _this = this
       this.$axios.post(this.$path.DataRequest,{
         postType:0,
         type:0,
         itemstr:JSON.stringify(_this.applyForm),
        //  ReqCode:_this.ReqCode
       })
       .then(res=>{
         let data =eval(res.data)
         if(data.code == 1000){
           this.$message({ message: '数据申请提交成功！', type: 'success' });
           this.dialogVisible3 = true
           this.getform()
         }else{
           this.$message({ message: '数据申请提交失败！', type: 'warning' });
         }
         console.log(res)
       })
       .catch(err=>{
         this.$message({ message: '数据申请提交失败！', type: 'warning' });
       })

     },
     //申请单批量开单按钮
     batchApplication(){
       this.dialogVisible4 = true
     },
     //收银台按钮点击
     showPayee(){
        this.innerVisible4 = true
        var repTable = this.$refs.editApplyChild.projectForm.repTable
        this.countMoney(repTable)
     },
     //计算收银台应收金额
     countMoney(repTable){
        var sumPrice = 0;
        repTable.forEach((item,index)=>{
            // _this.payData.grp_price += parseFloat(item.grp_price)
            sumPrice +=(item.grp_price*item.grp_index_num)+(item.grp_custom_price*item.grp_custom_num)
        })
        this.payData.req_price = sumPrice
     },
     //位点弹窗确定
     siteEditSumbit(){
       this.siteData= this.$refs.siteEditChild.siteData
       console.log(this.siteData)
       this.$refs.editApplyChild.siteData = this.siteData
        if(this.$refs.siteEditChild.checkSite()!=false){
          this.innerVisible5 = false
        }

     },
      //补样，试做弹窗
     onfirm(type){
       this.sample.applyRemark = ''
       if(type==2){
          this.innerVisible = true
       }else if(type==3){
         this.innerVisible3 = true
       }else{
         this.innerVisible2 = true
       }
     },

     //样本补样,退样,试做 处理确定
     onfirmApply(type){
       var _this = this
       var bar_id = this.selectRowsData.result.itemResult[0].bar_sn
       var name=''
       var returnFile = this.$refs.upLoadChild.uploadFileId
       var url = this.$path.ApplySample+'?BarSn='+bar_id+'&type='+type+'&remark='+this.sample.applyRemark
       if(type==2){
          this.innerVisible = false
          name='补样'
       }else if(type==3){
          this.innerVisible3 = false
          name='退样'
          url = this.$path.ApplySample+'?BarSn='+bar_id+'&type=0&remark='+this.sample.applyRemark+'&FileID='+returnFile
       }else{
          this.innerVisible2 = false
          name='试做'
       }


       this.$axios.post(url)
       .then(res=>{
         console.log(res)
         var data = eval(res.data)
         if (data.code == '1000') {
              _this.$message({ message: name+'申请成功!请等待处理!', type: 'success' })
          }
          else{
              _this.$message({ message: name+'申请出错，请重新确认', type: 'warning' })
          }
       })
       .catch(err=>{
         _this.$message({ message: name+'申请出错，请重新确认', type: 'warning' })
       })
     },
     //申请修改项目弹窗
     EditApplySample(){
          this.editApplySample.itemSelect = ''
          this.editApplySample.change_price = ''
          this.editApplySample.reason = ''
          this.innerVisible6 = true

     },
     //申请修改项目提交
     ItemEditApplySample(){
       var subData = qs.stringify({
         file_id:this.$refs.upLoadChild.uploadFileId,
         type:2,
         address:undefined,
         itemSelect:this.editApplySample.itemSelect,
         change_price:this.editApplySample.change_price,
         reason:this.editApplySample.reason,
         specid:undefined,
         req_code: this.selectRowsData.result.itemResult[0].bar_sn
       })
       this.$axios.post(this.$path.ItemEditApplySample,subData)
       .then(res=>{
         let data = eval(res.data)
         if(data == 1000){
          _this.$message({ message: '修改项目申请成功，详情请看审批管理！', type: 'success' })
          this.innerVisible6 = false
         }else{
           _this.$message({ message: data.result.msg, type: 'warning' })
         }
       })
       .catch(err=>{
         _this.$message({ message: err, type: 'warning' })
       })
     },
      //表格行控制
      tableRowClassName({row, rowIndex}){
        if(row.req_submit_flag != 0){
          return 'warning-row';
        }else{

        }
        return '';
      },
      selectRowChange(row,col,event){
          row.flag = !row.flag;
          this.$refs.multipleTable.toggleRowSelection(row,row.flag);
      },
      //导出表格
      exportData(){
        console.log(this.$path.getform)
        console.log(this.$path.getform1)
        window.location.href= this.$path.getform1+'&posttype=2&OutField='+encodeURI(JSON.stringify(this.OutField))+'&searchField='+encodeURI(JSON.stringify(this.listQuery));
        return false
      },
      searchFrom(){
        this.pagination.currentPage = 1
        this.getform()
        return false
      },
   },
   components:{
     ViewApply,
     Upload,
     editApply,
     Cashier,
     siteEdit
   }
}
</script>
<style lang="scss">
  .queryMain .el-select,.queryMain .el-form-item__content{
    width: 240px;
  }
  .queryMain .mMain .el-select,.queryMain .mMain .el-form-item__content{
    width: auto;
  }
  .search-box .el-select,.search-box .el-form-item__content{
    width: 350px;
  }
  .float_right{
    float: right;
  }
  .queryMain{
    .el-dialog__body{
      padding: 10px 20px;
    }
  }
  .applyModel .el-form-item__content{
    width: auto;
  }
  .editTopBtn{
    text-align: right;
    position:absolute;
    right: 40px;
    z-index: 9999;
  }
  .w100{
    .el-select{
      width: 100%;
    }
  }
   .el-table .warning-row {
    //  background: #dfdfdf;
    .cell{
      color: rgb(202, 202, 202);
    }
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  @media screen and (max-width:750px){
    .app-container,.el-card__body{
      padding: 0;
    }
    .el-button{
      padding: 8px 15px;
      margin-bottom: 5px;
    }
    .el-card{
      background-color:transparent;
    }
    .el-form-item__label{
      width: 80px !important;
    }
    .el-form-item__content,.el-select{
      width: 215px !important;
    }
    .el-table .cell.el-tooltip{
      white-space:normal;
    }
    .el-button+.el-button{
      margin-left: 0;
    }
    .el-dialog{
      width: 95% !important;
      .el-dialog__body{
        padding: 0 !important;
      }
      .el-form-item__label{
        width: 120px !important;
      }
    }
    .el-form--inline .el-form-item{
        margin-right:0 !important;
      }
    .float_right{
      margin:0 !important;
      .el-form-item__content{
            line-height: 35px !important;
      }
      .el-form-item__content, .el-select{
        width: 150px !important;
        input{
          height: 35px !important;
        }
      }
    }
    .el-date-range-picker{
      left: 5px !important;
      width: 360px;
      overflow-x: auto;
    }
    .el-message-box{
      width: auto !important;
    }
  }
</style>
