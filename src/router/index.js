import Vue from 'vue'
import Router from 'vue-router'
import GoogleBook from '@/components/GoogleBook'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoogleBook',
      component: GoogleBook
    }
  ]
})
