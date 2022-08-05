<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          出库完成
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="text-center">
          <div class="page-header">
            <h3 class="text-success"><i class="fa fa-check-circle"></i> 出库成功</h3>
            <p> {{result.createdAt}}出库开单成功<br> 出库数量 {{result.unitAmount}} </p>
          </div>
          <router-link :to="{name: 'TChannelOutReceiptShow', params: {id: result.id}}" class="el-button el-button--default el-button--small">
            <i class="fa fa-eye"></i> 查看出库详情
          </router-link>
          <router-link :to="{name: 'TChannelOutReceiptIndex'}" class="el-button el-button--success el-button--small">
            <i class="fa fa-list"></i> 返回列表
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/t_channel_out_receipts'
import t_channel_receipt from '@/api/t_channel_receipt'
export default {
  components: {
    tab
  },
  data() {
    return {
      result: {}
    }
  },
  filters: {
    tag_type(type) {
      return {pending: 'warning', completed: 'info', canceled: 'info'}[type]
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      {title: '出库单列表', path: {name: 'TChannelOutReceiptIndex'}},
      {title: '出库完成'}
    ])
    t_channel_receipt.show(this.$route.params.id).then(response => {
      this.result = response.data
    })
  },
  methods: {
    
  }
}
</script>
<style scoped lang="scss">
.page-header {
  margin: 0px 0px 10px;
  padding-bottom: 9px;
  border-bottom: 1px solid #ddd;
}
.text-success {
  color: #3c763d;
}
h3 {
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 10px;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.1;
}
</style>
