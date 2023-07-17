<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th style="border-top: none;">礼品图片/名称</th>
                <th style="border-top: none;">类型</th>
                <th style="border-top: none;">库存</th>
                <th style="border-top: none;">可见管理员</th>
                <th style="border-top: none;">创建时间</th>
                <th style="border-top: none;">操作</th>
              </tr>
            </thead>
            <tbody v-for="item in crud.data" :key="item.id">
              <tr class="top-side">
                <td colspan="5">
                  <div class="flex items-center">
                    套卡名称： <router-link :to="{ name: 'SuiteCardShow', params: { id: item.id }}">{{ item.name }}</router-link>
                  </div>
                </td>
                <td>
                  <el-button v-if="checkPer(['good_read'])" type="text" @click="$router.push({ name: 'SuiteCardShow', params: { id: item.id }})">详情</el-button> <el-button v-if="checkPer(['good_destroy'])" type="text" @click="crud.doDelete(item)">删除</el-button>
                </td>
              </tr>
              <tr v-for="goods in item.childCards" :key="goods.id + '-goods'">
                <td>
                  <div class="flex items-center">
                    <custom-img :image="goods.imageList[0]" :size="{width: '60px', height: '60px' }" />
                    <router-link v-if="checkPer(['good_read'])" :to="{ name: 'GoodsShow', params: { goodsId: item.id }}" style="margin-left: 10px;">{{ goods.name }}</router-link>
                    <span v-else>{{ goods.name }}</span>
                  </div>
                </td>
                <td> 套卡 </td>
                <td>
                  <router-link v-if="checkPer(['good_stock_changes'])" :to="{name: 'StoreGoodStockChange', params: {id: goods.id }}">
                    <el-tooltip class="item" effect="dark" content="库存不足" placement="top">
                      <i v-if="goods.stockQuantity <= 0" class="fa fa-warning" />
                    </el-tooltip>
                    {{ goods.stockQuantity }}
                    <i class="fa fa-edit" />
                  </router-link>
                  <span v-else>
                    {{ goods.stockQuantity > 0 ? ' > 0' : '0' }}
                  </span>
                </td>
                <td>
                  {{ goods.accountSet ? goods.accountSet.map(i => i.name).join(',') : '-' }}
                </td>
                <td>
                  {{ goods.createdAt }}
                </td>
                <td>
                  <router-link v-if="checkPer(['good_read'])" :to="{ name: 'GoodsShow', params: { goodsId: goods.id }}">详情</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/goods.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import CustomImg from '@/components/Image/goods'
import suite_cards from '@/api/suite_cards'

export default {
  components: {
    tab,
    pagination,
    CustomImg
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '套卡列表', url: '/lmp/v2/admin/gift/suite_card', crudMethod: { ...suite_cards }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '礼品列表' }])
    this.crud.refresh()
  }
}
</script>
<style lang="scss" scoped>
.top-side {
  background: #F5F5F5;
  border-top: 5px solid #FFF;
}
.bottom-side td {
  &:after {
    content: '';
    display: block;
    width: 100%;
    border-bottom: 1px solid #e6e6e6;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    vertical-align: middle;
    margin-right: 10px;
  }
}
::v-deep {
  .el-button.el-button--text {
    padding: 0;
  }
}
</style>
