<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <div v-if="detail.childCards.length < detail.suiteSpec" class="panel-heading">
            <el-button v-if="checkPer(['good_create'])" type="success" @click="$router.push({ name: 'SuiteCardChildGoodsNew'})">添加卡片</el-button>
            需要设置{{ detail.suiteSpec }}种卡片
          </div>
          <el-table :data="detail.childCards">
            <el-table-column label="图片">
              <template slot-scope="scope">
                <custom-img :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px' }" />
              </template>
            </el-table-column>
            <el-table-column label="卡片名称">
              <template slot-scope="scope">
                <router-link v-if="checkPer(['good_read'])" :to="{ name: 'GoodsShow', params: { goodsId: scope.row.id} }">
                  {{ scope.row.name }}
                </router-link>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="库存">
              <template slot-scope="scope">
                <router-link v-if="checkPer(['good_stock_changes'])" :to="{name: 'GoodsStockChange', params: {goodsId: scope.row.id }}">
                  <el-tooltip class="item" effect="dark" content="库存不足" placement="top">
                    <i v-if="scope.row.stockQuantity <= 0" class="fa fa-warning" />
                  </el-tooltip>
                  {{ scope.row.stockQuantity }}
                  <i class="fa fa-edit" />
                </router-link>
                <span v-else>
                  {{ scope.row.stockQuantity > 0 ? ' > 0' : '0' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="可见管理员">
              <template slot-scope="scope">
                {{ scope.row.accountSet ? scope.row.accountSet.map(i => i.name).join(',') : '-' }}
              </template>
            </el-table-column>
            <el-table-column v-if="checkPer(['good_read'])" label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'GoodsShow', params: { goodsId: scope.row.id} }">
                  查看
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import suite_cards from '@/api/suite_cards'
import tab from '@/components/Tabs/suite_cards.vue'
import CustomImg from '@/components/Image/goods'

export default {
  components: { tab, CustomImg },
  data() {
    return {
      detail: {
        childCards: []
      }
    }
  },
  async mounted() {
    const breadcrumb = [{ title: '礼品列表', path: { name: 'SuiteCardIndex' }}]
    await suite_cards.show({ ...this.$route.params }).then(({ data }) => {
      this.detail = data
      breadcrumb.push({ title: data.name, path: { name: 'SuiteCardShow', params: { id: data.id }}})
    })
    breadcrumb.push({ title: '卡片管理' })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
  }
}
</script>

<style>

</style>
