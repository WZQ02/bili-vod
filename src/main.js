import { createApp } from 'vue'
import { createRouter,createWebHistory } from 'vue-router'
import main from './main.vue'
import mitt from 'mitt'
import nProgress from 'nprogress'
import '../node_modules/nprogress/nprogress.css'

import './assets/css/base.css'
import './assets/css/extra.css'
import app_name from './assets/json/app_name.json'

const Home = () => import('./pages/splash.vue')
const Conf = () => import('./pages/config.vue')
const Show = () => import('./pages/show.vue')
const VOD = () => import('./pages/vod.vue')
const About = () => import('./pages/about.vue')

const routes = [
    { path: '/', component: Home, name: Home, meta: {title: ''} },
    { path: '/config', component: Conf, name: Conf, meta: {title: '配置 / Config'} },
    { path: '/vod', component: VOD, name: VOD, meta: {title: '弹幕点播 / VOD'} },
    { path: '/show', component: Show, name: Show, meta: {title: '消息展示 / Show'} },
    { path: '/about', component: About, name: About, meta: {title: '关于 / About'} }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to,from,next)=>{
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

router.beforeResolve((to,from,next)=>{
    if (to.name) {
        nProgress.start()
    }
    next()
})

router.afterEach((to,from)=>{
    nProgress.done()
})

const app = createApp(main)
app.use(router)
app.config.globalProperties.$bus = mitt();

app.mount('#app')

console.log(`${app_name.app_name} version ${app_name.version}. Last updated ${app_name.last_updated}`)