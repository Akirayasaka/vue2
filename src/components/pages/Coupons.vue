<template>
    <div>
        <div class="text-end mt-1">
            <button class="btn btn-primary" @click="openModal(true)">建立新的優惠券</button>
        </div>
        <table class="table mt-4 table-hover">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th>折扣百分比</th>
                    <th>到期日</th>
                    <th>啟用狀態</th>
                    <th>動作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="coupon in couponList" :key="coupon.id">
                    <td class="align-middle">{{coupon.title}}</td>
                    <td class="align-middle">{{coupon.percent}} %</td>
                    <td class="align-middle">{{new Date(coupon.due_date * 1000).getFullYear()}}-{{new Date(coupon.due_date * 1000).getMonth() + 1}}-{{new Date(coupon.due_date * 1000).getDate()}}</td>
                    <td class="align-middle">
                        <span class="text-success" v-if="coupon.is_enabled">啟用</span>
                        <span class="text-danger" v-else>尚未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openModal(false, coupon)">編輯</button>
                        <button class="btn btn-outline-danger btn-sm ml-2" @click="deleteCoupon(coupon.id)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal -->
        <div class="modal fade" id="couponModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="couponModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header bg-info">
                    <h5 class="modal-title" id="couponModalLabel"><span v-if="isNew">新增</span><span v-else>編輯</span>優惠券</h5>
                    <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="modal-couponTitle" class="form-label">標題</label>
                        <input type="text" class="form-control" id="modal-couponTitle" placeholder="" v-model="tempCoupon.title">
                    </div>
                    <div class="mb-3">
                        <label for="modal-couponCode" class="form-label">優惠代碼</label>
                        <input type="text" class="form-control" id="modal-couponCode" placeholder="" v-model="tempCoupon.code">
                    </div>
                    <div class="mb-3">
                        <label for="modal-expiredDate" class="form-label">到期日</label>
                        <input type="date" class="form-control" id="modal-expiredDate" placeholder="" v-model="tempCoupon.due_date">
                    </div>
                    <div class="mb-3">
                        <label for="modal-rate" class="form-label">折扣百分比</label>
                        <input type="number" class="form-control" id="modal-rate" placeholder="" v-model="tempCoupon.percent">
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="modal_active"
                        :true-value="1" :false-value="0" v-model="tempCoupon.is_enabled">
                        <label class="form-check-label" for="modal_active">
                            是否啟用
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">關閉</button>
                    <button type="button" class="btn btn-primary" @click="updateCoupon()"><span v-if="isNew">新增</span><span v-else>更新</span></button>
                </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data(){
        return {
            couponList: [],
            pagination: [],
            isNew: false,
            tempCoupon: {}
        }
    },
    methods: {
        getCouponList(page = 1){
            const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`;
            const vm = this;
            vm.$store.dispatch('updateLoading', true); // 狀態改由vuex管理
            this.axios.get(url).then((s)=>{
                console.log(s);
                vm.$store.dispatch('updateLoading', false); // 狀態改由vuex管理
                vm.couponList = s.data.coupons;
                vm.pagination = s.data.pagination;
            });
        },
        updateCoupon() {
            let url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`;
            let httpMethod = 'post';
            const vm = this;
            if(!vm.isNew){
                url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
            }
            console.log(this.tempCoupon);
            const apiData = Object.assign({}, vm.tempCoupon);
            apiData.due_date = Math.floor(new Date(vm.tempCoupon.due_date)/1000);
            
            this.axios[httpMethod](url, {data: apiData}).then((s)=>{
                console.log(s);
                vm.closeModal();
                vm.getCouponList();
            });
        },
        deleteCoupon(id){
            const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${id}`;
            const vm = this;
            this.axios.delete(url).then((s)=>{
                console.log(s);
                vm.getCouponList();
            });
        },
        openModal(isNew, item) {
            if(isNew){
                this.tempCoupon = {};
                this.isNew = true;
            }else {
                this.tempCoupon = Object.assign({}, item);
                this.tempCoupon.due_date = new Date(item.due_date * 1000).toISOString().split('T')[0];
                console.log(this.tempCoupon);
                this.isNew = false;
            }
            // 取得Modal
            const addCouponModal = new window.bootstrap.Modal(document.getElementById('couponModal'), { keyboard: false });
            this.Modal = addCouponModal;
            addCouponModal.show();
        },
        closeModal() {
            this.Modal.hide(); //<- 透過data儲存的Modal對象, 把開啟的Modal關閉
            this.tempProduct = {};
        },
        unixToDate(timestamp) {
            return new Date(timestamp);
        }
    },
    created(){
        this.getCouponList();
    }
}
</script>