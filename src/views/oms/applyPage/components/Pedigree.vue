<template>
    <div>
      <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>基本信息</span>
          <el-button
            style="float:right"
            type="primary"
            @click="queryUser()"
            size="small">
            查询搜索
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="80px">
            <el-form-item label="姓名:">
              <el-input v-model="listQuery.pat_name" class="input-width" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="流水号:">
              <el-input v-model="listQuery.barcode" class="input-width" placeholder="流水号"></el-input>
            </el-form-item>
            <el-form-item label="家庭号:">
              <el-input v-model="listQuery.pat_familyno" class="input-width" placeholder="家庭号"></el-input>
            </el-form-item>
          </el-form>
          <!-- 表格 -->
          <el-table
            :data="tableData"
            stripe
            highlight-current-row
            max-height="200"
            ref="singleTable"
            @current-change="handleCurrentChange"
            style="width: 100%">
            <el-table-column
              prop="pat_name"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="pat_id"
              label="顾客编码">
            </el-table-column>
            <el-table-column
              prop="pat_familyno"
              label="家庭号">
            </el-table-column>
            <el-table-column
              prop="grp_name"
              label="项目"
              width="200">
            </el-table-column>
            <el-table-column
              prop="sp_name"
              label="样本类型">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="CheckPosition(scope.row.bar_sn,listSearch.status)">获取位点</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 条件 -->
          <el-form style="margin-top: 15px" :inline="true" :model="listSearch" size="small">
            <el-form-item label="是否复制先证者信息:">
              <el-checkbox v-model="listSearch.checked"></el-checkbox>
            </el-form-item>
            <el-form-item label="与先证者关系:">
              <el-select v-model="listSearch.status" placeholder="与先证者关系" clearable class="input-width" @change="tempName(listSearch.status)">
                <el-option v-for="(item,index) in patRelation" :key="index" :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="验证方式:">
              <el-radio-group v-model="listSearch.radio" @change="position=[];type=!type">
                <el-radio label="1">先证者验证</el-radio>
                <el-radio label="2">自定义验证</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card class="filter-container" shadow="never" style="margin-top:20px;">
        <div>
          <i class="el-icon-search"></i>
          <span>基本信息</span>
          <el-button
            style="float:right"
            type="primary"
            @click="addDna()"
            v-if="listSearch.radio!='1'"
            size="small">
            添加
          </el-button>
          <el-button
            style="float:right;margin-right: 15px"
            @click="delAllDna()"
            v-if="listSearch.radio!='1'"
            size="small">
            清空
          </el-button>
        </div>
        <el-table
            :data="position"
            ref="multipleTable"
            stripe
            max-height="200"
            style="width: 100%">
            <el-table-column
              type="selection"
              v-if="type"
              width="55">
            </el-table-column>
            <el-table-column
              prop="GeneName"
              label="基因名称">
            <template slot-scope="scope">
              <span v-if="listSearch.radio=='1'">{{scope.row.GeneName}}</span>
              <el-input v-else v-model="scope.row.GeneName" placeholder="请输入内容"></el-input>
            </template>
            </el-table-column>
            <el-table-column
              prop="Chr"
              label="染色体">
             <template slot-scope="scope">
              <span v-if="listSearch.radio=='1'">{{scope.row.Chr}}</span>
              <el-input v-else v-model="scope.row.Chr" placeholder="请输入内容"></el-input>
            </template>
            </el-table-column>
            <el-table-column
              prop="ChrPos"
              label="染色体位置">
               <template slot-scope="scope">
                <span v-if="listSearch.radio=='1'">{{scope.row.ChrPos}}</span>
                <el-input v-else v-model="scope.row.ChrPos" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="RNAAccession"
              label="转录本">
               <template slot-scope="scope">
                <span v-if="listSearch.radio=='1'">{{scope.row.RNAAccession}}</span>
                <el-input v-else v-model="scope.row.RNAAccession" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="Nucleotide"
              label="核苷酸">
               <template slot-scope="scope">
                <span v-if="listSearch.radio=='1'">{{scope.row.Nucleotide}}</span>
                <el-input v-else v-model="scope.row.Nucleotide" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="BaseChange"
              label="核苷酸改变">
               <template slot-scope="scope">
                <span v-if="listSearch.radio=='1'">{{scope.row.BaseChange}}</span>
                <el-input v-else v-model="scope.row.BaseChange" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="AminoAcidChange"
              label="氨基酸改变">
               <template slot-scope="scope">
                <span v-if="listSearch.radio=='1'">{{scope.row.AminoAcidChange}}</span>
                <el-input v-else v-model="scope.row.AminoAcidChange" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="ZygoticState"
              label="合子状态">
               <template slot-scope="scope">
                <span v-if="listSearch.radio=='1'">{{scope.row.ZygoticState}}</span>
                <el-input v-else v-model="scope.row.ZygoticState" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              v-if="listSearch.radio!='1'"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, position)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-card>
    </div>
</template>
<script>
export default {
   data() {
      return {
        listQuery:{
          pat_name:'',
          pat_familyno:'',
          barcode:'',
        },
        tableData: [],
        listSearch:{
            checked:true,
            status:'',
            radio:'1',
        },
        position:[],
        currentRow:[],
        type:true,
        tempNameText:'',
        patient:[], //提交获取的数据
      }
   },
   activated() {
   },
   methods:{
      //获取关系字段
      tempName(val){
        this.tempNameText = this.patRelation[val]
      },
      addDna(){  //自定义验证添加
         let obj = {
           GeneName:'',
            Chr:'',
            ChrPos:'',
            RNAAccession:'',
            Nucleotide:'',
            BaseChange:'',
            AminoAcidChange:'',
            ZygoticState:''
         }
         this.position.push(obj)
      },
      delAllDna(){  //清空所有
         this.position = []
      },
      deleteRow(index, rows) {  //移除单个
        rows.splice(index, 1);
      },
      //查询家系
      queryUser(){
        var _this = this
        this.$axios.get(_this.$path.CheckFamily,{
          params:{
            pat_name: _this.listQuery.pat_name,
            pat_familyno: _this.listQuery.pat_familyno,
            barcode: _this.listQuery.barcode,
          }
        })
        .then(res=>{
          var data = eval(res.data).result
          console.log(data)
          this.tableData = data.barcode
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
      },
      //表格获取位点
      CheckPosition(bar_sn,relation){
        var _this = this
        if(_this.listSearch.status == ''){
          this.$message({
            message: '请选择先证者关系',
            type: 'warning'
          });
          return false;
        }
        this.$axios.get(_this.$path.CheckPosition,{
          params:{
            bar_sn: bar_sn,
            relation: relation,
          }
        })
        .then(res=>{
          var data = eval(res.data).result
          this.position = data.position
          if(data.position==''){
            this.$message({ message: '当前没有位点信息，请联系管理员!', type: 'warning' });
            return false;
          }
          console.log(data)

        })
        .catch(err=>{
          console.log(err)
        })
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      //家系查询提交
      submitfamily(){
        var type = 0
        var _this = this
        var row = this.currentRow
        if(row == ''){
          this.$message({
            message: '请选择一位先证者',
            type: 'warning'
          });
          type = 1
          return type
        }
        if(_this.listSearch.status == ''){
          this.$message({
            message: '请选择先证者关系',
            type: 'warning'
          });
          type = 1
          return type
        }

        for(var i=0;i<_this.position.length;i++){
          var item = _this.position[i]
          if(item.GeneName == ''){
            this.$message({ message: '基因名称必须填写!', type: 'warning' })
            type = 1
            return type
          }
           if(item.RNAAccession == ''){
            this.$message({ message: '转录本必须填写!', type: 'warning' })
            type = 1
            return type
          }
           if(item.BaseChange == ''){
            this.$message({ message: '核苷酸改变必须填写!', type: 'warning' })
            type = 1
            return type
          }
        }
        if(this.listSearch.radio=='1'){
          var row = this.$refs.multipleTable.selection
          _this.position = row
          return row
        }
      },
   },
   props:["patRelation"]
}
</script>
<style>
  .el-form--inline .el-form-item{
    margin-right: 20px;
  }
</style>
