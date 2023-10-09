<!-- 
  <% if @store.advanced_user_mgr_func? && @store.whitelist_phones.any? %>
    <%= d.field :whitelist_phone_enabled do %>
      <%= t @activity.whitelist_phone_enabled.to_s %>
    <% end %>
  <% end %>

  <%= d.field :attend_limit_condition do %>
    <%= @activity.attend_limit_condition.text %>
  <% end %>

  <% if @activity.attend_limit_condition.by_tag? %>
    <%= d.field :allowed_tags do %>
      <% if @activity.allowed_tags.present? %>
        <%= @activity.store.user_tags.where(id: @activity.allowed_tags).pluck(:name).join("，") %>
      <% else %>
        无（全部）
      <% end %>
    <% end %>
    <%= d.field :disallowed_tag do %>
      <% if @activity.disallowed_tag.present? %>
        <%= @activity.store.user_tags.where(id: @activity.disallowed_tag).pluck(:name).join("，") %>
      <% else %>
        无
      <% end %>
    <% end %>
  <% elsif @activity.attend_limit_condition.by_channel_type? %>

  <% elsif @activity.attend_limit_condition.by_vip_level? %>
    <%= d.field :vip_level_ids do %>
      <%= @activity.vip_levels.pluck(:label).join("，") %>
    <% end %>
  <% end %>

  <%= d.field :disallowed_url %>
-->
<template>
  <tbody>
    <tr>
      <td>
        {{ $t('activities.whitelist_phone_enabled') }}</td>
      <td>{{ $t(`boolean['${d[var2LowerCase('whitelist_phone_enabled')]}']`) }}</td>
    </tr>
    <tr>
      <td>{{ $t('activities.attend_limit_condition') }}</td>
      <td>{{ $t(`activities.attrbutes.attend_limit_condition['${d[var2LowerCase('attend_limit_condition')]}']`) }}</td>
    </tr>
    <template v-if="d[var2LowerCase('attend_limit_condition')] === 'by_tag'">
      <tr>
        <td>{{ $t('activities.allowed_tags') }}</td>
        <td v-if="d[var2LowerCase('allowed_tags')] && d[var2LowerCase('allowed_tags')].length">
          {{ d[var2LowerCase('allowed_tag_names')].join(',') }}
        </td>
        <td v-else>
          无（全部）
        </td>
      </tr>
      <tr>
        <td>{{ $t('activities.disallowed_tag') }}</td>
        <td v-if="d[var2LowerCase('disallowed_tag')] && d[var2LowerCase('disallowed_tag')].length">
          {{ d[var2LowerCase('disallowed_tag_names')].join(',') }}
        </td>
        <td v-else>
          无
        </td>
      </tr>
    </template>
    <template v-else-if="d[var2LowerCase('attend_limit_condition')] === 'by_channel_type'">
      <tr v-if="activity.type !== 'SharingActivity'">
        <td>
          {{ $t('activities.wx_miniprogram_attend_enabled') }}
        </td>
        <td>
          {{ $t(`boolean['${d[var2LowerCase('wx_miniprogram_attend_enabled')]}']`) }}
        </td>
      </tr>
      <tr>
        <td> {{ $t('activities.allowed_channel_types') }} </td>
        <td v-if="d[var2LowerCase('allowed_channel_types')] && d[var2LowerCase('allowed_channel_types')].length">
          {{ d[var2LowerCase('allowed_channel_type_names')].join(',') }}
        </td>
        <td v-else>
          无（全部）
        </td>
      </tr>
    </template>
    <template v-else-if="d[var2LowerCase('attend_limit_condition')] === 'by_vip_level'">
      <tr>
        <td>{{ $t('activities.vip_level_ids') }}</td>
        <td>
          {{ d[var2LowerCase('vip_level_names')] ? d[var2LowerCase('vip_level_names')].join(',') : '' }}
        </td>
      </tr>
    </template>
    <tr>
      <td>{{ $t('activities.disallowed_url') }}</td>
      <td>{{ d[var2LowerCase('disallowed_url')] }}</td>
    </tr>
  </tbody>
</template>
<script>
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
  computed: {
    regionText() {
      return this.d[this.var2LowerCase('region')].join(',')
    }
  }
}
</script>
