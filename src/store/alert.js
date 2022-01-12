import store from '@/store';

export default {
    namespaced: true,
    state: {
        alertMessage: [{
            message: 'test',
            status: 'success',
            timestamp: 123
        }],
        hide: true
    },
    actions: {
        showAlertMessage(context, payload){
            context.commit('STATUS', false);
            context.commit('MESSAGE', payload);
            setTimeout(() => {
                store.dispatch('alertModules/hideAlertMessage');
            }, 5000);
        },
        hideAlertMessage(context) {
            const initialState = [{
                message: '',
                status: '',
                timestamp: 0
            }];
            context.commit('MESSAGE', initialState);
            context.commit('STATUS', true);
        }
    },
    mutations: {
        MESSAGE(state, payload) {
            state.alertMessage = [];
            payload.forEach(el => {
                state.alertMessage.push(el);
            });
        },
        STATUS(state, payload) {
            state.hide = payload;
        }
    }
}