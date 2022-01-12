<template>
    <div v-show="!status">
          <div class="message-alert" >
            <div class="alert alert-dismissible"
            :class="'alert-' + item.status"
            v-for="(item, i) in messages" :key="i" role="alert">
            {{ item.message }}
            <button type="button" class="btn-close" @click="removeMessage(i)" aria-label="Close" >
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        removeMessage(target) {
            console.log(target);
        }
    },
    computed: {
        messages() {
            return this.$store.state.alertModules.alertMessage;
        },
        status() {
            return this.$store.state.alertModules.hide;
        }
    },
    created() {
        //this.$store.dispatch('alertModules/');
    }
}
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
</style>