<template>
  <div class="panel panel-default new-show">
    <div class="panel-heading">
      <h5>活动信息</h5>
    </div>

    <div class="panel-body">
      <table class="table table-loose table-hover">
        <tr>
          <td>{{ $t('activities.title') }}</td>
          <td>
            <router-link :to="{ name: 'ActivityShow', params: { activityId: activity.id }}">
              {{ activity.name }}
            </router-link>
          </td>
        </tr>
        <template v-if="Object.keys(unit.award).length && Object.keys(award).length">
          <tr>
            <td>奖项名称</td>
            <td>{{ award.title }}</td>
          </tr>
          <tr>
            <td>奖品</td>
            <td class="table-responsive">
              <table id="" class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>图片</th>
                    <th>名称</th>
                    <th>类型</th>
                    <th>库存</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="good">
                    <td>
                      <CustomImg v-if="good.imageList" :image="good.imageList[0]" :size="{width: '60px', height: '60px' }" />
                    </td>
                    <td class="line-break-enable good-name-td">
                      <p class="good-name">
                        <router-link :to="{ name: 'GoodsShow', params: { goodsId: good.id }}">
                          {{ good.name }}
                        </router-link>
                      </p>
                      <span class="text-muted">
                        <GoodsPrice :detail="good" />
                      </span>
                    </td>
                    <td>
                      {{ good.showName }}
                    </td>
                    <td>{{ good.stockQuantity }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <template v-if="unit.takenAt && unit.awardOrder">
            <tr>
              <td>兑奖状态</td>
              <td>{{ award.type }}</td>
            </tr>
            <tr>
              <td>订单</td>
              <td>{{ award.type }}</td>
            </tr>
            <tr>
              <td>扫码用户</td>
              <td>{{ award.type }}</td>
            </tr>
          </template>
        </template>
      </table>
    </div>
  </div>

</template>

<script>
import GoodsPrice from '@/components/Goods/Price'
import CustomImg from '@/components/Image/goods'
export default {
  components: {
    GoodsPrice,
    CustomImg
  },
  props: {
    activity: {
      type: Object,
      default: () => {
        return {}
      }
    },
    award: {
      type: Object,
      default: () => {
        return {}
      }
    },
    good: {
      type: Object,
      default: () => {
        return {}
      }
    },
    unit: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style>

</style>
