<!-- 任务池 -->
<template>
<!-- 消息中心 -->
    <div class="queryMain app-container">
      <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-message"></i>
          <span>任务仪表盘</span>
          <el-button
            style="float:right"
            @click="showSearch1=!showSearch1"
            size="small">
            {{ !showSearch1 ? '收 起' : '展 开' }}
          </el-button>
        </div>
        <div style="margin-top: 15px" class="search-box" v-show="!showSearch1">
          <div class="charts">
            <div id="barGraph" style="height: 350px;"></div>
          </div>
        </div>
      </el-card>
      <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-message"></i>
          <span>消息中心</span>
          <el-button
            style="float:right"
            @click="showSearch2=!showSearch2"
            size="small">
            {{ !showSearch2 ? '收 起' : '展 开' }}
          </el-button>
        </div>
        <div style="margin-top: 15px" class="search-box" v-show="!showSearch2">
          <ul class="msg-card clearfix">
            <li @click="msgTab(1)" :class="msgType==1?'active':''">全部消息</li>
            <li @click="msgTab(2)" :class="msgType==2?'active':''">未读消息<span v-if="msgNum>0">{{ msgNum }}</span></li>
          </ul>
          <div style="margin:10px 0;">
            <el-button
              @click="readMsg"
              size="small">
              标为已读
            </el-button>
          </div>
          <div>
            <el-table
              :data="EditNoticeTable"
              ref="editNoticeTable"
              style="width: 100%">
              <el-table-column
                type="selection"
                fixed
                width="55">
              </el-table-column>
              <el-table-column
                prop="tittle"
                label="标题"
                align="center"
                header-align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="context"
                label="内容"
                align="center"
                header-align="center"
                >
              </el-table-column>
              <el-table-column
                prop="createUserName"
                label="创建人"
                align="center"
                header-align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="CreateDate"
                label="创建时间"
                align="center"
                header-align="center"
                width="180">
              </el-table-column>
            </el-table>
            <div class="" style="margin-top:15px;">
              <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page="pagination2.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pagination2.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination2.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float:right"
            @click="showSearch=!showSearch"
            size="small">
            {{ showSearch ? '收 起' : '展 开' }}
          </el-button>
          <el-button
            style="float:right;margin-right: 15px"
            v-if="showSearch"
            type="primary"
            @click="search()"
            size="small">
            查询搜索
          </el-button>
        </div>
        <div style="margin-top: 15px" class="search-box" v-if="showSearch">
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
          <el-button v-if="index>3" v-for="(item,index) in headerBtnList" :key="index" @click="navBtnList(item.op_title)">{{item.op_title}}</el-button>
          <el-button  @click="changeTable(item.id,item.name)" class="quickList" type="text" v-for="(item,index) in quick" :key="item.name">{{item.name}}<span style="color:#ea8c25;">({{ item.num }})</span></el-button>
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
          :row-class-name="tableRowClassName"
          @row-click = "selectRowChange"
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
            :width="140"
            :fixed="index<3?true:false"
            >
            <template slot-scope="scope">
              <span v-if="scope.row[item.id]!='' && scope.row[item.id]!=null ">{{ scope.row[item.id] }}</span>
              <span v-else> - </span>
            </template>
          </el-table-column>

          <el-table-column
            prop="address"
            label="操作"
            fixed="right"
            min-width="350px"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- <el-button v-if="index>1 && index<headerBtnList.length-1" v-for="(item,index) in headerBtnList" :key="index" @click="navBtnList(scope.row)" size="small">{{item.op_title}}</el-button> -->
              <!-- <el-button @click="navBtnList(item.op_title,1,scope.row)" v-if="index>1 && index<headerBtnList.length-1" v-for="(item,index) in headerBtnList" :key="index" size="small">{{item.op_title}}</el-button> -->

              <div v-if="scope.row.sam_flag == 200">
                <div v-if="row.RepFormat==1">
                  <el-button v-if="item.op_title=='终稿'||item.op_title=='预览'||item.op_title=='报告'||item.op_title=='选择'||item.op_title=='附件'||item.op_title=='详情'" @click="navBtnList(item.op_title,1,scope.row)" v-for="(item,index) in headerBtnList" :key="index" size="small">{{item.op_title}}</el-button>
                </div>
                <div v-else>
                    <el-button v-if="item.op_title=='终稿'||item.op_title=='预览'||item.op_title=='选择'||item.op_title=='附件'||item.op_title=='详情'" @click="navBtnList(item.op_title,1,scope.row)" v-for="(item,index) in headerBtnList" :key="index" size="small">{{item.op_title}}</el-button>
                </div>
              </div>
              <div v-if="scope.row.sam_flag == 29 || scope.row.sam_flag == 33">
                <div v-if="row.RepFormat==1">
                  <el-button v-if="item.op_title=='预览'||item.op_title=='报告'||item.op_title=='选择'||item.op_title=='附件'||item.op_title=='详情'" @click="navBtnList(item.op_title,1,scope.row)" v-for="(item,index) in headerBtnList" :key="index" size="small">{{item.op_title}}</el-button>
                </div>
                <div v-else>
                    <el-button v-if="item.op_title=='预览'||item.op_title=='选择'||item.op_title=='附件'||item.op_title=='详情'" @click="navBtnList(item.op_title,1,scope.row)" v-for="(item,index) in headerBtnList" :key="index" size="small">{{item.op_title}}</el-button>
                </div>
              </div>
              <div v-else>
                <div v-if="row.RepFormat==1">
                  <el-button v-if="item.op_title=='报告'||item.op_title=='选择'||item.op_title=='报告'||item.op_title=='附件'||item.op_title=='详情'" @click="navBtnList(item.op_title,1,scope.row)" v-for="(item,index) in headerBtnList" :key="index" size="small">{{item.op_title}}</el-button>
                </div>
                <div v-else>
                    <el-button v-if="item.op_title=='选择'||item.op_title=='附件'||item.op_title=='详情'" @click="navBtnList(item.op_title,1,scope.row)" v-for="(item,index) in headerBtnList" :key="index" size="small">{{item.op_title}}</el-button>
                </div>
              </div>

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


      <!-- 详情弹窗 -->
      <el-dialog
        title="详情"
        :visible.sync="dialogVisible"
        width="80%"
        top="3vh"
        >
        <el-tabs v-model="activeName2" type="card" v-if="dialogVisible" @tab-click="handleClick(activeName2)">
          <el-tab-pane label="详 情" name="first" v-if="activeName2=='first'">
            <ViewApply :req_code="req_code"></ViewApply>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitModify" v-if="activeName2=='second'">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 详情弹窗 end-->

    </div>
</template>
<script>
// 引入基本模板,按需加载
let echarts = require('echarts/lib/echarts');
import upLoad from '../oms/applyPage/components/upLoad'
import ViewApply from '../oms/applyPage/viewApply'
import qs from 'qs'
// import { GetMedicalTaskSort,sampGetMenuFieldList } from '../../../static/data/mockData'
export default {
   data() {
      return {
        searchTable:'',
        dialogVisible:false,
        msgNum:0,
        guid:'0',
        showSearch:false,
        showSearch1:false,
        showSearch2:false,
        listQuery:{},
        EditNoticeTable:[],
        msgType:1,
        searchSelect:[],  //搜索下拉列表
        searchText:[],    //搜索文本
        searchDate:[],    //搜索时间
        pagination:{
          pageSize:10,    //每页显示条数
          total:0,        //总页数
          currentPage:1,    //当前页数
        },
        pagination2:{
          pageSize:10,    //每页显示条数
          total:0,        //总页数
          currentPage:1,    //当前页数
        },
        quick:[
          {name:'未领任务',num:0,id:24},
          {name:'一审',num:0,id:27},
          {name:'二审',num:0,id:28},
          {name:'三审',num:0,id:33},
          {name:'终稿',num:0,id:29},
        ],
        menuList:[],
        OutField:{},
        headerBtnList:[],
        options: [],  //状态筛选列表
        value6: '',
        row: [],
        multipleSelection: [],
        guid:'0',
        ReqCode:'',
        checkedCities:[],
        menuCodeList:'erp_medical_report_task',
        formatted:'formatted',
        type:1000,
        posttype:1,
        sam_flag:'',
        req_code:'',
        activeName2:'first',
        option:{
          title : {
            text: '个人报告份数和任务数量统计'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {
            data:['标准报告','任务例数']
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '标准报告/任务例数',
              min: 0,
              interval: 50,
              axisLabel: {
                formatter: '{value} 份'
              }
            }
          ],
          series: [
            {
              name:'标准报告',
              type:'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              data:[]
            },
            {
              name:'任务例数',
              type:'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              data:[]
            }
          ]
        }
      }
   },
   activated() {
   },
   created(){
     this.GetMenuOperationList()
     this.GetMenuFieldList()
     this.getform()
     this.GetMedicalTotal()
     this.EditNotice(1)
     this.EditNotice()

   },
   mounted(){
      this.echartsShow()
   },
   methods:{
     //物流提交按钮
     logisticsSubmit(row){
       var _this = this
       if(row.rep_num == null){
          this.$message({ message: '请输入物流单号！', type: 'warning' });
          return false;
       }
       var data = {
          rep_result: row.rep_result==null?'':row.rep_result,
          rep_id: row.rep_id==null?'':row.rep_id,
          rep_num: row.rep_num==null?'':row.rep_num,
          rep_InvoiceCode: row.rep_InvoiceCode==null?'':row.rep_InvoiceCode,
          rep_InvoicePrice: row.rep_InvoicePrice==null?'':row.rep_InvoicePrice,
          rep_InvoiceRemark: row.rep_InvoiceRemark==null?'':row.rep_InvoiceRemark,
       }
       this.$axios.get(this.$path.UpdateRepTask,{
         params:data
       })
       .then(res=>{
         let data = eval(res.data)
         if(data.code==1000){
           _this.$message({ message:'提交物流信息成功！', type: 'success' })
           _this.getform()
         }else{
           _this.$message({ message:'提交物流信息失败！', type: 'warning' })
           return false;
         }
       })
       .catch(err=>{
         _this.$message({ message:'提交物流信息失败！', type: 'warning' })
         return false;
       })
     },
     //导出按钮
     exportData(){
       window.location.href= this.$path.GetRepTask+'?posttype=2&OutField='+JSON.stringify(this.OutField)+'&searchField='+JSON.stringify(this.listQuery);
        return false;
     },
     //打印按钮
     print(row){
       if(row.FilePath!=null){
         window.open(row.FilePath);
       }else{
          this.$message({ message: '还未上传相关文件！', type: 'warning' });
          return false;
       }

     },
     //批量打印按钮
     batchPrinting(){
       let sel = this.$refs.multipleTable.selection
       let sam_id = []
       sel.forEach(item=>{
         sam_id.push(item.sam_id)
       })
       this.$axios.get(this.$path.mergeReport+'?samIdList='+sam_id.join(','))
       .then(res=>{
         let data = eval(res.data)
         window.open(data.FilePath);
       })
       .catch(err=>{
          this.$message({ message: '批量打印失败！', type: 'warning' });
          return false;
       })
     },
     //确定时间周期
     dateTime(value){
       this.listQuery.req_date = value[0]+'<'+value[1]
     },
     //查询搜索按钮
     search(){
      this.searchTable = ''
      var obj =  this.listQuery
      for(let key in obj){
        if(Array.isArray(obj[key])){
          obj[key] = '>'+obj[key][0]+'<'+obj[key][1]
        }
      }
       this.listQuery = obj
       this.pagination.currentPage = 1
       this.pagination.pageSize = 10
       this.getform(1)
     },
     //获取表头按钮
     GetMenuOperationList(){
        var _this = this
        this.$axios.get(this.$path.sampGetMenuOperationList+'?menuCodeList='+this.menuCodeList
        +'&returnType=formatted')
        .then(res=>{
          var data = res.data
          if(data.errorcode=='002'){
            this.$message({ message: data.errormsg, type: 'warning' });
          }else{
            _this.headerBtnList = data.data
          }
        })
        .catch(err=>{
          console.log(err)
        })
     },
     //获取表格头部列表
     GetMenuFieldList(){
      var _this = this
      this.$axios.get(this.$path.sampGetMenuFieldList+'?menuCodeList='+this.menuCodeList+'&returnType=formatted')
      .then(res=>{
        let data = res.data
        _this.menuList = data.data
        // _this.menuList = sampGetMenuFieldList(),
        _this.menuList.forEach((item,index) => {
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
        // console.log(_this.menuList)
      })
      .catch(err=>{
       console.log(err)
      })
     },
     //获取表格信息
     getform(type,searchField){
      var _this = this
      var searchField = searchField?searchField:JSON.stringify({"sam_flag":"24"})
      var obj = encodeURI(JSON.stringify(this.listQuery))
      console.log(obj)
      this.$axios.post(this.$path.GetMedicalTaskSort+'?type=3&posttype=1&searchField='+(type == 1? obj:searchField),{
      // this.$axios.post(this.$path.getform+'?posttype=1&searchField='+obj,{
        orderField: "OutTime",
        pageIndex:this.pagination.currentPage,
        pageSize:this.pagination.pageSize,
        sortOrder:"asc",
        sortvalue:this.searchTable==''?undefined:this.searchTable,
      })
      .then(res=>{
        var _this = this
        let data = res.data
        // res.data = GetMedicalTaskSort()
        // console.log(GetMedicalTaskSort())
        _this.row = res.data.rows
        _this.pagination.total = res.data.total
      })
      .catch(err=>{
      })
     },
     //获取案件数量
     GetMedicalTotal(){
       let _this = this
       this.$axios.post(this.$path.GetMedicalTotal+'?type='+this.type+'&posttype='+this.posttype)
       .then(res=>{
         let data = res.data.data
         //加载柱形图
         let statisticsData = res.data.performanceList;
         let chargeDataNum = []
         let copiesData = []
         let numData = []
         for (var j=0;j<statisticsData.length;j++){
          chargeDataNum.push(statisticsData[j].user);
          copiesData.push(statisticsData[j].Performance);
          numData.push(statisticsData[j].count);
         }
          _this.option.xAxis[0].data = chargeDataNum
          _this.option.series[0].data = copiesData
          _this.option.series[1].data = numData
          _this.echartsShow()

         _this.quick[0].num = data[24]
         _this.quick[1].num = data[27]
         _this.quick[2].num = data[28]
         _this.quick[3].num = data[33]
         _this.quick[4].num = data[29]
       })
       .then(err=>{
       })
     },
     //通过数量切换表格数据
     changeTable(sum,name){
       if(sum == 29){
         var finalTime='>'+this.GetDateStr(0)+'<'+this.GetDateStr(1)+'';
         var searchField = JSON.stringify({"sam_flag":sum,"sam_final_checktime":finalTime})
       }else{
         var searchField = JSON.stringify({"sam_flag":sum})
       }

       this.getform(2,searchField)
       this.GetMedicalTotal()
        if (name =="未领任务"){
            this.sam_flag=24;
        }
        if (name =="所有"){
            this.sam_flag='';
        }
        if (name =="初稿"){
            this.sam_flag=26;
        }
        if (name =="一审"){
            this.sam_flag=27;
        }
        if (name =="二审"){
            this.sam_flag=28;
        }
        if (name =="三审"){
            this.sam_flag=33;
        }
        if (name =="四审"){
            this.sam_flag=200;
        }
        if (name =="终稿"){
            this.sam_flag=29;
        }
     },

      //点击操作按钮
      navBtnList(name,type,row){
        var arr  = [];
        arr.push(row);
        if(row){
          var row = arr
        }else{
          var row = this.$refs.multipleTable.selection  //获取选中行数据
        }
        console.log(row)
        if(!type && row.length == 0 && name!='导出'){
          this.$message({ message: '请勾选需要选择的任务!', type: 'warning' });
          return false;
        }

        if(name=='选择'){
          let select_id=[];
          let select_data=[];
          let select_flag=[];
          for ( var  i=0;i<row.length;i++){
              select_data.push(row[i].sam_id);
              select_id.push(row[i].TmCheckIn);
              select_flag.push(row[i].sam_flag)
          }
          if(select_id.indexOf(1)==0){
            this.$message({ message: '选择的任务中包含已领取的任务，请重新确认!', type: 'warning' });
            return false;
          }else {
            if(select_flag.indexOf(29)==0 || select_flag.indexOf(200)==0 ){
                this.$message({ message: '选择的任务中包含四审和终稿阶段状态，不可选择，请重新确认!', type: 'warning' });
                return false;
            }else {
                this.$confirm('确定选择任务吗?选取成功后在我的任务中查看！', '提示', { confirmButtonText: '确定',
                  cancelButtonText: '取消', type: 'warning' }).then(() => {
                  this.$axios.post(this.$path.EditMedicalTask+'?samid='+select_data.toString()+'&type=5')
                  .then(res=>{
                    let data = eval(res.data)
                    if(data.code == '1000'){
                      this.$message({ message: '任务选择成功!', type: 'success' });
                      this.getform();
                    }else{
                      this.$message({ message: data.result.msg, type: 'warning' });
                    }
                  })
                  .catch(err=>{
                    this.$message({ message: '选择出错！', type: 'warning' });
                  })
                }).catch(() => {

                });
            }
          }
        }
        if(name=='导出'){
          this.listQuery['sam_flag'] = this.sam_flag;
          let outArray = this.OutField
          let searchArray = this.listQuery
          window.location.href= this.$path.GetMedicalTaskSort+'?type=3&posttype=2&OutField='+encodeURI(JSON.stringify(outArray))+'&searchField='+encodeURI(JSON.stringify(searchArray));
          return false;
        }
        if(name=='附件'){
          for ( var  i=0;i<row.length;i++){
              let res_id = row[i].req_code
              var urlPath = this.$path.getfile+'?code='+res_id
              this.$axios.post(urlPath +'&type=100')
              .then(res=>{
                if (res.data == 'true') {
                    window.location.href = urlPath+ '&type=0';
                }
                else{
                  this.$message({ message: '没有相关附件', type: 'warning' });
                }
              })
              .catch(err=>{
                this.$message({ message: '下载出错，请重新尝试', type: 'warning' });
              })
          }
        }
        if(name=='详情'){
          if(row.length>1){
            this.$message({ message: '请选择一条数据查看详情！', type: 'warning' });
            return false
          }
          this.dialogVisible = true
          this.req_code = row[0].req_code
        }
        if(name=='预览'){
          this.$axios.get(this.$path.PreviewReport+'?samid='+row[0].sam_id)
          .then(res=>{
            console.log(res)
            if(res.data.Status){
              window.open(res.data.Data, '_blank');
            }else{
              this.$message({ message: res.data.Message, type: 'warning' });
            }
          })
          .catch(err=>{
            this.$message({ message: '预览文件出错！', type: 'warning' });
          })
        }
        if(name=='报告'){
          window.open(this.$path.InspectManagement+'?samid='+row[0].sam_id);
        }

        if(name=='终稿'){
          this.$confirm('确定终稿吗?', '提示', { confirmButtonText: '确定',
            cancelButtonText: '取消', type: 'warning' }).then(() => {
            this.$axios.post(this.$path.FinalVersion,{
              samid: row[i].sam_id
            })
            .then(res=>{
              let data = eval(res.data)
              if(data.code == '1000'){
                this.$message({ message: '终稿完成！', type: 'success' });
                this.getform();
              }else{
                this.$message({ message: data.result.msg, type: 'warning' });
              }
            })
            .catch(err=>{
              this.$message({ message: '终稿出错！', type: 'warning' });
            })
          }).catch(() => {

          });
        }
      },

     //消息中心
     EditNotice(type){
       if(type){
         var href = this.$path.EditNotice+'?type=25&posttype=1&searchField={"isRead":"0"}'
       }else{
         var href = this.$path.EditNotice+'?type=25&posttype=1'
       }
       this.$axios.post(href,{
          orderField: "CreateDate",
          pageIndex: 1,
          pageSize: 10,
          sortOrder: "asc",
       })
       .then(res=>{
         this.EditNoticeTable = res.data.rows
         this.pagination2.total = res.data.total
         if(type) this.msgNum = res.data.total
         console.log(res.data.rows)
       })
       .catch(err=>{

       })
     },
     //切换消息Tab
     msgTab(type){
       this.msgType = type
       if(type==1){
         this.EditNotice()
       }else{
         this.EditNotice(1)
       }
     },
     //标记为已读
     readMsg(){
       let sel = this.$refs.editNoticeTable.selection
       if(sel.length<1){
         this.$message({ message: '请勾选需要标记的内容！', type: 'warning' });
         return false
       }
       var selMsg=[];
       var sleId={};
       for ( var  i=0;i<sel.length;i++){
          sleId = {"ID":sel[i].id};
          selMsg.push(sleId)
       }
       this.$axios.get(this.$path.EditNotice+'?type=3&itemStr='+JSON.stringify(selMsg))
       .then(res=>{
         let data = eval(res.data)
         if (data.code == '1000') {
            this.$message({ message: '标记已读失败！', type: 'success' });
            this.EditNotice(1)
         }
         else {
            this.$message({ message: data.result.msg, type: 'warning' });
         }
       })
       .catch(err=>{
          this.$message({ message: '标记已读失败！', type: 'warning' });
          return false;
       })


     },
     //加载柱状图
     echartsShow(){
       this.$nextTick(()=>{
         let barGraph = echarts.init(document.getElementById('barGraph'));
         barGraph.setOption(this.option);
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

     //显示表格头部列
     handleCheckedCitiesChange2(){
       console.log(this.checkedCities)
     },
     handleSizeChange2(value){
       this.pagination2.pageSize = value
       this.getform()
     },
     handleCurrentChange2(value){
       this.pagination2.currentPage = value
       this.getform()
     },


     //列表颜色判断
     tableRowClassName({row, rowIndex}){
      //  let tempValue=/\d{4}-\d{1,2}-\d{1,2}/g.exec(value);
      //  console.log(rowIndex)
       if(eval(this.DateDiff(row.EstimateDate,this.getNowFormatDate()))>5){
            return 'success-row';
        }
        if(eval(this.DateDiff(row.EstimateDate,this.getNowFormatDate()))>=0 && eval(this.DateDiff(row.EstimateDate,this.getNowFormatDate()))<=5){
            return 'warning-row';
        }
        if(eval(this.DateDiff(row.EstimateDate,this.getNowFormatDate()))<0 && eval(this.DateDiff(row.EstimateDate,this.getNowFormatDate()))>=-42){
            return 'red';
        }
        if(eval(this.DateDiff(row.EstimateDate,this.getNowFormatDate()))<-42){
            return 'purple';
        }
        return '';
     },
     //计算天数差的函数，通用
    DateDiff(strDate1,  strDate2){
      var iDays;
      if(strDate1!=null){
          strDate1=strDate1.replace(/-/g,"/");
      }else {
          strDate1=strDate1;
      }
      if(strDate2!=null){
          strDate2=strDate2.replace(/-/g,"/");
      }else {
          strDate2=strDate2;
      }
      var date1 = Date.parse(strDate1);
      var date2 = Date.parse(strDate2);
      iDays=((date1-date2)/(60*60*1000*24)).toFixed(2);
      return iDays;
    },
    //获取当前日期
    getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    },
    selectRowChange(row,col,event){
          row.flag = !row.flag;
          this.$refs.multipleTable.toggleRowSelection(row,row.flag);
    },

    GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
        var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
        return y+"-"+m+"-"+d;
    },
    searchFrom(){
        this.pagination.currentPage = 1
        this.getform()
        return false
      },




   },
   components:{
     upLoad,
     ViewApply
   }
}
</script>
<style lang="scss">
  .search-box .el-select,.search-box .el-form-item__content{
    width: 350px;
  }
  .float_right{
    float: right;
  }
  .w-100{
    .el-form-item__content{
      width: auto;
    }
  }
  .quickList{
    font-size: 18px;
    font-weight: bold;
  }
  .el-table .success-row {
    color:#00780e;
  }

  .el-table .warning-row {
    color:#f27c22;
  }
  .el-table .red {
    color:#f22346;
  }
  .el-table .purple {
    color:#8f1b99;
  }
  .msg-card{
    border-bottom: 3px solid #e4e7ed;

    li{
      position: relative;
      top: 3px;
      z-index: 9999;
      float: left;
      padding: 0 20px 10px 20px;
      list-style: none;
      border-bottom:3px solid transparent;
      color: #666;
      cursor: pointer;
      span{
        position: absolute;
        margin-left: 4px;
        padding: 2px 8px;
        background: #FF5722;
        text-align: center;
        line-height: 15px;
        border-radius: 4px;
        color: #e4e7ed;
      }
    }
    li:hover,li.active{
      color: #00780e;
      border-bottom:3px solid #00780e;
    }
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";    /*不用有内容也可以*/
  }

  .clearfix:after {
      clear: both;
  }

  .clearfix {
      *zoom: 1;
  }
</style>
