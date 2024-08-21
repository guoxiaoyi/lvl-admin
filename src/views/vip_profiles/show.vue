<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 会员详情 </a>
      </li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="panel-body table-responsive">
        <table v-if="Object.keys(result).length" class="table table-loose table-hover">
          <tr>
            <td>头像</td>
            <td><el-image :src="result.avatar" style="width: 50px" /></td>
          </tr>
          <tr>
            <td>昵称</td>
            <td>
              {{ result.nickname }}
              <el-tag v-if="result.inBlacklist" type="info" effect="dark">黑名单</el-tag>
            </td>
          </tr>
          <tr>
            <td>姓名</td>
            <td>{{ result.name }}</td>
          </tr>
          <tr>
            <td>手机号</td>
            <td>{{ result.phone }}</td>
          </tr>
          <tr v-for="(item, index) in result.customFieldValues" :key="'custom_field_'+index">
            <td>{{ item.customField.label }}</td>
            <td>
              <CustomField :data="item" />
            </td>
          </tr>
          <tr>
            <td>公众号</td>
            <td>{{ result.subscribed ? '已关注' : '未关注' }}</td>
          </tr>
          <tr v-if="vipFuncEnabled">
            <td>会员等级</td>
            <td>{{ result.vipLevelName }}</td>
          </tr>
          <tr>
            <td>成长值</td>
            <td>{{ result.vipXpBalance }}</td>
          </tr>
          <tr>
            <td>注册时间</td>
            <td>{{ result.createdAt }}</td>
          </tr>
          <tr>
            <td>标签</td>
            <td>{{ result.tags.map(item => item.name).join(', ') }}</td>
          </tr>
          <tr>
            <td>更多信息</td>
            <td><router-link :to="{ name: 'UserShow', params: { userId: result.userId } }">查看详情</router-link></td>
          </tr>
        </table>
      </div>
      <div v-if="checkPer(['vip_registers_manage'])" class="panel-footer">
        <el-button type="success" @click="toEdit"> 修改 </el-button>
        <el-button v-if="!result.inBlacklist" type="danger" @click="joinBlackList"> 加入黑名单 </el-button>
        <el-button v-else type="success" @click="removeBlacklist"> 移除黑名单 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vip_profiles from '@/api/vip_profiles'
import CustomField from '@/components/CustomField'
import user from '@/api/user'
import point_store from '@/api/point_store'
export default {
  components: {
    CustomField
  },
  data() {
    return {
      result: {},
      vipFuncEnabled: false
    }
  },
  async mounted() {
    await vip_profiles.get(this.$route.params).then(response => {
      this.result = response.data
    })
    await point_store.functions().then(response => {
      this.vipFuncEnabled = response.data.vipFuncEnabled
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '会员列表', path: { name: 'VipProfilesIndex' }}, { title: this.result.name }])
  },
  methods: {
    toEdit() {
      this.$router.push({ name: 'UserEdit', params: { userId: this.result.userId }})
    },
    joinBlackList() {
      if (confirm('确定将该用户加入黑名单吗？')) {
        user.join_blacklist({ id: this.result.userId }).then(response => {
          this.$router.push({ name: 'UserShow', params: { userId: this.result.userId }})
        })
      }
    },
    removeBlacklist() {
      if (confirm('确定将该用户移除黑名单吗？')) {
        user.remove_blacklist({ id: this.result.userId }).then(response => {
          this.$router.push({ name: 'UserShow', params: { userId: this.result.userId }})
        })
      }
    }
  }
}
</script>
