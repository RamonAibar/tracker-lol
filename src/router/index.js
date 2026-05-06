import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import TierListView from '../views/TierListView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'LoL Tracker — Inici' },
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { title: 'LoL Tracker — Cerca Invocador' },
  },
  {
    path: '/search/:region/:gameName/:tagLine',
    name: 'summoner',
    component: SearchView,
    meta: { title: 'LoL Tracker — Perfil' },
  },
  {
    path: '/tierlist',
    name: 'tierlist',
    component: TierListView,
    meta: { title: 'LoL Tracker — Tier Lists' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  document.title = to.meta.title || 'LoL Tracker'
})

export default router
