import Vue from 'vue';
import VueRouter from 'vue-router';

//#region 頁面元件
import Login from '@/components/pages/Login'
import Dashboard from '@/components/pages/Dashboard';
import Products from '@/components/pages/Products';
import Orders from '@/components/pages/Orders';
import Coupons from '@/components/pages/Coupons';

import CustomerOrders from '@/components/pages/CustomerOrders';
//#endregion

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '*',
            redirect: 'login'
        },
        {
            name: 'admin',
            path: '/admin',
            component: Dashboard,
            meta: { requiresAuth: true },
            children: [
                {
                    name: 'Products',
                    path: 'products',
                    component: Products,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'Orders',
                    path: 'orders',
                    component: Orders,
                    meta: { requiresAuth: true } 
                },
                {
                    name: 'Coupons',
                    path: 'coupons',
                    component: Coupons,
                    meta: { requiresAuth: true } 
                }
            ]
        },
        {
            name: 'Login',
            path: '/login',
            component: Login
        },
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard,
            children:[
                {
                    path: 'customer_order',
                    name: 'CustomerOrders',
                    component: CustomerOrders
                }
            ]
        }
    ]
});