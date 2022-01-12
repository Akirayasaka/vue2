<template>
  <div>
    <!-- <loading :active.sync="isLoading" /> -->
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 150px;background-size: cover;background-position: center;" :style="{backgroundImage: `url(${item.imageUrl})`}" ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{item.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">{{item.origin_price}} 元</div>
              <del class="h6" v-if="item.price">原價 {{item.origin_price}} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{item.price}} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click.prevent="getProduct(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id, 1, false)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

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

    <hr>

    <div class="w-50 mx-auto" v-if="cart.carts !== undefined && cart.carts.length > 0">
        <table class="table">
            <thead>
                <th></th>
                <th>品名</th>
                <th>數量</th>
                <th>單價</th>
            </thead>
            <tbody>
                <tr v-for="item in cart.carts" :key="item.id">
                    <td class="align-middle">
                        <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)"><i class="far fa-trash-alt"></i></button>
                    </td>
                    <td class="align-middle">
                        {{ item.product.title }}
                        <div class="text-success" v-if="item.coupon">
                        已套用優惠券
                        </div>
                    </td>
                    <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                    <td class="align-middle text-right">{{ item.final_total }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="text-right">總計</td>
                    <td class="text-right">{{ cart.total }}</td>
                </tr>
                <tr v-if="cart.final_total !== cart.total">
                    <td colspan="3" class="text-right text-success">折扣價</td>
                    <td class="text-right text-success">{{ cart.final_total }}</td>
                </tr>
            </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                套用優惠碼
                </button>
            </div>
        </div>

        <div class="my-5 row justify-content-center">
          <validation-observer class="col-md-6" v-slot="{ invalid }">
            <form  @submit.prevent="createOrder">
                <!-- <div class="form-group">
                    <label for="useremail">Email</label>
                    <input type="email" class="form-control" name="email" id="useremail" v-model="form.user.email" placeholder="請輸入 Email" required>
                    <span class="text-danger"></span>
                </div> -->
                
                <validation-provider rules="required|email" v-slot="{ errors, classes }">
                  <div class="form-group">
                    <label for="useremail">Email</label>
                    <input type="email" class="form-control" name="email" id="useremail" v-model="form.user.email" :class="classes" placeholder="請輸入 Email">
                    <span class="invalid-feedback">{{ errors[0]}}</span>
                  </div>
                </validation-provider>
            
                <!-- <div class="form-group">
                    <label for="username">收件人姓名</label>
                    <input type="text" class="form-control" name="name" id="username" v-model="form.user.name" placeholder="輸入姓名">
                    <span class="text-danger"></span>
                </div> -->
                <validation-provider rules="required" v-slot="{ errors, classes }">
                  <div class="form-group">
                    <label for="username">收件人姓名</label>
                    <input type="text" class="form-control" name="name" id="username" v-model="form.user.name" :class="classes" placeholder="輸入姓名">
                    <span class="invalid-feedback">{{ errors[0]}}</span>
                  </div>
                </validation-provider>
            
                <!-- <div class="form-group">
                    <label for="usertel">收件人電話</label>
                    <input type="tel" class="form-control" id="usertel" v-model="form.user.tel" placeholder="請輸入電話">
                </div> -->
                <validation-provider rules="required" v-slot="{ errors, classes }">
                  <div class="form-group">
                    <label for="usertel">收件人電話</label>
                    <input type="tel" class="form-control" name="tel" id="usertel" v-model="form.user.tel" :class="classes" placeholder="請輸入電話">
                    <span class="invalid-feedback">{{ errors[0]}}</span>
                  </div>
                </validation-provider>
            
                <!-- <div class="form-group">
                    <label for="useraddress">收件人地址</label>
                    <input type="text" class="form-control" name="address" id="useraddress" v-model="form.user.address" placeholder="請輸入地址">
                    <span class="text-danger">地址欄位不得留空</span>
                </div> -->
                <validation-provider rules="required" v-slot="{ errors, classes }">
                  <div class="form-group">
                    <label for="useraddress">收件人地址</label>
                    <input type="text" class="form-control" name="address" id="useraddress" v-model="form.user.address" :class="classes" placeholder="請輸入地址">
                    <span class="invalid-feedback">{{ errors[0]}}</span>
                  </div>
                </validation-provider>
            
                <div class="form-group">
                    <label for="comment">留言</label>
                    <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
                </div>
                <div class="text-center mt-1">
                    <button type="submit" class="btn btn-success" :disabled="invalid">送出訂單</button>
                </div>
            </form>
          </validation-observer>
        </div>
    </div>

    <!-- Product Detail Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
      aria-labelledby="exampleModalLabel" aria-hidden="true" v-if="product">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{num}} {{product.unit}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary"
              @click="addtoCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
        </div>
        </div>
  </div>
</template>

<script>

export default {
  name: "CustomerOrders",
  data() {
    return {
      products: [],
      product: {},
      pagination: {},
      isLoading: false,
      status: {
        loadingItem: ""
      },
      cart: {},
      coupon_code: "",
      form: {
          user: {
              name: '',
              email: '',
              tel: '',
              address: ''
          },
          message: ''
      },
      Modal: null
    };
  },
  components: {
    
  },
  methods: {
    getProducts(page = 1) {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`;
      vm.isLoading = true;
      vm.$store.dispatch('updateLoading', true);
      this.$http.get(url).then((s) => {
        console.log(s.data);
        vm.$store.dispatch('updateLoading', false);
        vm.products = s.data.products;
        vm.isLoading = false;
        vm.pagination = s.data.pagination;
      });
    },
    getProduct(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(url).then((s)=> {
        console.log(s);
        vm.product = s.data.product;
        vm.product.num = 1;
        vm.status.loadingItem = '';
        vm.openModal();
      });
    },
    addtoCart(id, qty = 1, open = true){
        const vm = this;
        const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
        vm.status.loadingItem = id;
        const cart = {product_id: id, qty};
        this.$http.post(url, { data: cart}).then((s)=> {
            console.log(s);
            vm.status.loadingItem = '';
            vm.getCart();
            if(open){
                vm.closeModal();
            }
        });
    },
    getCart(){
        const vm = this;
        const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
        this.$http.get(url).then((s)=> {
            console.log(s);
            vm.cart = s.data.data;
            vm.status.loadingItem = '';
        });
    },
    removeCartItem(id){
        const vm = this;
        const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
        vm.$store.dispatch('updateLoading', true);
        this.axios.delete(url).then((s)=>{
            console.log(s);
            vm.$store.dispatch('updateLoading', false);
            vm.getCart();
        });
    },
    addCouponCode(){
        const vm = this;
        const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
        const coupon = { code: vm.coupon_code };
        console.log(coupon);
        this.axios.post(url, {data: coupon}).then((s)=>{
            console.log(s);
            if(s.data.success){
                this.$store.dispatch('alertModules/showAlertMessage', [{
                    message: `已成功套用優惠券`,
                    status: 'danger',
                    timestamp: 123
                }]);
                vm.getCart();
            }else{
                this.$store.dispatch('alertModules/showAlertMessage', [{
                    message: `${s.data.message}`,
                    status: 'danger',
                    timestamp: 123
                }]);
            }
        });
    },
    createOrder() {
        const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;
        const vm = this;
        const order = vm.form;
        this.axios.post(url, { data: order}).then((s)=>{
            console.log(s);
            this.$store.dispatch('alertModules/showAlertMessage', [{
                    message: `已成功建立訂單`,
                    status: 'success',
                    timestamp: 123
                }]);
        });
    },
    openModal(){
      const productModal = new window.bootstrap.Modal(document.getElementById("productModal"), { keyboard: false, });
      this.Modal = productModal;
      productModal.show();
    },
    closeModal() {
      this.Modal.hide();
      this.product = {};
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>
