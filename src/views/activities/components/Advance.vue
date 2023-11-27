<template>
  <div class="panel panel-default new-show">
    <div class="panel-heading">
      <h4 class="panel-title">
        高级设置
      </h4>
    </div>
    <div class="panel-body">
      <table class="table table-loose table-hover">
        <tbody>
          <Advanced v-for="item in templateList" :key="item" :attr="item" :column="advance" :activity="detail" :per="checkFuncPer(item)" />
          <tr v-if="!detail.parentId && detail.kind === 'normal' && account.store.accountsEnabled && account.main && account.store.accountNumber > 1 && advance.accountSet.length">
            <td>
              可见管理员
            </td>
            <td>
              {{ advance.accountSet.map(i => i.name).join(',') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-footer">
      <router-link v-if="checkPer(['activity_update'])" :to="{ name: 'ActivityAdvanceEdit', params: { ...$route.params }}" class="el-button el-button--success">
        <i class="fa fa-edit" />修改高级设置
      </router-link>
    </div>
  </div>
</template>

<script>
import activity_advance from '@/api/activity_advance'
import Advanced from './advanced/index.vue'

import { mapGetters } from 'vuex'

export default {
  components: {
    Advanced
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {
          page: {}
        }
      }
    }
  },
  data() {
    return {
      advance: {
        accountSet: [],
        regionText: null
      },
      defaultCheckedRegion: [],
      templateList: [
        'subscribe_required',
        'add_wework_required',
        'third_party_leading_enabled',
        'region_required',
        'attend_limit_enabled',
        'leading_enabled',
        'activity_form_enabled',
        'product_track_enabled',
        'scan_limit_alert_enabled',
        'rebate_enabled',
        'points_enabled'
      ]
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  async mounted() {
    await activity_advance.get({ id: this.$route.params.activityId }).then(({ data }) => {
      this.advance = { ...this.advance, ...data }
      this.defaultCheckedRegion = data.region
      // this.goodsModal.rebateGoods = data.rebateGoods || {}
    })
  },
  methods: {
    checkFuncPer(name) {
      return {
        subscribe_required: this.detail.page.ruleEnabled && (this.account.wechatProfile && this.account.wechatProfileServiceExpired === false),
        add_wework_required: this.checkPer(['wework_manage']) && this.account.wework && !['AntiFakeActivity'].includes(this.detail.type),
        third_party_leading_enabled: this.account.store.thirdPartyLeadingFuncEnabled && !['InvitingActivity', 'AntiFakeActivity'].includes(this.detail.type),
        region_required: !['AntiFakeActivity'].includes(this.detail.type),
        attend_limit_enabled: this.account.store.advancedUserMgrFunc,
        leading_enabled: this.detail.page.settingLeadingEnabled,
        activity_form_enabled: this.detail.page.customFieldsEnabled,
        product_track_enabled: this.detail.product && this.detail.unitsEnabled && this.account.store.productBatchEnabled,
        scan_limit_alert_enabled: this.detail.product && this.detail.unitsEnabled,
        rebate_enabled: this.account.store.rebateFuncEnabled && !['InvitingActivity', 'Activity'].includes(this.detail.type) && this.detail.awardEnabled,
        points_enabled: this.detail.page.ruleEnabled
      }[name]
    }
  }
}
</script>
