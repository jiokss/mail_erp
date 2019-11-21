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
        <el-button :type="activeBtn==0?'primary':''" @click="changeTable(0)">特殊退款申请</el-button>
        <el-button :type="activeBtn!=0?'primary':''"@click="changeTable(1)">其他审批</el-button>
      </el-card>
      <el-card class="filter-container" shadow="never" style="margin-top:15px;">
        <div style="margin-bottom:25px;">
          <el-button v-for="(item,index) in headerBtnList" :key="index" @click="navBtnList(item.op_title)">{{item.op_title}}</el-button>
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
            :width="item.name=='创建备注'?'400':'auto'"
            align="center"
            header-align="center"
            >
            <template slot-scope="scope">
              <!-- <span v-if="scope.row[item.id] == '1'">已通过</span>
              <span v-if="scope.row[item.id] == '2'">未通过</span> -->

              <span v-if="item.id=='Result'">
                <span style="color:#f2c440" v-if="scope.row[item.id] == '0'">未审批</span>
                <span style="color:#4af240" v-if="scope.row[item.id] == '1'">已通过</span>
                <span style="color:#f22346" v-if="scope.row[item.id] == '2'">已拒绝</span>
                <span style="color:#3e9af2" v-if="scope.row[item.id] == '3'">已取消</span>
              </span>
              <span v-else>{{ scope.row[item.id] }}</span>
            </template>

          </el-table-column>

          <el-table-column
            v-if="menuCodeList=='sales_special_item'"
            prop="address"
            label="操作"
            fixed="right"
            align="center"
            header-align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button @click="Enclosure(scope.row)" size="small">附件</el-button>
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

      <!-- 新增申请弹窗 -->
      <el-dialog
        title="特殊退款申请"
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
                <upLoad ref="upLoadChild" :guid="guid" v-if="dialogVisible2"/>
              </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="confirmReturn">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 新增申请弹窗 end-->


    </div>
</template>
<script>
import upLoad from './components/upLoad'
export default {
   data() {
      return {
        searchTable:'',
        showHideSeach:false,
        dialogVisible:false,
        dialogVisible2:false,
        req_remark:'',  //新增申請备注
        guid:'0',
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
        guid:'0',
        ReqCode:'',
        checkedCities:[],
        menuCodeList:'sales_special_item',
        formatted:'formatted',
        OutField:[],
        searchSelect:[],
        searchText:[],
        searchDate:[],
        loading:true,
        activeBtn:0,
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
         this.menuCodeList = 'sales_special_item'
       }else{
          this.menuCodeList = 'sales_application_report'
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
        _this.menuList = res.data.data
        res.data.data.forEach((item,index) => {
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
      let CreatedDate = this.listQuery.CreatedDate
      let RevisedDate = this.listQuery.RevisedDate
      if(CreatedDate!='' && this.listQuery.CreatedDate) this.listQuery.CreatedDate = '>'+CreatedDate[0]+'<'+CreatedDate[1]
      if(RevisedDate!='' && this.listQuery.RevisedDate) this.listQuery.RevisedDate = '>'+bar_receive_date[0]+'<'+RevisedDate[1]
      var obj = encodeURI(JSON.stringify(this.listQuery))
      if(this.menuCodeList=='sales_application_report'){
        var path = '?type=1000&posttype=1'
      }else{
        var path = '?type=2&status=1&posttype=1'

      }
      if(type==1){
          path = path+'&searchField='+obj
      }
      console.log(path)
      // this.$axios.get(this.$path.get,{
      this.$axios.post(this.$path.approvalGet+path,{
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
     //查看附件
     Enclosure(row){
        this.guid = row.FileIDStr
        var _this = this
        console.log(row.FileIDStr)
        if(row.FileIDStr==null){
            this.$message({ message:'当前信息没有附件！', type: 'warning' });
            return false;
        }
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.upLoadChild.GetFileByGuid(row.FileIDStr)
        });
      //  this.$refs.upLoadChild.GetFileByGuid(row.FileIDStr)

     },
     //表头按钮点击
     navBtnList(name){
       if(name=='新增'){
         this.guid = 0
         this.dialogVisible2 = true
       }else{

       }
     },
     //新增申请确定
     confirmReturn(){
        var _this = this
        var uploadFileId = this.$refs.upLoadChild.uploadFileId
        this.$axios.post(this.$path.ApplySample+'?BarSn=&type=4&remark='+this.req_remark+'&FileID='+uploadFileId)
        .then(res=>{
          var data = eval(res.data)
          console.log(data.code)
          if(data.code==1000){
            _this.$message({
              message: '成功！',
              type: 'success'
            });
            _this.req_remark = ''
            _this.getform()
          }else{
            _this.$message({
              message: '失败！',
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
        this.dialogVisible2 = false
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
</style>
