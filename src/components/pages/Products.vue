<template>
    <div>
        <div class="text-end mt-1">
            <button class="btn btn-primary" @click="openModal(true)">建立新的產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th class="text-center" width="120">分類</th>
                    <th class="text-center">產品名稱</th>
                    <th width="120">原價</th>
                    <th width="120">售價</th>
                    <th width="120" class="text-center">啟用狀態</th>
                    <th width="120">動作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in products" :key="item.id">
                    <td class="text-center">{{item.category}}</td>
                    <td>{{item.title}}</td>
                    <td class="text-end">{{item.origin_price}}</td>
                    <td class="text-end">{{item.price}}</td>
                    <td class="text-center">
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else class="text-danger">未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
                        <button class="btn btn-outline-danger btn-sm" @click="openDeleteModal(item)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination -->
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{'disabled': !pagination.has_pre}">
                    <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProducts(pagination.current_page - 1)">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" v-for="page in pagination.total_pages" :key="page" :class="{'active': pagination.current_page === page}">
                    <a class="page-link" href="#" @click.prevent="getProducts(page)">{{page}}</a>
                </li>
                <li class="page-item" :class="{'disabled': !pagination.has_next}">
                    <a class="page-link" href="#" aria-label="Next" @click.prevent="getProducts(pagination.current_page + 1)">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>

        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                        <span v-if="isNew">新增產品</span>
                        <span v-else>編輯產品</span>
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                            <label for="image">輸入圖片網址</label>
                            <input type="text" class="form-control" id="image" v-model="tempProduct.imageUrl" placeholder="請輸入圖片連結">
                            </div>
                            <div class="form-group">
                            <label for="customFile">或 上傳圖片
                                <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                            </label>
                            <input type="file" id="customFile" class="form-control"
                                ref="files" @change="uploadFile">
                            </div>
                            <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                            class="img-fluid" :src="tempProduct.imageUrl" alt="">
                        </div>
                        <div class="col-sm-8">
                            <div class="form-group">
                            <label for="title">標題</label>
                            <input type="text" class="form-control" id="title" v-model="tempProduct.title" placeholder="請輸入標題">
                            </div>

                            <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="category">分類</label>
                                <input type="text" class="form-control" id="category" v-model="tempProduct.category" placeholder="請輸入分類">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="price">單位</label>
                                <input type="unit" class="form-control" id="unit" v-model="tempProduct.unit" placeholder="請輸入單位">
                            </div>
                            </div>

                            <div class="form-row">
                            <div class="form-group col-md-6">
                            <label for="origin_price">原價</label>
                                <input type="number" class="form-control" id="origin_price" v-model="tempProduct.origin_price" placeholder="請輸入原價">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="price">售價</label>
                                <input type="number" class="form-control" id="price" v-model="tempProduct.price" placeholder="請輸入售價">
                            </div>
                            </div>
                            <hr>

                            <div class="form-group">
                            <label for="description">產品描述</label>
                            <textarea type="text" class="form-control" id="description" v-model="tempProduct.description"  placeholder="請輸入產品描述"></textarea>
                            </div>
                            <div class="form-group">
                            <label for="content">說明內容</label>
                            <textarea type="text" class="form-control" id="content" v-model="tempProduct.content" placeholder="請輸入產品說明內容"></textarea>
                            </div>
                            <div class="form-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="tempProduct.is_enabled"
                                :true-value="1" :false-value="0" id="is_enabled">
                                <label class="form-check-label" for="is_enabled">
                                是否啟用
                                </label>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <!-- <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button> -->
                        <button type="button" class="btn btn-outline-secondary" @click="closeModal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                        <span>刪除產品</span>
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="deleteProduct()">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            products: [], //List列表
            Modal: null, // 儲存Modal狀態
            tempProduct: {}, // 單一筆資料
            isNew: false,
            //isLoading: false, 狀態改由vuex管理
            status: {
                fileUploading: false
            },
            pagination: []
        };
    },
    methods: {
        getProducts(page = 1) {
            const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products?page=${page}`;
            const vm = this;
            vm.$store.dispatch('updateLoading', true); // 狀態改由vuex管理
            this.axios.get(api).then((s)=>{
                console.log(s);
                vm.$store.dispatch('updateLoading', false); // 狀態改由vuex管理
                vm.products = s.data.products;
                vm.pagination = s.data.pagination;
            });
        },
        openModal(isNew, item) {
            if(isNew){
                this.tempProduct = {};
                this.isNew = true;
            }else {
                this.tempProduct = Object.assign({}, item);
                this.isNew = false;
            }
            // 取得Modal
            const addProductModal = new window.bootstrap.Modal(document.getElementById('productModal'), { keyboard: false });
            this.Modal = addProductModal;
            addProductModal.show();
        },
        closeModal() {
            this.Modal.hide(); //<- 透過data儲存的Modal對象, 把開啟的Modal關閉
            this.tempProduct = {};
        },
        updateProduct() {
            let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`;
            let httpMethod = 'post';
            const vm = this;

            if(!vm.isNew){
                api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
                httpMethod = 'put';
            }
            this.axios[httpMethod](api, { data:vm.tempProduct}).then((s)=>{
                console.log(s);
                if(s.data.success){
                    console.log("OK");
                }else{
                    console.log("Fail");
                }
                vm.closeModal();
                vm.getProducts();
            });
        },
        openDeleteModal(item) {
            const delProductModal = new window.bootstrap.Modal(document.getElementById("delProductModal"), { keyboard: false });
            this.Modal = delProductModal;
            this.tempProduct = item;
            delProductModal.show();
        },
        deleteProduct() {
            const vm = this;
            const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;

            this.$http.delete(api).then((s) => {
                console.log(s);
                if (s.data.success) {
                this.getProducts();
                this.$store.dispatch('alertModules/showAlertMessage', [{
                    message: `產品${this.tempProduct.title}已刪除`,
                    status: 'success',
                    timestamp: 123
                }]);
                //this.$store.dispatch('productListModules/getProducts');
                this.closeModal();
                } else {
                console.log("刪除失敗");
                }
            });
        },
        uploadFile() {
            const imgFile = this.$refs.files.files[0];
            const vm = this;
            // 模擬傳統form格式
            const formData = new FormData();
            formData.append("file-to-upload", imgFile);
            const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`;
            vm.status.fileUploading = true;
            this.axios.post(url, formData, {Headers: {'Content-Type': 'multipart/form-data'}}).then((s)=>{
                console.log(s.data);
                vm.status.fileUploading = false;
                if(s.data.success){
                    vm.$set(vm.tempProduct, 'imageUrl', s.data.imageUrl);
                }
            });
        }
    },
    created() {
        this.getProducts();
    },
    computed: {
        isLoading() {
            return this.$store.state.isLoading;
        },
    }
}
</script>