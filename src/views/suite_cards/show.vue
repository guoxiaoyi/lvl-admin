<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default new-show">
      <div class="panel-body">
        <table class="table table-loose table-hover">
          <tbody>
            <tr>
              <td>套卡名称</td>
              <td>
                {{ detail.name }}
              </td>
            </tr>
            <tr>
              <td>卡片数量 </td>
              <td> {{ detail.suiteSpec }} </td>
            </tr>
            <tr>
              <td>套卡封面图 </td>
              <td>
                <el-image v-if="detail.coverImgFileName" :src="detail.coverImgUrl" class="img-thumbnail activity-thumbnail-middle" fit="cover" :preview-src-list="[detail.coverImgUrl]" />
                <el-image v-else :src="require('@/assets/ex_banner.png')" class="img-thumbnail activity-thumbnail-middle" fit="cover" :preview-src-list="[detail.coverImgUrl]" />
              </td>
            </tr>
            <tr>
              <td>集齐奖励 </td>
              <td>
                <router-link v-if="detail.good && checkPer(['good_read'])" :to="{ name: 'GoodsShow', params: { goodsId: detail.good.id }}">
                  {{ detail.good.name }}
                </router-link>
                <span v-else>{{ detail.good ? detail.good.name : '-' }}</span>
              </td>
            </tr>
            <tr>
              <td>兑换结束日期 </td>
              <td>{{ detail.expiresAt }}</td>
            </tr>
            <tr>
              <td>套卡状态 </td>
              <td>{{ detail.enabled ? '开启' : '关闭' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="checkPer(['suite_card_manage'])" class="panel-footer">
        <el-button type="success" @click="$router.push({ name: 'SuiteCardEdit', params: { id: detail.id } })">编辑</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/suite_cards.vue'
import suite_cards from '@/api/suite_cards'
export default {
  components: { tab },
  data() {
    return {
      detail: {}
    }
  },
  async mounted() {
    const breadcrumb = [{ title: '礼品列表', path: { name: 'SuiteCardIndex' }}]
    await suite_cards.show({ ...this.$route.params }).then(({ data }) => {
      this.detail = data
      breadcrumb.push({ title: data.name })
    })
    breadcrumb.push({ title: '套卡详情' })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
  }
}
</script>
<style lang="scss" scoped>
.activity-thumbnail-middle {
  width: 320px;
  height: 120px;
}
</style>
