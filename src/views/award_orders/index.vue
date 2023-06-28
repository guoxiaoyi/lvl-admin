<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active"><a aria-current="page" href="javascript:void(0)">全部</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
        </div>
        <div class="panel panel-default table-responsive">
          <div class="panel-heading">
            
          </div>
          <table v-loading="crud.loading" class="table table-bordered table-hover">
            <thead>
              <tr>
                <th v-for="item in ['创建时间', '活动/活动标签', '奖项', '奖品', '用户', '状态/兑奖时间', '操作']" :key="item">
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in crud.data">
                <tr class="top-side">
                  <td colspan="9">
                    <span> 订单编号： {{ item.code }} </span>
                    <span v-if="item.shipment" class="pull-right">收货信息：{{ item.shipment.name }} {{ item.shipment.phone }} {{ item.shipment.provinceName }} {{ item.shipment.cityName }} {{ item.shipment.districtName }}  {{ item.shipment.addr }}</span>
                  </td>
                </tr>
                <tr class="bottom-side">
                  <td>
                    <div class="flex" style="align-items: center; max-width:300px;">
                      <CustomImg :image="item.goods.imageList[0]" :size="{width: '60px', height: '60px' }" />
                      <router-link :to="{ name: 'StoreGoodShow', params: { id: item.goods.id }}" class="good-name">
                        {{ item.goods.name }}
                      </router-link>
                    </div>
                  </td>
                  <td> {{ item.createdAt }} </td>
                  <td>
                    {{ (item.points > 0 || item.cash <= 0) ? `${item.points}积分` : '' }}
                    {{ item.cash > 0 ? `${item.cash}元` : '' }}
                  </td>
                  <td> {{ item.quantity }} 件 </td>
                  <td> {{ item.cash }}<span class="unit">元</span> </td>
                  <td> {{ item.points }} <span class="unit">积分</span> </td>
                  <td> <a :href="'/admin/users/'+item.userId">{{ item.userName }}</a> </td>
                  <td>
                    <p class="margin-bottom-5">
                      <span class="label" :class="'label-'+item.state"> {{ item.stateName }} </span>
                    </p>
                  </td>
                  <td>
                    <router-link v-if="checkPer(['store_order_manage'])" :to="{ name: 'StoreOrderShow', params: { id: item.code }}">
                      详情
                    </router-link>
                    <el-button v-if="item.state === 'confirmed' && checkPer(['store_order_manage'])" type="text" @click="fh(item)">
                      - 发货
                    </el-button>
                    <el-button v-if="item.state === 'paid' && checkPer(['store_order_manage'])" type="text" @click="confirm(item)">
                      - 接收订单
                    </el-button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <pagination />
      </div>
    </div>

  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/EsPagination'
import tags from '@/api/tag'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '兑奖订单', url: '/lmp/v2/admin/award_order/es', props: { otherSearch: true }, sort: ['createdAt,desc'] })
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户管理' }
    ])
  },
  mounted() {
    if (this.crud.page.page === 1) {
      this.crud.props.searchAfter = undefined
      this.crud.refresh()
    }
    tags.all({ type: 'ActivityTag' }).then(response => {
      // this.userTags = response.data
    })
  }

}
</script>
