<template>
  <tbody>
    <tr>
      <td>{{ $t('activities.region') }}</td>
      <td>
        {{
          d[var2LowerCase('region')] ?
            d[var2LowerCase('region')].length ? d[var2LowerCase('region_text')] : '无'
            : '无'
        }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.only_in_region') }}</td>
      <td>
        {{ $t(`boolean['${d[var2LowerCase('only_in_region')]}']`) }}
      </td>
    </tr>
    <tr v-if="activity.type !== 'Activity' && checkPer(['fleeing_manage'])">
      <!--
        <% if (!@activity.instance_of?(Activity)) && (can? :manage, Fleeings::ActivityFleeing) %>
        <%= d.field :region_notice do %>
          <%= t "boolean.#{@activity.region_notice}" %>
        <% end %>
      <% end %>
       -->
      <td>
        {{ $t('activities.region_notice') }}
      </td>
      <td>
        {{ $t(`boolean['${d[var2LowerCase('region_notice')]}']`) }}
      </td>
    </tr>
  </tbody>
</template>

<script>
import dict_region from '@/api/dict_region'

export default {
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
  },
  data() {
    return {
      text: null
    }
  },
  mounted() {
    if (this.d.region.length) {
      dict_region.tree_duplicate(this.d.region).then(response => {
        this.d.regionText = response.data.map(item => item.name).join(', ')
      })
    }
  }
}
</script>
