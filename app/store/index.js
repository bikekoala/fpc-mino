/**
 * vuex store
 * 主要用于暂存设置项的值
 * 用于组件间通信 及时通知组件变化
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as Setting from '../api/setting.js'
import * as BingAPI from '../api/bing/image.js'

const state = {
  searches: null, // 搜索设置
  featrues: null, // 包括 application lovasites 的设置
  bing: null, // 必应背景设置项 {name: "bing", status: false}
  color: null //纯色背景设置 #987a3b
}

/**
 * 初始化数据
 */
Setting.fetchSearches.then(data => {
  state.searches = data
})
Setting.fetchFeatures.then(data => {
  state.featrues = data
})
Setting.fetchBing.then(data => {
  state.bing = data
})
Setting.fetchColor.then(data => {
  state.color = data
})

// getters
const getters = {
  searches: state => state.searches,
  featrues: state => state.featrues,
  application: state => state.featrues ? state.featrues.application : null, // 防止空值异常
  commonsites: state => state.featrues ? state.featrues.commonsites : null,
  bing: state => state.bing,
  color: state => state.color
}

// mutation 的类型
const types = {
  SET_SEARCHES_VALUE: 'SET_SEARCHES_VALUE',
  SET_FEATRUES_VALUE: 'SET_FEATRUES_VALUE',
  SET_BING_STATUS: 'SET_BING_STATUS',
  SET_BING_INITAL : 'SET_BING_INITAL',
  SET_COLOR: 'SET_COLOR'
}

// mutation
const mutations = {
  // 开启/关闭 搜索设置
  [types.SET_SEARCHES_VALUE](state, { type,status }) {
    state.searches[type].status = status
  },
  // 开启/关闭 Featrues 设置
  [types.SET_FEATRUES_VALUE](state, { type,status }) {
    state.featrues[type].status = status
  },
  // 开启/关闭 必应背景图片
  [types.SET_BING_STATUS](state, status) {
    state.bing.status = status
  },
  [types.SET_BING_INITAL](state, val) {
    state.bing.inital = val
  },
  // 设置颜色值
  [types.SET_COLOR](state, value) {
    state.color = value
  }
}

const actions = {
  /**
   * 修改 搜索设置
   * @param {String} type [application/setting]
   * @param {Boolean} status
   */
  modifySearches({ commit, state}, { type, status }) {
    // 修改vuex的值
    commit(types.SET_SEARCHES_VALUE, { type, status })
    // 存储新的数据
    Setting.modify(type, status)
  },

  /**
   * 修改 featrues
   * @param {String} type [application/setting]
   * @param {Boolean} status
   */
  modifyFeatrues({ commit, state}, { type, status }) {
    // 修改vuex的值
    commit(types.SET_FEATRUES_VALUE, { type, status })
    // 存储新的数据
    Setting.modify(type, status)
  },

  /*
   * 修改 Bing 背景图片
   * @param {Boolean} status
   */
  modifyBackground({ commit, state }, image) {
    // 修改vuex的值
    commit(types.SET_BING_STATUS, true)
    commit(types.SET_BING_INITAL, false)
    // local store
    BingAPI.saveBackground(image)
    // 存储新的数据
    Setting.modify('bing', true)
  },

  modifyBackgroundVisible({ commit, state }, status){
    commit(types.SET_BING_STATUS, status)
    // 存储新的数据
    Setting.modify('bing', status)
  },

  // 设置背景颜色
  modifyColor({ commit, state }, value) {
    // 修改vuex的值
    commit(types.SET_COLOR, value)
    // 同时更新bing 设置为不可见
    commit(types.SET_BING_STATUS, false)
    // 存储新的数据
    Setting.setColor(value)
    // 存储新的数据
    Setting.modify('bing', false)
  }
}

// vuex 应用
Vue.use(Vuex)
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
