<template>
    <div>
        <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                <div class="position-sticky pt-3">
                    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                        <span>管理員</span>
                        <a class="link-secondary" href="#" aria-label="Add a new report">
                            <span data-feather="plus-circle"></span>
                        </a>
                    </h6>
                    <ul class="nav flex-column mb-2">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/admin/products" :class="{'text-primary': currentPath === '/admin/products'}"><i class="fas fa-box-open"></i> 產品列表</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/admin/orders" :class="{'text-primary': currentPath === '/admin/orders'}"><i class="fas fa-list-alt"></i> 訂單管理</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/admin/coupons" :class="{'text-primary': currentPath === '/admin/coupons'}"><i class="fas fa-ticket-alt"></i> 優惠券</router-link>
                        </li>
                    </ul>

                    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                        <span>模擬功能</span>
                        <a class="link-secondary" href="#" aria-label="Add a new report">
                            <span data-feather="plus-circle"></span>
                        </a>
                    </h6>
                    <ul class="nav flex-column mb-2">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/customer_order" :class="{'text-primary': currentPath === '/customer_order'}"><i class="fas fa-shopping-cart"></i> 模擬訂單</router-link>
                        </li>
                    </ul>
                    
                </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'Sidebar',
    data(){
        return {
            currentPath: ''
        }
    },
    watch: { 
     '$route.path': {
        handler: function(newVal, oldVal) {
           console.log(newVal, oldVal);
           this.currentPath = newVal;
        },
        deep: true,
        immediate: true
      }
    },
}
</script>