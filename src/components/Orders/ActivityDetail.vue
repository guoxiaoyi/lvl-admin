<template>
  <div v-if="order.activity" class="order-desc" style="border-right: 1px white solid;">
    <h4>活动信息</h4>
    <div class="info-row">
      <div>
        <p class="title">活动标题:</p>
        <p>
          <router-link v-if="checkPer(['activity_read'])" :to="{ name: 'ActivityShow', params: { activityId: order.activity.id }}">{{ order.activity.title }}</router-link>
          <template v-else>{{ order.activity.title }}</template>
        </p>
      </div>
      <div>
        <p class="title">导购返利订单:</p>
        <p>
          <a v-if="order.rebateOrderId" :href="'/admin/rebate_orders/' + order.rebateOrderCode">
            {{ order.rebateOrderCode }}
          </a>
          <template v-else>
            -
          </template>
        </p>
      </div>
      <div v-if="order.unitSnText">
        <p class="title">二维码序号:</p>
        <p>{{ order.unitSnText }}</p>
      </div>

      <div v-if="order.customFieldValues.length > 0 ">
        <p class="title">活动表单:</p>
        <table>
          <tbody>
            <tr v-for="item in order.customFieldValues" :key="item.id">
              <td>{{ item.customField.label }}</td>
              <td style="padding-left: 10px;">
                <template v-if="['CustomField::Picture', 'CustomField::Camera'].includes(item.customField.type)">
                  <el-image :src="item.pictureUrl" fit="fit" class="activity_forms_image" :preview-src-list="[item.pictureUrl]" />
                </template>
                <template v-else>
                  {{ item.value }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
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
