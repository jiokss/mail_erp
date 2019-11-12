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
      <el-card class="filter-container btnList" shadow="never" style="margin-top:15px;">
        <el-button @click="changeTable(0)" :type="menuCodeList=='erp_medical_report_delay'?'primary':''">正常报告</el-button>
        <el-button @click="changeTable(1)" :type="menuCodeList=='medical_report_delay'?'primary':''">迟发报告记录</el-button>
      </el-card>
      <el-card class="filter-container" shadow="never" style="margin-top:15px;">
        <div style="margin-bottom:25px; overflow:hidden">
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
            :width="item.name=='原因'?'600':'auto'"
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

      <!-- 延期通知弹窗 -->
      <el-dialog
        title="迟发通知"
        :visible.sync="dialogVisible"
        width="60%"
        top="7vh"
        class="applyModel"
        >
        <el-form ref="form" label-width="100px" class="wForm">
          <el-form-item label="选择原因：">
            <el-checkbox-group v-model="sample.title">
              <el-checkbox name="fulicheckbox" data-value="1" label="送检标本出现溶血/凝血，需要重新送检"></el-checkbox>
              <el-checkbox name="fulicheckbox" data-value="2" label="送检标本血容量不足，需重新送检"></el-checkbox>
              <el-checkbox name="fulicheckbox" data-value="3" label="实验过程中质检不通过，需重新实验"></el-checkbox>
              <el-checkbox name="fulicheckbox" data-value="4" label="设备故障"></el-checkbox>
              <el-checkbox name="fulicheckbox" data-value="5" label="测序数据量不足，需重新实验"></el-checkbox>
              <el-checkbox name="fulicheckbox" data-value="6" label="标本增加验证项目，需延迟发放"></el-checkbox>
              <el-checkbox name="fulicheckbox" data-value="7" label="验证标本送检迟于患者"></el-checkbox>
              <el-checkbox name="fulicheckbox" data-value="8" label="专家会诊"></el-checkbox>
              <el-checkbox name="fulicheckbox" data-value="9" label="临床资料不足"></el-checkbox>
              <el-checkbox name="fulicheckbox" data-value="10" label="其他"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="其他原因：">
            <el-input type="textarea" v-model="sample.context" placeholder="请输入其他原因......；注：需要上面选择“其他”选项"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="sample.remark" placeholder="请输入备注内容......"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="delaySubmit">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 延期通知弹窗 end-->

    </div>
</template>
<script>
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
        menuCodeList:'erp_medical_report_delay',
        formatted:'formatted',
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
       if(type==0){
         this.menuCodeList = 'erp_medical_report_delay'
       }else{
          this.menuCodeList = 'medical_report_delay'
       }
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
       //conosle.log(err)
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
          console.log(err)
        })
     },
     //获取表格信息
     getform(type){
      var _this = this
      var obj = encodeURI(JSON.stringify(this.listQuery))
      if(this.menuCodeList=='medical_report_delay'){
        var url = this.$path.EditNoticeLateReport+'?type=25&posttype=1'
        var orderField = "CreateDate"
      }else{
        var url = this.$path.Getsample+'?type=3&posttype=1'
        var orderField = 'sam_sign_time'
      }
      if(type) url += '&searchField=' + obj
      // this.$axios.get(this.$path.get,{
      // let url = 'http://dna.gz.cn/mgene//sample/Getsample?type=3&posttype=1'
      this.$axios.post(url,{
        orderField:orderField,
        pageIndex:this.pagination.currentPage,
        pageSize:this.pagination.pageSize,
        sortOrder:"desc",
        sortvalue:this.searchTable==''?undefined:this.searchTable,
      })
      .then(res=>{
        var data = eval(res.data)

        if(data.code==1004){
          this.$message({ message: data.result.msg, type: 'warning' })
          return false
        }
        console.log(data.rows)
        console.log(data.total)
        _this.row=data.rows
        _this.pagination.total = data.total

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
     //按钮操作列表
     navBtnList(name,type,row){
        var _this = this
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

        if(name=='导出'){
          console.log(JSON.stringify(this.OutField))
          console.log(JSON.stringify(this.listQuery))
          return false
          window.location.href= this.$path.GetRepTask+'?posttype=2&OutField='+JSON.stringify(this.OutField)+'&searchField='+JSON.stringify(this.listQuery);
        }
        if(name=='延期通知'||name=='迟发通知'){
          this.dialogVisible = true
        }


     },
     //延期通知
     delaySubmit(){
       var _this = this
       let rows = this.$refs.multipleTable.selection
       let arr = []
       var text = $("input:checkbox[name='fulicheckbox']:checked").map(function(index,elem) {
					return $(elem).parents(".el-checkbox").attr("data-value")
       }).get().join(',');
       rows.forEach(item=>{
         let obj = {
           bar_sn : item.bar_sn,
           tittle : text,
           context : _this.sample.context,
           context : _this.sample.remark,
         }
         arr.push(obj)
       })
       if(text==''){
          this.$message({ message: '请选择原因!', type: 'warning' })
          return false;
       }
       if(text.indexOf("10") != -1 && _this.sample.context==''){
          this.$message({ message: '请填写其他原因!', type: 'warning' })
          return false;
       }

       console.log(JSON.stringify(arr))
       let url = this.$path.EditNoticeLateReport
       let objs = qs.stringify({
          type: 0,
          itemstr: JSON.stringify(arr)
        })
       this.$axios.post(url,objs)
       .then(res=>{
         let data = eval(res.data)
         if(data.code == '1000'){
          this.$message({ message: '延期通知发起成功!', type: 'success' })
          this.dialogVisible = false
         }else{
          this.$message({ message: data.result.msg, type: 'warning' })
         }
         console.log(res)
       })
       .catch(err=>{
         this.$message({ message: err, type: 'warning' })
       })
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
</style>
