<template>
    <div style="width:100%;height:100%;" ref="maxContainer">
      <Row ref="queryContainer">
          <Col span="4" class="query-item">
            <Input type="text" v-model="searchData.searchText" placeholder="GUID/文件名称" clearable></Input>
          </Col>
          <Col span="4" class="query-item">
            <DatePicker v-model="searchData.date" type="daterange" placeholder="日期" style="width: 100%"></DatePicker>
          </Col>
          <Col span="2" class="query-item">
            <Button type="primary" :style="{width: '100%', maxWidth: '120px', minWidth: '50px'}" @click="searchTable()">搜索</Button>
          </Col>
      </Row>
      <div class="tool-icon-group" ref="iconContainer">
        <span @click="exportFn" class="icon-title"><Icon class="icon iconfont icon-daochu" size="20" title="导出日志"></Icon>导出</span>
      </div>
      <Table border ref="table" :columns="columnTitle" :height="tableH" :data="queryData" :stripe="true"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div :style="{textAlign:'center'}">
            <Page :total="pageInfo.total" :page-size="pageInfo.pageSize" :current="pageInfo.current" @on-change="changePage" @on-page-size-change="pageSizeChange" show-sizer show-elevator show-total></Page>
        </div>
      </div>
      <Modal v-model="detailsModal" :width="760" title="基站测试详情" :mask-closable="false" class-name="vertical-center-modal">
        <Table border ref="detailsTable" :columns="columnDetails" :data="detailsData" :stripe="true" :height="360"></Table>
        <div slot="footer">
            <Button type="primary" size="large" @click="cancleFn">确定</Button>
        </div>
      </Modal>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { formatDate, formatSize } from '@/libs/utils'
export default {
  data () {
    return {
      searchData: { searchText: '', date: [] },
      detailsModal: false,
      columnTitle: [
        {
          title: '文件名称',
          width: 500,
          align: 'center',
          key: 'FileName',
          render: (h, params) => {
            return h('Tooltip', {
              props: {
                placement: 'bottom',
                transfer: true
              }
            }, [
              h('span', {
                style: {
                  display: 'block',
                  width: '460px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.showDetailsFn(params.row)
                  }
                }
              }, params.row.FileName),
              h('div', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal'
                }
              }, params.row.FileName)
            ])
          }
        },
        {
          title: '文件全路径',
          width: 280,
          align: 'center',
          tooltip: true,
          key: 'FileFullyName'
        },
        {
          title: '文件大小',
          width: 120,
          align: 'center',
          tooltip: true,
          key: 'Size',
          render: function (h, params) {
            return h(
              'div',
              formatSize(params.row.Size)
            )
          }
        },
        {
          title: '制式',
          width: 120,
          align: 'center',
          tooltip: true,
          key: 'MobileMode'
        },
        {
          title: '状态',
          width: 120,
          align: 'center',
          tooltip: true,
          key: 'Status',
          render: function (h, params) {
            return h(
              'span',
              { 0: '已上传', 1: '已发送', 2: '已解析', 3: '文件错误' }[params.row.Status]
            )
          }
        },
        {
          title: '上传者',
          minWidth: 120,
          align: 'center',
          tooltip: true,
          key: 'UserName'
        },
        {
          title: '上传时间',
          align: 'center',
          width: 160,
          key: 'CreateTime',
          render: function (h, params) {
            return h(
              'div',
              formatDate(new Date(params.row.CreateTime), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '识别码',
          width: 200,
          tooltip: true,
          align: 'center',
          key: 'Guid'
        }
      ],
      queryData: [],
      pageInfo: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      tableTotal: 1,
      tableH: 0,
      columnDetails: [
        {
          title: '基站名称',
          width: 200,
          align: 'center',
          tooltip: true,
          key: 'SiteName'
        }, {
          title: '制式',
          align: 'center',
          key: 'MobileMode'
        }, {
          title: '测试状态',
          align: 'center',
          key: 'State',
          render: function (h, params) {
            let state = '已完成'
            if (params.row.UnTest.length > 0) {
              state = '未完成'
            }
            return h('span', state)
          }
        },
        {
          title: '未测小区',
          width: 340,
          align: 'center',
          tooltip: true,
          key: 'Memo',
          render: function (h, params) {
            let liArray = []
            for (let item of params.row.UnTest) {
              let li = h('li', {
                style: {
                  listStyle: 'none',
                  fontSize: '14px',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'left'
                },
                attrs: {
                  title: item
                }
              }, item)
              liArray.push(li)
            }
            return h('ul', liArray)
          }
        }
      ],
      detailsData: []
    }
  },
  mounted: function () {
    this.queryTable()
    const that = this
    window.onresize = () => {
      that.tableHeight()
    }
  },
  methods: {
    ...mapActions(['queryLog', 'showDetails']),
    tableHeight () {
      if (this.$refs.maxContainer) {
        this.outsiderH = this.$refs.maxContainer.offsetHeight
        this.queryH = this.$refs.queryContainer.$el.offsetHeight
        this.iconH = this.$refs.iconContainer.offsetHeight
        this.tableH = this.outsiderH - this.queryH - this.iconH - 50
      }
    },
    queryTable () {
      let params = {}
      params.current = this.pageInfo.current
      params.pagesize = this.pageInfo.pageSize
      params.searchText = this.searchData.searchText || ''
      if (this.searchData.date && this.searchData.date[0]) {
        params.StartTime = formatDate(this.searchData.date[0], 'yyyy-MM-dd')
        params.EndTime = formatDate(this.searchData.date[1], 'yyyy-MM-dd')
      }
      this.queryLog(params).then(res => {
        this.queryData = res.Data
        this.pageInfo.total = res.Total
        this.tableHeight()
      })
    },
    searchTable () {
      this.pageInfo.current = 1
      this.queryTable()
    },
    changePage (page) {
      this.pageInfo.current = page
      this.queryTable()
    },
    pageSizeChange (pageSize) {
      this.pageInfo.pageSize = pageSize
      this.queryTable()
    },
    exportFn () {
      this.$refs.table.exportCsv({
        filename: '上传记录日志'
      })
    },
    showDetailsFn (data) {
      if (data.Status === 2) {
        this.detailsModal = true
        let params = { guid: data.Guid }
        this.showDetails(params).then(res => {
          this.detailsData = res.Data
        })
      } else {
        this.$Message.error({ content: '文件' + (data.Status === 3 ? '解析失败' : '尚未解析'), duration: 3 })
      }
    },
    cancleFn () {
      this.detailsModal = false
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
.logspan{
  cursor: pointer;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
