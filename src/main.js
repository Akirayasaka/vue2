import Vue from 'vue'
import App from './App.vue'
import router from './router';

import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Vuex from 'vuex';
import store from './store';
import { ValidationObserver, ValidationProvider, extend, localize, configure } from 'vee-validate';
import TW from 'vee-validate/dist/locale/zh_TW.json';
import * as rules from 'vee-validate/dist/rules';

//#region Vee-Validate

// extend追加rule
Object.keys(rules).forEach((rule)=>{
  extend(rule, rules[rule]);
});
localize('zh_TW', TW);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
});
//#endregion

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
axios.defaults.withCredentials = true;
Vue.component('Loading', VueLoading);

//#region 加入bootstrap設定, 方便在各元件內直接調用方法
window.bootstrap = require('bootstrap');
//#endregion

Vue.use(Vuex);


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');

router.beforeEach((to, from, next)=>{
  // 頁面跳轉時確認, 對象component的meta requireAuth
  if(to.meta.requiresAuth) {
    //#region 確認登入狀態
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    axios.post(api).then((s)=> {
      //console.log(s.data);
      if(s.data.success) {
        next();
      }else {
        next({ path: '/login' });
      }
    })
    //#endregion
  }else {
    next();
  }
});