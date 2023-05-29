<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'EmployeesShow'}"> <router-link :to="{name: 'EmployeesShow', params: {id: $route.params.id}}">员工详情</router-link> </li>
      <li> <a :href="`/admin/employees/${$route.params.id}/rebate_child_users`">关联详情</a> </li>
    </ul>
    <div class="panel panel-default">
      <div class="panne-body">
        <table v-if="employee.user" class="table table-loose table-hover">
          <tr>
            <td>头像</td>
            <td>
              <img :src="employee.user.avatar" width="50">
            </td>
          </tr>
          <tr>
            <td>昵称 </td>
            <td> {{ employee.user.nickname }} </td>
          </tr>
          <tr>
            <td>门店 </td>
            <td>
              <template v-if="employee.channel">
                {{ employee.channel.name }}
              </template>
              <template v-else>
                -
              </template>
            </td>
          </tr>
          <tr>
            <td>省份 </td>
            <td> {{ employee.user.province }}</td>
          </tr>
          <tr>
            <td> 姓名 </td>
            <td> {{ employee.user.name }}</td>
          </tr>
          <tr>
            <td> 手机号 </td>
            <td> {{ employee.user.phone }}</td>
          </tr>
          <tr v-for="(item, index) in employee.customFieldValues" :key="index">
            <td>{{ item.customField.label }}</td>
            <td v-if="['CustomField::CheckBoxes', 'CustomField::CheckBoxes'].includes(item.customField.type)">
              {{ item.valueList ? item.valueList.join() : '' }}
            </td>
            <td v-if="['CustomField::Select', 'CustomField::String', 'CustomField::CitizenId'].includes(item.customField.type)">
              {{ item.value }}
            </td>
            <td v-if="['CustomField::Picture', 'CustomField::Camera'].includes(item.customField.type)">
              <a :href="item.pictureUrl" target="_blank" class="activity_forms_image_a">
                <img :src="item.pictureUrl" style="width: 30px;">
              </a>
            </td>
          </tr>
          <tr v-if="employee.type === 'ChannelWorker'">
            <td>权限</td>
            <td>
              <el-checkbox-group v-model="employee.permission">
                <el-checkbox v-for="(item, index) in permissions" :key="index" :label="item.key">{{ item.value }}</el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
        </table>
        <div v-if="employee.type === 'ChannelWorker' && checkPer(['employee_manage'])" class="panel-footer">
          <el-button type="success" @click="save">保存</el-button>
          <el-button type="danger" @click="del">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import employee from '@/api/employee'
import account from '@/api/account'
export default {
  filters: {
    t(v) {
      return ({ female: '女', male: '男' }[v] || '未知')
    }
  },
  data() {
    return {
      employee: {},
      permissions: []
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '员工列表', path: { name: 'EmployeesIndex' }},
      { title: '员工详情' }
    ])
    await employee.get(this.$route.params).then(response => {
      this.employee = response.data
    })
    if (this.employee.type === 'ChannelWorker') {
      account.permissions().then(response => {
        this.permissions = response.data
      })
    }
  },
  methods: {
    save() {
      employee.edit({ permission: this.employee.permission, id: this.employee.id }).then(response => {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
      })
    },
    del() {
      if (confirm('确认删除吗?')) {
        employee.del({ id: this.employee.id }).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$router.push({ name: 'EmployeesIndex' })
        })
      }
    }
  }
}
</script>
