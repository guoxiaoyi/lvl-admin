<template>
  <table class="table table-loose table-hove">
    <tr>
      <td>卡券领取链接</td>
      <td>
        <a :href="detail.url" target="_blank">{{ detail.url }}</a>
      </td>
    </tr>
  </table>
</template>
<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
