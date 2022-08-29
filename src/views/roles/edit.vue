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
              <el-radio value="all" label="全部订单">全部订单</el-radio>
              <el-radio value="own" label="可见活动订单">可见活动订单</el-radio>
            </el-radio-group>
          </el-form-item>
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
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '角色列表', path: { name: 'RoleIndex' }},
      { title: `${this.$route.name === 'RoleEdit' ? '编辑' : '新建'}角色` }
    ])
    crudsRole.show(this.$route.params).then(response => {
      console.log(response)
    })
  }
}
</script>
