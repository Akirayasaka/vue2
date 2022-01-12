// 彙整所有Vuex行為

import Vue from 'vue';
import Vuex from 'vuex';
//import axios from 'axios';

//#region 模組化Modules
import productListModules from './products';
import alertModules from './alert';
//#endregion

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    state: {
        isLoading: false,
        //products: []
    },
    actions: {
        updateLoading(context, payload) {
            context.commit('LOADING', payload);
        },
        // 模組化前程式碼(對照用)
        // getProducts(context) {
        //     const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products`;
            
        //     context.commit('LOADING', true); // 狀態改由vuex管理
        //     axios.get(api).then((s)=>{
        //         console.log(s);
        //         context.commit('LOADING', false); // 狀態改由vuex管理
        //         context.commit('PRODUCTS', s.data.products);
        //     });
        // }
    },
    mutations: {
        LOADING(state, payload) {
            state.isLoading = payload;
        },
        // PRODUCTS(state, payload) {
        //     state.products = payload;
        // }
    },
    modules: {
        productListModules,
        alertModules
    }
});