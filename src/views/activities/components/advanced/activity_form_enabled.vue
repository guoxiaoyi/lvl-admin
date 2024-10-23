<template>
  <tbody>
    <tr>
      <td>{{ $t('activities.custom_fields') }}</td>
      <td class="table-responsive">
        <table v-if="customFieldList.length" class="table table-bordered table-hover">
          <thead>
            <tr>
              <th>名称</th>
              <th>类型</th>
              <th>选项值</th>
              <th>必填</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in customFieldList" :key="f.id">
              <td>{{ f.label }}</td>
              <td>{{ f.kind | kind_text }}</td>
              <td>{{ f.options || '-' }}</td>
              <td>{{ f.required ? '是' : '否' }}</td>
            </tr>
          </tbody>
        </table>
        <span v-else>无</span>
      </td>
    </tr>
    <template v-if="customFieldList.length && !activity.page[var2LowerCase('only_form_before_attending')]">
      <tr>
        <td>
          {{ $t('activities.form_before_attending') }}
        </td>
        <td>
          {{ $t(`activities.attrbutes.form_before_attending['${d[var2LowerCase('form_before_attending')]}']`) }}
        </td>
      </tr>
      <tr v-if="!d[var2LowerCase('form_before_attending')]">
        <td>
          {{ $t('activities.form_with_awards_enabled') }}
        </td>
        <td>
          {{ $t(`activities.attrbutes.form_with_awards_enabled['${d[var2LowerCase('form_with_awards_enabled')]}']`) }}
        </td>
      </tr>
      <tr>
        <td>
          {{ $t('activities.activity_form_mode') }}
        </td>
        <td>
          {{ $t(`activities.attrbutes.activity_form_mode['${d[var2LowerCase('activity_form_mode')]}']`) }}
        </td>
      </tr>
      <tr>
        <td>
          {{ $t('activities.form_filling_mode') }}
        </td>
        <td>
          {{ $t(`activities.attrbutes.form_filling_mode['${d[var2LowerCase('form_filling_mode')]}']`) }}
        </td>
      </tr>
    </template>
  </tbody>
</template>
<script>
import custom_field from '@/api/v2_custom_field.js'
export default {
  filters: {
    kind_text(value) {
      return {
        name: '姓名',
        phonecode: '手机号(验证码)',
        string: '文字',
        phone: '手机号',
        select: '单选',
        checkboxes: '多选',
        picture: '图片',
        camera: '拍照',
        citizenid: '身份证号',
        thirdPartyCode: '三方验证码',
        thirdPartyCodeDeli: '三方验证码',
        address: '省市区',
        gender: '性别'
      }[value]
    }
  },
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
      customFieldList: []
    }
  },
  computed: {
    regionText() {
      return this.d[this.var2LowerCase('region')].join(',')
    }
  },
  mounted() {
    custom_field.get({ fieldableId: parseInt(this.$route.params.activityId), fieldableType: 'Activity' }).then(({ data }) => {
      this.customFieldList = data.filter(item => item.deletedAt === null)
    })
  }
}
</script>
