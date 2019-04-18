import axios from '@/libs/api.request'
// 运营商
export const operatorQuery = (params) => {
  return axios.request({
    url: params.url,
    params,
    method: 'get'
  })
}
// 全国分包商
export const subContractor = (params) => {
  return axios.request({
    url: params.url,
    params,
    method: 'get'
  })
}
// 点击柱子
export const clickColumn = (params) => {
  return axios.request({
    url: params.url,
    params,
    method: 'get'
  })
}
// 全国地区分包商
export const areaSubContractor = (params) => {
  return axios.request({
    url: params.url,
    params,
    method: 'get'
  })
}
// 获取省内各市区分包商进度
export const citiesData = (params) => {
  return axios.request({
    url: params.url,
    params,
    method: 'get'
  })
}
