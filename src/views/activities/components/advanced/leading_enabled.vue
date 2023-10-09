
<template>
  <tbody>
    <tr>
      <td>{{ $t('activities.leading_img') }}</td>
      <td>
        <el-image
          :src="d[var2LowerCase('leading_img_url')]"
          :preview-src-list="[d[var2LowerCase('leading_img_url')]]"
          class="img-thumbnail"
          style="width: 260px;"
        />
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.leading_title') }}</td>
      <td>
        {{ d[var2LowerCase('leading_title')] }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.leading_url') }}</td>
      <td>
        {{ d[var2LowerCase('leading_url')] || '-' }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.leading_auto_redirect') }}</td>
      <td>
        {{ $t(`boolean['${d[var2LowerCase('leading_auto_redirect')]}']`) }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.leading_desc') }}</td>
      <td>
        {{ d[var2LowerCase('leading_desc')] || '-' }}
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
