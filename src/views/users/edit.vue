<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 编辑用户 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="OpenID">
            {{ detail.openid }}
          </el-form-item>
          <el-form-item label="头像">
            <el-image :src="detail.avatar" style="width: 50px; overflow: visible;">
              <el-image slot="error" :src="require('@/assets/avatar_small_missing.jpg')" style="width: 50px; overflow: visible;" />
            </el-image>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="form.tagIds" placeholder="请选择" filterable clearable multiple>
              <el-option
                v-for="(item, index) in userTags"
                :key="index +'_tags'"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

          </el-form-item>
          <el-form-item label="选择渠道">
            <el-input v-model="form.channel" />
            <p class="help-block">列表中没有想要的渠道？<router-link :to="{ name: 'ChannelSearch' }" target="_blank">点击新建渠道</router-link></p>
          </el-form-item>
          <hr>
          <el-button type="success">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import user from '@/api/user'
import tags from '@/api/tag'
export default {
  data() {
    return {
      detail: {
        tags: []
      },
      userTags: [],
      form: {},
      rules: {}
    }
  },
  async mounted() {
    await user.show(this.$route.params).then(response => {
      const { data } = response
      this.detail = data
      this.form.tagIds = data.tags.map(t => t.id)
      this.form.name = data.name
      this.form.phone = data.phone
    })
    tags.all({ type: 'UserTag' }).then(response => {
      this.userTags = response.data
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户管理', path: { name: 'UserIndex' }},
      { title: this.detail.name, path: { name: 'UserShow', params: { userId: this.detail.id }}},
      { title: '用户详情' }
    ])
  }
}
</script>
