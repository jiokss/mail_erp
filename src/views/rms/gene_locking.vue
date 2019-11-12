<template>
    <!-- 迟发通知 -->
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
         <form style="display:none" class="form-signin" role="form" method="post" enctype='multipart/form-data' id="formData">
              <input id="file" tabindex="-1" name="file" type="file"/>
          </form>
          <el-button type="primary" @click="importXlsx">导 入</el-button>
          <el-button @click="exportData">导 出</el-button>

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
            min-width="150px"
            :width="item.name=='详细'?'800':'auto'"
            align="center"
            header-align="center"
            :fixed="index<3"
            v-if="checkedCities.indexOf(item.name) != -1"
            >
            <template slot-scope="scope">
              <span v-if="scope.row[item.id] == null"> - </span>
              <span v-else>{{ scope.row[item.id] }} </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            fixed="right"
            width="105px"
            v-if="menuCodeList=='erp_medical_report_delay'"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button v-if="item.op_title != '导出' " v-for="(item,index) in headerBtnList" :key="index" @click="navBtnList(item.op_title,scope.row)" size="small">{{item.op_title}}</el-button>
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
//import { medical_dis_report } from '../../../static/data/mockData'
import qs from 'qs'
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
        searchSelect:[],  //搜索下拉列表
        searchText:[],    //搜索文本
        searchDate:[],    //搜索时间
        sample:{
          title:[],
          context:'',
          remark:'',
        },
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
        menuCodeList:'erp_madical_lock',
        formatted:'formatted',
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
            var form = new FormData(document.getElementById("formData"));
            $.ajax({
                url: _this.$path.ImportMitoTrainData,
                type: 'post',
                data: form,
                processData: false, //禁止序列化data，默认为true
                contentType: false, //避免JQuery对contentType做操作
                layerIndex:-1,
                beforeSend: function () {
                    // 禁用按钮防止重复提交，发送前响应
                    $("#file").attr({ disabled: "disabled" });
                },
                success: function (json) {
                    var codeData = eval(json);
                    if (codeData.Status==true) {
                        _this.$message({ message: '上传成功', type: 'success' });
                        _this.getform()
                    }
                    else {
                      _this.$message({ message: codeData.Message, type: 'warning' });
                    }
                },
                complete: function () {//完成响应
                    $("#file").removeAttr("disabled");
                    $('#file').val('')
                },
                error: function (json) {
                    layer.alert(json.Message, {icon: 2});
                }
            })
      }).on("fileuploaded", function (event, data) {// 异步上传成功
          dataId = data.response

      }).on("filebatchuploaderror", function (event, data, msg) {// 同步上传失败
          _this.$message({ message: msg, type: 'warning' });
          return false;
      }).on("fileerror", function (event, data, msg) {// 异步上传失败
          _this.$message({ message: msg, type: 'warning' });
          return false;
      });
   },
   methods:{
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
     //获取表格头部列表
     GetMenuFieldList(){
      console.log(this.menuCodeList)
      var _this = this
      this.$axios.get(this.$path.sales_GetMenuFieldList+"?menuCodeList="+this.menuCodeList+"&returnType="+this.formatted)
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
     //获取表格信息
     getform(type){
      var _this = this
      var url = this.$path.GetMitoMutationTrainData
      // this.$axios.get(this.$path.get,{
      // let url = 'http://dna.gz.cn/mgene//sample/Getsample?type=3&posttype=1'
      this.$axios.post(url,{
        filterOrder: "ID",
        searchField: type?_this.listQuery:undefined,
        pageIndex:this.pagination.currentPage,
        pageSize:this.pagination.pageSize,
        sortOrder:"desc",
        sortvalue:this.searchTable==''?undefined:this.searchTable,
      })
      .then(res=>{
        var data = eval(res.data)
        console.log(data)
        if(data.code==1004){
          this.$message({ message: data.result.msg, type: 'warning' })
          return false
        }
        console.log(data.rows)
        console.log(data.total)
        _this.row=data.Data.rows
        _this.pagination.total = data.Data.total

      })
      .catch(err=>{
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
     //导出按钮
     exportData(){
        window.location.href=this.$path.ExportMitoTrainData;
        return false;
     },
     //文件导入
     importXlsx(){
        $("#file").trigger("click")
      },
      searchFrom(){
        this.pagination.currentPage = 1
        this.getform()
        return false
      },

   },
   components:{
   }
}
</script>
<style lang="scss">
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
  .file-input{
    display: none;
  }
</style>
