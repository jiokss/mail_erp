<template>
    <div class="rex">
       <van-cell is-link @click="showPopup">展示弹出层</van-cell>

            <van-popup v-model="show">内容</van-popup>
        <div class="main">
          <!-- 家系查询 -->
          <div class="pedigree">
            <div>
              <h2 class="group-title">条件搜索</h2>
              <van-cell-group>
                <van-field
                  v-model="pedigree.searchFamilyName"
                  clearable
                  label="姓名"
                  placeholder="请输入姓名"
                />
                <van-field
                  v-model="pedigree.searchBarCode"
                  clearable
                  label="流水号"
                  placeholder="请输流水号"
                />
                <van-field
                  v-model="pedigree.searchFamilyNo"
                  clearable
                  label="家庭号"
                  placeholder="请输入家庭号"
                />
                <div style="text-align: center; padding:10px 40px;">
                  <van-button class="sm-btn" type="info" size="large" square>搜 索</van-button>
                </div>
              </van-cell-group>
            </div>
            <div>
              <h2 class="group-title">搜索结果</h2>
              <el-table
                class="pedigree-table"
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  type="selection"
                  header-align = 'center'
                  align="center"
                  width="55">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="pat_name"
                  label="姓名"
                  header-align = 'center'
                  align="center"
                  sortable
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="pat_id"
                  label="顾客编码"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="pat_familyno"
                  label="家庭号"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="grp_name"
                  label="项目"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="sp_name"
                  label="样本类型"
                  header-align = 'center'
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  header-align = 'center'
                  align="center"
                  width="80">
                  <template slot-scope="scope">
                    <el-button type="text" size="small">获取位点</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                style="background:#fff"
                layout="prev, pager, next"
                :pager-count="5"
                :total="1000">
              </el-pagination>
            </div>
            <div>
              <h2 class="group-title">选择信息</h2>
              <van-radio-group v-model="radio">
                <van-cell-group>
                  <van-cell title="复制信息：">
                    <van-radio name="1">是</van-radio>
                    <van-radio name="2">否</van-radio>
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
              </van-cell-group>
                <van-field
                    v-model="pedigree.searchBarCode"
                    clearable
                    label="与先证者关系"
                    placeholder="请选择"
                  />
              </van-cell-group>
            </div>
            
          </div>
          <!-- 申请单 -->
          <div>

          </div>
          <!-- 收银台 -->
          <div>

          </div>
        </div>
        
<!-- 选择弹窗 -->
      
        <!-- 底部切换 -->
        <van-tabbar v-model="active">
          <van-tabbar-item icon="home-o">标签</van-tabbar-item>
          <van-tabbar-item icon="search">标签</van-tabbar-item>
          <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
          <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
        </van-tabbar>
       
    </div>
</template>
<script>
export default {
   data() {
      return {
        show: false,
        active: 0,
        radio:'',
        pedigree:{
          searchFamilyName:'',
          searchBarCode:'',
          searchFamilyNo:'',
        },
        tableData:[{
          "bar_sn": "10040935",
          "grp_name": "Citrin缺乏症",
          "sp_name": "全血",
          "pat_id": "997202",
          "pat_familyno": "9972",
          "pat_name": "19611测试",
          "pat_sex": 2,
          "pat_birthday": "2019-07-27 00:00",
          "pat_native": null,
          "pat_nation": null,
          "pat_IDcard": "",
          "pat_phone": "00000000000",
          "pat_address": "",
          "pat_email": null,
          "pat_age": null,
          "pat_medical_no": "",
          "pat_age_unit": null,
          "CNVFilePath": "",
          "MutationFilePath": "",
          "pat_family_relation": 2,
          "pat_mr_num": null,
          "pat_age_dec": "28岁"
        },{
          "bar_sn": "10040935",
          "grp_name": "Citrin缺乏症",
          "sp_name": "全血",
          "pat_id": "997202",
          "pat_familyno": "9972",
          "pat_name": "19611测试",
          "pat_sex": 2,
          "pat_birthday": "2019-07-27 00:00",
          "pat_native": null,
          "pat_nation": null,
          "pat_IDcard": "",
          "pat_phone": "00000000000",
          "pat_address": "",
          "pat_email": null,
          "pat_age": null,
          "pat_medical_no": "",
          "pat_age_unit": null,
          "CNVFilePath": "",
          "MutationFilePath": "",
          "pat_family_relation": 2,
          "pat_mr_num": null,
          "pat_age_dec": "28岁"
        }],
      }
   },
   activated() {
   },
   methods:{
     showPopup(){
       this.show = true;
     }
   }
}
</script>
<style lang="scss">
  .main{
    padding-bottom:100px;
    .group-title{
      margin: 0;
      padding: 15px 15px 15px;
      color: rgba(69, 90, 100, 0.6);
      font-weight: normal;
      font-size: 14px;
    }
    .van-radio{
      float:right;
      width:50%;
    }
  }

  .sm-btn{
    height: 36px;
    line-height: 36px;
    span{
      font-size: 14px;
    }
  }

</style>
<style>
  html,body,#app{
    height:100%;overflow:auto;margin: 0;
  }
  .main::-webkit-scrollbar{
　  display:none
  }
  .main{
    -webkit-overflow-scrolling : touch
  }
 
  .el-table td, .el-table th{
    padding:5px 0 !important;
  }
  .pedigree-table .cell{
    padding-left:2px !important;
    padding-right:2px !important;
  }
  .fixedBtm{
    position:fixed;
    left:0;
    right:0;
    bottom:0;
    height:40px;
    background:red;

  }
</style>
