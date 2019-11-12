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
        <div style="margin-top: 15px"  class="search-box" v-show="showHideSeach">
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
        <el-button v-for="item in switchBtn" :type="type==item.type?'primary':''" :key="item.type" @click="changeTable(item.type)">{{ item.name }}</el-button>
      </el-card>
      <el-card class="filter-container" shadow="never" style="margin-top:15px;">
        <div style="margin-bottom:25px;">
          <el-button v-for="(item,index) in headerBtnList" :key="index" @click="navBtnList(item.op_title)">{{item.op_title}}</el-button>
          <el-button  @click="changeNumTable(item.id,item.name)" class="quickList" type="text" v-for="(item,index) in quick" :key="item.name">{{item.name}}<span style="color:#ea8c25;">({{ item.num }})</span></el-button>
          <div :inline="true" class="demo-form-inline float_right">
            <el-input style="width:auto;" placeholder="搜索" v-model="searchTable"  @keyup.enter.native=" searchFrom()"></el-input>
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
            :fixed="index < 3 ? true:false"
            :prop="item.id"
            v-if="checkedCities.indexOf(item.name) != -1"
            :width="item.name=='创建备注'?'600':'150'"
            >
          </el-table-column>

          <el-table-column
            prop="address"
            label="操作"
            fixed="right"
            min-width="280px"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button @click="navBtnList(item.op_title,1,scope.row)" v-if="item.op_title != '导出'" v-for="(item,index) in headerBtnList" :key="index" size="small">{{item.op_title}}</el-button>
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

      <!-- 资料缺失说明弹窗 -->
      <el-dialog
        title="资料缺失说明"
        :visible.sync="dialogVisible2"
        width="40%"
        top="7vh"
        class="applyModel"
        >
        <div>
            <el-form ref="form" label-width="100px" class="wForm">
              <el-form-item label="原因：">
                <el-input type="textarea" v-model="missingData"></el-input>
              </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="submitModify">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 资料缺失说明弹窗 end-->

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
import upLoad from '../oms/applyPage/components/upLoad'
import ViewApply from '../oms/applyPage/viewApply'
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
        activeSwitch:0,
        switchBtn:[
          {
            name:'本人任务', type:1002,
          },
          {
            name:'其他任务', type:1001,
          },
          {
            name:'待更新报告', type:1003,
          },
          {
            name:'验证中', type:1004,
          },
        ],
        searchSelect:[],  //搜索下拉列表
        searchText:[],    //搜索文本
        searchDate:[],    //搜索时间
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
        menuCodeList:'medical_self_report',
        formatted:'formatted',
        quick:[
          {name:'未领任务',num:0,id:24},
          {name:'所有',num:0,id:''},
          {name:'一审',num:0,id:27},
          {name:'二审',num:0,id:28},
          {name:'三审',num:0,id:33},
          {name:'终稿',num:0,id:29},
        ],
        type:1002,
        activeName2:'first',
        missingData:'临床资料不足',
        barArray:[],
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
      this.type = type
      this.getform()

     },

     changeNumTable(sum,name){
       let searchField = JSON.stringify({"sam_flag":sum})
       this.getform(2,searchField)
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
       console.log(this.$store.state.user)
        var _this = this
        this.$axios.get(this.$path.sampGetMenuOperationList+'?menuCodeList='+this.menuCodeList
        +'&returnType=formatted',{
          params:{
            user_loginid:_this.$store.state.user.user_loginid,
            AppCodeList:'ERP_MAIN'
          }
        })
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
     getform(type,searchField){
      var _this = this
      var searchField = searchField?searchField:JSON.stringify({"sam_flag":"27"})
      var obj = encodeURI(JSON.stringify(this.listQuery))
      this.$axios.post(this.$path.GetMedicalTaskSort+'?type='+_this.type+'&posttype=1&searchField='+(type == 1? obj:searchField),{
        orderField: "OutTime",
        pageIndex:this.pagination.currentPage,
        pageSize:this.pagination.pageSize,
        sortOrder:"asc"
      })
      .then(res=>{
        var data = eval(res.data)
        console.log(data)
        if(data.code==1004){
          this.$message({ message: data.result.msg, type: 'warning' });
        }
        _this.row=res.data.rows
        _this.pagination.total = res.data.total
        console.log(res)
      })
      .catch(err=>{
      })
      //加载任务条数
      this.GetMedicalTotal()
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

     //表头按钮点击
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
        if(name=='取消'){
            let select_data=[]
            for ( var  i=0;i<row.length;i++){
              select_data.push(row[i].sam_id);
            }
            this.$confirm('确定取消任务吗?取消后需要重新选取！', '提示', { confirmButtonText: '确定',
              cancelButtonText: '取消', type: 'warning' }).then(() => {
              this.$axios.post(this.$path.EditMedicalTask+'?samid='+select_data.toString()+'&type=6')
              .then(res=>{
                let data = eval(res.data)
                if(data.code == '1000'){
                  this.$message({ message: '任务取消成功!', type: 'success' })
                  this.type = 1001
                  this.getform()
                }else{
                  this.$message({ message: data.result.msg, type: 'warning' })
                }
              })
              .catch(err=>{
                this.$message({ message: '取消出错！', type: 'warning' })
              })
            }).catch(() => {

            });
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
            if(select_flag.indexOf(29)==0 || select_flag.indexOf(200)==0|| select_flag.indexOf(26)==0 || select_flag.indexOf(27)==0|| select_flag.indexOf(28)==0|| select_flag.indexOf(33)==0){
                this.$message({ message: '选择的任务中不可选择的任务，请重新确认!', type: 'warning' });
                return false;
            }else {
                this.$confirm('确定选择任务吗?选取成功后在我的任务中查看！', '提示', { confirmButtonText: '确定',
                  cancelButtonText: '取消', type: 'warning' }).then(() => {
                  this.$axios.post(this.$path.EditMedicalTask+'?samid='+select_data.toString()+'&type=5')
                  .then(res=>{
                    let data = eval(res.data)
                    if(data.code == '1000'){
                      this.$message({ message: '任务选择成功!', type: 'success' });
                      this.type=1002
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
        if(name=='详情'){
          if(row.length>1){
            this.$message({ message: '请选择一条数据查看详情！', type: 'warning' });
            return false
          }
          this.dialogVisible = true
          this.req_code = row[0].req_code
        }
        if(name=='资料缺乏'){
          console.log(this.missingData)
          this.dialogVisible2 = true
          this.barArray = []
          this.missingData = '临床资料不足'
          row.forEach(item=>{
            let obj = {
              bar_sn : item.bar_sn,
              Reason : this.missingData
            }
            this.barArray.push(obj)
          })
        }
        if(name=='导出'){
          this.listQuery['sam_flag'] = this.sam_flag;
          let outArray = this.OutField
          let searchArray = this.listQuery
          window.location.href= this.$path.GetMedicalTaskSort+'?type='+_this.type+'&posttype=2&OutField='+encodeURI(JSON.stringify(outArray))+'&searchField='+encodeURI(JSON.stringify(searchArray));
          return false;
        }
     },

     //获取案件数量
     GetMedicalTotal(){
       let _this = this
       this.$axios.post(this.$path.GetMedicalTotal+'?type='+this.type+'&posttype=1')
       .then(res=>{
         let data = res.data.data
         _this.quick[0].num = data[24]
         _this.quick[1].num = data[1000]
         _this.quick[2].num = data[27]
         _this.quick[3].num = data[28]
         _this.quick[4].num = data[33]
         _this.quick[4].num = data[29]
       })
       .then(err=>{
         console.log(err)
       })
     },
      //资料缺失确定按钮
      submitModify(){

        this.barArray.forEach(item=>{
          item.Reason = this.missingData
        })
        console.log(this.barArray)
        let url = this.$path.EditNoticeRecord
        var subData = qs.stringify({
          type: 0,
          itemstr: JSON.stringify(this.barArray)
        })
        this.$axios.post(url,subData)
        .then(res=>{
          let data = eval(res.data)
          if(data.code == 1000){
            this.$message({ message: '资料缺失通知发起成功！', type: 'success' });
            this.dialogVisible2 = false
          }else{
            this.$message({ message: '资料缺失通知发起失败', type: 'warning' });
          }
        })
        .catch(err=>{
          this.$message({ message: '资料缺失通知发起失败', type: 'warning' });
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
     upLoad,
     ViewApply
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
  .quickList{
    font-size: 18px;
    font-weight: bold;
  }
</style>
