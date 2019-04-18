import { queryLog, showDetails } from '@/api/log'

export default {
  actions: {
    // 查询日志列表
    queryLog ({ commit }, params) {
      return new Promise((resolve, reject) => {
        queryLog(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 查看日志详情
    showDetails ({ commit }, params) {
      return new Promise((resolve, reject) => {
        showDetails(params).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
