<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default new-show">

      <div class="panel-body table-responsive">
        <table v-if="Object.keys(result).length" class="table table-loose table-hover">
          <tr label="入库单号">
            <td>入库单号</td>
            <td>{{ result.code }}</td>
          </tr>
          <tr label="入库类型">
            <td>入库类型</td>
            <td>{{ result.inOutTypeName }}</td>
          </tr>
          <tr label="入库时间">
            <td>入库时间</td>
            <td> {{ result.completed_at || '-' }} </td>
          </tr>
          <tr label="创建时间">
            <td>创建时间</td>
            <td>{{ result.createdAt }}</td>
          </tr>
          <tr label="发货方">
            <td>发货方</td>
            <td>
              <router-link v-if="result.outChannel" :to="{name: 'ChannelShow', params: {id: result.outChannel.id}}">
                {{ result.outChannel.name }}
              </router-link>
              <span v-else>-</span>
            </td>
          </tr>
          <tr label="收货方">
            <td>收货方</td>
            <td>
              <router-link :to="{name: 'ChannelShow', params: {id: result.inChannel.id}}">
                {{ result.inChannel.name }}
              </router-link>
            </td>
          </tr>
          <tr label="状态">
            <td>状态</td>
            <td>
              <span class="label label-pending ">{{ result.stateName }}</span>
            </td>
          </tr>
          <tr label="操作人">
            <td>操作人</td>
            <td> {{ result.operatorName }} </td>
          </tr>
          <tr label="备注">
            <td>备注</td>
            <td> {{ result.note || '-' }} </td>
          </tr>
        </table>
      </div>

      <div class="panel-footer" style="display: flex; justify-content: space-between;">
        <div>
          <router-link
            v-if="result.state === 'pending'"
            :to="{name: 'TChannelInReceiptEdit',
                  params: {id: $route.params.id}}"
            class="el-button el-button--default el-button--small"
          >
            修改
          </router-link>
          <router-link
            v-if="result.state === 'pending'"
            :to="{name: 'TChannelInReceiptTunitNew',
                  params: {id: $route.params.id}}"
            class="el-button el-button--success el-button--small"
          >
            添加产品
          </router-link>
        </div>
        <el-button v-if="result.canExecute" type="success" @click="finished">完成入库</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/t_channel_in_receipts'
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
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '入库单列表', path: { name: 'TChannelInReceiptIndex' }},
      { title: '入库详情' }
    ])
    t_channel_receipt.show(this.$route.params.id).then(response => {
      console.log(response.data)
      this.result = response.data
    })
  },
  methods: {
    finished() {
      if (confirm('确认完成入库吗?')) {
        t_channel_receipt.execute(this.$route.params.id).then(response => {
          console.log(response)
        })
      }
    }
  }
}
</script>
