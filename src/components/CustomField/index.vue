<template>
  <div>
    <component :is="data.customField.type.replace('::','')" :data="data" :product-size="productSize" />
  </div>
</template>

<script>
import CustomFieldCitizenId from './Citizenid'
import CustomFieldString from './String'
import CustomFieldSelect from './Select'
import CustomFieldCheckBoxes from './Checkboxes'
import CustomFieldPicture from './Picture'
import CustomFieldCamera from './Picture'
import CustomFieldAddress from './Address'
import CustomFieldGender from './Gender'

export default {
  components: {
    CustomFieldCitizenId,
    CustomFieldString,
    CustomFieldSelect,
    CustomFieldCheckBoxes,
    CustomFieldPicture,
    CustomFieldCamera,
    CustomFieldAddress,
    CustomFieldGender
  },
  props: {
    data: {
      type: Object,
      default: () => { return {} }
    },
    productSize: {
      type: Number,
      default: 30
    }
  }
}
</script>
