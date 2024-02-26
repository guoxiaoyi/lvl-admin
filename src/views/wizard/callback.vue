<template>
  <div>

  </div>
</template>

<script>
import wechat_authorization from '@/api/wechat_authorization'
export default {
  mounted() {
    if (this.$route.query.auth_code) {
      wechat_authorization.authorize(this.$route.query.auth_code).then(response => {
        this.$router.push({ name: 'WizardEditStore' })
      }).catch(fail => {
        this.$router.push({ name: 'WizardAuthorize' })
      })
    }
    if (!this.$route.query.auth_code) {
      this.$router.push({ name: 'WizardAuthorize' })
    }
  }
}
</script>
