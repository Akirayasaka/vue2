<template>
    <div>
        <form class="form-signin" @submit.prevent="signin">
            <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
            <div class="form-floating">
                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="user.username">
                <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="user.password">
                <label for="floatingPassword">Password</label>
            </div>
            <div class="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me"> Remember me
                </label>
            </div>
            <button class="w-100 btn btn-lg btn-primary" type="submit">Sign In</button>
            <p class="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        signin() {
            const api = `${process.env.VUE_APP_API}/admin/signin`;
            const vm = this;
            this.axios.post(api, vm.user).then((s)=>{
                console.log(s.data);
                if(s.data.success){
                    const token = s.data.token;
                    const expired = s.data.expired;
                    // 前端儲存token
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
                    // 轉址
                    vm.$router.push('/admin/products');
                }else{
                    console.log('error');
                }
            });
        }
    }
}
</script>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>