<template>
  <div class="app-container">
    <div class="panel panel-default new-show">
      <div class="flex" style="padding: 32px">
        <PhonePreview />
        <div class="editor" style="margin-left: 74px;">
          <table v-if="Object.keys(item).length" class="table table-loose table-hover">
            <tr>
              <td>任务名称</td>
              <td> {{ item.name }} </td>
            </tr>
            <tr>
              <td>发送范围</td>
              <td> {{ item.chatTypeName }} </td>
            </tr>
            <tr>
              <td>发送方式</td>
              <td> {{ item.pushTypeName }} </td>
            </tr>
            <tr>
              <td>发送时间</td>
              <td> {{ item.sendTime }} </td>
            </tr>
            <tr>
              <td>消息文本</td>
              <td> {{ item.messageContent }} </td>
            </tr>
            <tr>
              <td>消息文本</td>
              <td>
                <div style="max-width: 600px;">
                  <WeWorkAssets :limit="9" mode="list" />
                </div>
              </td>
            </tr>
            <tr>
              <td>数据统计</td>
              <td>
                <div class="states">
                  <dl>
                    <dt>已发送员工</dt>
                    <dd> {{ states.sentUserCount }} </dd>
                  </dl>
                  <dl>
                    <dt>送达客户</dt>
                    <dd>{{ states.sentCount }}</dd>
                  </dl>
                  <dl>
                    <dt>未发送员工</dt>
                    <dd>{{ states.sendingUserCount }}</dd>
                  </dl>
                  <dl>
                    <dt>未送达客户</dt>
                    <dd>{{ states.sendingCount }}</dd>
                  </dl>
                  <dl>
                    <dt>客户接收已达上限</dt>
                    <dd> {{ states.receivedOtherCount }}</dd>
                  </dl>
                  <dl>
                    <dt>因不是好友发送失败</dt>
                    <dd>{{ states.notFriendCount }}</dd>
                  </dl>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import PhonePreview from '@/components/WeWorkAssets/phone.vue'
import WeWorkAssets from '@/components/WeWorkAssets'
import wework_group_message from '@/api/wework_group_message'
export default {
  provide() {
    return {
      _vm: this
    }
  },
  components: {
    PhonePreview,
    WeWorkAssets
  },
  data() {
    return {
      attachmentList: [],
      item: {},
      form: {
        content: ''
      },
      states: {}
    }
  },
  async mounted() {
    await wework_group_message.show(this.$route.params).then(response => {
      this.item = response.data
      this.form.content = response.data.messageContent
      this.attachmentList = response.data.attachments.map(i => {
        if (i.msgType === 'link') {
          return {
            mediaType: i.msgType,
            desc: i.linkDesc,
            title: i.linkTitle,
            url: i.linkUrl
          }
        } else {
          return {
            mediaFileName: i.mediaFileName,
            mediaType: i.msgType,
            id: i.mediaId,
            thum: (i.msgType === 'video' ? i.weworkMedia.imageUrl : i.weworkMedia.s3Url) }
        }
      })
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '群发消息', path: { name: 'WeworkGroupMessageIndex' }}, { title: this.item.name }])

    wework_group_message.statistics(this.$route.params).then(response => {
      this.states = response.data
    })
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.editor {
  flex: 1;
}
.states {
  display: flex;
  flex-wrap: wrap;
  dl, dd {
    margin: 0;
    padding: 0;
  }
  dl {
    width: 33.333%;
    padding: 10px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    dt {
      font-size: 16px;
      white-space: nowrap;
    }
    &+dl {
      // border-left: 1px solid #999;
    }
  }
}
</style>
