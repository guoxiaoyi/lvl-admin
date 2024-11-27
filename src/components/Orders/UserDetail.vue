<template>
  <div v-if="Object.keys(order).length" class="order-desc" style="border-right: 1px white solid;">
    <h4>{{ title }}</h4>
    <div class="info-row">
      <div>
        <p class="title">头像:</p>
        <img :src="order.userAvatar" class="img-thumbnail good-thumbnail-middle user-avatar">
      </div>
      <div>
        <p class="title">昵称:</p>
        <div>
          {{ order.userNickname }}
          <router-link v-if="order.userId" :to="{ name: 'UserShow', params: { userId: order.userId }}">
            {{ order.userName }}
          </router-link>
          <span v-else>匿名</span>
        </div>
      </div>
      <div>
        <p class="title">手机号</p>
        <div>
          {{ order.userPhone || '-' }}
        </div>
      </div>
      <div v-if="order.location">
        <p class="title">位置:</p>
        <p>
          {{ order.location.province }}
          {{ order.location.city }}
          {{ order.location.district }}
          {{ order.location.address }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: '用户信息'
    }
  },
  mounted() {

  }
}
</script>

<style>

</style>