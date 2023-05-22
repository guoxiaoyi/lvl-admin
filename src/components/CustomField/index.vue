<template>
  <div>
    <component :is="data.customField.type.replace('::','')" :data="data" />
  </div>
</template>

<script>
import CustomFieldCitizenId from './Citizenid'
import CustomFieldString from './String'
import CustomFieldSelect from './Select'
import CustomFieldCheckBoxes from './Checkboxes'
import CustomFieldPicture from './Picture'
import CustomFieldAddress from './Address'

export default {
  components: {
    CustomFieldCitizenId,
    CustomFieldString,
    CustomFieldSelect,
    CustomFieldCheckBoxes,
    CustomFieldPicture,
    CustomFieldAddress
  },
  props: {
    data: {
      type: Object,
      default: () => { return {} }
    }
  }
}
</script>

<style>

</style>
