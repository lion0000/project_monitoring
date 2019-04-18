import { operatorQuery, subContractor, clickColumn, areaSubContractor, citiesData } from '@/api/home'

export default {
  actions: {
    // 运营商查询
    operatorQuery ({ state }, params) {
      return new Promise((resolve, reject) => {
        operatorQuery(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 分包商查询
    subContractor ({ state }, params) {
      return new Promise((resolve, reject) => {
        subContractor(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 点击柱子
    clickColumn ({ state }, params) {
      return new Promise((resolve, reject) => {
        clickColumn(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 地区分包商查询
    areaSubContractor ({ state }, params) {
      return new Promise((resolve, reject) => {
        areaSubContractor(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取省内各市区分包商进度
    citiesData ({ state }, params) {
      return new Promise((resolve, reject) => {
        citiesData(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
