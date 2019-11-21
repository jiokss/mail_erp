<template>
    <div class="load-main loadFile">
        <div class="form-group">
            <div class="">
                <input id="file" name="myfile" type="file"  class="file form-control" multiple />
            </div>
        </div>
    </div>
</template>
<script>

export default {
   data() {
      return {
          formMovie:{
              posterURL:'',
          },
          imgUploadAPI: 'xxx',
          uploadFileName:[],  //所有提交文件
          uploadFile:"",
          uploadFileId:[],
          uploadFileIds:[],
      }
   },
   mounted:function(){
     console.log(this.guid)
     if(this.guid=='0'){
       this.initFile()
     }
     if(this.guid=='99'){
       this.autoLoad()
     }
   },
   methods:{
     //文件上传组件初始化
     initFile(){
       var _this = this
       this.$nextTick(() => {
            $(".file").fileinput({
                'theme': 'explorer-fa',
                'enctype': 'multipart/form-data',
                'language' : 'zh',
                'dropZoneTitle':'也可以拖拽文件到这进行上传！(申请单及临床资料（具体的症状以及相关检查结果），支持图片、视频、PDF等各类文件上传。)',
                'uploadUrl': 'http://121.32.130.178:8896/api/FileService/UploadFile?moduleTag=6'
            });
            $(".file").on("filebatchselected", function(event, files) {
                _this.$message({
                  message: '文件选择完成，请确认上传，否则不能提交申请单！',
                  type: 'success'
                });
            });
            $(".file").on("fileuploaded", function(event, data, previewId, index) {
                _this.$message({
                  message: '上传成功！',
                  type: 'success'
                });
                _this.uploadFileName.push(data.filenames[index]);
                _this.uploadFileId.push(data.response);
                if(_this.uploadFile!="")
                    _this.uploadFile+=",";
                _this.uploadFile+= data.response;
                console.log(_this.uploadFileName)
                console.log(_this.uploadFileId)
            });
            $(".file").on("filesuccessremove", function (event, data, previewId, index) {
                for (var i = 0; i < _this.uploadFileId.length; i++) {
                    console.log(_this.uploadFileId[i])
                    console.log(data)
                    if (_this.uploadFileId[i]== data.response) {
                        delete _this.uploadFileId[i];
                    }
                }
                console.log(_this.uploadFileId)
            });
        })
     },
     //自动上传初始化
     autoLoad(){
      var _this = this
      var barCode = this.barCode
      console.log(this)
      $("#file").fileinput({
          language: 'zh',
          uploadUrl: 'http://121.32.130.178:8896/api/FileService/Upload',
          browseClass: "btn btn-primary",
          browseLabel: '上传',
          showCaption: true,
          showRemove: true,
          showUpload: true,
          showCancel: true,
          enctype: 'multipart/form-data',
          uploadExtraData: function () {
          return { 'relativePath': '/10/'+barCode+'/8_QualityControl'};
      }
      }).on("filebatchselected", function (event, files) {// 选择文件后自动上传
          $(this).fileinput("upload");
      }).on("fileuploaded", function (event, data, previewId, index) {// 异步上传成功
          if (data.response.Status){
            _this.$message({ message: data.response.Message, type: 'success'  });
          }else{
            _this.$message({ message: data.response.Message, type: 'success'  });
          }
      }).on("filebatchuploaderror", function (event, data, msg) {// 同步上传失败
          _this.$message({ message: data.response.Message, type: 'error'  });
      }).on("fileerror", function (event, data, msg) {// 异步上传失败
          _this.$message({ message: data.response.Message, type: 'error'  });
      });
     },

     //回显上传数据
     GetFileByGuid(newVal){
       var _this = this
       _this.$axios.get(this.$path.GetFileByGuid+'?guid='+newVal)
       .then(res=>{
          var data = eval(res.data)
          var fileId = newVal.split(',')
          this.$nextTick(() => {
            var delFile = []
            var previewFile = []
            var fileId = []
            for ( var i = 0; i< data.result.data.length; i++) {
                delFile.push({ caption: data.result.data[i].FileName, width: "120px",url: "http://121.32.130.178:8896/api/FileService/DeleteFile?guid="+fileId[i], key:fileId[i]});
                previewFile.push(data.result.data[i].FilePath);
            }
            console.log(delFile)
            console.log(previewFile)
            $(".file").fileinput({
                'theme': 'explorer-fa',
                'enctype': 'multipart/form-data',
                'language' : 'zh',
                'previewFileType':'any',
                'uploadUrl': 'http://121.32.130.178:8896/api/FileService/UploadFile?moduleTag=6',
                initialPreviewAsData: true,
                overwriteInitial: false,
                showPreview:true,
                initialPreviewShowDelete:true,
                preferIconicPreview: true, // this will force thumbnails to display icons for following file extensions
                previewFileIconSettings: { // configure your icon file extensions
                    '*': '<i class="fa fa-file-archive-o text-muted"></i>',
                    'doc': '<i class="fa fa-file-word-o text-primary"></i>',
                    'xls': '<i class="fa fa-file-excel-o text-success"></i>',
                    'pptx': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
                    'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
                    'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
                    'htm': '<i class="fa fa-file-code-o text-info"></i>',
                    'txt': '<i class="fa fa-file-text-o text-info"></i>',
                    'mov': '<i class="fa fa-file-movie-o text-warning"></i>',
                    'mp3': '<i class="fa fa-file-audio-o text-warning"></i>',
                    'rar': '<i class="fa fa-file-archive-o text-muted"></i>',
                    'vcf': '<i class="fa fa-file-archive-o text-success"></i>'
                },
                initialPreview: previewFile,
                initialPreviewConfig: delFile
            });
            //在删除原图片之前触发，而新选择的图片不会触发。能满足我们的要求。
            $('.file').on('filebeforedelete', function(event, key, jqXHR, data) {
                return new Promise(function(resolve, reject) {
                    layer.confirm('确定删除原文件？删除后不可恢复', {
                        btn: ['确定', '取消']
                        , btn1:function(index){
                            resolve();
                            layer.close(index);
                        }
                        , btn2: function (index) {
                            layer.close(index);
                        }
                    });
                });
            });
            $('.file').on('filedeleted', function(event, key, jqXHR, data) {
                Array.prototype.indexOf = function(val) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] == val) return i;
                    }
                    return -1;
                };
                Array.prototype.remove = function(val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                fileId.remove(key);
                var delFile=fileId.join(",");

            });
          });
       })
       .catch(err=>{
         console.log(err)
       })
     },
     beforeUpdate() {
        console.log(this.uploadFileIds);
     },
      show(){
        console.log(this)
      },
   },
   props: ['guid','barCode'],
   watch:{
      guid(newVal,oldVal){
        console.log(newVal)
        console.log(oldVal)
       if(newVal!=''){
         //console.log(this)
         // this.GetFileByGuid(newVal)
        // console.log(this.GetFileByGuid)
       }else{

       }
      }
   }
}
</script>
<style>
    .input-group-btn{
        position: relative;
        top: -3px;
    }
    .load-main .krajee-default.file-preview-frame{
        overflow: hidden;
    }
    .load-main .el-form-item__content{
        line-height: normal;
    }
    .load-main .form-group .clearfix{
        display: none;
    }
    .load-main .file-drop-zone{
        clear: both;
        overflow: hidden;
    }
    .load-main .file-drop-zone-title{
        padding:25px ;
    }
    #kvFileinputModal{
      z-index: 99999;
    }
    .loadFile .file-input{
      display: block !important;
    }
    .loadFile .btn-file{
      width: 120px;
    }
</style>

