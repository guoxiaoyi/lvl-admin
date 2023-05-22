<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 会员权益 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        可以用于配置会员权益，帮助保持会员活跃，提高复购。
      </div>
      <div class="panel panel-default" style="border-left: none; border-right: none; margin-bottom: 0;">
        <el-table v-loading="crud.loading" :data="crud.data" class="data">
          <el-table-column label="权益图标" prop="pictureUrl" width="200px">
            <template slot-scope="scope">
              <el-image v-if="scope.row.isDefault" style="width: 60px; height: 60px" :src="require('@/assets/vip/interests/'+ scope.row.pictureUrl +'.png')" />
              <el-image v-else style="width: 60px; height: 60px" :src="scope.row.pictureUrl">
                <div slot="error" class="image-slot">
                  <el-image style="width: 60px; height: 60px" :src="require('@/assets/image_missing.png')" />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="权益名称" prop="label" />
          <el-table-column label="权益说明" prop="description" min-width="200px" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.isDefault" type="text" @click="$router.push({ name: 'VipInterestEdit', params: { id: scope.row.id }})">编辑</el-button>
              <el-button v-if="!scope.row.isDefault" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import vip_interest from '@/api/vip_interests'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      list: []
    }
  },
  cruds() {
    return CRUD({ title: '会员权益', url: '/lmp/v2/admin/vip_setting/vip_interest', query: { typeIn: 'true' }, crudMethod: { ...vip_interest }})
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '会员权益' }
    ])
    this.crud.refresh()
  },
}
</script>

<style>

</style>
