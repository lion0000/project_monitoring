<template>
    <div style="width:100%;height:100%;"  ref="maxContainer">
      <Row ref="queryContainer">
        <Col :span="4" class="query-item">
          <Input type="text" v-model="queryForm.name" placeholder="名称" clearable></Input>
        </Col>
        <Col :span="2" class="query-item">
            <Button type="primary" :style="{width: '100%', maxWidth: '120px', minWidth: '50px'}" @click="queryFn('queryForm')">搜索</Button>
        </Col>
      </Row>
      <div class="tool-icon-group" ref="iconContainer">
        <span @click="addFn" class="icon-title"><Icon class="icon iconfont icon-xinzeng" size="20" title="新增"></Icon>新增</span>
        <span @click="delFn" class="icon-title"><Icon class="icon iconfont icon-shanchu" size="20" title="删除"></Icon>删除</span>
      </div>
      <Table border ref="selection" :columns="columnTitle" :data="queryData" :height="tableH" :stripe="true"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div :style="{textAlign:'center'}">
            <Page :total="pageInfo.total" :page-size="pageInfo.pageSize" :current="pageInfo.current" @on-change="changePage" @on-page-size-change="pageSizeChange" show-sizer show-elevator show-total></Page>
        </div>
      </div>
      <Modal v-model="subcModal" :width="360" :title="modalTitle" :mask-closable="false" class-name="vertical-center-modal">
          <Form ref="subcFrom" :model="subcInfo" label-position="top">
              <Row>
                <Col span="24" class="modal-form-item-padding">
                  <FormItem label="名称" prop="Name" :rules="{ required: true, validator: validateName,  trigger: 'blur' }">
                      <Input v-model="subcInfo.Name" clearable placeholder="名称"></Input>
                  </FormItem>
                </Col>
              </Row>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="cancleFn">取消</Button>
            <Button type="primary" size="large" @click="saveFn">确定</Button>
          </div>
      </Modal>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      subcModal: false,
      modalTitle: '',
      modalStatus: '',
      queryForm: {},
      columnTitle: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          width: 80,
          title: '序号',
          align: 'center'
        },
        {
          title: '分包商名称',
          align: 'center',
          key: 'Name'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('span', {
              class: 'table-inline-btn',
              on: {
                click: () => {
                  this.modifyFn(params.index)
                }
              }
            }, [
              h('Icon', {
                props: {
                  type: 'icon iconfont icon-bianji'
                },
                style: {
                  marginRight: '3px',
                  fontSize: '20px',
                  color: '#2d8cf0'
                }
              }),
              h('span', '编辑')
            ])
          }
        }
      ],
      queryData: [],
      subcInfo: {
        Id: '',
        Name: '',
        Code: ''
      },
      pageInfo: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      validateName: function (rule, value, callback) {
        if (!value) {
          callback(new Error('名称不能为空!'))
        } else if (!/[`~!@#$%^&*()_+<>?:"{},./\\;'[\]]/im.test(value)) {
          callback()
        } else {
          callback(new Error('名称不能包含特殊符号!'))
        }
      },
      tableH: 0
    }
  },
  mounted: function () {
    this.initFn()
  },
  methods: {
    ...mapActions([
      'querySubcontractorList',
      'insertSubcInfo',
      'modifySubcInfo',
      'deleteSubcInfo'
    ]),
    tableHeight () {
      if (this.$refs.maxContainer) {
        this.outsiderH = this.$refs.maxContainer.offsetHeight
        this.queryH = this.$refs.queryContainer.$el.offsetHeight
        this.iconH = this.$refs.iconContainer.offsetHeight
        this.tableH = this.outsiderH - this.queryH - this.iconH - 50
      }
    },
    initFn () {
      this.subcInfoNew = JSON.parse(JSON.stringify(this.subcInfo))
      this.queryFn(true)
      const that = this
      window.onresize = () => {
        that.tableHeight()
      }
    },
    addFn () {
      try {
        this.$refs.subcFrom.resetFields()
      } catch (e) {}
      this.subcModal = true
      this.modalTitle = '添加分包商'
      this.modalStatus = 'insert'
      this.subcInfo = JSON.parse(JSON.stringify(this.subcInfoNew))
    },
    modifyFn (index) {
      try {
        this.$refs.subcFrom.resetFields()
      } catch (e) {}
      this.subcModal = true
      this.modalTitle = '修改分包商'
      this.modalStatus = 'modify'
      this.subcInfo = JSON.parse(JSON.stringify(this.subcInfoNew))
      const row = JSON.parse(JSON.stringify(this.queryData[index]))
      this.subcInfo = row
      this.subcModal = true
    },
    delFn () {
      const rows = this.$refs.selection.getSelection()
      let ids = []
      if (rows.length === 0) {
        this.$Message.success('请选择要删除的数据!')
        return false
      }
      for (let i = 0; i < rows.length; i++) {
        ids.push(rows[i].Id)
      }
      this.$Modal.confirm({
        title: '提示',
        content: '是否确定要删除选择的分包商？',
        onOk: () => {
          this.deleteSubcInfo({ Ids: ids.toString() }).then(res => {
            if (res.State === 0) {
              this.$Message.success('操作成功!')
              this.queryFn()
            } else {
              this.$Message.error({ content: res.Message, duration: 3 })
            }
          })
        }
      })
    },
    saveFn () {
      this.$refs.subcFrom.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.subcInfo))
          if (this.modalStatus === 'insert') {
            this.insertSubcInfo(data).then(res => {
              if (res.State === 0) {
                this.subcModal = false
                this.$Message.success('保存成功!')
                this.queryFn()
              } else {
                this.$Message.error({ content: res.Message, duration: 3 })
              }
            })
          } else if (this.modalStatus === 'modify') {
            this.modifySubcInfo(data).then(res => {
              if (res.State === 0) {
                this.subcModal = false
                this.$Message.success('更新成功!')
                this.queryFn()
              } else {
                this.$Message.error({ content: res.Message, duration: 3 })
              }
            })
          }
        }
      })
    },
    cancleFn () {
      this.subcModal = false
    },
    queryFn (isQuery) {
      let params = JSON.parse(JSON.stringify(this.queryForm))
      if (params.areaId && params.areaId.length > 0) {
        params.areaId = params.areaId[params.areaId.length - 1]
      }
      if (isQuery) {
        this.pageInfo.current = 1
      }
      params.current = this.pageInfo.current
      params.pagesize = this.pageInfo.pageSize
      this.querySubcontractorList(params).then(res => {
        this.queryData = res.Data
        this.pageInfo.total = res.Total
        this.tableHeight()
      })
    },
    changePage (page) {
      this.pageInfo.current = page
      this.queryFn()
    },
    pageSizeChange (pageSize) {
      this.pageInfo.pageSize = pageSize
      this.queryFn()
    }
  }
}
</script>
<style scoped>
.query-item{
  padding-right: 20px;
}
.tool-icon-group{
  padding-top: 20px;
  padding-bottom: 20px;
}
.tool-icon-group span {
  font-size: 14px;
  padding-right: 25px;
  color: #999999;
  cursor: pointer;
}
.tool-icon-group i{
  margin-right: 3px;
}
.tool-icon-group span:hover{
  color: #409eff;
}
.modal-form-item-padding {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
