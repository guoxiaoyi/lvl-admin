<template>
  <tbody>
    <template v-if="activity[var2LowerCase('units_enabled')]">
      <tr>
        <td>{{ $t('activities.rebate_kind') }}</td>
        <td>
          {{ $t(`activities.attrbutes.rebate_kind['${d[var2LowerCase('rebate_kind')]}']`) }}
        </td>
      </tr>
      <tr v-if="d[var2LowerCase('rebate_kind')] === 'rebater_scan'">
        <td>{{ $t('activities.rebater_required') }}</td>
        <td>
          {{ $t(`boolean[${d[var2LowerCase('rebater_required')]}]`) }}
        </td>
      </tr>
    </template>
    <tr>
      <td>{{ $t('activities.rebate_good') }}</td>
      <td class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead>
            <tr>
              <th>图片</th>
              <th>名称</th>
              <th>类型</th>
              <th>库存</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <CustomImg :image="d[var2LowerCase('rebate_goods')]['imageList'][0]" :size="{width: '60px', height: '60px' }" />
              </td>
              <td>
                <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: d[var2LowerCase('rebate_goods')]['id']}}" class="name">
                  {{ d[var2LowerCase('rebate_goods')]['name'] }}
                </router-link>
                <span v-else>{{ d[var2LowerCase('rebate_goods')]['name'] }}</span>
                <GoodsPrice :detail="d[var2LowerCase('rebate_goods')]" />
              </td>
              <td>
                {{ d[var2LowerCase('rebate_goods')]['typeName'] }}
              </td>
              <td>{{ d[var2LowerCase('rebate_goods')]['stockQuantity'] }}</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.unstock_rebate_enabled') }}</td>
      <td> {{ $t(`boolean[${d[var2LowerCase('unstock_rebate_enabled')]}]`) }} </td>
    </tr>
    <tr v-if="d[var2LowerCase('rebate_kind')] === 'rebater_scan'">
      <td> {{ $t('activities.rebater_attending_enabled') }} </td>
      <td> {{ $t(`boolean[${d[var2LowerCase('rebater_attending_enabled')]}]`) }} </td>
    </tr>
  </tbody>
</template>

<script>
import CustomImg from '@/components/Image/goods'
import GoodsPrice from '@/components/Goods/Price'
export default {
  components: {
    CustomImg,
    GoodsPrice
  },
  props: {
    d: {
      type: Object,
      default: () => {
        return {}
      }
    },
    activity: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
