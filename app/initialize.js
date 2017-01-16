import Vue from 'vue'
import 'babel-polyfill'
import store from 'app/store'
import VueRouter from 'vue-router'
import routes from './config/routes'
import {RouterBase} from 'app/components'
import VueResource from 'vue-resource'
import VueValidator from 'vue-validator'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueValidator)

const environment = process.env.NODE_ENV

Vue.config.debug = environment === 'development'
Vue.config.devtools = environment === 'development'

Vue.http.interceptors.push((request, next) => {
  request.headers
    .set('Authorization', store.state.auth.token)
  next()
})

let router = new VueRouter({
  history: true,
  routes
})

const app = new Vue({
  el: '#content',
  render: r => r(RouterBase),
  router,
  store
})

if (window && environment === 'development') {
  window.App = app
}
