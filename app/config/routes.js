import {Base} from 'app/layouts'
import views from '../views'

const {
  Pages,
  ErrorViews
} = views

export default [
  {
    path: '/',
    component: Base,
    children: [
      {name: 'home', path: '/', component: Pages.Home},
      {name: 'about', path: 'about', component: Pages.About}
    ]
  },

  {
    path: '/forbidden',
    name: 'error401',
    component: ErrorViews.Error401
  },

  {
    path: '*',
    name: 'error404',
    component: ErrorViews.Error404
  }
]
