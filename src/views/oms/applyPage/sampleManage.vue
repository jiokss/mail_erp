<template>
<!-- 样本管理 -->
    <div class="queryMain app-container">
      <div class="tabs">
        <ul>
          <li @click="changeTabs(item.id)" v-for="(item,index) in tabsList" :key="index" :class="tabsActive==item.id?'active':''">{{ item.name }}</li>
        </ul>
      </div>
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
          <el-button v-for="(item,index) in btnList" :key="index" @click="topBtnList(item.op_title)">{{ item.op_title }}</el-button>
          <div :inline="true" class="demo-form-inline float_right">
            <el-input style="width:auto;" placeholder="搜索" v-model="searchTable"  @keyup.enter.native="searchFrom()"></el-input>
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
          style="width: 100%"
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
            :width="150"
            :fixed="index<3?true:false"
            >
            <template slot-scope="scope">
              <span v-if="item.id=='resultStr'">
                <span style="color:red" v-if="scope.row[item.id] == '未完成'">未完成</span>
                <span style="color:#59ff7a" v-if="scope.row[item.id] == '已完成'">已完成</span>
              </span>
              <el-input size="mini" v-else-if="item.id=='rep_num'&&scope.row['resultStr'] == '未完成'" v-model="scope.row.rep_num" placeholder="请输入内容"></el-input>
              <el-input size="mini" v-else-if="item.id=='rep_InvoiceCode'&&scope.row['resultStr'] == '未完成'" v-model="scope.row.rep_InvoiceCode" placeholder="请输入内容"></el-input>
              <el-input size="mini" v-else-if="item.id=='rep_InvoicePrice'&&scope.row['resultStr'] == '未完成'" v-model="scope.row.rep_InvoicePrice" placeholder="请输入内容"></el-input>
              <el-input size="mini" v-else-if="item.id=='rep_InvoiceRemark'&&scope.row['resultStr'] == '未完成'" v-model="scope.row.rep_InvoiceRemark" placeholder="请输入内容"></el-input>
              <span v-else>{{ scope.row[item.id] }}</span>
            </template>

          </el-table-column>

          <el-table-column
            prop="address"
            label="操作"
            fixed="right"
            min-width="250px"
            show-overflow-tooltip>
            <template slot-scope="scope">
                <span v-for="(item,index) in btnList" :key="index" class="btnList" v-if="item.op_title!='导出'">
                  <el-button size="small" v-if="item.op_title=='摧毁样本'" @click="destroy_sample(scope.row)">{{ item.op_title }}</el-button>
                  <el-button size="small" v-if="item.op_title=='编辑'" @click="clickModify(scope.row.req_code,0)">{{ item.op_title }}</el-button>
                  <el-button size="small" v-if="item.op_title=='重新交接'" @click="upload(scope.row.req_code,item.op_title)">{{ item.op_title }}</el-button>
                  <el-button size="small" v-if="item.op_title=='签收'" @click="sample_receive(scope.row,item.op_title)">{{ item.op_title }}</el-button>
                  <el-button size="small" v-if="item.op_title=='接收'" @click="sample_receive(scope.row,item.op_title)">{{ item.op_title }}</el-button>
                  <el-button size="small" v-if="item.op_title=='拒收'" @click="sample_rejection(scope.row,item.op_title)">{{ item.op_title }}</el-button>
                  <el-button size="small" v-if="item.op_title=='退样'" @click="sample_rejection(scope.row,item.op_title)">{{ item.op_title }}</el-button>
                  <el-button size="small" v-if="item.op_title=='详情'" @click="clickModify(scope.row.req_code,1)">{{ item.op_title }}</el-button>
                  <el-button size="small" v-if="item.op_title=='上传'" @click="upload(scope.row.req_code)">{{ item.op_title }}</el-button>
                  <el-button size="small" v-else-if="item.op_title=='打印'" @click="printing(scope.row)">{{ item.op_title }}</el-button>
                </span>

                  <!-- <el-button size="small" v-for="(item,index) in btnList" :key="index" v-else-if="item.op_title=='打印'">{{ item.op_title }}</el-button>
                  <el-button size="small" v-for="(item,index) in btnList" :key="index" v-else>3</el-button> -->
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
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </el-card>



      <!-- 修改选项弹窗 -->
      <el-dialog
        title="修改"
        :visible.sync="dialogVisible"
        width="80%"
        top="3vh"
        >
        <div class="editTopBtn" v-if="activeName2=='second'">
           <el-button size="mini" @click="showPayee">收银台</el-button>
           <el-button size="mini" @click="innerVisible = true">保存</el-button>
        </div>
        <!-- 收银台弹窗 -->
        <el-dialog
          width="50%"
          title="收银台"
          :visible.sync="innerVisible4"
          append-to-body>
          <Cashier ref="cashierChild" :payData="payData"></Cashier>
          <span slot="footer" class="dialog-footer">
            <el-button @click="innerVisible4 = false">取 消</el-button>
            <el-button type="primary" @click="innerVisible4 = false">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 收银台弹窗 end-->
        <el-tabs v-model="activeName2" type="card" v-if="dialogVisible" @tab-click="handleClick(activeName2)">
          <el-tab-pane label="详 情" name="first" v-if="activeName2=='first'">
            <ViewApply :req_code="req_code"></ViewApply>
          </el-tab-pane>
          <el-tab-pane label="修 改" name="second" v-if="activeName2=='second'">
            <!-- <iframe ref="editApply" v-if="activeName2=='second'" style="width:100%;height:600px;" class="ifa" scrolling=auto :src="path+req_code" frameborder="0"></iframe> -->
            <editApply ref="editApplyChild" :data="1"></editApply>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitModify" v-if="activeName2=='second'">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改选项弹窗 end-->


      <!-- 接收,签收弹窗 -->
      <el-dialog
        :title="titleName"
        :visible.sync="receiveVisible"
        width="40%"
        top="7vh"
        >
        <el-tabs type="card">
          <el-form ref="form" label-width="80px" class="wForm">
            <el-form-item label="数量：">
              <el-input v-model="receive.receiveNum"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="textarea" v-model="receive.receiveRemark"></el-input>
            </el-form-item>
          </el-form>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="receiveVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmReceive">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 接收弹窗 end-->

      <!-- 拒收,退样弹窗 -->
      <el-dialog
        :title="titleName2"
        :visible.sync="rejectionVisible"
        width="40%"
        top="7vh"
        >
        <el-tabs type="card">
          <el-form ref="rejection" label-width="100px" class="wForm">
            <el-form-item label="用户名：">
              <el-input v-model="rejection.rejectionName"></el-input>
            </el-form-item>
            <el-form-item label="密码：">
              <el-input v-model="rejection.rejectionPass"></el-input>
            </el-form-item>
            <el-form-item label="拒收理由：">
              <el-input type="textarea" v-model="rejection.rejectionRemark"></el-input>
            </el-form-item>
          </el-form>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectionVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmRejectionReceive">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 拒收弹窗 end-->

      <!-- 上传文件，样本重新交接 弹窗 -->
      <el-dialog
        :title="titleName3"
        :visible.sync="dialogVisible2"
        width="50%"
        top="7vh"
        >
        <el-alert
          v-if="titleName3=='重新交接'"
          :closable="false"
          title="确认重新交接前，请务必于销售确认，获取标本试做知情同意书，并在下方上传扫描版样本试做知情同意书。谢谢！"
          type="info">
        </el-alert>
        <el-tabs type="card">
          <upLoad ref="upLoadChild" :guid="guid" v-if="dialogVisible2"></upLoad>
        </el-tabs>
        <el-input type="textarea" v-model="redoRemark" v-if="titleName3=='重新交接'" placeholder="请输入备注信息。。"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="upLoadSumbit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 上传文件，样本重新交接弹窗 end-->
      <!-- 样本摧毁弹窗 -->
      <el-dialog
        title="摧毁样本"
        :visible.sync="dialogVisible3"
        width="50%"
        top="7vh"
        >
        <el-alert
          :closable="false"
          title="提示：是否确认销毁样本，请务必于销售确认。谢谢！"
          type="info">
        </el-alert>
        <el-input type="textarea" style="margin-top:25px" v-model="destroyRemark" placeholder="请输入备注信息。。"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="destroy_sumbit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 样本摧毁弹窗 end-->
    </div>
</template>
<script>
import ViewApply from './viewApply'
import editApply from './editApply'
import upLoad from './components/upLoad'
import qs from 'qs'
export default {
   data() {
      return {
        searchTable:'',
        dialogVisible:false,    //详情，修改弹窗
        receiveVisible:false,    //接受弹窗
        rejectionVisible:false,   //拒收弹窗
        dialogVisible2:false,     //上传弹窗
        dialogVisible3:false,     //样本摧毁交接
        innerVisible4:false,    //收银台弹窗
        selectRowsData:[],
        redoRemark:'',  //重新交接备注
        destroyRemark:'',   //摧毁样本备注
        ReqCode:'',
        req_code:'',
        guid:'',
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
        activeName2:'first',
        showEdit:false,   //是否显示修改
        titleName:'样本接收',   //接收,签收
        titleName2:'样本拒收',    //拒收，退样
        titleName3:'上传文件',    //上传文件，样本重新交接
        btnList:[],
        tabsList:[
          {'id':'0','name':'所有样本'},
          {'id':'1','name':'待接收'},
          {'id':'2','name':'已接受'},
          {'id':'3','name':'待签收'},
          {'id':'4','name':'已签收'},
          {'id':'5','name':'信息维护'},
          {'id':'6','name':'退样'},
          {'id':'7','name':'暂存'},
          {'id':'8','name':'拒收'}
          ],
        tabsActive:'0',
        dialogVisible:false,
        guid:'0',
        req_date:'',
        bar_receive_date:'',
        sam_sign_time:'',
        listQuery:{},
        pagination:{
          pageSize:10,    //每页显示条数
          total:0,        //总页数
          currentPage:1,    //当前页数
        },
        menuList:[],
        OutField:{},
        headerBtnList:[{
          "op_id": 51,
          "op_name": "application_add",
          "op_url": "application/Add",
          "op_method": "Get",
          "op_remark": "新增申请单",
          "app_id": 4,
          "sort_id": 1,
          "create_time": "2018-02-26 14:11:26",
          "update_time": "2018-04-02 13:57:27",
          "del_flag": 0,
          "op_title": "新增",
          "op_icon_url": null
        }],
        options: [],  //状态筛选列表
        value6: '',
        row: [],
        multipleSelection: [],
        guid:'0',
        ReqCode:'',
        checkedCities:[],
        menuCodeList:'sample_all',
        formatted:'formatted',
        type:'25',
        receive:{     //接收弹窗信息
          receiveNum:'1',
          receiveRemark:'',
        },
        rejection:{
          rejectionName:'',
          rejectCode:'',
          rejectionPass:'',
          rejectionRemark:''
        },
        selectRow:[],     //选中行数
        OutField:[],
        searchSelect:[],
        searchText:[],
        searchDate:[],
        showHideSeach:false,
        loading:true,
      }
   },
   activated() {
   },
   created(){
     this.GetMenuOperationList()
     this.GetMenuFieldList()
     this.getform()
   },
   mounted(){
    var _this = this
    var dataId = ''
   },
   methods:{
     //切换类型
     changeTabs(id){
       var _this = this
       this.tabsActive=id
       if(id=='0'){
          _this.menuCodeList = 'sample_all'
          _this.type = '25'
       }else if(id=='1'){
         _this.menuCodeList = 'sample_receive'
         _this.type = '0'
       }else if(id=='2'){
         _this.menuCodeList = 'sample_received'
         _this.type = '1'
       }else if(id=='3'){
         _this.menuCodeList = 'sample_sign'
         _this.type = '2'
       }else if(id=='4'){
         _this.menuCodeList = 'sample_signed'
         _this.type = '3'
       }else if(id=='5'){
         _this.menuCodeList = 'sample_information'
         _this.type = '3'
       }else if(id=='6'){
         _this.menuCodeList = 'sample_back'
         _this.type = '4'
       }else if(id=='7'){
         _this.menuCodeList = 'sample_temporary'
         _this.type = '5'
       }else if(id=='8'){
         _this.menuCodeList = 'sample_rejection'
         _this.type = '6'
       }else{
         _this.menuCodeList = 'sample_all'
         _this.type = '25'
       }
        this.$nextTick(() => {
          this.GetMenuOperationList()
          this.GetMenuFieldList()
          this.getform()
        });
       console.log(id)

     },
     //查询搜索按钮
     search(){
       this.searchTable = ''
       let req_date = this.listQuery.req_date
       let bar_receive_date = this.listQuery.bar_receive_date
       let sam_sign_time = this.listQuery.sam_sign_time
       if(req_date!='' && this.listQuery.req_date) this.listQuery.req_date = '>'+req_date[0]+'<'+req_date[1]
       if(bar_receive_date!='' && this.listQuery.bar_receive_date) this.listQuery.bar_receive_date = '>'+bar_receive_date[0]+'<'+bar_receive_date[1]
       if(sam_sign_time!='' && this.listQuery.sam_sign_time) this.listQuery.sam_sign_time = '>'+sam_sign_time[0]+'<'+sam_sign_time[1]
       let searchField = '?posttype=1&searchField='+JSON.stringify(this.listQuery)
       this.pagination.currentPage = 1
       this.pagination.pageSize = 10
       this.getform(searchField)
     },
     //获取表格按钮信息
     GetMenuOperationList(){
       var _this = this
       this.$axios.get(
         this.$path.sampGetMenuOperationList+'?menuCodeList='+_this.menuCodeList+'&returnType=formatted&t='+new Date().getTime()
         ).then(res=>{
           var data = eval(res.data)
           console.log(data.data)
           _this.btnList = data.data
           console.log(res)
         }).catch(err=>{
           this.$message({ message: '获取表头信息出错，请重新加载！', type: 'warning' });
           console.log(err)
         })
     },
     //获取表格头部列表
     GetMenuFieldList(){
      var _this = this
      var menu = 'sample_all'
      this.$axios.get(_this.$path.sampGetMenuFieldList+'?menuCodeList='+_this.menuCodeList+'&returnType=formatted&t='+new Date().getTime())
      .then(res=>{
        _this.menuList = res.data.data
        res.data.data.forEach((item,index) => {
          _this.checkedCities.push(item.name)
          if(item.id=="RequestStatus"){
            _this.options = item.data
          }
        });
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
      })
      .catch(err=>{
       this.$message({ message: '获取表头信息出错，请重新加载！', type: 'warning' });
       console.log(err.ExceptionMessage)
      })
     },
     //获取表格信息
     getform(data){
      var _this = this
      _this.loading = true
      var dataC=">"+_this.getPreMonthDay(_this.curentTime(),30)+"<"+_this.curentTime()+"";
      var obj = encodeURI(JSON.stringify(this.listQuery))
      if(data){
        var url = this.$path.Getsample+'?type='+_this.type+'&posttype=1&searchField='+obj
      }else{
        var url = this.$path.Getsample+'?type='+_this.type+'&posttype=1&searchField={"req_date":"'+dataC+'"}'
      }

      this.$axios.post( url ,{
        pageIndex:this.pagination.currentPage,
        pageSize:this.pagination.pageSize,
        sortOrder:"desc",
        sortvalue:this.searchTable==''?undefined:this.searchTable,
      })
      .then(res=>{
        var _this = this
        _this.row = res.data.rows
        console.log(_this.row)
        _this.loading = false
        _this.pagination.total = res.data.total
      })
      .catch(err=>{
        _this.loading = false
        this.$message({ message: '获取表格信息出错，请重试！', type: 'warning' });
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
     //文件导入
     importXlsx(){
        $("#file").trigger("click")
      },
      //获取当前日期
      curentTime() {
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var clock = year + "-";
        if(month < 10)
            clock += "0";
        clock += month + "-";
        if(day < 10)
            clock += "0";
        clock += day + "";
        return(clock);
      },
      //获取前几个月的具体日期
      getPreMonthDay(date, monthNum) {
        let dateArr = date.split('-');
        let year = dateArr[0]; //获取当前日期的年份
        let month = dateArr[1]; //获取当前日期的月份
        let day = dateArr[2];//获取当前日期的日
        let days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        let year2 = year;
        let month2 = parseInt(month) - monthNum;
        if (month2 <= 0) {
            year2 =
                parseInt(year2) -
                parseInt(month2 / 12 == 0 ? 1 : Math.abs(parseInt(month2 / 12)) + 1);
            month2 = 12 - (Math.abs(month2) % 12)
        }
        let day2 = day;
        let days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2
        }
        if (month2 < 10) {
            month2 = '0' + month2
        }
        let t2 = year2 + '-' + month2 + '-' + day2;
        return t2
      },
      //详情按钮
      sample_detail(row){
        this.dialogVisible = true
        // this.$refs.upLoadChild.GetFileByGuid(row.FileIDStr)
        this.req_code = row.req_code
        console.log(row)
      },
      //打印按钮
      printing(row){
        var bar_code = row.bar_code
        var num = 1
        this.$axios.post(this.$path.Print+'?BarCode='+bar_code+'&num='+num)
        .then(res=>{
          let data = eval(res.data)
          console.log(data)
          console.log(data.code)
          if(data.code==1000){
              this.$message({ message: '打印成功！', type: 'success' });
          }else {
              this.$message({ message: '打印出错，请重新确认！', type: 'warning' });
          }
        })
        .catch(err=>{
          this.$message({ message: '打印出错，请重新确认！', type: 'warning' });
        })
      },
      //顶部按钮组点击
      topBtnList(name){
        console.log(name)
        var outArray = {
          BarStatus: "状态",
          bar_born_flag: "产前产后",
          bar_code: "检测号",
          bar_item_name: "项目",
          bar_receive_date: "接收时间",
          bar_receiver_name: "接收人",
          check_method_name: "检测方法",
          grp_encoded: "项目代码",
          grp_price: "单价",
          org_name: "开单机构",
          pat_familyno: "家庭号",
          pat_name: "姓名",
          relationStr: "对象栏",
          req_date: "申请时间",
          req_depart_name: "科室",
          req_doc_name: "医生",
          req_payment_price: "实收",
          req_price: "总价",
          req_user_name: "申请人",
          sam_sign_time: "签收时间",
          sam_sign_user_name: "签收人",
          sp_name: "样本类型"
        }
        var searchArray = this.listQuery
        var row = this.$refs.multipleTable.selection  //获取选中行数据
        let code = ''
        //导出按钮
        if(name=='导出'){
          console.log(this.listQuery)
          var tableUrl="sample/Getsample?type="+this.type+"&";
          window.location.href=''+this.$path.Getsample+'/'+tableUrl+'&posttype=2&OutField='+JSON.stringify(outArray)+'&searchField='+JSON.stringify(searchArray);
        }
        //导出按钮
        if(name=='详情'){
          if(row.length!=1){
            this.$message({ message: '请选中一行数据!', type: 'warning' });
            return false;
          }else{
            code = row[0].req_code
          }
          this.dialogVisible = true
          this.req_code = code
        }
        //打印按钮
        if(name=='打印'){
          if(row.length!=1){
            this.$message({ message: '请选中一行数据!', type: 'warning' });
            return false;
          }else{
            this.printing(row)
          }
        }
        //拒收按钮
        if(name=='拒收' || name=='接收'|| name=='签收' || name=='退样'){
          if(row.length<1){
            this.$message({ message: '请选中数据!', type: 'warning' });
            return false;
          }else{
            if(name=='拒收' || name=='退样'){
              this.sample_rejection(row,name)
            }else if(name=='接收' || name=='签收'){
              this.sample_receive(row,name)
            }
          }
        }
        //上传
        if(name=="上传"||name=='重新交接'){
          this.upload(name)
        }
        //样本摧毁
        if(name=='摧毁样本'){
          if(row.length<1){
            this.$message({ message: '请选中数据!', type: 'warning' });
            return false;
          }else{
            this.destroy_sample(row)
          }

        }

      },
      //样本摧毁
      destroy_sample(row){
        this.dialogVisible3 = true
        this.selectRow = row
        this.destroyRemark = ''
      },
      //样本摧毁确定
      destroy_sumbit(row,name){
        if(this.selectRow.length>0){
          let arr = []
          this.selectRow.forEach(item=>{
            console.log(item.bar_sn)
            arr.push(item.bar_sn)
          })
          var bar_sn = arr.join(',')
        }else{
          var bar_sn = this.selectRow.bar_sn
        }
        var _this = this
        this.$axios.post(this.$path.DestroySample+'?barsn='+bar_sn+'&remark='+this.destroyRemark)
        .then(res=>{
          let data = eval(res.data)
          if (data.code == 1000) {
            _this.$message({ message: '样本销毁操作成功!', type: 'success' });
            _this.dialogVisible3 = false
            _this.getform()
          }else{
            _this.$message({ message: data.result.msg, type: 'warning' });
          }
        })
        .catch(err=>{
          _this.$message({ message: '样本销毁操作成功出错，请重新确认！', type: 'warning' });
        })
      },
      //接收,签收按鈕
      sample_receive(row,name){

        this.titleName = '样本'+name
        this.receiveVisible = true
        this.selectRow = row
        this.receive.receiveNum = '1'
        this.receive.receiveRemark = ''
      },
      //样本接收确定，签收确定
      confirmReceive(){
        if(this.selectRow.length>0){
          let arr = []
          this.selectRow.forEach(item=>{
            console.log(item.bar_sn)
            arr.push(item.bar_sn)
          })
          var bar_sn = arr.join(',')
        }else{
          var bar_sn = this.selectRow.bar_sn
        }
        var _this = this
        var receiveNum = this.receive.receiveNum
        var receiveRemark = this.receive.receiveRemark
        if(this.titleName == '样本接收'){
          var url = this.$path.RecSample+'?bar_sn='+bar_sn+'&num='+receiveNum+'&remark='+receiveRemark
        }else{
          var url = this.$path.signsample+'?bar_sn='+bar_sn+'&num='+receiveNum+'&remark='+receiveRemark
        }
        this.$axios.post(url)
        .then(res=>{
          let data = eval(res.data)
          if (data.code == 1000) {
            _this.$message({ message: _this.titleName +'成功!', type: 'success' });
            _this.receiveVisible = false
            _this.getform()
          }else{
            _this.$message({ message: data.result.msg, type: 'warning' });
          }
        })
        .catch(err=>{
          _this.$message({ message: _this.titleName +'出错，请重新确认！', type: 'warning' });
        })
      },

      //拒受按鈕
      sample_rejection(row,name){
        this.titleName2 = '样本'+name
        this.selectRow = row
        console.log(row)
        this.rejectionVisible = true
        this.rejection.rejectionName = ''
        this.rejection.rejectionPass = ''
        this.rejection.rejectionRemark = ''

      },
      //样本拒收确定
      confirmRejectionReceive(){
        if(this.selectRow.length>0){
          let arr = []
          this.selectRow.forEach(item=>{
            console.log(item.bar_sn)
            arr.push(item.bar_sn)
          })
          var bar_sn = arr.join(',')
        }else{
          var bar_sn = this.selectRow.bar_sn
        }
        let rejectionRemark = this.rejection.rejectionRemark
        let name = this.rejection.rejectionName
        let pass = this.rejection.rejectionPass
        var _this = this
        if(rejectionRemark ==''|| name=='' || pass==''){
          this.$message({ message: '请确认信息是否完整!', type: 'warning' });
          return false;
        }

        if(this.titleName2 == '样本拒收'){
          var url = this.$path.RejectSample+'?bar_sn='+bar_sn+'&num=1&remark='+rejectionRemark
        }else{
          var url = this.$path.ReturnSample+'?bar_sn='+bar_sn+'&num=1&remark='+rejectionRemark
        }
        var obj= qs.stringify({
          user_loginid: name,
          user_password: pass
        })
        this.$axios.post(this.$path.CheckRequestFormUser,obj)
        .then(res=>{
          let data = eval(res.data)
          if(data.status == 1){
            _this.$axios.post(url)
            .then(res=>{
              let data = eval(res.data)
              if(data.code == 1000){
                _this.$message({ message: _this.titleName2+'成功!', type: 'success' });
                _this.rejectionVisible = false
                _this.getform()
              }else{
                _this.$message({ message: data.result.msg, type: 'warning' });
              }
            })
            .catch(err=>{
              console.log(err)
              _this.$message({ message: _this.titleName2+'出错，请重新确认！', type: 'warning' });
            })
          }else{
            _this.$message({ message:_this.titleName2+'失败!请确认操作用户和密码是否正确！', type: 'warning' });
          }
        })
        .catch(err=>{
          console.log(err)
        })
      },
      //上传按钮
     upload(code,name){
       if(!code){
          var row = this.$refs.multipleTable.selection  //获取选中行数据
          console.log(row)
          if(name!='重新交接'){
            if(row.length<1){
              this.$message({ message: '请选中数据!', type: 'warning' });
              return false;
            }else{
              code = row[0].req_code
            }
          }else{
            if(row.length!=1){
              this.$message({ message: '请选择一条数据上传!', type: 'warning' });
              return false;
            }else{
              code = row[0].req_code
            }
            this.titleName3 = name
          }
        }
       this.redoRemark = ''
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
        if(this.titleName3=='重新交接'){
          var url = this.$path.ReTransfer+'?barsn='+this.ReqCode+'&remark='+this.redoRemark+'&fileID='+uploadFileId.join(',')
        }else{
          var url = this.$path.Attachment+'?type=0&ReqCode='+this.ReqCode+'&reqfileid='+uploadFileId.join(',')
        }
        // ''+path+'/sample/ReTransfer?barsn='+afreshCode.substring(0,afreshCode.length-1)+'&remark='+redoRemark+'&fileID='+uploadRedoFile+'',
        this.$axios.post(url)
        .then(res=>{
          let data = eval(res.data)
          if(data.code==1000){
            _this.$message({
              message: _this.titleName3+'成功！',
              type: 'success'
            });
            _this.dialogVisible2 = false
            _this.getform()
          }else{
            _this.$message({
              message: _this.titleName3+'失败！！',
              type: 'warning'
            });
          }
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })

     },
     //修改提交按钮
     submitModify(){
       console.log(this.payData)
       this.$refs.editApplyChild.submitForm(this.req_code,this.payData)
       this.dialogVisible = false
     },

     //申请单删除按钮
     delApplication(code){
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
       this.$axios.get(this.$path.deleteform+'?req_code='+code)
       .then(res=>{
         var data = eval(res.data)
         if(data.code == 1000){
            this.$message({ message: '删除成功！', type: 'success' });
            this.getform()
         }else{
            this.$message({ message: data.result.msg, type: 'warning' });
         }
         console.log(res)
       })
       .catch(err=>{
         console.log(err)
       })
     },
     //点击修改按钮
     clickModify(code,type){
       console.log(code)
        if(code==''){
          var row = this.$refs.multipleTable.selection  //获取选中行数据
          console.log(row)
          if(row.length!=1){
            this.$message({ message: '请选中一行数据!', type: 'warning' });
            return false;
          }else{
            code = row[0].req_code
          }
        }

       this.dialogVisible = true
       this.req_code = code
       var _this = this
       if(type==0){
         this.activeName2 = 'second'
         this.$nextTick(()=>{
          // this.$refs.editApplyChild.applyEcho(code)
           this.$axios.get(this.$path.getformCode1+'?req_code='+code)
           .then(res=>{
             console.log(res)
              var data = eval(res.data)
              _this.selectRowsData = data
              let reqList = data.result.reqList   //报告信息
              _this.payData.req_payment_way = parseInt(reqList[0].req_payment_way)
              _this.payData.req_payment_flag = parseInt(reqList[0].req_payment_flag)
              _this.payData.req_price = reqList[0].req_price
              _this.payData.req_payment_price = reqList[0].req_payment_price
              _this.payData.ContractNo = reqList[0].ContractNo
              _this.payData.clientPay = reqList[0].clientPay
              _this.payData.req_payment_remark = reqList[0].req_payment_remark
              console.log(this.$refs.editApplyChild)
             this.$refs.editApplyChild.applyEcho(data)
             this.$refs.editApplyChild.hideProBtn(1)
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
      //  this.dialogVisible = false

     },
     //收银台按钮点击
     showPayee(){
       this.innerVisible4 = true
     },
     //切换tab页
      handleClick(name) {
        if(name=='second'){
          this.clickModify(this.req_code,0)
        }
      },
      selectRowChange(row,col,event){
          row.flag = !row.flag;
          this.$refs.multipleTable.toggleRowSelection(row,row.flag);
      },
      searchFrom(){
        this.pagination.currentPage = 1
        this.getform()
        return false
      },
   },
   components:{
     upLoad,
     ViewApply,
     editApply
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
  .applyModel .el-form-item__content{
    width: auto;
  }
  .float_right{
    float: right;
  }
  .w-100{
    .el-form-item__content{
      width: auto;
    }
  }
  .tabs{
    border-left:1px solid #ddd;
    margin-bottom: 20px;
    ul{
      clear: both;
      overflow: hidden;
      padding: 0;
      margin: 0;
    }
    li{
      float: left;
      list-style: none;
      padding: 10px 30px;
      cursor: pointer;
      border-top:1px solid #ddd;
      border-bottom:1px solid #ddd;
      border-right:1px solid #ddd;
    }
    li:hover,li.active{
      background: #409EFF;
      color: #fff;
    }
  }
  .btnList{
    margin-right:5px
  }
  .btnList:last-child{
    margin-right:0;
  }
  .wForm{
    .el-form-item__content{
      width: 80%;
    }
  }
  .queryMain{
    .el-dialog__body{
      padding: 10px 20px;
    }
  }
  .editTopBtn{
    text-align: right;
    position:absolute;
    right: 40px;
    z-index: 9999;
  }
</style>
