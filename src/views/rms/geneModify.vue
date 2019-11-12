<template>
<!-- 物流打印 -->
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
        <div style="margin-top: 15px" v-show="showHideSeach">
          <el-form :inline="true" :model="listQuery" size="small" label-width="100px">
            <el-form-item label="基因名：">
              <el-input v-model="listQuery.GeneName" class="input-width" placeholder="基因名"></el-input>
            </el-form-item>
            <el-form-item label="旧基因名">
              <el-input v-model="listQuery.GeneOldName" class="input-width" placeholder="旧基因名"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card class="filter-container" shadow="never">
        <div style="margin-bottom:25px;">
          <el-button type="primary" @click="editBtnList('新增')">新增</el-button>
          <el-button @click="editBtnList('删除')">删除</el-button>
          <el-button @click="editBtnList('修改')">修改</el-button>
          <el-button @click="editBtnList('详情')">详情</el-button>
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
            prop="ID"
            label="ID"
            header-align = 'center'
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="GeneName"
            label="基因名"
            header-align = 'center'
            align="center" >
          </el-table-column>
          <el-table-column
            prop="GeneOldName"
            label="旧基因名"
            header-align = 'center'
            align="center" >
          </el-table-column>
          <el-table-column
            prop="OMIM"
            label="OMIM"
            header-align = 'center'
            align="center" >
          </el-table-column>
          <el-table-column
            prop="ConText"
            label="基因描述"
            header-align = 'center'
            align="center" >
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            header-align = 'center'
            align="center"
            fixed="right"
            min-width="80px"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button @click="editBtnList('修改',scope.row)" size="small">修改</el-button>
              <el-button @click="editBtnList('删除',scope.row)" size="small">删除</el-button>
              <el-button @click="editBtnList('详情',scope.row)" size="small">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
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
      <!-- 基因修改弹窗 -->
      <el-dialog
        :title="GeneTitle"
        :visible.sync="dialogVisible"
        width="40%"
        top="7vh"
        class="applyModel"
        >
        <el-form ref="form" label-width="120px" class="w-100">
          <el-form-item label="基因名：">
            <el-input v-model="applyForm.GeneName"></el-input>
          </el-form-item>
          <el-form-item label="旧基因名：">
            <el-input v-model="applyForm.GeneOldName"></el-input>
          </el-form-item>
          <el-form-item label="OMIM：">
            <el-input v-model="applyForm.OMIM"></el-input>
          </el-form-item>
          <el-form-item label="基因描述：">
            <el-input v-model="applyForm.ConText"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="reportSumbit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 基因修改弹窗 end-->

      <!-- 基因详情弹窗 -->
      <el-dialog
        :title="GeneTitle2"
        :visible.sync="dialogVisible2"
        width="60%"
        top="7vh"
        class="applyMode2"
        >
        <div>
          <div>
            <el-form :inline="true" class="demo-form-inline float_right">
              <el-form-item>
                <el-input placeholder="搜索"></el-input>
              </el-form-item>
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
            </el-form>
          </div>
          <el-table
            ref="multipleTable"
            :data="row2"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            >
            <el-table-column
              prop="EnName"
              label="EnName"
              header-align = 'center'
              fixed
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="ChName"
              label="ChName"
              fixed
              header-align = 'center'
              align="center" >
            </el-table-column>
            <el-table-column
              prop="EnDescription"
              label="EnDescription"
              fixed
              header-align = 'center'
              align="center" >
            </el-table-column>
            <el-table-column
              prop="ChDescription"
              label="ChDescription"
              header-align = 'center'
              align="center" >
            </el-table-column>
            <el-table-column
              prop="Inheritance"
              label="Inheritance"
              header-align = 'center'
              align="center" >
            </el-table-column>
            <el-table-column
              prop="Description"
              label="Description"
              header-align = 'center'
              align="center" >
            </el-table-column>
            <el-table-column
              prop="EnDescriptionJJ"
              label="EnDescriptionJJ"
              header-align = 'center'
              align="center" >
            </el-table-column>
            <el-table-column
              prop="ChDescriptionJJ"
              label="ChDescriptionJJ"
              header-align = 'center'
              align="center" >
            </el-table-column>
          </el-table>
          <div class="" style="margin-top:15px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination2.currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pagination2.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination2.total">
            </el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 基因详情弹窗 end-->


    </div>
</template>
<script>
// import upLoad from './components/upLoad'
import qs from 'qs'
export default {
   data() {
      return {
        searchTable:'',
        showHideSeach:false,
        dialogVisible:false,
        dialogVisible2:false,
        applyForm:{
          GeneName:'',
          GeneOldName:'',
          OMIM:'',
          ConText:'',
        },
        guid:'0',
        listQuery:{
          GeneName:'',
          GeneOldName:'',
        },
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
        menuList:[],
        OutField:{},
        headerBtnList:[],
        options: [],  //状态筛选列表
        value6: '',
        row: [],
        row2:[],
        multipleSelection: [],
        guid:'0',
        ReqCode:'',
        checkedCities:[],
        menuCodeList:'sales_special_item',
        formatted:'formatted',
        GeneTitle:'',
        GeneTitle2:'',
      }
   },
   activated() {
   },
   created(){
     this.getform()
   },
   mounted(){
   },
   methods:{

     //查询搜索按钮
     search(){
       this.searchTable = ''
       let searchField = 1
       this.pagination.currentPage = 1
       this.pagination.pageSize = 10
       this.getform(searchField)
     },
     //获取表格信息
     getform(searchField){
      var _this = this
      var obj = encodeURI(JSON.stringify(this.listQuery))
      var url = ''
      if(!searchField){
        url = this.$path.genemodify+'?type=25&posttype=1'
      }else{
        url = this.$path.genemodify+'?type=25&posttype=1&searchField='+obj
      }
      this.$axios.post(url,{
        pageIndex:this.pagination.currentPage,
        pageSize:this.pagination.pageSize,
        sortOrder:"desc",
        sortvalue:this.searchTable==''?undefined:this.searchTable,
      })
      .then(res=>{
        var _this = this
        _this.row = res.data.rows
        _this.pagination.total = res.data.total
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
      editBtnList(name,row){
        var arr = []
        if(row){
          arr.push(row)  //获取选中行数据
          row = arr
        }else{
          row = this.$refs.multipleTable.selection  //获取选中行数据
        }
        console.log(row)
        console.log(row.length)
        if((row.length<1 || row.length>1) && name!='新增' ){
          this.$message({ message: '请勾选一条任务进行操作!', type: 'warning' });
          return false;
        }
        //新增功能
        if(name=='新增'){
          this.$message({ message: '功能维护中！', type: 'warning' });
        }
        //删除功能
        if(name=='删除'){
          this.$message({ message: '功能维护中！', type: 'warning' });
        }
        //修改功能
        if(name=='修改'){
          this.dialogVisible = true
          let rowData = row[0]
          this.applyForm = { ...row[0] }
          this.GeneTitle = row[0].GeneName + '的基因信息修改'
        }
        //详情
        if(name=='详情'){
          this.dialogVisible2 = true
          this.GeneTitle2 = row[0].GeneName + '的基因信息详情'
          this.$axios.post(this.$path.ClientGene+'?geneID='+row[0].ID,{
          // this.$axios.post(this.$path.getform+'?posttype=1&searchField='+obj,{
            pageIndex:this.pagination2.currentPage,
            pageSize:this.pagination2.pageSize,
            sortOrder:"desc"
          })
          .then(res=>{
            var _this = this
            let data = eval(res.data)
            _this.row2 = data.result.data
            _this.pagination2.total = data.result.data.total?data.result.data.total:0
          })
          .catch(err=>{
          })

        }
      },
      //基因信息修改确定
      reportSumbit(){
        let url = this.$path.EditNoticeRecord
        let subData = qs.stringify({
          type: 1,
          itemstr: JSON.stringify(this.applyForm)
        })
        this.$axios.post(this.$path.GeneModify,subData)
        .then(res=>{
          let data = eval(res.data)
          if (data.code == '1000') {
            this.$message({ message: '更新成功！', type: 'success' });
            this.dialogVisible = false
          }
          else{
            this.$message({ message: data.result.msg, type: 'success' });
          }
          console.log(res)
        })
        .catch(err=>{
          this.$message({ message: err, type: 'success' });
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
    //  upLoad
   }
}
</script>
<style lang="scss">
  .queryMain .el-select,.queryMain .el-form-item__content{
    width: 240px;
  }
  .float_right{
    float: right;
  }
  .w-100{
    .el-form-item__content{
      width: auto;
    }
  }
  .applyMode2 .el-dialog__body{
    padding: 0px 20px;
  }
</style>
