<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default new-show">

      <div class="panel-body table-responsive">
        <table v-if="Object.keys(result).length" class="table table-loose table-hover">
          <tr label="出库单号">
            <td>出库单号</td>
            <td>{{result.code}}</td>
          </tr>
          <tr label="出库类型">
            <td>出库类型</td>
            <td>{{result.inOutTypeName}}</td>
          </tr>
          <tr label="出库时间">
            <td>出库时间</td>
            <td> {{result.completed_at || '-'}} </td>
          </tr>
          <tr label="创建时间">
            <td>创建时间</td>
            <td>{{result.createdAt}}</td>
          </tr>
          <tr label="发货方">
            <td>发货方</td>
            <td>
              <router-link :to="{name: 'ChannelShow', params: {id: result.outChannel.id}}">
                {{result.outChannel.name}}
              </router-link>
            </td>
          </tr>
          <tr label="收货方">
            <td>收货方</td>
            <td>
              <router-link :to="{name: 'ChannelShow', params: {id: result.inChannel.id}}">
                {{result.inChannel.name}}
              </router-link>
            </td>
          </tr>
          <tr label="状态">
            <td>状态</td>
            <td>
              <el-tag :type="result.state | tag_type" effect="plain"> {{result.stateName}} </el-tag>
            </td>
          </tr>
          <tr label="操作人">
            <td>操作人</td>
            <td> {{result.operatorName}} </td>
          </tr>
          <tr label="备注">
            <td>备注</td>
            <td> {{result.note || '-'}} </td>
          </tr>
        </table>
      </div>

      <div class="panel-footer" style="display: flex; justify-content: space-between;">
        <div>
          <router-link
            v-if="result.canCancel"
            :to="{name: 'TChannelOutReceiptEdit',
            params: {id: $route.params.id}}"
            class="el-button el-button--default el-button--small">
            撤单
          </router-link>
          <router-link
            v-else
            :to="{name: 'TChannelOutReceiptEdit',
            params: {id: $route.params.id}}"
            class="el-button el-button--default el-button--small">
            修改
          </router-link>
          <router-link
            v-if="!result.canCancel"
            :to="{name: 'TChannelOutReceiptTunitNew',
            params: {id: $route.params.id}}"
            class="el-button el-button--success el-button--small">
            添加产品
          </router-link>
        </div>
        <el-button v-if="result.canExecute" type="success" @click="finished">完成出库</el-button>
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
      {title: '出库详情'}
    ])
    t_channel_receipt.show(this.$route.params.id).then(response => {
      this.result = response.data
    })
  },
  methods: {
    finished() {
      if(confirm('确认完成出库吗?')) {
        t_channel_receipt.execute(this.$route.params.id).then(response => {
          console.log(response)
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
</style>
