<template>
  <div v-if="account.store.vipFuncEnabled" class="vip">
    <div class="user-info">
      <div>
        <img :src="require('@/assets/avatar_small_missing.jpg')" mode="aspectFill" class="avatar">
        <span> 点击登录 </span>
      </div>
    </div>
    <div class="vip-progress flex cant-vip">
      <div class="flex"><img :src="require('@/assets/diamond.png')" class="domain"> <span>注册会员享专属权益</span></div>
      <div class="button">
        <div style="display: inline;" bindtap="redirect"> 立即注册 </div>
      </div>
    </div>
    <slot name="functionBtn" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  inject: ['_micro_page_edit_vm'],
  provide() {
    return {
      _micro_page_template_vm: this
    }
  },
  props: {
    data: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  methods: {
    select(index) {
      this._micro_page_edit_vm.current = index
    }
  }
}
</script>

<style lang="scss" scoped>
.vip {
  border-radius: 16px;
  background: #FFF;
  // margin-top: -25px;
  position: relative;
  padding: 10px;
  .avatar {
    width: 40px;
    height: 40px;
    border: 1px solid #EEEEEE;
    padding: 4px;
    background: #EEEEEE;
    border-radius: 50%;
    margin-right: 8px;
  }
  .cant-vip {
    color: #FF882E;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    display: flex;
    background: linear-gradient(314deg, #FFF5E9 0%, #FFF9EC 100%);
    border-radius: 16px;
    padding: 10px 10px;
    margin-top: 10px;
  }
  .user-info {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    div {
      display: flex;
      align-items: center;
    }
  }
  .domain {
    width: 23px;
    height: 20px;
    margin-right: 8px;
  }
  .button {
    width: 84px;
    height: 30px;
    background: linear-gradient(314deg, #FF6818 0%, #FFC858 100%);
    box-shadow: 0px 2px 4px 0px rgba(247,201,84,0.4);
    color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border-radius: 20px;
  }
}
</style>
