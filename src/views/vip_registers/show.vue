<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 审核详情 </a>
      </li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="panel-body table-responsive">
        <table v-if="Object.keys(result).length" class="table table-loose table-hover">
          <tr>
            <td>姓名</td>
            <td> {{ result.name }} </td>
          </tr>
          <tr>
            <td>手机号</td>
            <td> {{ result.phone }} </td>
          </tr>

          <tr v-for="(item, index) in result.customFieldValues" :key="'custom_field_'+index">
            <td>{{ item.customField.label }}</td>
            <td>
              <CustomField :data="item" />
            </td>
          </tr>

          <tr>
            <td>注册时间</td>
            <td> {{ result.createdAt }} </td>
          </tr>
          <tr>
            <td>标签</td>
            <td> {{ result.tags.map(item => item.name ).join(', ') }} </td>
          </tr>

        </table>
      </div>
      <div class="panel-footer">
        <el-button type="success" @click="pass"> 通过 </el-button>
        <el-button type="danger" @click="reject"> 拒绝 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vip_register from '@/api/vip_register'
import CustomField from '@/components/CustomField'
export default {
  components: {
    CustomField
  },
  data() {
    return {
      result: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '审核详情' }])
    vip_register.get({ id: this.$route.params.id }).then(response => {
      this.result = response.data
    })
  },
  methods: {
    pass() {
      if (confirm('确认通过此用户的会员注册吗？')) {
        vip_register.update_state({
          id: this.$route.params.id,
          state: 'enabled'
        }).then(response => {
          this.$router.push({ name: 'VipRegistersIndex' })
        })
      }
    },
    reject() {
      if (confirm('确认拒绝此用户的会员注册吗？')) {
        vip_register.update_state({
          id: this.$route.params.id,
          state: 'rejected'
        }).then(response => {
          this.$router.push({ name: 'VipRegistersIndex' })
        })
      }
    }
  }
}
</script>
