<template>
  <div v-if="order.suiteCard" class="order-desc" style="border-right: 1px white solid;">
    <h4>套卡信息</h4>
    <div class="info-row">
      <div>
        <p class="title">图片:</p>
        <div>
          <el-image :src="order.suiteCard.coverImgUrl" class="img-thumbnail activity-thumbnail-middle" fit="cover" :preview-src-list="[order.suiteCard.coverImgUrl]" />
        </div>
      </div>
      <div >
        <p class="title">套卡名称:</p>
        <div>
          <router-link v-if="!order.suiteCard.deletedAt" :to="{ name:'SuiteCardShow', params: { id: order.suiteCard.id } }">
            {{ order.suiteCard.name }}
          </router-link>
          <span v-else>
            {{ order.suiteCard.name }}
          </span>
        </div>
      </div>
      <div>
        <p class="title">兑换奖励:</p>
        <p>{{ order.suiteCard.good.name }}</p>
      </div>
      <div>
        <p class="title">兑换结束日期:</p>
        <p>
          {{ order.suiteCard.expiresAt ? order.suiteCard.expiresAt : '无' }}
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
        return { }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .activity_forms_image {
    width: 30px;
    height: 30px;
    border: 1px solid rgb(221, 221, 221);
    padding: 2px;
    background-color: rgb(255, 255, 255);
  }
}
</style>
