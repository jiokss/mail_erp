<template>
<!-- 基因查询 -->
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
            <el-form-item label="基因名称：">
              <el-input v-model="listQuery.txtGeneName" class="input-width" placeholder="基因名称"></el-input>
            </el-form-item>
            <el-form-item label="疾病名称：">
              <el-input v-model="listQuery.txtDiseaseName" class="input-width" placeholder="疾病名称"></el-input>
            </el-form-item>
            <el-form-item label="基因包名称：">
              <el-input v-model="listQuery.txtGeneGroupName" class="input-width" placeholder="基因包名称"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card class="filter-container" shadow="never">
        <div style="margin-bottom:25px;">
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
            prop="GeneName"
            label="基因名称"
            header-align = 'center'
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="GeneOldName"
            label="基因旧名称"
            header-align = 'center'
            align="center" >
          </el-table-column>
          <el-table-column
            prop="ChName"
            label="疾病名称"
            header-align = 'center'
            align="center" >
          </el-table-column>
          <el-table-column
            prop="grp_item"
            label="基因包"
            header-align = 'center'
            align="center" >
          </el-table-column>
          <el-table-column
            prop="grp_price_post"
            label="产后价格"
            header-align = 'center'
            align="center" >
          </el-table-column>
          <el-table-column
            prop="grp_getRepTime"
            label="报告周期"
            header-align = 'center'
            align="center" >
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
        applyForm:{
          GeneName:'',
          GeneOldName:'',
          OMIM:'',
          ConText:'',
        },
        guid:'0',
        listQuery:{
          txtGeneName:'',
          txtDiseaseName:'',
          txtGeneGroupName:'',
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
        row2:[],
        multipleSelection: [],
        guid:'0',
        ReqCode:'',
        checkedCities:[],
        menuCodeList:'sales_special_item',
        formatted:'formatted',
        GeneTitle:'',
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
      var url = 'http://192.168.1.43:2223/reports/GMSearcher/SearchByName?offset='+this.pagination.currentPage+'&search='+(this.searchTable==''?undefined:this.searchTable)+'&limit='+this.pagination.pageSize+'&order=asc&geneName='+this.listQuery.txtGeneName+'&diseaseName='+this.listQuery.txtDiseaseName+'&geneGroupName='+this.listQuery.txtGeneGroupName
      // var url = this.$path.SearchByName+'?offset=0&limit=10&order=asc&geneName=&diseaseName=&geneGroupName='
      this.$axios.get(url)
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
