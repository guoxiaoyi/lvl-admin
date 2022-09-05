<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.name === 'RoleEdit' ? '编辑' : '新建' }}角色
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="查看兑奖订单" prop="visibleAwardOrdersKind">
            <el-radio-group v-model="form.visibleAwardOrdersKind">
              <el-radio :label="'all'">全部订单</el-radio>
              <el-radio :label="'own'">可见活动订单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开通权限" prop="permissions">
            <el-tree
              ref="menu"
              :data="permission"
              show-checkbox
              node-key="permission"
              :props="defaultProps"
            />
          </el-form-item>
          <hr>
          <el-button :loading="submitting" size="small" type="success" @click="submit"> 保存 </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import crudsRole from '@/api/role'
export default {
  data() {
    return {
      defaultProps: {
        children: 'permissions',
        label: 'name'
      },
      form: {
        name: null,
        permissions: [
          {
            dependentFunc: null,
            group: null,
            name: null,
            permission: null,
            position: 0
          }
        ],
        visibleAwardOrdersKind: 'all'
      },
      rules: {
      },
      permission: [],
      permissions: [],
      submitting: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '角色列表', path: { name: 'RoleIndex' }},
      { title: `${this.$route.name === 'RoleEdit' ? '编辑' : '新建'}角色` }
    ])
    if (this.$route.name === 'RoleEdit') {
      crudsRole.show(this.$route.params).then(response => {
        this.form = response.data
        this.permissions = response.data.permissions.map(m => m.permission)
        this.$refs.menu.setCheckedKeys(this.permissions)
      })
    }
    crudsRole.permission().then(response => {
      this.permission = response.data
    })
  },
  methods: {
    submit() {
      let action = this.$route.name === 'RoleEdit' ? 'edit' : 'add'
      this.form.permissions = this.$refs.menu.getCheckedNodes(true).map(item => { return { permission: item.permission } })
      if (this.$route.query.action === 'copy') {
        action = 'add'
        delete this.form.id
      }
      crudsRole[action](this.form).then(response => {
        this.$router.push({ name: 'RoleIndex' })
      })
    }
  }
}
</script>
