<template>
<!-- 物流打印 -->
    <div class="queryMain app-container logistics">
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
          <input id="file" type="file" style="display:none">
          <el-button type="primary" @click="view()">详 情</el-button>
          <el-button @click="exportData">导 出</el-button>
          <div :inline="true" class="demo-form-inline float_right">
            <el-input style="width:auto;" placeholder="搜索" v-model="searchTable"  @keyup.enter.native="searchFrom"></el-input>
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
            :width="item.name=='寄送地址'?'300':'140'"
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
            min-width="80px"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button @click="view(scope.row)" size="small">详情</el-button>
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
import qs from 'qs'
import ViewApply from './viewApply'
export default {
   data() {
      return {
        searchTable:'',
        dialogVisible:false,
        activeName2:'first',
        guid:'0',
        listQuery:{
          resultStr:'',
          repStatusStr:'',
          rep_id:'',
          pat_name:'',
          bar_code:'',
          rep_user:'',
          rep_phone:'',
          rep_address:'',

          rep_create_username:'',
          rep_num:'',
          rep_InvoiceCode:'',
          rep_InvoicePrice:'',
          rep_InvoiceRemark:'',
          rep_time:'',
          rep_finishtime:'',

        },
        pagination:{
          pageSize:10,    //每页显示条数
          total:0,        //总页数
          currentPage:1,    //当前页数
        },
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
        menuCodeList:'erp_medical_apply_inquiry',
        formatted:'formatted',
        OutField:[],
        searchSelect:[],
        searchText:[],
        searchDate:[],
        showHideSeach:false,
        req_code:'',
      }
   },
   activated() {
   },
   created(){
     this.GetMenuFieldList()
     this.getform()
   },
   mounted(){
    var _this = this
    var dataId = ''
   },
   methods:{
     //确定时间周期
     dateTime(value){
       this.listQuery.req_date = value[0]+'<'+value[1]
       console.log(this.listQuery.req_date)
     },
     //查询搜索按钮
     search(){
       this.searchTable = ''
       let searchField = '?posttype=1&searchField='+JSON.stringify(this.listQuery)
       this.pagination.currentPage = 1
       this.pagination.pageSize = 10
       this.getform(searchField)
     },
     //获取表格头部列表
     GetMenuFieldList(){
      var _this = this
      this.$axios.get(this.$path.sales_GetMenuFieldList+"?menuCodeList="+this.menuCodeList+"&returnType="+this.formatted)
      .then(res=>{
        console.log(res)
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
       this.$message({ message: '获取表头信息出错，请重试！', type: 'warning' });
      })
     },
     //获取表格信息
     getform(data = '?IsDel=1&posttype=1'){
      var _this = this
      var pathData = data
      var obj = encodeURI(JSON.stringify(this.listQuery))
      this.$axios.post(this.$path.getform1+pathData,{
      // this.$axios.post(this.$path.getform+'?posttype=1&searchField='+obj,{
        pageIndex:this.pagination.currentPage,
        pageSize:this.pagination.pageSize,
        sortOrder:"desc",
        sortvalue:this.searchTable==''?undefined:this.searchTable,
      })
      .then(res=>{
        var _this = this
        _this.row = res.data.rows
        _this.row.forEach((item,index)=>{
          if(item.resultStr=='未完成'){
             _this.row[index].rep_num = ''
             _this.row[index].rep_InvoiceCode = ''
             _this.row[index].rep_InvoicePrice = ''
             _this.row[index].rep_InvoiceRemark = ''
          }
        })

        _this.pagination.total = res.data.total
      })
      .catch(err=>{
        this.$message({ message: '请求表格数据出错，请重试！', type: 'warning' });
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
      selectRowChange(row,col,event){
          row.flag = !row.flag;
          this.$refs.multipleTable.toggleRowSelection(row,row.flag);
      },
      searchFrom(){
        this.pagination.currentPage = 1
        this.getform()
        return false
      },
      //查看详情
      view(row){
        var _this = this
        var arr  = [];
        arr.push(row);
        if(row){
          var row = arr
        }else{
          var row = this.$refs.multipleTable.selection  //获取选中行数据
        }
        if(row.length!=1){
          this.$message({ message: '请选择一条数据查看详情！', type: 'warning' });
          return false
        }
        this.dialogVisible = true
        this.req_code = row[0].req_code
      },
      //导出按钮
      exportData(){
        window.location.href= this.$path.getform1+'?IsDel=1&posttype=2&OutField='+JSON.stringify(this.OutField)+'&searchField='+JSON.stringify(this.listQuery);
        return false;
      },
   },
   components:{
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
  .logistics{
    .file-input{
      display: none;
    }
  }

</style>
