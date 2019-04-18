<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,body{
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
}
.ivu-table-cell span{
  font-size: 14px;
}
.ivu-table-cell div{
  font-size: 14px;
}
.ivu-menu-item-active{
  background-color: #f5f7f9 !important;
  color: #2d8cf0;
  border-left: 4px solid #2d8cf0;
}
.table-inline-btn{
  margin-right: 20px;
  cursor: pointer;
}
.table-inline-btn span:hover{
  color: #2d8cf0;
}
.ivu-modal-header {
  background-color: #2d8cf0;
}
.ivu-input,.ivu-select-input,.ivu-cascader-label,.ivu-form-item-content,.ivu-select-selected-value,.ivu-select-placeholder{
  font-size: 14px !important;
}
.ivu-modal-close i.ivu-icon-ios-close{
  color: #fff;
}
.ivu-modal-header-inner {
  color: #ffffff !important;
}
div.ivu-modal-footer{
  border-top: 0 !important;
  padding:0 18px 12px 18px;
}
.vertical-center-modal{
  display: flex;
  align-items: center;
  justify-content: center;
}
.vertical-center-modal .ivu-modal{
  top: 0;
}
.ivu-tooltip-rel{
  vertical-align: middle !important;
}
.icon-xinzeng,.icon-shanchu,.icon-daochu{
  color:#409eff;
}
.icon-title{
  color: #515a6e !important;
}
.icon-title:hover{
  color: #409eff !important;
}
</style>
