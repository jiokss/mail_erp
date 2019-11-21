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
      <el-card class="filter-container btnList" shadow="never" style="margin-top:15px;">
        <el-button :type="activeBtn==0?'primary':''" @click="changeTable(0)">任务发起</el-button>
        <el-button :type="activeBtn==1?'primary':''"@click="changeTable(1)">发配任务</el-button>
        <el-button :type="activeBtn==2?'primary':''"@click="changeTable(2)">工时管理</el-button>
      </el-card>
      <el-card class="filter-container" shadow="never" style="margin-top:15px;">
        <div style="margin-bottom:25px;">
          <el-button v-if="menuCodeList!='erp_medical_task_time'" v-for="(item,index) in headerBtnList" :key="index" @click="navBtnList(item.op_title)">{{item.op_title}}</el-button>
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
            align="center"
            header-align="center"
            >
              <template slot-scope="scope">
                <span v-if="item.id=='DataProcess'">
                  <span style="color:#00B7EE" v-if="scope.row[item.id] == '1'">已开始</span>
                  <span style="color:#00B7EE" v-if="scope.row[item.id] == '2'">已结束</span>
                  <span style="color:#ee370e" v-if="scope.row[item.id] != '2' && scope.row[item.id] != '1'">未开始</span>
                </span>
                <span v-else>{{ scope.row[item.id] }}</span>
              </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            fixed="right"
            align="center"
            header-align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="menuCodeList=='initiate_medical_task'">
                <el-button @click="UpdateFlag(scope.row)" size="small">提交</el-button>
                <el-button @click="finishReport(scope.row)" size="small">结束报告</el-button>
              </div>
              <div v-if="menuCodeList=='medical_task_manage'">
                <el-button @click="taskEdit(scope.row)" size="small">修改</el-button>
                <el-button @click="taskDelete(scope.row)" size="small">删除</el-button>
              </div>
              <div v-if="menuCodeList=='erp_medical_task_time'">
                <el-button @click="timeEdit(scope.row)" size="small">修改</el-button>
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

      <!-- 查看附件弹窗 -->
      <el-dialog
        title="附件信息"
        :visible.sync="dialogVisible"
        width="40%"
        top="7vh"
        class="applyModel"
        >
        <div class="viewUp" v-if="dialogVisible">
            <upLoad ref="upLoadChild" :guid="guid"/>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 查看附件弹窗 end-->

      <!-- 提交任务弹窗 -->
      <el-dialog
        title="提交任务"
        :visible.sync="dialogVisible2"
        width="40%"
        top="7vh"
        class="applyModel"
        >
        <div class="wForm">
            <el-form ref="form" label-width="120px">
              <el-form-item label="备注：">
                <el-input type="textarea" v-model="req_remark"></el-input>
              </el-form-item>
              <el-form-item label="上传附件：">
                <upLoad ref="upLoadChild" :guid="guid" :barCode="bar_code" v-if="dialogVisible2"/>
              </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="confirmReturn">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 提交任务弹窗 end-->

      <!-- 基因修改弹窗 -->
      <el-dialog
        :title="GeneTitle"
        :visible.sync="dialogVisible"
        width="40%"
        top="7vh"
        class="applyModel"
        >
        <el-form ref="form" label-width="120px" class="w-100">
          <el-form-item label="项目类型：">
            <el-select v-model="typeId" filterable placeholder="请选择" >
              <el-option
                v-for="item in typeList"
                :key="item.type_id"
                :label="item.type_name"
                :value="item.type_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人：">
            <el-select v-model="userId" multiple placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.user_id"
                :label="item.user_realname"
                :value="item.user_id+''">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="taskSumbit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 基因修改弹窗 end-->

    </div>
</template>
<script>
import upLoad from '../oms/applyPage/components/upLoad'
import qs from 'qs'
export default {
   data() {
      return {
        GeneTitle:'',
        typeId: '',
        userId: '',
        typeList: [],
        userList: [],
        remark:'',  //基因弹窗备注
        value: '',
        searchTable:'',
        showHideSeach:false,
        dialogVisible:false,
        dialogVisible2:false,
        req_remark:'',  //新增申請备注
        date:'',
        date2:'',
        OutField:{},
        listQuery:{},
        pagination:{
          pageSize:10,    //每页显示条数
          total:0,        //总页数
          currentPage:1,    //当前页数
        },
        menuList:[],
        headerBtnList:[],
        options: [],  //状态筛选列表
        value6: '',
        row: [],
        multipleSelection: [],
        guid:'99',
        ReqCode:'',
        checkedCities:[],
        menuCodeList:'initiate_medical_task',
        formatted:'formatted',
        OutField:[],
        searchSelect:[],
        searchText:[],
        searchDate:[],
        loading:true,
        activeBtn:0,
        SamID:'',
        bar_code:'',
        taskType:0,
        taskRow:{},
      }
   },
   activated() {
   },
   created(){
     this.GetMenuFieldList()
     this.GetMenuOperationList()
     this.getform()
   },
   methods:{
     //切换表格内容
     changeTable(type){
       this.activeBtn = type
       if(type==0){
         this.menuCodeList = 'initiate_medical_task'
       }else if(type==1){
          this.menuCodeList = 'medical_task_manage'
          this.taskList()
       }else{
         this.menuCodeList = 'erp_medical_task_time'
         this.OutField = {
            grp_id: "项目ID",
            grp_encoded: "项目代码",
            grp_item: "项目名称",
            org_name: "开单机构",
            part_name: "科室",
            Performance: "工作量",
         }
         this.listQuery = {
            grp_id: "",
            grp_encoded: "",
            grp_item: "",
            org_name: "",
            part_name: "",
            Performance: "",
         }
         this.searchText = [
           {
              data: "",
              id: "grp_id",
              name: "项目ID",
           },
           {
              data: "",
              id: "grp_encoded",
              name: "项目代码",
           },
           {
              data: "",
              id: "grp_item",
              name: "项目名称",
           },
           {
              data: "",
              id: "org_name",
              name: "开单机构",
           },
           {
              data: "",
              id: "part_name",
              name: "科室",
           },
           {
              data: "",
              id: "Performance",
              name: "工作量",
           },
         ]
         this.checkedCities = ['项目ID','项目代码','项目名称','开单机构','科室','工作量']
         this.menuList = this.searchText

         console.log(this.menuList)
         this.getform();
         return false
       }
      this.pagination.currentPage = 1
      this.loading = true
      this.GetMenuFieldList()
      this.getform();
      this.GetMenuOperationList()

     },
     //确定时间周期
     dateTime(value){
       this.listQuery.CreatedDate = value[0]+'<'+value[1]
       console.log(this.listQuery.req_date)
     },
     //确定时间周期
     dateTime2(value){
       this.listQuery.RevisedDate = value[0]+'<'+value[1]
       console.log(this.listQuery.req_date)
     },
     //查询搜索按钮
     search(){
       this.searchTable = ''
       this.pagination.currentPage = 1
       this.pagination.pageSize = 10
       this.getform(1)
     },
     //获取表格头部列表
     GetMenuFieldList(){
      var _this = this
      this.$axios.get(this.$path.sales_GetMenuFieldList+"?menuCodeList="+this.menuCodeList+"&returnType="+this.formatted)
      .then(res=>{
        let datas = res.data.data
        _this.menuList = datas
        datas.forEach((item,index) => {
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
        console.log(_this.checkedCities)
        });
      })
      .catch(err=>{
        this.$message({ message: '获取表头信息出错，请重试！', type: 'warning' });
      })
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
          this.$message({ message: '获取按钮信息出错，请重试！', type: 'warning' });
        })
     },
     //获取表格信息
     getform(type){
      var _this = this
      if(this.menuCodeList=='initiate_medical_task'){
        var path = this.$path.UpdateFlag
        var data = '?type=3&posttype=1'+ (type==1?'&searchField='+encodeURI(JSON.stringify(this.listQuery)):'')
      }else if(this.menuCodeList=='medical_task_manage'){
        var path = this.$path.EditTaskRule
        var data = '?type=3&posttype=1'+(type==1?'&searchField='+encodeURI(JSON.stringify(this.listQuery)):'')
      }else{
        var path = this.$path.EditDicGroupPer
        var data = '?type=1&posttype=1'+(type==1?'&searchField='+encodeURI(JSON.stringify(this.listQuery)):'')
      }
      // this.$axios.get(this.$path.get,{
      this.$axios.post(path+data,{
        pageIndex:this.pagination.currentPage,
        pageSize:this.pagination.pageSize,
        sortOrder:"desc",
        sortvalue:this.searchTable==''?undefined:this.searchTable,
      })
      .then(res=>{
        var data = eval(res.data)
        if(data.code==1004){
          this.$message({ message: data.result.msg, type: 'warning' });
        }
        _this.row=res.data.rows
        _this.pagination.total = res.data.total
        console.log(res)
        _this.loading = false
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
     //提交任务弹窗
     UpdateFlag(row){
        this.dialogVisible2 = true
        this.SamID = row.SamID
        this.bar_code = row.bar_code
        this.req_remark = ""
     },
     //表头按钮点击
     navBtnList(name){
       var _this = this
       var row = this.$refs.multipleTable.selection  //获取选中行数据
       if(name=='提交'){
         if(row.length==0){
          return _this.$message({ message: '请先选择数据！',type: 'warning'});
         }
         var arr = []
         row.forEach(item=>{
           let obj = {
             SamId:item.SamID
           }
           arr.push(obj)
         })
         var itemStr = qs.stringify({
           itemStr:JSON.stringify(arr)
         })
         this.$axios.post(this.$path.UpdateFlag+"?type=2",itemStr)
         .then(res=>{
           let data = eval(res.data)
           if(data.code==1000){
             _this.$message({ message: '提交信息成功！',type: 'success'});
           }else{
             _this.$message({ message: data.result.msg,type: 'error'});
           }
         })
         .catch(err=>{
            _this.$message({ message: err,type: 'error'});
         })
       }
       if(name=="导出"){
         window.location.href= this.$path.getform1+'?IsDel=1&posttype=2&OutField='+JSON.stringify(this.OutField)+'&searchField='+JSON.stringify(this.listQuery);
         return false;
       }
       if(name=="新增"){
         this.dialogVisible = true
         this.taskType = 0
         this.GeneTitle = '新建任务'
         this.typeId = ''
         this.userId = ''
         this.remark = ''
       }
       if(name=='修改'){
         if(row.length!=1){
          return _this.$message({ message: '请选择一条数据！',type: 'warning'});
         }
         this.taskEdit(row,0)
       }
       if(name=='删除'){
         if(row.length!=1){
          return _this.$message({ message: '请选择一条数据！',type: 'warning'});
         }
         this.taskDelete(row[0])
       }
     },
     //提交任务确定
     confirmReturn(){
        var _this = this
        var FlagRemark = this.req_remark
        var SamId = this.SamID
        var obj = qs.stringify({
          type:2,
          itemStr:'[{"FlagRemark":"'+FlagRemark+'","SamId":"'+SamId+'"}]'
        })
        this.$axios.post(this.$path.UpdateFlag,obj)
        .then(res=>{
          var data = eval(res.data)
          if(data.code==1000){
            _this.$message({
              message: '成功！',
              type: 'success'
            });
            _this.req_remark = ''
            _this.getform()
            this.dialogVisible2 = false
          }else{
            _this.$message({
              message: data.result.msg,
              type: 'warning'
            });
          }
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
            _this.$message({
              message: '失败！',
              type: 'warning'
            });
        })
     },
     //结束报告
     finishReport(row){
        var _this = this
        this.$confirm('请确认是否要结束报告？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var itemStr = qs.stringify({
            "itemStr":row.SamID
          })
          _this.$axios.post(_this.$path.UpdateFlag+"?type=4",itemStr)
          .then(res=>{
            let data = eval(res.data)
            if(data.code==1000){
              _this.$message({ message: '结束报告成功！', type: 'success' });
            }else{
              _this.$message({ message: data.result.msg, type: 'warning' });
            }
          })
          .catch(err=>{
            _this.$message({ message: err, type: 'warning' });
          })
        }).catch(() => {

        });
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
      //项目类型，负责人下拉列表
      taskList(){
        this.EditTaskRule(0,'?type=25&posttype=0')
      },
      //发起任务修改
      taskEdit(row,type){
        var row = row[0]
        this.dialogVisible = true
        this.taskRow = row
        this.GeneTitle = row.type_name
        this.typeId = row.type_id
        this.userId = row.userIDStr.split(",")
        this.remark = row.trm_remark
        this.taskType = 1
      },
      //发起任务确定
      taskSumbit(){
        var _this = this
        var type_id = this.typeId
        var userIDStr = this.userId
        var trm_remark = this.remark
        var json = JSON.stringify({"type_id":type_id,"userIDStr":userIDStr.join(","),"trm_remark":trm_remark})
        var json2 = JSON.stringify({"trm_id":this.taskRow.trm_id,"type_id":type_id,"userIDStr":userIDStr.join(','),"trm_createBy":this.taskRow.trm_createBy,"trm_createDate":this.taskRow.trm_createDate,"trm_updateBy":this.taskRow.trm_updateBy,"trm_updateDate":this.taskRow.trm_updateDate,"trm_remark":trm_remark,"Ext_1":this.taskRow.Ext_1,"Ext_2":this.taskRow.Ext_2})
        var obj = qs.stringify({
          type: _this.taskType==0?0:1,
          itemstr: _this.taskType==0?json:json2
        })
        this.EditTaskRule(1,'',obj)
      },
      //发配任务删除
      taskDelete(row){
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var json2 = JSON.stringify({"trm_id":row.trm_id,"type_id":row.type_id,"userIDStr":row.userIDStr,"trm_createBy":row.trm_createBy,"trm_createDate":row.trm_createDate,"trm_updateBy":row.trm_updateBy,"trm_updateDate":row.trm_updateDate,"trm_remark":row.trm_remark,"Ext_1":row.Ext_1,"Ext_2":row.Ext_2})
          var obj = qs.stringify({
            type: 2,
            itemstr: json2
          })
          this.EditTaskRule(1,'',obj)
        }).catch(() => {

        });
      },
      //修改工时
      timeEdit(row){
        console.log(row)
        var _this = this
        var performance = row.Performance
        var grp_id = row.grp_id
        var pk_id = row.pk_id
        this.$prompt('工作量修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:performance,
          inputPattern: /^(\d+)(.\d{0,2})?$/,
        }).then(({ value }) => {
            _this.$axios.get(_this.$path.EditDicGroupPer+'?type=0&posttype=0&performance='+value+'&grp_id='+grp_id+'&pk_id='+pk_id)
            .then(res=>{
              var data = eval(res.data)
              if(data.code==1000){
                _this.$message({ message: data.result.msg, type: 'success' });
              }else{
                _this.$message({ message: data.result.msg, type: 'warning' });
              }
            })
            .catch(err=>{
              _this.$message({ message: err, type: 'warning' });
            })
        }).catch(() => {

        });
      },
      //请求
      EditTaskRule(type,url,obj){
        var _this = this
        this.$axios.post(this.$path.EditTaskRule+url,obj?obj:'')
        .then(res=>{
          var data = eval(res.data)
          if(type==1){
            if(data.code==1000){
              _this.$message({ message: data.result.msg, type: 'success'});
              _this.dialogVisible = false
            }else{
              var msg = data.result.msg
              _this.$message({ message:msg, type: 'error'});
            }
          }
          if(type==0){
            _this.typeList = data.result.typeList
            _this.userList = data.result.userList
          }
        })
        .catch(err=>{
          _this.$message({ message: err, type: 'error'});
        })
      },
   },
   components:{
     upLoad
   }
}
</script>
<style lang="scss">
  .queryMain .el-select,.queryMain .el-form-item__content{
    width: 240px;
  }
  .search-box .el-select,.search-box .el-form-item__content{
    width: 350px;
  }
  .wForm .el-form-item__content{
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
  .viewUp .file-caption-main{
    display: none;
  }
  .btnList{
    .el-card__body{
      background: #fff;
    }
  }
  .w-100{
    .el-select{
      width: 100%;
    }
  }
</style>
