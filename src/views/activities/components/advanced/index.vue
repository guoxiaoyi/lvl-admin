<template>
  <tr v-if="per">
    <td>
      {{ $t(`activities['${attr}']`) }}
    </td>
    <td class="table-responsive">
      <template v-if="column[var2LowerCase(attr)]">
        <table class="table table-loose table-hover">
          <component :is="attr" :d="column" :activity="activity" />
        </table>
      </template>
      <template v-else>
        否
      </template>
    </td>
  </tr>
</template>

<script>
import subscribe_required from './subscribe_required.vue'
import region_required from './region_required.vue'
import add_wework_required from './add_wework_required.vue'
import third_party_leading_enabled from './third_party_leading_enabled.vue'
import attend_limit_enabled from './attend_limit_enabled.vue'
import leading_enabled from './leading_enabled.vue'
import activity_form_enabled from './activity_form_enabled.vue'
import product_track_enabled from './product_track_enabled.vue'
import scan_limit_alert_enabled from './scan_limit_alert_enabled.vue'
import rebate_enabled from './rebate_enabled.vue'
import points_enabled from './points_enabled.vue'
import warranty_card_enabled from './warranty_card_enabled.vue'
export default {
  components: {
    subscribe_required,
    region_required,
    add_wework_required,
    third_party_leading_enabled,
    attend_limit_enabled,
    leading_enabled,
    activity_form_enabled,
    product_track_enabled,
    scan_limit_alert_enabled,
    rebate_enabled,
    points_enabled,
    warranty_card_enabled
  },
  props: {
    column: {
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
    },
    attr: {
      type: String,
      default: ''
    },
    k: {
      type: String,
      default: ''
    },
    per: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      iii: []
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .table-responsive {
    .table {
      margin-bottom: 0;
    }
  }
}
</style>
