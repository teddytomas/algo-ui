import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        selectedOrder:null,
        selectedPair:'btcusd',

    },
    mutations: {
        selectOrder(state, order) {
            console.log("equal " + (state.selectedOrder===order));
            return state.selectedOrder = order;
        },
        selectPair(state, pair) {
            return state.selectedPair = pair;
        },

    },
    actions: {
        selectOrder(context, order) {
            context.commit('selectOrder', order);
        },
        selectPair(context, pair) {
            context.commit('selectPair', pair);
        },
    },
    getters: {
        selectedOrderSide: state => {
            return state.selectedOrder.side;
        },
        selectedOrderIsBaseBuy: state => {
            let o = state.selectedOrder
            return (o.side=='buy' && o.pair.startsWith(o.currency.toLocaleLowerCase())) || (o.side=='sell' && !o.pair.startsWith(o.currency.toLocaleLowerCase()));
        },
        selectedOrder: state => {
            return state.selectedOrder;
        },
        globalSelectedPair: state => {
            if(state.selectedOrder != null) {
                return state.selectedOrder.pair;
            } else {
                return state.selectedPair;
            }
        }


    }
})