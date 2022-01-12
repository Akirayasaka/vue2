import axios from 'axios';
//import store from '@/store';

export default {
    namespaced: true,
    state: {
        products: [],
        pagination: []
    },
    actions: {
        getProducts(context) {
            const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products`;
            
            context.commit('LOADING', true, {root: true}); // LOADING行為在 store root底下, 追加{root: true}表示從底層觸發
            axios.get(api).then((s)=>{
                console.log(s);
                context.commit('LOADING', false, {root: true}); 
                context.commit('PRODUCTS', s.data.products);
                context.commit('PAGINATION', s.data.pagination);
                // store.dispatch('alertModules/showAlertMessage', [{
                //     message: '產品清單取得成功',
                //     status: 'success',
                //     timestamp: 123
                // }], {root: true});
            });
        }
    },
    mutations: {
        PRODUCTS(state, payload) {
            state.products = payload;
        },
        PAGINATION(state, payload){
            console.log('pagination', payload);
            state.pagination = payload;
        }
    }
}