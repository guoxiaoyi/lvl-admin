<!--
  <%= d.field :third_party_leading_img do %>
  <%= image_tag(@activity.third_party_leading_img.url(:large),
                class: "img-thumbnail",
                size: "260x160") %>
<% end %>
<%= d.field :third_party_leading_title %>
<%= d.field :third_party_leading_desc %>
<%= d.field :third_party_leading_word %>
<%= d.field :third_party_leading_alert %>
-->

<template>
  <tbody>
    <tr>
      <td>{{ $t('activities.third_party_leading_img') }}</td>
      <td>
        <el-image
          :src="d[var2LowerCase('third_party_leading_img_url')]"
          :preview-src-list="[d[var2LowerCase('third_party_leading_img_url')]]"
          class="img-thumbnail"
          style="width: 260px;"
        />
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.third_party_leading_title') }}</td>
      <td>
        {{ d[var2LowerCase('third_party_leading_title')] }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.third_party_leading_desc') }}</td>
      <td>
        {{ d[var2LowerCase('third_party_leading_desc')] }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.third_party_leading_word') }}</td>
      <td>
        {{ d[var2LowerCase('third_party_leading_word')] }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.third_party_leading_alert') }}</td>
      <td>
        {{ d[var2LowerCase('third_party_leading_alert')] }}
      </td>
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
    }
  }
}
</script>
