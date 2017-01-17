import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from './components/pages/Main.vue'
import Index from './App.vue'
import Split from './components/pages/Split.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    component: Index,
    name: 'index',
    children: [
      {
        path: 'main',
        name: 'main',
        component: Main
      },
      {
        name: 'split',
        path: 'split',
        component: Split
      }
    ]
  }
]
export const router = new VueRouter({
  routes,
  mode: 'history'
})
