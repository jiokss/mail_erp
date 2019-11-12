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
          <el-button type="primary" @click="importXlsx">导 入</el-button>
          <el-button @click="exportData">导 出</el-button>
          <el-button @click="batchPrinting">批量打印</el-button>
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
            min-width="150px"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button  v-if="scope.row['resultStr'] == '未完成'" type="success" @click="logisticsSubmit(scope.row)" size="small">提交</el-button>
              <el-button @click="print(scope.row)" size="small">打印</el-button>
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

    </div>
</template>
<script>
import upLoad from './components/upLoad'
import qs from 'qs'
export default {
   data() {
      return {
        searchTable:'',
        dialogVisible:false,
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
        menuCodeList:'sales_special_item',
        formatted:'formatted',
        OutField:[],
        searchSelect:[],
        searchText:[],
        searchDate:[],
        showHideSeach:false,
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
     //初始化上传
    $("#file").fileinput({
        language: 'zh',
        uploadUrl: 'http://192.168.1.43:5555/api/FileService/UploadFile?moduleTag=6',
        browseClass: "btn btn-primary",
        browseLabel: '导入',
        showCaption: false,
        showRemove: false,
        showUpload: false,
        showCancel: false,
        showPreview: false,
        previewFileIcon: "",
        allowedFileExtensions : ['xlsx', 'xls'],
        enctype: 'multipart/form-data'
      }).on("filebatchselected", function (event, files) {// 选择文件后自动上传
          $(this).fileinput("upload");
      }).on("fileuploaded", function (event, data) {// 异步上传成功
          dataId = data.response
          _this.$axios.post(_this.$path.GetRepTask,{
            type:2,
            OutField:JSON.stringify(_this.OutField),
            searchField:JSON.stringify(_this.listQuery),
            fileId:dataId
          })
          .then(res=>{
            let data = eval(res.data)
            if(data.code=='1000'){
              _this.getform()
            }else{
              _this.$message({ message: data.result.msg, type: 'warning' });
              return false;
            }
          })
          .catch(err=>{
            console.log(err)
          })
      }).on("filebatchuploaderror", function (event, data, msg) {// 同步上传失败
          this.$message({ message: msg, type: 'warning' });
          return false;
      }).on("fileerror", function (event, data, msg) {// 异步上传失败
          this.$message({ message: msg, type: 'warning' });
          return false;
      });



   },
   methods:{
     //物流提交按钮
     logisticsSubmit(row){
       var _this = this
       if(row.rep_num == null){
          this.$message({ message: '请输入物流单号！', type: 'warning' });
          return false;
       }
       console.log(row)
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
      this.$axios.get(this.$path.logisticsGetMenuFieldList)
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
     getform(data = '?posttype=1'){
      var _this = this
      var pathData = data
      var obj = encodeURI(JSON.stringify(this.listQuery))
      this.$axios.post(this.$path.GetRepTask+pathData,{
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
     //文件导入
     importXlsx(){
        $("#file").trigger("click")
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
