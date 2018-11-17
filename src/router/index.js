import Vue from 'vue'
import Router from 'vue-router'
import SelectGarden from '@/components/SelectGarden'
import ViewGarden from '@/components/ViewGarden'
import AddGarden from '@/components/AddGarden'
import Statistic from '@/components/Statistic'
import About from '@/components/About'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'select-garden',
      component: SelectGarden
    },
    {
      path: '/view/:garden_id',
      name: 'view-garden',
      component: ViewGarden
    },
    {
      path: '/add',
      name: 'add-garden',
      component: AddGarden
    },
    {
      path: '/statistic/:garden_id',
      name: 'statistic',
      component: Statistic
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
