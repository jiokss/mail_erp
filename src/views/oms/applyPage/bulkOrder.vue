<template>
    <div class="queryMain app-container">
      <el-card class="filter-container" shadow="never" style="margin-top:15px;">
        <div>
          <el-button @click="importXlsx">导入excal</el-button>
          <el-button type="primary" @click="addAll">新增</el-button>
          <el-button type="success">下载模板</el-button>
          <input id="file" type="file" @change="sendfile" style="display:none">
        </div>
      </el-card>
      <el-card class="filter-container" shadow="never" style="margin-top:15px;">
        <el-table
          :data="dataAll"
          stripe
          style="width: 100%">
          <el-table-column type="expand" fixed >
            <template slot-scope="props">
                <div>
                    <el-button size="mini" style="margin:15px 0" @click="addPro(props.$index)" >添加</el-button>
                      <el-table
                        :data="props.row.proData"
                        style="width: 50%"
                        stripe
                        border
                        :default-sort = "{prop: 'date', order: 'descending'}"
                        @row-click = "selectRowChange"
                        >
                        <el-table-column
                          prop="grp_name"
                          label="项目"
                        >
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.grp_name" placeholder="请输入内容"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="req_born_flag"
                          label="项目类型"
                        >
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.req_born_flag" placeholder="请选择">
                            <el-option label="产前"  value="0"></el-option>
                            <el-option label="产后"  value="1"></el-option>
                          </el-select>
                        </template>
                        </el-table-column>
                        <el-table-column
                          prop="spec_id"
                          label="标本"
                        >
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.spec_id" placeholder="请选择">
                            <el-option
                              v-for="(item,index) in spec"
                              :key="index"
                              :label="item.sp_name"
                              :value="item.sp_id">
                            </el-option>
                          </el-select>
                        </template>
                        </el-table-column>
                        <el-table-column
                          prop="bar_sampling_time"
                          label="采样日期"
                        >
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.bar_sampling_time" placeholder="请输入内容"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="bar_item_goal"
                          label="送检目的"
                        >
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.bar_item_goal" placeholder="请选择">
                              <el-option label="A.怀疑送检者是遗传病患者，明确诊断"  value="0"></el-option>
                              <el-option label="B.送检者不一定是遗传病，排除遗传因素"  value="1"></el-option>
                              <el-option label="C.携带者筛查"  value="2"></el-option>
                              <el-option label="D.送检者亲属被怀疑为遗传病患者"  value="3"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          width="100">
                          <template slot-scope="scope">
                            <el-button size="small" @click.native.prevent="deleteRow(scope.$index, props.row.proData)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                </div>
                <div>
                    <el-button size="mini" style="margin:15px 0" @click="addProSite(props.$index)" >添加</el-button>
                      <el-table
                        :data="props.row.siteData"
                        style="width: 50%"
                        stripe
                        border
                        :default-sort = "{prop: 'date', order: 'descending'}"
                        >
                        <el-table-column
                          v-for="(item,index) in sTitle" :key="index"
                          :prop="item.id"
                          :label="item.name"
                          >
                          <template slot-scope="scope">
                            <el-input v-model="scope.row[item.id]" placeholder="请输入内容"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          width="100">
                          <template slot-scope="scope">
                            <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, props.row.siteData)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item,index) in tTitle" :key="index"
            :fixed="index==0?true:false"
            :label="item.name"
            width="120px"
            :prop="item.id">
            <template slot-scope="scope">
              <el-select v-if="item.name=='开单机构'" v-model="scope.row.req_org_id" placeholder="请选择">
                <el-option
                  v-for="(item,index) in orgItem"
                  :key="index"
                  :label="item.org_name"
                  :value="item.org_id">
                </el-option>
              </el-select>
              <el-select v-else-if="item.name=='科室'" v-model="scope.row.req_org_dept" placeholder="请选择">
                <el-option
                  v-for="(item,index) in part"
                  :key="index"
                  :label="item.part_name"
                  :value="item.part_id">
                </el-option>
              </el-select>
              <!-- <el-date-picker
                v-else-if="item.name=='出生日期'"
                v-model="dataAll[index][item.id]"
                type="date"
                placeholder="选择日期">
              </el-date-picker> -->
              <el-input v-else v-model="scope.row[item.id]" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button size="small" @click.native.prevent="deleteRow(scope.$index, dataAll)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div style="width:300px;margin:15px auto;">
        <el-button type="primary" @click="confirmOrder()">确认批量开单</el-button>
      </div>

    </div>
</template>
<script>
import XLSX from "xlsx"
import qs from 'qs'
export default {
   data() {
      return {
        nameAll:[],
        dataAll:[],
        proData:[],
        siteData:[],
        tTitle:[
          {"id":'bar_serial_num',"name":'条码'},
          {"id":'isNewFamily',"name":'是否新家系'},
          {"id":'pat_familyno',"name":'家系序号'},
          {"id":'req_org_id',"name":'开单机构'},
          {"id":'req_org_dept',"name":'科室'},
          {"id":'req_doc_name',"name":'医生'},
          {"id":'req_doc_phone',"name":'医生电话'},
          {"id":'pat_name',"name":'患者姓名'},
          {"id":'pat_sex',"name":'性别'},
          {"id":'pat_age_dec',"name":'年龄'},
          {"id":'pat_birthday',"name":'出生日期'},
          {"id":'pat_IDcard',"name":'身份证'},
          {"id":'pat_phone',"name":'联系电话'},
          {"id":'req_mr_num',"name":'就诊号'},
          {"id":'pat_address',"name":'家庭住址'},
          {"id":'req_diag_info',"name":'临床症状'},
          {"id":'req_remark',"name":'备注'},
          {"id":'req_send',"name":'寄送报告'},
          {"id":'req_note',"name":'寄送发票'},
          {"id":'LmUserSend',"name":'收件人'},
          {"id":'LmPhoneSend',"name":'收件电话'},
          {"id":'LmAddressSend',"name":'快递地址'},
          {"id":'LmInvoiceSend',"name":'发票抬头'},
          {"id":'LmEmailSend',"name":'E-mail'},
          {"id":'req_payment_way',"name":'付款方式'},
          {"id":'req_payment_flag',"name":'收费情况'},
          {"id":'req_payment_price',"name":'实收金额'},
          {"id":'req_payment_remark',"name":'收费备注'},
        ],
        pTitle:[
          {"id":'grp_name',"name":'项目'},
          {"id":'req_born_flag',"name":'项目类型'},
          {"id":'spec_id',"name":'标本'},
          {"id":'bar_sampling_time',"name":'采样日期'},
          {"id":'bar_item_goal',"name":'送检目的'},
        ],
        sTitle:[
          {"id":'GeneName',"name":'基因名称'},
          {"id":'Chr',"name":'染色体'},
          {"id":'ChrPos',"name":'染色体位置'},
          {"id":'RNAAccession',"name":'转录本'},
          {"id":'Nucleotide',"name":'核苷酸'},
          {"id":'BaseChange',"name":'核苷酸改变'},
          {"id":'AminoAcidChange',"name":'氨基酸改变'},
          {"id":'ZygoticState',"name":'合子状态'},
        ],
        orgItem:[],  //开单机构
        part:[],    //科室
        spec:[],    //标本

      }
   },
   activated() {
   },
   created(){
     var _this = this
     this.$axios(this.$path.itemini)
     .then(res=>{
       var data = eval(res.data)
        _this.$nextTick(()=>{
          _this.orgItem = data.result.orgItem
          _this.part = data.result.part
          _this.spec = data.result.spec
        })

       console.log(res)
     })
     .catch(err=>{
       console.log(err)
     })
   },
   methods:{
     sendfile(e){
        //导入数据
        var _this = this
        var dataAll=[];//基本信息数据
        var proData=[];//项目数据
        var siteData=[];//位点数据
        var files = e.target.files;
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
            try {
                var data = ev.target.result,
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    }), // 以二进制流方式读取得到整份excel表格对象
                    persons = {}; // 存储获取到的数据
            } catch (e) {
                console.log('文件类型不正确');
                return;
            }
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {

                    fromTo = workbook.Sheets[sheet]['!ref'];
                    var tiem = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                    persons[sheet]=XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                }
            }
            dataAll =persons["基本信息"];
            proData =persons["项目"];
            siteData =persons["位点"];
            if(!proData || !siteData){
              _this.$message({ message: '导入excel文档格式不正确，请重新修改!', type: 'warning' });
              return false;
            }



            this.nameAll = dataAll
            for(var i = 0; i < dataAll.length; i++) {
                dataAll[i]["bar_serial_num"] = dataAll[i]["条码"];
                dataAll[i]["pat_tag"] = '';
                dataAll[i]["req_org_id"] = dataAll[i]["开单机构"];
                dataAll[i]["req_org_dept"] = dataAll[i]["科室"];
                dataAll[i]["req_doc_name"] = dataAll[i]["医生"];
                dataAll[i]["req_doc_phone"] = dataAll[i]["医生电话"];
                dataAll[i]["req_dest_labid"] = '1';
                dataAll[i]["pat_name"] = dataAll[i]["患者姓名"];
                dataAll[i]["pat_sex"] = dataAll[i]["性别"];
                dataAll[i]["pat_age_dec"] = dataAll[i]["年龄"];
                dataAll[i]["pat_birthday"] = _this.formatDate(dataAll[i]["出生日期"], '/');
                dataAll[i]["pat_IDcard"] = dataAll[i]["身份证"];
                dataAll[i]["pat_phone"] = dataAll[i]["联系电话"];
                dataAll[i]["req_pat_id"] = '';
                dataAll[i]["pat_familyno"] = dataAll[i]["家庭号"];
                dataAll[i]["pat_family_relation"] = '';
                dataAll[i]["req_mr_num"] = dataAll[i]["就诊号"];
                dataAll[i]["pat_address"] = dataAll[i]["家庭住址"];
                dataAll[i]["req_diag_info"] = dataAll[i]["临床症状"];
                dataAll[i]["req_remark"] = dataAll[i]["备注"];
                dataAll[i]["req_send"] = dataAll[i]["寄送报告"];
                dataAll[i]["req_note"] = dataAll[i]["寄送发票"];
                dataAll[i]["LmUserSend"] = dataAll[i]["收件人"];
                dataAll[i]["LmPhoneSend"] = dataAll[i]["收件电话"];
                dataAll[i]["LmAddressSend"] = dataAll[i]["快递地址"];
                dataAll[i]["LmInvoiceSend"] = dataAll[i]["发票抬头"];
                dataAll[i]["LmEmailSend"] = dataAll[i]["E-mail"];
                dataAll[i]["req_payment_way"] = dataAll[i]["付款方式"];
                dataAll[i]["req_payment_flag"] = dataAll[i]["收费情况"];
                dataAll[i]["req_payment_price"] = dataAll[i]["实收金额"];
                dataAll[i]["req_payment_remark"] = dataAll[i]["收费备注"];
                dataAll[i]["proData"] = [];
                dataAll[i]["siteData"] = [];
                delete dataAll[i]["条码"];
                delete dataAll[i]["开单机构"];
                delete dataAll[i]["科室"];
                delete dataAll[i]["医生"];
                delete dataAll[i]["医生电话"];
                delete dataAll[i]["患者姓名"];
                delete dataAll[i]["性别"];
                delete dataAll[i]["年龄"];
                delete dataAll[i]["出生日期"];
                delete dataAll[i]["身份证"];
                delete dataAll[i]["联系电话"];
                delete dataAll[i]["家庭号"];
                delete dataAll[i]["就诊号"];
                delete dataAll[i]["家庭住址"];
                delete dataAll[i]["临床症状"];
                delete dataAll[i]["备注"];
                delete dataAll[i]["寄送报告"];
                delete dataAll[i]["寄送发票"];
                delete dataAll[i]["收件人"];
                delete dataAll[i]["收件电话"];
                delete dataAll[i]["快递地址"];
                delete dataAll[i]["发票抬头"];
                delete dataAll[i]["E-mail"];
                delete dataAll[i]["付款方式"];
                delete dataAll[i]["收费情况"];
                delete dataAll[i]["实收金额"];
                delete dataAll[i]["收费备注"];
            }

            for(var j = 0; j < proData.length; j++) {
                proData[j]["bar_serial_num"] = proData[j]["条码"];
                proData[j]["grp_name"] = proData[j]["项目"];
                proData[j]["req_born_flag"] = proData[j]["项目类型"];
                proData[j]["bar_sampling_time"] = _this.formatDate(proData[j]["采样日期"], '/');
                proData[j]["spec_id"] = proData[j]["标本"];
                proData[j]["bar_item_goal"] = proData[j]["送检目的"];
                delete proData[j]["条码"];
                delete proData[j]["项目"];
                delete proData[j]["项目类型"];
                delete proData[j]["采样日期"];
                delete proData[j]["标本"];
                delete proData[j]["送检目的"];
            }
            for(var k = 0; k < siteData.length; k++) {
                siteData[k]["bar_serial_num"] = siteData[k]["条码"];
                siteData[k]["GeneName"] = siteData[k]["基因名称"];
                siteData[k]["Chr"] = siteData[k]["染色体"];
                siteData[k]["ChrPos"] = siteData[k]["染色体位置"];
                siteData[k]["RNAAccession"] = siteData[k]["转录本"];
                siteData[k]["Nucleotide"] = siteData[k]["核苷酸"];
                siteData[k]["BaseChange"] = siteData[k]["核苷酸改变"];
                siteData[k]["AminoAcidChange"] = siteData[k]["氨基酸改变"];
                siteData[k]["ZygoticState"] = siteData[k]["合子状态"];
                delete siteData[k]["条码"];
                delete siteData[k]["基因名称"];
                delete siteData[k]["染色体"];
                delete siteData[k]["染色体位置"];
                delete siteData[k]["转录本"];
                delete siteData[k]["核苷酸"];
                delete siteData[k]["核苷酸改变"];
                delete siteData[k]["氨基酸改变"];
                delete siteData[k]["合子状态"];
            }
            /*测试 理顺 数据结构*/
            $.each(dataAll,function(index,value){
              var bar_serial = value.bar_serial_num
              // 项目
              for(var i=0;i<proData.length;i++){
                if(bar_serial == proData[i].bar_serial_num){
                  dataAll[index]["proData"].push(proData[i])
                }
              }
              // 位点
              for(var i=0;i<siteData.length;i++){
                if(bar_serial == siteData[i].bar_serial_num){
                  dataAll[index]["siteData"].push(siteData[i])
                }
              }
            });
            _this.$nextTick(()=>{
              if(_this.dataAll==''){
                _this.dataAll = dataAll
              }else{
                dataAll.forEach((item,index)=>{
                  _this.dataAll.push(item)
                })
              }
              console.log(dataAll)
              console.log(_this.dataAll)
            })
            // this.dataAll = dataAll
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
     },
     formatter(row, column){
       return row
     },
      formatDate(numb, format) {
        const time = new Date((numb - 1) * 24 * 3600000 + 1)
        time.setYear(time.getFullYear() - 70)
        const year = time.getFullYear() + ''
        const month = time.getMonth() + 1 + ''
        const date = time.getDate() - 1 + ''
        if (format && format.length === 1) {
          return year + format + month + format + date
        }
        return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
      },
      deleteRow(index, rows) {
         rows.splice(index, 1);
        console.log(index)
        console.log(rows)

      },
      //添加父表格行
      addAll(){
        var listTbale = {
          'LmAddressSend': '',
          'LmEmailSend': '',
          'LmInvoiceSend': '',
          'LmPhoneSend': '',
          'LmUserSend': '',
          'bar_serial_num': this.dataAll.length,
          'pat_IDcard': '',
          'pat_address': '',
          'pat_age_dec': '',
          'pat_birthday': '',
          'pat_family_relation': '',
          'pat_familyno': '',
          'pat_name': '',
          'pat_phone': '',
          'pat_sex': '',
          'pat_tag': '',
          'proData': [],
          'req_dest_labid': '',
          'req_diag_info': '',
          'req_doc_name': '',
          'req_doc_phone': '',
          'req_mr_num': '',
          'req_note': '',
          'req_org_dept': '',
          'req_org_id': '',
          'req_pat_id': '',
          'req_payment_flag': '',
          'req_payment_price': '',
          'req_payment_remark': '',
          'req_payment_way': '',
          'req_remark': '',
          'req_send': '',
          'siteData': []
        }

        this.dataAll.push(listTbale)
      },
      addPro(index){  //添加项目
        var obj = {
          bar_item_goal: "",
          bar_sampling_time: "",
          bar_serial_num: "",
          grp_name: "",
          req_born_flag: "",
          spec_id: ""
        }
        this.dataAll[index].proData.push(obj)
        console.log(index)
      },
      addProSite(index){  //添加基因位点
        var obj = {
          AminoAcidChange: "",
          BaseChange: "",
          Chr: "",
          ChrPos: "",
          GeneName: "",
          Nucleotide: "",
          RNAAccession: "",
          ZygoticState: "",
          bar_serial_num: ""
        }
        this.dataAll[index].siteData.push(obj)
        console.log(index)
      },
      confirmOrder(){   //确认开单
          var _this = this
          if(this.dataAll==''){
            this.$message({ message: '请最少添加一条数据！', type: 'warning' });
            return false;
          }
          var _thisData = this.dataAll
          for(var i=0;i<_thisData.length;i++){
            for(var j in _thisData[i]){
              //开单机构
              if(j=='req_org_id'){
                var org = _thisData[i][j]
                _this.orgItem.forEach(item=>{
                  if(org == item.org_name){
                      org = item.org_id
                  }
                })
              _thisData[i]['req_org_id'] = org
              }
              //科室
              if(j=='req_org_dept'){
                var org = _thisData[i][j]
                _this.part.forEach(item=>{
                  if(org == $.trim(item.part_name)){
                      org = item.part_id
                  }
                })
              _thisData[i]['req_org_dept'] = org
              }
              //性别
              if(j=='pat_sex'){
                _thisData[i]['pat_sex'] = _thisData[i]['pat_sex'] == '未知'?'0':(_thisData[i]['pat_sex'] == '男'?'1':_thisData[i]['pat_sex'] == '女'?'2':_thisData[i]['pat_sex'])
              }
              //寄送报告
              if(j=='req_send'){
               _thisData[i]['req_send'] = _thisData[i]['req_send'] == '是'?'1':(_thisData[i]['req_send'] == '否'?'0':_thisData[i]['req_send'])
              }
              //寄送发票
              if(j=='req_note'){
                _thisData[i]['req_note'] = _thisData[i]['req_note'] == '是'?'1':(_thisData[i]['req_note'] == '否'?'0':_thisData[i]['req_note'])
              }
              //付款方式
              if(j=='req_payment_way'){
                _thisData[i]['req_payment_way'] =
                _thisData[i]['req_payment_way'] == '现金'?'0'
                :_thisData[i]['req_payment_way'] == 'POS机'?'1'
                :_thisData[i]['req_payment_way'] == '银行转账'?'2'
                :_thisData[i]['req_payment_way'] == '微信'?'3'
                :_thisData[i]['req_payment_way'] == '支付宝'?'4'
                :_thisData[i]['req_payment_way'] == '月结'?'5'
                :_thisData[i]['req_payment_way']
              }
              //付款方式
              if(j=='req_payment_flag'){
                _thisData[i]['req_payment_flag'] =
                _thisData[i]['req_payment_flag'] == '未收费'?'0'
                :_thisData[i]['req_payment_flag'] == '全费'?'1'
                :_thisData[i]['req_payment_flag'] == '免费'?'2'
                :_thisData[i]['req_payment_flag'] == '优惠'?'3'
                :_thisData[i]['req_payment_flag'] == '协议/合同'?'4'
                :_thisData[i]['req_payment_flag']
              }

              if(j=='proData'){
                //项目信息
                for(var z=0; z<_thisData[i]['proData'].length;z++){
                  for(var x in _thisData[i]['proData'][z]){
                      //项目类型
                      if(x=='req_born_flag'){
                        _thisData[i]['proData'][z][x] =
                        _thisData[i]['proData'][z][x] == '产前'? '0'
                        :_thisData[i]['proData'][z][x] == '产后'? '1'
                        :_thisData[i]['proData'][z][x]
                      }
                      //标本
                      if(x=='spec_id'){
                        _this.spec.forEach(item=>{
                          if(_thisData[i]['proData'][z][x]==item.sp_name){
                            _thisData[i]['proData'][z][x] = item.sp_id
                          }
                        })
                      }
                      //标本
                      if(x=='bar_item_goal'){
                        _thisData[i]['proData'][z][x] =
                        _thisData[i]['proData'][z][x] == 'A.怀疑送检者是遗传病患者，明确诊断'? '0'
                        : _thisData[i]['proData'][z][x] == 'B.送检者不一定是遗传病，排除遗传因素'? '1'
                        : _thisData[i]['proData'][z][x] == 'C.携带者筛查'? '2'
                        : _thisData[i]['proData'][z][x] == 'D.送检者亲属被怀疑为遗传病患者'? '3'
                        : _thisData[i]['proData'][z][x]
                      }
                  }

                }
              }


            }

          }
          console.log(_thisData)
          var proData = qs.stringify({
                itemstr:JSON.stringify(this.dataAll),
          })
          // console.log(proData)
          this.$axios.post(this.$path.FormCompleteByBatch,
            proData
          )
          .then(res=>{
            var data = eval(res.data)
            if(data.code=='1000'){

            }else{
              this.$message({ message: data.result, type: 'warning' });
              return false;
            }
            console.log(res)
          })
          .catch(err=>{
            console.log(err)
          })

          console.log(this.dataAll)
      },
      importXlsx(){
        $("#file").trigger("click")
      },
      selectRowChange(row,col,event){
          row.flag = !row.flag;
          this.$refs.multipleTable.toggleRowSelection(row,row.flag);
      }
   },
   components:{
   }
}
</script>
<style lang="scss">

</style>
