import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/Index.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('@/views/Game.vue')
  },
  {
    path: '/select-map',
    name: 'MapSelect',
    component: () => import('@/views/MapSelect.vue')
  },
  {
    path: '/select-ship',
    name: 'ShipSelect',
    component: () => import('@/views/ShipSelect.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
