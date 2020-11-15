import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import UserView from "@/components/UserView";
import Account from "@/views/Account";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Account',
    component: Account
  },
  {
    path:'/userview',
    name:'Signature',
    component: UserView,
    props: true
  },
  {
    path:'/planner',
    name:'Planner',
    component: Home,
    props: true,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
