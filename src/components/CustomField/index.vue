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
import CustomFieldGender from './Gender'

export default {
  components: {
    CustomFieldCitizenId,
    CustomFieldString,
    CustomFieldSelect,
    CustomFieldCheckBoxes,
    CustomFieldPicture,
    CustomFieldAddress,
    CustomFieldGender
  },
  props: {
    data: {
      type: Object,
      default: () => { return {} }
    }
  }
}
</script>
