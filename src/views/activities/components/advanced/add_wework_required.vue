<template>
  <tbody>
    <tr>
      <td> {{ $t('activities.add_wework_before_attending') }} </td>
      <td> {{ $t(`activities.attrbutes.add_wework_before_attending.${d[var2LowerCase('add_wework_before_attending')]}`) }} </td>
    </tr>
    <tr>
      <td>{{ $t('activities.wework_contact_user') }}</td>
      <td class="table-responsive">
        <table id="wework_contact_user_table" class="table table-bordered table-hover" style="width: 600px">
          <thead>
            <tr>
              <th>姓名</th>
              <th>负责区域</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="we_contact_user in weworkContactUsers" :key="we_contact_user.userid" class="weworks_user">
              <td>{{ we_contact_user.name }}</td>
              <td width="300">{{ we_contact_user.regionScopeText.map(i => i.name).join(', ') }}</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        {{ $t('activities.wework_add_kind') }}
      </td>
      <td>
        {{ $t(`activities.attrbutes.wework_add_kind.${d[var2LowerCase('wework_add_kind')]}`) }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.wework_add_tags') }}</td>
      <td>
        {{ d[var2LowerCase('wework_add_tag_names')] && d[var2LowerCase('wework_add_tag_names')].join(',') }}
      </td>
    </tr>
  </tbody>
</template>
<script>
import we_work_users from '@/api/we_work_users'
export default {
  props: {
    d: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      weworkContactUsers: []
    }
  },
  mounted() {
    we_work_users.v2_list({ useridIn: this.d.weworkContactUser }).then(({ data }) => {
      this.weworkContactUsers = data.content
    })
  }
}
</script>
