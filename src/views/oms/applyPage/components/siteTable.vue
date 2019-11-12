<template>
    <div>
      <el-table
        ref="multipleTable"
        :data="thedepByOrgList"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="GeneName"
          label="基因名称"
          >
          <template slot-scope="scope">
              <el-input v-model="scope.row.GeneName" :disabled="isDisabled=='true'?true:false"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="Chr"
          label="染色体"
         >
          <template slot-scope="scope">
              <el-input v-model="scope.row.Chr" :disabled="isDisabled=='true'?true:false"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="ChrPos"
          label="染色体位置"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <el-input v-model="scope.row.ChrPos" :disabled="isDisabled=='true'?true:false"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="RNAAccession"
          label="转录本"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <el-input v-model="scope.row.RNAAccession" :disabled="isDisabled=='true'?true:false"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="Nucleotide"
          label="核苷酸"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <el-input v-model="scope.row.Nucleotide" :disabled="isDisabled=='true'?true:false"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="AminoAcidChange"
          label="核苷酸改变"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <el-input v-model="scope.row.AminoAcidChange" :disabled="isDisabled=='true'?true:false"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="BaseChange"
          label="氨基酸改变"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <el-input v-model="scope.row.BaseChange" :disabled="isDisabled=='true'?true:false"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="ZygoticState"
          label="合子状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <el-input v-model="scope.row.ZygoticState" :disabled="isDisabled=='true'?true:false"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              class="siteRemove"
              @click.native.prevent="deleteRow(scope.$index, siteData)"
              type="text"
               :disabled="isDisabled=='true'?true:false"
              size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
export default {
   data() {
      return {
        thedepByOrgList:this.siteData,
        isDisabled:this.siteDisabled,
      }
   },
   activated() {
   },
   created(){
     console.log(JSON.stringify(this.siteData))
   },
   props:["siteData","siteDisabled"],
   watch:{
     siteData:function(val){
      this.thedepByOrgList=val
    }
   },
   methods:{
      deleteRow(index, rows) {
        rows.splice(index, 1)
      },
   }
}
</script>
<style>
</style>
