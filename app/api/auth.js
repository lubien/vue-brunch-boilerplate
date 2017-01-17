import Vue from 'vue'
import store from 'app/store'
import VueResource from 'vue-resource'

Vue.use(VueResource)

export default {
  signin (username, password) {
    store.commit('auth/set_token', 'Q6SnSk2N5wGbXsEllqG6hSx7vRmxcz')
  },

  signout () {
    store.commit('auth/set_token', null)
  }
}
