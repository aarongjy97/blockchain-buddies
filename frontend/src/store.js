import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    details: {
      address: '',
      company: null,
      email: '',
      id: null,
      name: '',
      password: '',
      role: '',
    }
  },
  mutations: {
    storeDetails(state, data) {
      state.details = data;
    }
  },
  actions: {
    clearData({ commit }) {
      commit('storeDetails', 
      {
        address: '',
        company: null,
        email: '',
        id: null,
        name: '',
        password: '',
        role: '',
      })
    }
  },
  plugins: [createPersistedState()],
});

export default store;
