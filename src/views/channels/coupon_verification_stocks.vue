<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default new-show">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="卡券名称" prop="">
              <template slot-scope="scope">
                <router-link :to="{ name: 'GoodsShow', params: { goodsId: scope.row.goodId}}">
                  {{ scope.row.goodName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="stock" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/channel_show.vue'
import channels from '@/api/channels'
import CRUD, { presenter, crud, header } from '@crud/crud'

export default {
  components: {
    tab
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      channel: { }
    }
  },
  async mounted() {
    await channels.get(this.$route.params).then(response => {
      this.channel = response.data
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '渠道列表', path: { name: 'ChannelSearch' }},
      { title: this.channel.name, path: { name: 'ChannelShow', query: { id: this.channel.id }}},
      { title: '渠道卡券' }
    ])
    this.crud.refresh()
  },
  cruds() {
    return CRUD({ title: '渠道管理', url: `/lmp/admin/api/couponVerificationStock/stock/channel/${this.parent.$route.params.id}`, sort: 'id,desc' })
  }

}
</script>
