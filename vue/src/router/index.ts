import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/Index.vue')
  },
  {
    path: '/join-room',
    name: 'JoinRoom',
    component: () => import('@/views/JoinRoom.vue')
  },
  {
    path: '/select-difficulty',
    name: 'DifficultySelect',
    component: () => import('@/views/DifficultySelect.vue')
  },
  {
    path: '/game',
    name: 'Board',
    component: () => import('@/views/Board.vue')
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
  {
    path: '/waiting-room',
    name: 'WaitingForJoin',
    component: () => import('@/views/WaitingForJoin.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
