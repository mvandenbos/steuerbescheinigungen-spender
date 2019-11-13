import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    persons: [],
    reportData: [],
    addisonData: [],
    matchingAddisonSpenderIdInChurchtools: [],
    noMatchingAddisonSpenderIdInChurchtools: [],
    noAddisonSpenderIdInChurchtools: [],
    noAddisonSpenderIdInChurchtoolsIdList: [],
    donationReportData: [],
    settings: {},
    template: {},
  },
  mutations: {
    UPDATE_PERSONS: (state, data) => state.persons = data,
    UPDATE_ADDISON_DATA: (state, data) => state.addisonData = data,
    UPDATE_MATCHINGADDISONIDS_DATA: (state, data) => state.matchingAddisonSpenderIdInChurchtools = data,
    UPDATE_NOMATCHINGADDISONIDS_DATA: (state, data) => state.noMatchingAddisonSpenderIdInChurchtools = data,
    UPDATE_NOADDISONIDSINCT_DATA: (state, data) => state.noAddisonSpenderIdInChurchtools = data,
    UPDATE_NOADDISONIDSINCTLIST_DATA: (state, data) => state.noAddisonSpenderIdInChurchtoolsIdList = data,
    UPDATE_DONATIONREPORT_DATA: (state, data) => state.donationReportData = data,
    UPDATE_SETTINGS: (state, data) => state.settings = data,
    UPDATE_TEMPLATE: (state, data) => state.template = data,
  },
  actions: {
    UPDATE_PERSONS: ({ commit }, data) => commit('UPDATE_PERSONS', data),
    UPDATE_ADDISON_DATA: ({ commit }, data) => commit('UPDATE_ADDISON_DATA', data),
    UPDATE_CTADDISON_DATA: ({ commit }, data) => commit('UPDATE_CTADDISON_DATA', data),
    UPDATE_MATCHINGADDISONIDS_DATA: ({ commit }, data) => commit('UPDATE_MATCHINGADDISONIDS_DATA', data),
    UPDATE_NOMATCHINGADDISONIDS_DATA: ({ commit }, data) => commit('UPDATE_NOMATCHINGADDISONIDS_DATA', data),
    UPDATE_NOADDISONIDSINCT_DATA: ({ commit }, data) => commit('UPDATE_NOADDISONIDSINCT_DATA', data),
    UPDATE_NOADDISONIDSINCTLIST_DATA: ({ commit }, data) => commit('UPDATE_NOADDISONIDSINCTLIST_DATA', data),
    UPDATE_DONATIONREPORT_DATA: ({ commit }, data) => commit('UPDATE_DONATIONREPORT_DATA', data),
    UPDATE_SETTINGS: ({ commit }, data) => commit('UPDATE_SETTINGS', data),
    UPDATE_TEMPLATE: ({ commit }, data) => commit('UPDATE_TEMPLATE', data),
  }
})
