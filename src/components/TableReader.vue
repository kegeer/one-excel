<template>
<div>
  <h1 class="text-center">模板稀释表格批量上传</h1>
  <div>
    <h4>请务必按照如下格式提交: <strong>模板稀释表</strong></h4>
    <p class="help-block">如果不符合以下要求,请更改后在提交,以免数据有误</p>
    <table class="table table-bordered" style="color: #000;">
      <thead>
      <tr>
        <th rowspan="2">序号</th>
        <th rowspan="2">谱元编号</th>
        <th rowspan="2">扩增方案</th>
        <th colspan="4">稀释</th>
        <th rowspan="2">产物浓度</th>
        <th rowspan="2">实验批次</th>
        <th rowspan="2">项目归属</th>
        <th rowspan="2">备注(意外情况</th>
      </tr>
      <tr>
        <th>原浓度</th>
        <th>取样体积</th>
        <th>加水量</th>
        <th>终浓度</th>
      </tr>
      </thead>
    </table>
  </div>
  <form>
    <div class="form-group">
      <label for="file" class="control-label"></label>
      <input type="file" @change="fileLoad">
    </div>
    <div style="margin-bottom: 24px;">
      <a href="#" @click="previewTable" class="btn btn-info"><i class="fa fa-eye">&nbsp;&nbsp;</i>预览表格</a>
      <a href="#" @click="showSaveModal" v-show="selectedRow.length > 0" class="btn btn-primary"><i class="fa fa-save">&nbsp;&nbsp;</i>保存到数据库</a>
    </div>
    <div v-show="isProcessing">
      <span>Processing.........</span>
    </div>

    <div v-show="showPreview" class="well">
      <div class="row">
        <div class="col-sm-2">
          <h4 class="list-header text-center">所有表格: <i class="fa fa-angle-right"></i></h4>
        </div>
        <div class="col-sm-10">
          <ul class="list-group" style="margin-top: 20px;">
            <li v-for="(sheetData, sheetName) in sheets" class="list-group-item table-list" v-html="sheetName" @click="selectedSheet(sheetName)" style="display:inline-block;cursor:pointer;">
            </li>
          </ul>
        </div>
      </div>
      <div style="margin: 20px 40px;">
          <h4><i class="fa fa-level-down"></i>请逐行选择和添加你要上传的数据</h4>
      </div>

      <span v-show="!sheetData.data">
          该表格里面没有数据
      </span>
      <table class="table">
        <tr v-for="(row, index) in sheetData.data" class="text-center">
          <td>
            <div class="checkbox" v-show="index">
              <input type="checkbox" :id="checkboxInput(index)" v-model="selectedRow" :value="index">
              <label :for="checkboxInput(index)"></label>
            </div>
          </td>
          <td v-for="(col, index) in row" v-html="col"></td>
        </tr>
      </table>
    </div>
  </form>
  <div class="modal fade" id="saveModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" style="width:55%;">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel">请填写信息提交</h4>
        </div>
        <div class="modal-body">
          <form>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <label for="extraction_manager">提取负责人</label>
                  <input type="text" class="form-control" id="extraction_manager" v-model="form.extraction_manager">
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <label for="extraction_time">提取时间</label>
                  <input type="date" class="form-control" id="extraction_time" v-model="form.extraction_time">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <label for="purify_manager">提取负责人</label>
                  <input type="text" class="form-control" id="purify_manager" v-model="form.purify_manager">
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <label for="purify_time">提取时间</label>
                  <input type="date" class="form-control" id="purify_time" v-model="form.purify_time">
                </div>
              </div>
            </div>

          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary" @click.prevent="saveTable">确认并提交</button>
        </div>
      </div>
    </div>
  </div>

</div>
</template>
<script>
import {
  readFile
} from '../services/reader'
import $ from 'jquery'
export default {
  data () {
    return {
      excelFile: '',
      showPreview: false,
      isProcessing: false,
      sheets: [],
      json_string: '',
      sheetData: {},
      selectedRow: [],
      form: {
        purify_manager: '',
        purify_time: '',
        extraction_manager: '',
        extraction_time: '',
        data: []
      }
    }
  },
  methods: {
    fileLoad (e) {
      this.excelFile = e.target.files[0]
    },
    previewTable () {
      this.isProcessing = true
      this.sheets = []
      this.showJson = false
      this.showPreview = true
      if (this.excelFile) {
        readFile(this.excelFile, this.showPreview, false).then((data) => {
          this.sheets = data.sheets
          this.isProcessing = false
        })
      }
      console.log(this.sheets)
    },
    checkboxInput (index) {
      return 'checkbox' + index
    },
    selectedSheet (sheetName) {
      this.sheetData = this.sheets[sheetName]
    },
    showSaveModal () {
      $('#saveModal').modal('show')
    },
    saveTable () {
      console.log(this.selectedRow)
      this.resetForm()
      this.selectedRow.forEach(index => this.form.data.push(this.sheetData.data[index]))
      console.log(this.form)
//      this.$http.post('http://localhost:8000/api/experiments', this.form)
    },
    resetForm () {
      this.form.purify_manager = ''
      this.form.purify_time = ''
      this.form.extraction_manager = ''
      this.form.extraction_time = ''
      this.form.data = []
    }
  }
}
</script>
<style>
td {
  font-weight: 300;
  text-align: center;
  padding: 2px 6px;
  border: 1px solid #ededed;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
  .table-list {
    padding:3px 6px;
    background-color: #000;
    color: #fff;
  }
  .list-header {
    margin-top: 24px;
  }
</style>
