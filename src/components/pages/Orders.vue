<template>
    <div>
        <table class="table mt-4 table-hover">
            <thead>
                <tr>
                    <th width="120">購買時間</th>
                    <th>Email</th>
                    <th>購買項目</th>
                    <th width="120">應付金額</th>
                    <th width="120">付款狀態</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in orderList" :key="item.id">
                    <td>{{item.create_at}}</td>
                    <td>{{item.user.email}}</td>
                    <td></td>
                    <td class="text-end"><span v-if="item.is_paid">{{item.total}}</span></td>
                    <td>
                        <span class="text-primary" v-if="item.is_paid">已付款</span>
                        <span class="text-danger" v-else>未付款</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            orderList: [],
            pagination: []
        }
    },
    methods: {
        getOrderList(page = 1) {
            const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/orders?page=${page}`;
            const vm = this;
            vm.$store.dispatch('updateLoading', true); // 狀態改由vuex管理
            this.axios.get(api).then((s)=>{
                console.log(s);
                vm.$store.dispatch('updateLoading', false); // 狀態改由vuex管理
                vm.orderList = s.data.orders;
                vm.pagination = s.data.pagination;
            });
        },

    },
    created() {
        this.getOrderList();
    }
}
</script>