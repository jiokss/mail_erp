if (process.env.NODE_ENV === 'development') {
  var api = '/api/'
} else {
  if(window.location.port == '2222'){
    var api = 'http://192.168.1.43:2222/'
  }else{
    var api = 'http://192.168.1.43:2223/'
  }
}

let path = {
  urlPath : api,

  /*  OMS 系统  */
  GetLoginUserInfo:api+'/api/webapi/GetLoginUserInfo', //获取登录信息
  itemini: api + 'mgene/newform/itemini',             //初始化
  BarcodeList:api + 'mgene/newform/BarcodeList',     //添加项目
  CheckFamily:api + 'mgene/newform/CheckFamily',     //查询家系
  CheckPosition:api + 'mgene/newform/CheckPosition',  //获取表格位点
  submitfamily:api + 'mgene/newform/submitfamily',  //家系信息提交
  formcomplete:api + 'mgene/newform/formcomplete',   //提交申请单
  GetMenuFieldList:api + 'api/webapi/GetMenuFieldList?menuCodeList=erp_sales_apply_manage&returnType=formatted',  //获取表格表头
  getform:api + 'mgene/newform/getform?posttype=1',   //申请单管理查询表格数据
  getform1:api + 'mgene/newform/getform',   //申请单管理查询表格数据
  getformcw:api + 'mgene/newform/getformcw',   //申请单管理查询表格数据
  approvalGet:api + 'mgene/approval/get',   //申请单管理查询表格数据
  getErpUserOperation1:api + 'api/webapi/getErpUserOperation',   //申请单管理表头按钮
  getformCode1:api + 'mgene/newform/getform',     //编辑回显数据
  GetFileByGuid:api + 'mgene/file/GetFileByGuid',          //上传文件回显
  getstatus:api + 'mgene/workflow/getstatus',          //获取样本日志列表
  deleteform:api + 'mgene/newform/deleteform',          //删除申请单
  Attachment:api + 'mgene/File/Attachment',          //申请单上传文件
  DataRequest:api + 'mgene/task/DataRequest',          //申请单申请数据提交
  sales_GetMenuFieldList:api + 'api/webapi/GetMenuFieldList',          //审批管理表头数据
  GetMenuOperationList:api + 'api/webapi/GetMenuOperationList?menuCodeList=erp_medical_approval_manage&returnType=formatted',  //审批管理按钮信息
  FormCompleteByBatch:api + 'mgene/newform/FormCompleteByBatch',  //批量开单提交
  logisticsGetMenuFieldList:api + 'api/webapi/GetMenuFieldList?menuCodeList=erp_customer_logistics_print&returnType=formatted',    //物流信息表格表头
  GetRepTask:api + 'mgene//task/GetRepTask',   //物流信息表格
  mergeReport:api + 'mgene/file/mergeReport',        //物流信息批量打印
  UpdateRepTask:api + 'mgene/task/UpdateRepTask',     //物流信息提交
  sampGetMenuFieldList:api + 'api/webapi/GetMenuFieldList',    //管理表头
  Getsample:api + 'mgene/sample/Getsample',     //样本管理表格加载
  sampGetMenuOperationList:api + 'api/webapi/GetMenuOperationList',   //管理按钮组
  Print:api + 'mgene/sample/Print',      //样本管理打印按钮
  // bGetsample:'/api/sample/Getsample',   //样本管理导出
  ApplySample:api + 'mgene/approval/ApplySample',   //样本补样处理确定
  CheckRequestFormUser:api + 'api/webapi/CheckRequestFormUser',  //样本拒收用户校验
  RejectSample:api + 'mgene/sample/RejectSample',  //样本拒收确定
  RecSample:api + 'mgene/sample/RecSample',      //样本接收确定
  signsample:api + 'mgene/sample/signsample',     //样本签收确定
  ReturnSample:api + 'mgene/sample/ReturnSample',    //样本退样
  ReTransfer:api + 'mgene/sample/ReTransfer',       //重新交接
  DestroySample:api + 'mgene/sample/DestroySample',  //摧毁样本
  ItemEditApplySample:api + 'mgene/sample/ItemEditApplySample',  //申请项目修改

  /**  RMS 系统   */
  GetMedicalTaskSort:api + 'mgene/taskmedical/GetMedicalTaskSort',   //任务池所有任务接口
  GetMedicalTotal:api + 'mgene/taskmedical/GetMedicalTotal',     //任务数量接口
  EditMedicalTask:api + 'mgene/taskMedical/EditMedicalTask',     //任务池选择
  FinalVersion:api + 'hcxrep/InspectManagement/FinalVersion?isOut=1',  //确定终稿
  getfile:api + 'mgene/file/getfile',    //下载附件
  PreviewReport:api + 'hcxrep/InspectManagement/PreviewReport',    //文件预览
  InspectManagement:api + 'hcxrep/InspectManagement',    //报告系统
  EditNotice:api + 'mgene/notice/EditNotice',    //消息中心
  EditNoticeRecord:api + 'mgene/notice/EditNoticeRecord',    //资料缺乏
  genemodify:api + 'mgene/gene/genemodify',    //疾病基因维护
  GeneModify:api + 'mgene/gene/GeneModify',    //基因修改确定
  ClientGene:api + 'mgene/gene/ClientGene',    //基因详情
  SearchByName:api + 'reports/GMSearcher/SearchByName',    //基因查询
  EditNoticeLateReport:api + 'mgene/notice/EditNoticeLateReport',  //迟发报告记录
  GetMitoMutationTrainData:'http://192.168.1.44:8899/api/MitoModelAnalysis/GetMitoMutationTrainData',   //人工锁定信息
  ImportMitoTrainData:'http://192.168.1.44:8899/api/MitoModelAnalysis/ImportMitoTrainData',   //人工锁定导入
  ExportMitoTrainData:'http://192.168.1.44:8899/api/MitoModelAnalysis/ExportMitoTrainData',   //人工锁定导出
  GetReportDetail:api + 'mgene/report/GetReportDetail',    //案例统计信息
  UpdateFlag:api + 'mgene/taskmedical/UpdateFlag',  //任务发起信息查询
  EditTaskRule:api + 'mgene/taskmedical/EditTaskRule',  //任务发起信息查询
  EditDicGroupPer:api + 'mgene/itemorg/EditDicGroupPer',  //任务发起信息查询

}

export default path
