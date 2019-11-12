<template>
    <div>
      <el-card class="filter-container" style="margin-bottom:15px;" shadow="never" v-for="(item,index) in siteData" :key="index">
        <div>
          <el-button
            v-if="index=='0'"
            style="float:right"
            type="primary"
            @click="addSite()"
            size="mini">
            添加
          </el-button>
          <el-button
            v-else
            style="float:right"
            @click="delSite(index)"
            size="mini">
            刪除
          </el-button>
        </div>
        <div>
            <el-form :inline="true" :model="item" size="small" label-width="100px">
              <el-form-item label="基因名称:">
                <el-input v-model="item.GeneName" class="input-width" placeholder="基因名称"></el-input>
              </el-form-item>
              <el-form-item label="染色体:">
                <el-input v-model="item.Chr" class="input-width" placeholder="染色体"></el-input>
              </el-form-item>
              <el-form-item label="染色体位置:">
                <el-input v-model="item.ChrPos" class="input-width" placeholder="染色体位置"></el-input>
              </el-form-item>
              <el-form-item label="转录本:">
                <el-input v-model="item.RNAAccession" class="input-width" placeholder="转录本"></el-input>
              </el-form-item>
              <el-form-item label="核苷酸:">
                <el-input v-model="item.Nucleotide" class="input-width" placeholder="核苷酸"></el-input>
              </el-form-item>
              <el-form-item label="核苷酸改变:">
                <el-input v-model="item.AminoAcidChange" class="input-width" placeholder="核苷酸改变"></el-input>
              </el-form-item>
              <el-form-item label="氨基酸改变:" style="margin-bottom:0">
                <el-input v-model="item.BaseChange" class="input-width" placeholder="氨基酸改变"></el-input>
              </el-form-item>
              <el-form-item label="合子状态:" style="margin-bottom:0">
                <el-input v-model="item.ZygoticState" class="input-width" placeholder="合子状态"></el-input>
              </el-form-item>
            </el-form>
        </div>
      </el-card>

    </div>
</template>
<script>
export default {
   data() {
      return {
        siteData:[
          {
            ID:'',
            GeneName:'',
            Chr:'',
            ChrPos:'',
            RNAAccession:'',
            Nucleotide:'',
            AminoAcidChange:'',
            BaseChange:'',
            ZygoticState:'',
          }
        ]
      }
   },
   created(){

   },
   activated() {
   },
   methods:{
     addSite(){
       let obj = {
          ID:'',
          GeneName:'',
          Chr:'',
          ChrPos:'',
          RNAAccession:'',
          Nucleotide:'',
          AminoAcidChange:'',
          BaseChange:'',
          ZygoticState:'',
       }
       this.siteData.push(obj)
     },
     delSite(index){
       this.siteData.splice(index, 1);
     },
     //校验录入信息
     checkSite(){
       var type = false
       this.siteData.forEach((item,index)=>{
         var msg = ''
         if(item.GeneName==''||item.RNAAccession==''||item.Nucleotide==''){
          msg = (item.GeneName==''?'基因名称必须填写!':(item.RNAAccession==''?'转录本必须填写!':(item.Nucleotide==''?'核苷酸改变必须填写!':'')))
          this.$message({
            message: msg,
            type: 'warning'
          });
          type = false
         }else{
           type = true
         }
       })
       return type
     },
   }
}
</script>
<style lang="scss" scoped>
.el-form--inline .el-form-item{
      margin-right: 6px;
}
</style>
