<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active"><a aria-current="page" href="javascript:void(0)">用户详情</a></li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="panel-body table-responsive">
        <table class="table table-loose">
          <tr>
            <td>ID</td>
            <td> {{ detail.id }} </td>
          </tr>
          <tr>
            <td>OpenId</td>
            <td> {{ detail.openid }} </td>
          </tr>
          <tr>
            <td>头像</td>
            <td>
              <el-image :src="detail.avatar" style="width: 50px">
                <img slot="error" :src="require('@/assets/avatar_small_missing.jpg')" style="width: 50px; vertical-align: middle;">
              </el-image>
            </td>
          </tr>
          <tr>
            <td>昵称</td>
            <td> {{ detail.nickname }} </td>
          </tr>
          <tr>
            <td>性别</td>
            <td> {{ detail.genderText }} </td>
          </tr>
          <tr>
            <td>用户标签</td>
            <td> {{ detail.tags.map( t => t.name).join(',') }} </td>
          </tr>
          <tr>
            <td>省份</td>
            <td> {{ detail.province }} </td>
          </tr>
          <tr>
            <td>姓名</td>
            <td> {{ detail.name }} </td>
          </tr>
          <tr>
            <td>手机号</td>
            <td> {{ detail.phone }} </td>
          </tr>
          <tr>
            <td>积分余额</td>
            <td>
              <el-button type="text" @click="editPoint(detail)">
                <i class="fa fa-edit" /> {{ detail.pointsBalance }}
              </el-button>
              <el-button type="success" size="mini" @click="$router.push({ name: 'PointsPrans', params: { userId: detail.id}})">积分记录</el-button></td>
          </tr>
          <tr>
            <td>累计积分</td>
            <td> {{ detail.totalPoints }} </td>
          </tr>
          <tr>
            <td>零钱</td>
            <td> {{ detail.cashBalance }} </td>
          </tr>
          <tr>
            <td>累计金额</td>
            <td> {{ detail.totalCash }} </td>
          </tr>
          <tr>
            <td>活动参与次数</td>
            <td> {{ detail.attendingsCount }} </td>
          </tr>
          <tr>
            <td>兑奖次数</td>
            <td> {{ detail.awardCollectedCount }} </td>
          </tr>
        </table>
      </div>
      <div v-if="checkPer(['user_read'])" class="panel-footer">
        <el-button type="success" @click="$router.push({ name: 'UserEdit', params: { ...$route.params }})"> 修改</el-button>
        <el-button v-if="!detail.inBlacklist" type="danger" @click="joinBlackList"> 加入黑名单 </el-button>
        <el-button v-else type="success" @click="removeBlacklist"> 移除黑名单 </el-button>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.user_point.show"
      title="修改积分"
      width="780px"
    >
      <el-form ref="point_form" :rules="modal.user_point.rules" :model="modal.user_point.form" size="small" label-width="80px">
        <el-form-item label="类型" prop="incr" class="incr">
          <el-radio-group v-model="modal.user_point.form.incr">
            <el-radio :label="true">增加</el-radio>
            <el-radio :label="false">减少</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="积分额" prop="amount">
          <el-input v-model.number="modal.user_point.form.amount" />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="modal.user_point.form.desc" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="modal.user_point.status === 1" @click="save_user_point">保存</el-button>
        <el-button @click="modal.user_point.show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import users from '@/api/user'
export default {
  data() {
    return {
      detail: {
        tags: []
      },
      modal: {
        user_point: {
          show: false,
          form: {
            incr: true,
            amount: null,
            desc: null
          },
          rules: {
            incr: [
              { required: true, message: '不能为空' }
            ],
            amount: [
              { required: true, message: '不能为空' }
            ]
          },
          status: 0
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户管理', path: { name: 'UserIndex' }},
      { title: '用户详情' }
    ])
    this.fetch()
  },
  methods: {
    fetch() {
      users.show(this.$route.params).then(response => {
        this.detail = response.data
      })
    },
    joinBlackList() {
      if (confirm('确定将该用户加入黑名单吗？')) {
        users.join_blacklist({ id: this.detail.id }).then(response => {
          this.$message.success('更新成功')
          this.fetch()
        })
      }
    },
    removeBlacklist() {
      if (confirm('确定将该用户移除黑名单吗？')) {
        users.remove_blacklist({ id: this.detail.id }).then(response => {
          this.$message.success('更新成功')
          this.fetch()
        })
      }
    },
    editPoint(data) {
      if (this.checkPer(['user_read'])) {
        this.modal.user_point.show = true
        this.modal.user_point.form.id = data.id
      }
    },
    save_user_point() {
      this.$refs.point_form.validate((valid) => {
        if (valid) {
          this.modal.user_point.status = 1
          users.edit_points(this.modal.user_point.form).then(response => {
            this.fetch()
            this.modal.user_point.show = false
            this.modal.user_point.status = 0
          }).catch(fail => {
            this.modal.user_point.status = 0
          })
        }
      })
    }
  }
}
</script>
