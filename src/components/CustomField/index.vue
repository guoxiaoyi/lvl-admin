<template>
  <div>
    <component :is="dynamicComponent" :data="data" :product-size="productSize" />
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
  },
  data() {
    return {
      componentTypes: [
        'CustomFieldCitizenId',
        'CustomFieldString',
        'CustomFieldSelect',
        'CustomFieldCheckBoxes',
        'CustomFieldPicture',
        'CustomFieldCamera',
        'CustomFieldAddress',
        'CustomFieldGender'
      ]
    }
  },
  computed: {
    dynamicComponent() {
      const typeName = this.data.customField && this.data.customField.type
        ? this.data.customField.type.replace('::', '')
        : ''
      // 检查类型名是否存在于 componentTypes 数组中，如果不存在，则默认为 'CustomFieldString'
      if (this.componentTypes.includes(typeName)) {
        return typeName
      }
      return 'CustomFieldString'
    }
  }
}
</script>
