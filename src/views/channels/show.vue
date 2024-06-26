<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default new-show">
      <div class="panel-body table-responsive">
        <h5>基本信息</h5>
        <hr>
        <table class="table table-loose table-hover">
          <tr>
            <td>名称</td>
            <td>{{ channel.name }}</td>
          </tr>
          <tr>
            <td>代码</td>
            <td>{{ channel.code }}</td>
          </tr>
          <tr>
            <td>类型</td>
            <td>{{ channel.typeName }}</td>
          </tr>
          <tr>
            <td>添加时间</td>
            <td>{{ channel.createdAt }}</td>
          </tr>
        </table>
        <h5>负责人信息</h5>
        <hr>
        <table class="table table-loose table-hover">
          <tr>
            <td>联系人</td>
            <td>{{ channel.contact }}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{ channel.phone }}</td>
          </tr>
        </table>
        <h5>渠道信息</h5>
        <hr>
        <table class="table table-loose table-hover">
          <tr v-if="channel.parentChannel">
            <td>所属上级</td>
            <td>
              <router-link :to="{name: 'ChannelShow', params: {id: channel.parentChannel.id}}">{{ channel.parentChannel.name }}</router-link>
            </td>
          </tr>

          <tr>
            <td>业务范围</td>
            <td>{{ channel.regionScopeName ? channel.regionScopeName.join(',') : '-' }}</td>
          </tr>
          <tr>
            <td>认领状态</td>
            <td>{{ channel.registeredAt ? '已认领' : '未认领' }}</td>
          </tr>
          <tr v-if="channel.registeredAt">
            <td>认领时间</td>
            <td>{{ channel.registeredAt }}</td>
          </tr>
          <tr>
            <td>返利状态</td>
            <td>
              <span class="label" :class="[ channel.stopRebate ? 'label-paused' : 'label-enabled']">
                {{ channel.stopRebate ? '暂停' : '正常' }}
              </span>
              <span class="label" :class="[ channel.stopRebate ? 'label-success' : 'label-danger']" @click="stopRebate">{{ channel.stopRebate ? '开启' : '停止' }}返利</span>
            </td>
          </tr>
          <tr>
            <td>所在地</td>
            <td>{{ channel.addr }}</td>
          </tr>
          <tr>
            <td>地址</td>
            <td>{{ channel.provinceName }} {{ channel.cityName }} {{ channel.districtName }}</td>
          </tr>
          <tr>
            <td>地图</td>
            <td>
              <div v-if="channel.lon && channel.lat" class="map">
                <img :src="map_picture(channel.lat, channel.lon)" style="border-radius: 10px;">
                <a :href="qq_map_url(channel.lat, channel.lon, channel.name, channel.addr)" class="btn map-btn" target="_blank">查看地图</a>
              </div>
            </td>
          </tr>
        </table>
        <h5>其他信息</h5>
        <hr>
        <table class="table table-loose table-hover">
          <tr v-for="(item, index) in channel.customFieldValues" :key="index">
            <td>{{ item.customField.label }}</td>
            <td v-if="['CustomField::CheckBoxes', 'CustomField::CheckBoxes'].includes(item.customField.type)">
              {{ item.valueList ? item.valueList.join() : '' }}
            </td>
            <td v-if="['CustomField::Select', 'CustomField::String'].includes(item.customField.type)">
              {{ item.value }}
            </td>
            <td v-if="['CustomField::Picture', 'CustomField::Camera'].includes(item.customField.type)">
              <a :href="item.pictureUrl" target="_blank" class="activity_forms_image_a">
                <img :src="item.pictureUrl" style="width: 30px;">
              </a>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>{{ channel.note || '-' }}</td>
          </tr>
        </table>
      </div>

      <div v-if="checkPer(['channel_list'])" class="panel-footer">
        <router-link :to="{name: 'ChannelEdit', params: {id: channel.id}}" class="el-button el-button--success el-button--small">
          修改
        </router-link>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeAddQrAlert"
      :visible="dialogShow"
      :title="channel.stopRebate ? '开启返利' : '停止返利'"
      width="660px"
    >
      <div class="flex justify-content__center direction-column">
        <p>{{ channel.stopRebate ? '开启返利后，渠道将恢复正常返利（如：入库返利及导购返利），确定启用返利吗？' : '停止返利，将停止本渠道全部入库返利及导购返利' }}</p>
      </div>

      <div class="text-center" style="margin: 40px 0 10px 0;">
        <el-button type="success" :loading="confirmStopRebateIng" @click="confirmStopRebate">确定</el-button>
        <el-button @click="closeAddQrAlert">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import channels from '@/api/channels'

import tab from '@/components/Tabs/channel_show.vue'
export default {
  components: {
    tab
  },
  data() {
    return {
      channel: { },
      dialogShow: false,
      confirmStopRebateIng: false
    }
  },
  async mounted() {
    await channels.get(this.$route.params).then(response => {
      this.channel = response.data
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '渠道列表', path: { name: 'ChannelSearch' }},
      { title: this.channel.name },
      { title: '渠道详情', path: { name: 'ChannelShow', query: { id: this.channel.id }}}
    ])
  },
  methods: {
    stopRebate() {
      this.dialogShow = true
    },
    closeAddQrAlert() {
      if (this.confirmStopRebateIng) {
        return
      }
      this.dialogShow = false
    },
    confirmStopRebate() {
      this.confirmStopRebateIng = true
      channels.toggle_stop_rebate(this.$route.params).then(response => {
        this.channel.stopRebate = !this.channel.stopRebate
        this.dialogShow = false
        this.confirmStopRebateIng = false
      }).catch(fail => {
        this.confirmStopRebateIng = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  position: relative;
  width: 400px;
  height: 200px;
  .map-btn {
    position: absolute;
    right: 0;
    bottom: 0;
    background: #999;
    color: #FFF;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.428571429;
  }
}
.label {
  cursor: pointer;
}
</style>
