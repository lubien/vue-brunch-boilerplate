const state = {
  token: null
}

const mutations = {
  set_token (state, token) {
    state.token = token
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
