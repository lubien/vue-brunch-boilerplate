import Vue from 'vue'
import store from 'app/store'
import VueResource from 'vue-resource'
import {
  AUTH_TOKEN
} from '../state/mutations'

Vue.use(VueResource)

export default {
  signin (username, password) {
    store.commit(AUTH_TOKEN, 'Q6SnSk2N5wGbXsEllqG6hSx7vRmxcz')
  },

  signout () {
    store.commit(AUTH_TOKEN, null)
  }
}
