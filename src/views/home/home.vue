<template>
    <div>
    <Row type="flex" justify="start" class="code-row-bg index_nav">
      <Col span="4" class="index_nav_text"  v-for='(item,index) in singleStation' :key="index"  v-bind:class='{active:index==style_active}'>
        <div @click="addClass(index)">{{item.message}}</div>
      </Col>
      <Col span="2" offset="14" class="time">
        <Time :time="time" :interval="1" type="date"/>
      </Col>
    </Row>
    <Row :gutter="20" class="index_communication">
      <Col span="4" v-for='(item,index) in operator' :key="index">
        <div @click="addClassFun(index)" v-bind:class='{class_style:index==style_index}'>
          <span></span>
          {{item.message}}
        </div>
      </Col>
    </Row>
    <div class="data_show">
      <div>
        <Row type="flex" justify="start" class="code-row-bg">
          <Col span="14">
            <Row class="station_num">
              <Col span="8" v-for='item in operator_data' :key="item.message">
                <span>{{item.message}}</span>
                <p>{{item.numData}}</p>
              </Col>
            </Row>
            <Row class="nationwide">
              <Col>
                <p>全国分包商{{fulfill_advance}}监控<span class="per_cent">（%）</span></p>
              </Col>
              <Col>
                <div class="nationwide_plan">
                  <div id="nationwide_plan"></div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span="10">
            <Row class="nationwide_map">
              <Col>
                <p>
                  <span>全国各省{{fulfill_advance}}监控地图</span>
                  <span>点击地图查看各省分包商{{fulfill_advance}}</span>
                </p>
              </Col>
              <Col class="mapContainer">
                <div id="mapContainer"></div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Row class="nationwide">
        <Col>
          <p>地区分包商{{fulfill_advance}}监控<span class="per_cent">（%）</span></p>
        </Col>
        <Col span="24" class="mountNode">
          <div>
            <div class="coordinate">
              <hr /><hr /><hr /><hr />
              <ul>
                <li>100</li>
                <li>80</li>
                <li>60</li>
                <li>40</li>
                <li>20</li>
                <li>0</li>
              </ul>
            </div>
            <div class="show_frame">
              <div class="column" id="column_move">
                <ul class="box">
                  <li v-for='(item,index) in regionData' :key="index">
                    <ul class="region" >
                      <li v-for='(item2,index2) in item.SubcontractorCompletion' ref="dataHeight" :key="index2" @click="singleData(item2,item)" :style="item2.Style">
                        <span>{{item2.Complet|capitalize}}%</span>
                        <span v-bind:id="item2.Complet|capitalize">{{item2.SubcontractorName}}</span>
                      </li>
                    </ul>
                    <div>{{item.AreaName}}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <Modal v-model="model0" width="90" class='closeBtn' class-name="vertical-center-modal">
      <Row class="nationwide">
        <Col>
          <p><span>{{region_name}}</span>全国{{fulfill_advance}}监控<span class="per_cent">（%）</span></p>
        </Col>
        <Col class="nationwide_plan">
          <div id="nationwide_model1"></div>
        </Col>
      </Row>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="model1" width="60" class='closeBtn' class-name="vertical-center-modal">
      <Row class="nationwide">
        <Col>
          <p class="model1_style"><span>{{region_name}}</span>分包商{{fulfill_advance}}监控<span class="per_cent">（%）</span></p>
        </Col>
      </Row>
      <div class="mountNode model">
        <div>
            <div class="coordinate">
              <hr /><hr /><hr /><hr />
              <ul>
                <li>100</li>
                <li>80</li>
                <li>60</li>
                <li>40</li>
                <li>20</li>
                <li>0</li>
              </ul>
            </div>
            <div class="show_frame roll_add">
            <div class="column">
              <ul>
                <li v-for='item in regionData2' :key="item.index">
                  <ul class="region" >
                    <li v-for='item2 in item.SubcontractorCompletion' :key="item2.SubcontractorName" :style="item2.Style">
                      <span>{{item2.Complet | capitalize}}%</span>
                      <span v-bind:id="item2.Complet|capitalize">{{item2.SubcontractorName}}</span>
                    </li>
                  </ul>
                  <div>{{item.AreaName}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="footer_style_pop"></div>
    </Modal>
    <Modal v-model="model2" width="60" class='closeBtn' class-name="vertical-center-modal">
      <Row class="nationwide">
        <Col>
          <p><span>{{region_name}}</span>分包商{{fulfill_advance}}监控<span class="per_cent">（%）</span></p>
        </Col>
        <Col class="nationwide_plan">
          <div id="nationwide_model2"></div>
        </Col>
      </Row>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// 引入 this.$echarts 主模块
import chinaJson from 'echarts/map/json/china.json'
// import G2 from '@antv/g2'
import $ from 'jquery'
export default {
  name: 'home',
  components: {},
  data () {
    return {
      time: new Date(),
      style_index: 0,
      style_active: 0,
      model0: false,
      model1: false,
      model2: false,
      region_name: '',
      width: '',
      fulfill_advance: '进度',
      operatorUrl: '/index/getscheduletotal',
      subContractorUrl: '/index/getschedulesubcontractor',
      clickColumnUrl: '/index/getschedulesubcontractorarea',
      areaSubContractorUrl: '/index/getscheduleprovince',
      citiesDataUrl: '/index/getschedulecity',
      singleStation: [
        { message: '单站进度监控' },
        { message: '单站完成度监控' }
      ],
      operator: [
        { message: '中国移动' },
        { message: '中国联通' },
        { message: '中国电信' }
      ],
      operator_data: [
        { message: '计划站点数', numData: '' },
        { message: '已测试站点数', numData: '' },
        { message: '总体进度', numData: '' }
      ],
      regionData: [],
      regionData2: []
    }
  },
  filters: {
    capitalize (value) {
      if (value > 100) {
        value = 100
        return value
      }
      return Math.round(value)
    }
  },
  computed: {
    isCollapsed: function () {
      return this.$store.state.isCollapsed
    }
  },
  watch: {
    isCollapsed (newVaue, oldValue) {
      this.resizeFn()
    }
  },
  methods: {
    ...mapActions([
      'operatorQuery',
      'subContractor',
      'clickColumn',
      'areaSubContractor',
      'citiesData'
    ]),
    // 初始化
    initFn () {
      this.$store.state.spinShow = true
      $('.ivu-layout').css({
        'overflow-x': 'hidden',
        'overflow-y': 'hidden'
      })
      // 进度
      this.operatorQuery({ OperatorId: 1, url: this.operatorUrl }).then(res => {
        this.operator_data[0].numData = res.Data.PlanCount
        this.operator_data[1].numData = res.Data.AlreadyCount
        this.operator_data[2].numData = Math.round(res.Data.Complet) + '%'
      })
    },
    // 点击切换 进度监控/完成度监控
    addClass (index) {
      // 进度监控0 完成度监控1
      this.$store.state.spinShow = true
      $('.ivu-layout').css({
        'overflow-x': 'hidden',
        'overflow-y': 'hidden'
      })
      this.style_active = index
      if (this.style_active === 0) {
        this.operatorUrl = '/index/getscheduletotal'
        this.subContractorUrl = '/index/getschedulesubcontractor'
        this.clickColumnUrl = '/index/getschedulesubcontractorarea'
        this.areaSubContractorUrl = '/index/getscheduleprovince'
        this.citiesDataUrl = '/index/getschedulecity'
        this.operator_data[0].message = '计划站点数'
        this.operator_data[1].message = '已测试站点数'
        this.operator_data[2].message = '总体进度'
        this.fulfill_advance = '进度'
      } else {
        this.operatorUrl = '/index/getcompletiontotal'
        this.subContractorUrl = '/index/getcompletionsubcontractor'
        this.clickColumnUrl = '/index/getcompletionsubcontractorarea'
        this.areaSubContractorUrl = '/index/getcompletionprovince'
        this.citiesDataUrl = '/index/getcompletioncity'
        this.operator_data[0].message = '已测试站点数'
        this.operator_data[1].message = '已完成站点数'
        this.operator_data[2].message = '完成度'
        this.fulfill_advance = '完成度'
      }
      this.operatorQuery({ OperatorId: this.style_index + 1, url: this.operatorUrl }).then(res => {
        this.operator_data[0].numData = res.Data.PlanCount
        this.operator_data[1].numData = res.Data.AlreadyCount
        this.operator_data[2].numData = Math.round(res.Data.Complet) + '%'
      })
      this.lineRender()
    },
    // 运营商点击切换
    addClassFun (index) {
      this.$store.state.spinShow = true
      $('.ivu-layout').css({
        'overflow-x': 'hidden',
        'overflow-y': 'hidden'
      })
      // 中国移动1 中国联通2 中国电信3
      this.style_index = index
      // 进度
      this.operatorQuery({ OperatorId: this.style_index + 1, url: this.operatorUrl }).then(res => {
        this.operator_data[0].numData = res.Data.PlanCount
        this.operator_data[1].numData = res.Data.AlreadyCount
        this.operator_data[2].numData = Math.round(res.Data.Complet) + '%'
      })
      this.lineRender()
    },
    // 全国分包商进度监控和地图监控
    lineRender (id) {
      this.$echarts.registerMap('china', chinaJson)
      const myCharts = this.$echarts.init(document.getElementById('mapContainer'))
      this.myCharts = myCharts
      let districts = []
      let district = []
      let districtData = []
      let opdata = []
      let _this = this
      let subcontractorData = []
      let scheduleData = []
      let areaId = []
      // 地图
      this.areaSubContractor({ OperatorId: this.style_index + 1, url: this.areaSubContractorUrl }).then(res => {
        for (var i = 0; i < res.Data.length; i++) {
          for (var j = 0; j < res.Data[i].SubcontractorCompletion.length; j++) {
            let item = res.Data[i].SubcontractorCompletion[j]
            let getHeight = item.Complet > 100 ? 100 : item.Complet
            let colorValue = ['#409eff', '#fe7c17', '#b451f9', '#855fa8', '#00c79e', '#ffd201', '#ff5a62', '#25ce4e', '#3a8ee4', '#c36067']
            item.Style = { height: getHeight + '%',
              background: colorValue[j % 10] }
          }
        }
        this.regionData = res.Data
        /** 设置滚动效果 */
        this.$nextTick(function () {
          this.width = $('.box').width()
          if ($('.box').width() > $('.show_frame').width()) {
            this.drawLiness()
          } else {
            if ($('.box').length > 1) {
              $('#column_move>ul').last().remove()
            }
            $('#column_move').css({ left: 0 })
            $('#column_move').stop(true).unbind('mouseenter').unbind('mouseleave')
          }
        })
        opdata = [
          {
            name: '南海诸岛',
            value: 0,
            itemStyle: {
              normal: { opacity: 0 }
            }
          },
          { name: '北京', value: '', id: '110000' }, { name: '天津', value: '', id: '120000' },
          { name: '上海', value: '', id: '310000' }, { name: '重庆', value: '', id: '500000' },
          { name: '河北', value: '', id: '130000' }, { name: '河南', value: '', id: '410000' },
          { name: '云南', value: '', id: '530000' }, { name: '辽宁', value: '', id: '210000' },
          { name: '黑龙江', value: '', id: '230000' }, { name: '湖南', value: '', id: '430000' },
          { name: '安徽', value: '', id: '340000' }, { name: '山东', value: '', id: '370000' },
          { name: '新疆', value: '', id: '650000' }, { name: '江苏', value: '', id: '320000' },
          { name: '浙江', value: '', id: '330000' }, { name: '江西', value: '', id: '360000' },
          { name: '湖北', value: '', id: '420000' }, { name: '广西', value: '', id: '450000' },
          { name: '甘肃', value: '', id: '620000' }, { name: '山西', value: '', id: '140000' },
          { name: '内蒙古', value: '', id: '150000' }, { name: '陕西', value: '', id: '610000' },
          { name: '吉林', value: '', id: '220000' }, { name: '福建', value: '', id: '350000' },
          { name: '贵州', value: '', id: '520000' }, { name: '广东', value: '', id: '440000' },
          { name: '青海', value: '', id: '630000' }, { name: '西藏', value: '', id: '540000' },
          { name: '四川', value: '', id: '510000' }, { name: '宁夏', value: '', id: '640000' },
          { name: '海南', value: '', id: '460000' }, { name: '台湾', value: '', id: '710000' },
          { name: '香港', value: '', id: '810000' }, { name: '澳门', value: '', id: '820000' }
        ]// 数据
        for (let i = 0; i < opdata.length; i++) {
          districts.push(opdata[i].name)
        }
        for (let j = 0; j < this.regionData.length; j++) {
          district = this.regionData[j].AreaName
          district = district.replace('省', '').replace('市', '')
          if (district.indexOf('内蒙古') > -1) {
            district = '内蒙古'
          } else if (district.length > 3) {
            district = district.substr(0, 2)
          }
          districtData.push(district)
        }

        for (let i = 0; i < districts.length; i++) {
          for (let j = 0; j < districtData.length; j++) {
            if (districtData[j] === districts[i]) {
              opdata[i].value = this.regionData[j].Complet >= 100 ? 100 : this.regionData[j].Complet.toFixed(2)
            }
          }
        }
        const optionMap = {
          backgroundColor: '#FFFFFF',
          title: {
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {
              label: {
                width: 200,
                height: 100
              }
            },
            formatter: function (params) {
              var res = params.name + '<br/>'
              var myseries = optionMap.series
              for (var i = 0; i < myseries.length; i++) {
                for (var j = 0; j < myseries[i].data.length; j++) {
                  if (myseries[i].data[j].name === params.name) {
                    res += myseries[i].name + ' : ' + (myseries[i].data[j].value || '-') + '%'
                  }
                }
              }
              return res
            }
          },
          // 左侧小导航图标
          visualMap: {
            show: true,
            x: 'right',
            y: '70%',
            selectedMode: 'multiple',
            splitList: [
              { start: 80, end: 100, label: '80%-100%' },
              { start: 60, end: 80, label: '60%-80%' },
              { start: 40, end: 60, label: '40%-60%' },
              { start: 20, end: 40, label: '20%-40%' },
              { start: 0, end: 20, label: '0%-20%' }
            ],
            textStyle: {
              color: '#666'
            },
            color: ['#5ea4fb', '#ff903b', '#91c93b', '#2fd5b3', '#c181ee']
          },
          // 配置属性
          series: [{
            name: _this.style_active === 0 ? '进度' : '完成度',
            type: 'map',
            map: 'china',
            roam: true,
            label: {
              normal: {
                show: true, // 省份名称
                // textStyle: { color: '#409eff' }, // 省份标签字体颜色
                formatter: function (params) {
                  if (params.name === '南海诸岛') {
                    return ' '
                  } else {
                    return params.name
                  }
                }
              },
              emphasis: {
                textStyle: { color: '#fff' }, // 选中区域文字颜色
                show: false
              }
            },
            emphasis: {// 选中区域颜色
              itemStyle: {
                areaColor: '#409eff'
              }
            },
            itemStyle: {
              normal: {
                borderColor: '#dfdfdf' // 区域边框颜色
              }
            },
            scaleLimit: {
              min: 1,
              max: 2
            },
            left: '5%',
            right: '5%',
            top: '5%',
            bottom: '5%',
            data: opdata
          }]
        }
        myCharts.setOption(optionMap)
        this.$nextTick(function () {
          this.$store.state.spinShow = false
          $('.ivu-layout').css({
            'overflow-y': 'auto'
          })
        })
      })

      myCharts.off('click')
      // 地图点击事件
      myCharts.on('click', function (param) {
        if (param.data.value === '') {
          _this.$Message.error('该地区暂无数据')
        } else {
          _this.model1 = true
          _this.citiesData({ OperatorId: _this.style_index + 1, AreaId: param.data.id, url: _this.citiesDataUrl }).then(res => {
            for (var i = 0; i < res.Data.length; i++) {
              for (var j = 0; j < res.Data[i].SubcontractorCompletion.length; j++) {
                let item = res.Data[i].SubcontractorCompletion[j]
                let getHeight = item.Complet > 100 ? 100 : item.Complet
                let colorValue = ['#409eff', '#fe7c17', '#b451f9', '#855fa8', '#00c79e', '#ffd201', '#ff5a62', '#25ce4e', '#3a8ee4', '#c36067']
                item.Style = {
                  height: getHeight + '%',
                  background: colorValue[j % 10] }
              }
            }
            _this.regionData2 = res.Data
            // 弹窗滚动条位置初始化判断
            if ((param.name === _this.region_name) === false) {
              $('.roll_add').scrollLeft(0)
            }
            _this.region_name = param.name
          })
        }
      })

      // 全国分包商进度监控
      this.subContractor({ OperatorId: this.style_index + 1, url: this.subContractorUrl }).then(res => {
        for (let i = 0; i < res.Data.length; i++) {
          subcontractorData.push(res.Data[i].SubcontractorName)
          if (res.Data[i].Complet > 100) {
            res.Data[i].Complet = 100
          }
          scheduleData.push({ id: res.Data[i].SubcontractorId, value: res.Data[i].Complet })
          areaId.push(res.Data[i].SubcontractorId)
        }
        myChart.setOption(option)
      })
      const myChart = this.$echarts.init(document.getElementById('nationwide_plan'))
      this.myChart = myChart
      const option = {
        grid: {
          left: '0%',
          right: '0%',
          bottom: '2%',
          top: '2%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return params.value.toFixed(2) + '%'
          }
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 40
            },
            // 去除刻度线
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#666'

              }
            },

            splitLine: {
              show: false,
              lineStyle: {
                color: '#ddd'
              }
            },
            data: subcontractorData
          }
        ],
        yAxis: [
          {
            type: 'value',
            nameLocation: 'end',
            nameGap: 50,
            show: true,
            max: 100,
            min: 0,
            // 去除刻度线
            axisTick: {
              show: false
            },
            // 坐标轴相关的设置
            axisLine: {
              show: false,
              lineStyle: {
                color: '#444'
              }
            },
            // 区域中的分割线
            splitLine: {
              show: true,
              interval: 1,
              lineStyle: {
                color: '#f0f0f0'
              }
            }
          }
        ],
        series: [{
          type: 'bar',
          // 柱子最大宽度
          barMaxWidth: 50,
          barWidth: '50%',
          data: scheduleData,
          itemStyle: {
            normal: {
              // 柱形图圆角，初始化效果
              barBorderRadius: [40, 40, 0, 0],
              color: function (params) {
                let colorList = ['#5d8cbc', '#409eff']
                if (params.dataIndex % 2 === 0) {
                  return colorList[0]
                } else {
                  return colorList[1]
                }
              }
            }
          }
        }]
      }
      myChart.off('click')
      // 全国分包商点击事件
      myChart.on('click', function (param) {
        _this.model0 = true
        _this.region_name = param.name
        _this.clickColumn({ OperatorId: _this.style_index + 1, SubcontractorId: param.data.id, url: _this.clickColumnUrl }).then(res => {
          for (let i = 0; i < res.Data.length; i++) {
            wholeProvinceName.push(res.Data[i].AreaName)
            if (res.Data[i].Complet > 100) {
              res.Data[i].Complet = 100
            }
            // res.Data[i].Complet>100?100:res.Data[i].Complet
            wholeProvinceData.push(res.Data[i].Complet.toFixed(2))
          }
          ChartModel1.setOption(option1)
        })

        let wholeProvinceName = []
        let wholeProvinceData = []

        const ChartModel1 = _this.$echarts.init(document.getElementById('nationwide_model1'))
        const option1 = {
          grid: {
            left: '0%',
            right: '0%',
            bottom: '2%',
            top: '2%',
            containLabel: true
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return params.value + '%'
            }
          },
          xAxis: [
            {
              type: 'category',
              // 去除刻度线
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                rotate: 50
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#666'
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#ddd'
                }
              },
              data: wholeProvinceName,
              max: 'dataMax'
            }
          ],
          yAxis: [
            {
              type: 'value',
              nameLocation: 'end',
              nameGap: 50,
              max: 100,
              min: 0,
              axisTick: {
                show: false
              },
              // 坐标轴相关的设置
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#444'
                }
              },
              // 区域中的分割线
              splitLine: {
                show: true,
                interval: 1,
                lineStyle: {
                  color: '#ddd'
                }
              }
            }
          ],
          series: [{
            type: 'bar',
            // 柱子的宽度
            barMaxWidth: 50,
            barWidth: '50%',
            data: wholeProvinceData,
            itemStyle: {
              normal: {
              // 柱形图圆角，初始化效果
                barBorderRadius: [40, 40, 0, 0],
                color: function (params) {
                  let colorList = ['#5d8cbc', '#409eff']
                  if (params.dataIndex % 2 === 0) {
                    return colorList[0]
                  } else {
                    return colorList[1]
                  }
                }
              }
            }
          }]
        }
        ChartModel1.setOption(option1)
        setTimeout(function () {
          ChartModel1.resize()
          window.onresize = function () {
            ChartModel1.resize()
          }
        }, 20)
      })
      window.addEventListener('resize', function () {
        myChart.resize()
        myCharts.resize()
      })
    },
    // 地区分包商点击事件
    singleData (item2, item) {
      this.region_name = item2.SubcontractorName + item.AreaName
      this.ChartModel(item.AreaId, item2.SubcontractorId)
      this.model2 = true
    },
    // 地区分包商弹窗
    ChartModel (AreaId, SubcontractorId) {
      let wholeProvinceName = []
      let wholeProvinceData = []

      const ChartModel2 = this.$echarts.init(document.getElementById('nationwide_model2'))
      const option2 = {
        grid: {
          left: '0%',
          right: '0%',
          bottom: '2%',
          top: '2%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return params.value + '%'
          }
        },
        xAxis: [
          {
            type: 'category',
            // 去除刻度线
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              rotate: 40
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#666'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#ddd'
              }
            },
            data: wholeProvinceName,
            max: 'dataMax'
          }
        ],
        yAxis: [
          {
            type: 'value',
            nameLocation: 'end',
            nameGap: 50,
            max: 100,
            min: 0,
            // show: false,
            // 去除刻度线
            axisTick: {
              show: false
            },
            // 坐标轴相关的设置
            axisLine: {
              show: false,
              lineStyle: {
                color: '#444'
              }
            },
            // 区域中的分割线
            splitLine: {
              show: true,
              interval: 1,
              lineStyle: {
                color: '#ddd'
              }
            }
          }
        ],
        series: [{
          type: 'bar',
          // 柱子的宽度
          barMaxWidth: 50,
          barWidth: '50%',
          data: wholeProvinceData,
          itemStyle: {
            normal: {
              // 柱形图圆角，初始化效果
              barBorderRadius: [40, 40, 0, 0],
              color: function (params) {
                let colorList = ['#5d8cbc', '#409eff']
                if (params.dataIndex % 2 === 0) {
                  return colorList[0]
                } else {
                  return colorList[1]
                }
              }
            }
          }
        }]
      }

      this.clickColumn({ OperatorId: this.style_index + 1, SubcontractorId, AreaId, url: this.clickColumnUrl }).then(res => {
        for (let i = 0; i < res.Data.length; i++) {
          wholeProvinceName.push(res.Data[i].AreaName)
          if (res.Data[i].Complet > 100) {
            res.Data[i].Complet = 100
          }
          wholeProvinceData.push(Math.round(res.Data[i].Complet))
        }
        ChartModel2.setOption(option2)
      })

      setTimeout(function () {
        ChartModel2.resize()
        window.onresize = function () {
          ChartModel2.resize()
        }
      }, 20)
    },
    // 地区分包商轮播
    drawLiness () {
      if ($('.box').length > 1) {
        $('#column_move>ul').last().remove()
      }
      $('.box').first().clone(true).appendTo('#column_move')
      $('#column_move').css({ left: 0 })
      let _this = this
      $('#column_move').stop(true).animate({ left: -_this.width }, _this.width * 25, 'linear', function () {
        _this.drawLiness()
      })
      $('#column_move').unbind('mouseenter').unbind('mouseleave').hover(function () {
        $('#column_move').stop(true)
      }, function () {
        $('#column_move').animate({ left: -_this.width }, _this.width * 25, 'linear', function () {
          _this.drawLiness()
        })
      })
    },
    resizeFn () {
      setTimeout(function () {
        this.myChart.resize()
        this.myCharts.resize()
      }.bind(this), 200)
    }
  },
  mounted () {
    this.initFn()
    this.$nextTick(function () {
      this.lineRender('nationwide_plan')
    })
    // 1小时刷新一次数据
    let _this = this

    let timer = setInterval(function () {
      if (_this.$route.path === '/home') {
        _this.addClass(_this.style_active)
      } else {
        clearTimeout(timer)
      }
    }, 1000 * 360)
  }

}
</script>

<style>
.index_nav{
  height: 60px;
  line-height: 60px;
  background: #fff;
  margin: -20px -20px 0;
}
.index_nav_text{
  font-size: 24px;
  color: #444;
  text-align: center;
  cursor: pointer;
}
.index_nav_text.active{
  background: #f7f7f7;
  border-bottom: 4px solid #409eff;
}
.time{
  text-align: right;
  padding-right: 20px;
  font-size: 14px;
}
.index_communication{
  /* background: #fafafa; */
  padding: 20px 0;
  text-align: center;
}
.index_communication>div>div{
  border: 1px solid #d8d8d8;
  border-radius: 20px;
  font-size: 20px;
  background: #fff;
  height: 40px;
  line-height: 38px;
  cursor: pointer;
}
.index_communication>div>div.class_style{
  background: #409eff;
  color: #fff;
  border:none;
  line-height: 40px;
}
.index_communication>div>div>span{
  display: inline-block;
  width: 25px;
  height: 23px;
  position: relative;
  top: 4px;
}
.index_communication>div:first-child>div>span{
  background: url('../../assets/move.png') 0 0/100% 100% no-repeat
}
.index_communication>div:nth-child(2)>div>span{
  background: url('../../assets/link.png') 0 0/100% 100% no-repeat
}
.index_communication>div:last-child>div>span{
 background: url('../../assets/telecom.png') 0 0/100% 100% no-repeat
}
.index_communication>div:first-child>div.class_style>span{
  background: url('../../assets/move_hover.png') 0 0/100% 100% no-repeat
}
.index_communication>div:nth-child(2)>div.class_style>span{
  background: url('../../assets/link_hover.png') 0 0/100% 100% no-repeat
}
.index_communication>div:last-child>div.class_style>span{
  background: url('../../assets/telecom_hover.png') 0 0/100% 100% no-repeat
}
.data_show{
  padding-bottom: 70px;
}
.data_show>div{
  background: #fff;
}
.data_show>div:first-child{
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
}
.data_show>div:first-child>div>div:first-child{
  border-right: 1px solid #e5e5e5;
}
.station_num span{
  font-size: 18px;
  color: #666;
}
.station_num p{
  font-size: 36px;
  color: #555;
  font-weight: bold;
}
.per_cent{
  font-size: 14px;
  color: #999;
}
.station_num>div{
  padding: 20px 40px;
  text-align: left;
  border-right: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}
.station_num>div:last-child{
  border-right: none;
}
.nationwide>div>p,.nationwide_map>div>p{
  font-size: 20px;
  border-left: 3px solid #409eff;
  margin: 20px;
  line-height: 1;
  color: #333;
  padding-left: 20px;
}
.nationwide>div>p.model1_style,.closeBtn .nationwide>div>p{
  margin: 0 0 20px;
}
.closeBtn .ivu-modal-footer{
  padding: 0;
}
.closeBtn .ivu-modal-footer .footer_style_pop{
  padding: 9px;
}
.closeBtn .nationwide_plan{
  padding: 0;
}
.nationwide_map>div:first-child{
  position: absolute;
  z-index: 1;
}
.nationwide_map>div>p{
  text-align: left;
  margin-left: 40px;
}
.nationwide_map>div>p>span{
  display: block;
}
.nationwide_map>div>p>span:last-child{
  font-size: 14px;
  color: #666;
  line-height: 22px;
}
.nationwide_plan{
  padding: 0 20px;
}
.nationwide_plan>div{
  width: 100%;
  height:250px;
}
.mapContainer{
  padding: 0 40px;
}
.mapContainer>div{
  height: 430px;
}
@media (max-width: 1366px) {
  .mapContainer>div{
    height: 300px;
    top: 80px;
  }
}
.mountNode{
  padding: 0 20px 44px 45px;
}
.mountNode.model{
  padding: 0 0px 20px 25px;
}
.mountNode>div{
  position: relative;
}
/* 地区分包商柱状图 */
ul,li{
  list-style: none;
  margin: 0;
  padding: 0;
}
hr{
  height: 24px;
  border: none;
  border-bottom: 1px solid #f0f0f0;
}
.coordinate{
  width: 100%;
  height: 125px;
  border: 1px solid #ddd;
  margin: 0 auto;
  position: relative;
}
.coordinate>ul{
  position: absolute;
  top: -10px;
  left: -28px;
}
.coordinate>ul>li{
  margin-bottom: 6px;
  text-align: right;
}
.coordinate>ul>li:last-child{
  margin: 0;
}
.show_frame{
  width: 100%;
  height: 165px;
  position: absolute;
  top: 0;
  overflow: hidden;
}
.show_frame.roll_add{
  overflow-x: auto;
}
.column{
  /* width: 100%; */
  height: 125px;
  position: absolute;
  top: 0;
  display: flex;
  /* padding-right: 66px */
}
.column>ul{
  height: 100%;
  display: flex;
  position: relative;
}
.column>ul>li{
  height: 100%;
}
.column>ul>li>div{
  width: 100%;
  text-align: center;
  margin-top: 5px;
  color: #666;
}
.column .region{
  bottom: 0;
  display: flex;
  align-items: flex-end;
  height: 100%;
  margin: 0 10px;
}
.column .region>li{
  background: blue;
  color: #333;
  opacity: 1;
  margin: 0 5px;
  position: relative;
  z-index: 99;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  display: flex;
  align-items: flex-end;
  flex-direction: column-reverse;
  cursor: pointer;
}
.column .region>li>span{
  display: inline-block;
  /* transform:rotate(-90deg); */
  writing-mode:vertical-rl;
  white-space:nowrap;
  /* flex-wrap: nowrap */
}
.column .region>li>span{
  margin-bottom: 3px;
}
.column .region>li>span:last-child{
  text-align:right;
  max-height:100px;
  min-height:60px;
  overflow: hidden;
}
.closeBtn .ivu-modal-close i.ivu-icon-ios-close{
  color: #999;
}
</style>
