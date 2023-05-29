<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          新建批量核销单
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="被核销方">
            <el-select
              v-model="form.channelId"
              size="small"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in channel_parents_options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.channelId" label=" ">
            <el-table :data="goods" @selection-change="handleSelectionChange">
              <el-table-column label="全选" type="selection" width="55" />
              <el-table-column label="卡券名称" prop="goodName" />
              <el-table-column label="可用数量" prop="avaliableStock" />
              <el-table-column label="核销数量">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.quantity" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="form.note" type="textarea" />
          </el-form-item>
          <div v-if="checkPer(['coupon_verify_manage'])">
            <hr>
            <el-button type="success" :loading="submitting" @click="submit">创建核销单</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import channels from '@/api/channels'
import couponVerificationAudit from '@/api/couponVerificationAudit'
export default {
  data() {
    return {
      form: {
        channelId: null,
        note: ''
      },
      rules: {},
      searchLoading: false,
      channel_parents_options: [],
      goods: [],
      selected: [],
      origin: [],
      submitting: false
    }
  },
  watch: {
    'form.channelId'() {
      couponVerificationAudit.stock({ channelId: this.form.channelId, size: 500 }).then(response => {
        this.origin = response.data.content
        this.goods = response.data.content.map(i => {
          return { goodId: i.goodId, goodName: i.goodName, avaliableStock: i.avaliableStock, quantity: i.avaliableStock }
        })
      })
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '渠道核销记录', path: { name: 'CouponVerificationAuditsIndex' }},
      { title: '核销详情' }
    ])
    channels.all().then(response => {
      this.channel_parents_options = response.data
    })
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.channel_parents_options = response.data
          })
        }, 200)
      } else {
        this.channel_parents_options = []
      }
    },
    handleSelectionChange(value) {
      this.selected = value
    },
    submit() {
      if (this.selected.length === 0) {
        alert('请先选择核销商品')
        return false
      }
      let result = true
      this.selected.forEach(element => {
        if (element.quantity > this.origin.find(i => i.goodId === element.goodId)['avaliableStock']) {
          alert('核销商品数量不能大于可用数量')
          result = false
        }
        if (element.quantity <= 0) {
          alert('核销商品数量必须大于0')
          result = false
        }
      })
      if (result) {
        this.submitting = true
        couponVerificationAudit.apply({ ...this.form, goods: this.selected }).then(_response => {
          this.submitting = false
          this.$router.push({ name: 'CouponVerificationAuditsIndex' })
        }).catch(_error => {
          this.submitting = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-table {
    border: 1px solid #ddd;
  }
}
</style>