<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.meta.title }}
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <ul class="nav nav-pills" data-active-first="true" data-action="tab">
          <li role="tab" data-toggle="tab" :class="{active: active === 'all'}">
            <a href="javascript:void(0)" data-toggle="tab" aria-expanded="true" @click="active = 'all'">
              全部
            </a>
          </li>
          <li v-for="item in list" :key="item.kind+ '_tab'" role="tab" data-toggle="tab" :class="{active: active === item.kind }">
            <a href="javascript:void(0)" data-toggle="tab" aria-expanded="true" @click="active = item.kind">
              {{ item.name }}
            </a>
          </li>
        </ul>
        <div class="tab-content">
          <div v-for="item in list" :key="item.kind" class="tab-pane" :class="{active: active === 'all' || active == item.kind }">
            <h4>{{ item.name }}</h4>
            <div class="flex direction-row flex-wrap">
              <div v-for="(act, index) in item.pages" :key="index" class="col-2">
                <div class="admin-activity-item">
                  <div class="admin-activity-warp">
                    <div class="thumbnail">
                      <el-image :src="require('@/assets/page_cover_imgs/'+imageUrl(index)+'.png')" />
                      <div class="flex justify-content__space-between">
                        <div class="flex-item text-center" @click="createActivity(act, index)">
                          <i class="fa fa-plus-circle" /><br>新建
                        </div>
                        <div v-if="act.previewEnabled" class="flex-item text-center" @click="preview(index)">
                          <i class="fa fa fa-eye" /><br>预览
                        </div>
                      </div>
                    </div>
                    <div class="activity-title">
                      <div>
                        <h4>{{ act.name }}</h4>
                        <small v-if="!['AntiFake3Page','AntiFake4Page', 'AntiFakePage', 'AntiFake2Page', 'DistinguishGenuinePage'].includes(index)">
                          最大奖项数量: {{ act.maxAwardsLength }}
                          <template v-if="account.store.childGoodFuncEnabled && act.childGoodEnabled">
                            <br>
                            支持附加奖项
                          </template>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.kind === 'extra'" class="col-2">
                <div class="admin-activity-item">
                  <div class="admin-activity-warp">
                    <div class="thumbnail">
                      <div class="activite-blank-img">
                        <img src="/assets/admin/page_cover_imgs/blank-8cf76eb2fe8527d5f0e389be69c5ba6c7c764fd650ad4fbb2e839b5b745be6f0.png" alt="Blank">
                        <div class="desc">如需定制活动模板，请联系<br>您的客户经理</div>
                      </div>
                    </div>
                    <div class="activity-title" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show"
      :before-close="handlerClose"
      width="680px"
      title="选择活动类型"
      top="10vh"
    >
      <div class="flex flex-wrap">
        <div v-for="item in types" :key="item.link" class="activity_klass_item">
          <img :src="require(`@/assets/activity_cover_imgs/${imageUrl(item.type)}_${item.kind}.png`)">
          <h4>{{ item.name }}</h4>
          <p>{{ $t(`page.page_new_modal_form.${item.type}_${item.kind}`) }}</p>
          <router-link :to="{ name: 'ActivityNew', query: { kind: item.kind, type: item.type, page_type: page }}" class="el-button el-button--success">
            选择
          </router-link>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="previewDialog.show"
      class="preview"
      width="620px"
    >
      <div class="flex">
        <div class="phone-frame">
          <iframe id="previewer" :src="previewDialog.url" />
          <div class="phone-home-btn" />
        </div>
        <div style="margin-left: 30px;">
          <VueQr :text="previewDialog.url" :size="120" :margin="10" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import activities from '@/api/activities'
import VueQr from 'vue-qr'
import { mapGetters } from 'vuex'
export default {
  components: {
    VueQr
  },
  data() {
    return {
      active: 'all',
      list: [],
      show: false,
      types: [],
      page: null,
      previewDialog: {
        show: false,
        url: null
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: { name: 'ActivityIndex' }},
      { title: '新建活动' }
    ])
    activities.list_new().then(({ data }) => {
      this.list = data
    })
  },
  methods: {
    imageUrl(str) {
      let url = str.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase()
      switch (str.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase()) {
        case 'xun_yu_zi_jiang_anti_fake_page':
          url = 'anti_fake_page'
          break
        case 'xun_yu_zi_jiang_anti_fakeb_page':
          url = 'anti_fake_page'
          break
        case 'sharing_red_pack_page':
          url = 'red_pack2_page'
          break
        case 'quick_red_pack_page':
          url = 'red_pack2_page'
          break
        case 'jtw_red_pack_popup_page':
          url = 'red_pack_popup_page'
          break
        case 'jin_hui_product_page':
          url = 'award_page'
          break
        case 'distinguish_genuine_award_page':
          url = 'distinguish_genuine_page'
          break
        case 'slot_machine32_page':
          url = 'slot_machine_page'
          break
        case 'yuhong_slot_machine_page':
          url = 'slot_machine_page'
          break
        case 'sharing_page':
          url = 'award_page'
          break
      }
      return `${url}`
    },
    createActivity(data, page) {
      if (data.antiFake) {
        // kind=normal&page_type=AntiFake4Page&type=AntiFakeActivity
        this.$router.push({ name: 'ActivityNew', query: { kind: data.activitiesData[0]['kind'], page_type: page, type: data.activitiesData[0]['type'] }})
      } else {
        this.types = data.activitiesData
        this.page = page
        this.show = true
      }
    },
    handlerClose() {
      this.show = false
    },
    // http://wx8a05cd45ff980d2b.lfl5.cn/mobile/activities/demo?page_type=sharing_page
    preview(data) {
      this.previewDialog.show = true
      this.previewDialog.url = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/activities/demo?page_type=${this.camelToSnake(data)}`
    },
    previewDialogClose() {
      this.previewDialog.show = false
      this.previewDialog.url = null
    }

  }

}
</script>

<style lang="scss" scoped>

.nav.nav-pills {
  padding: 10px;
  li a {
    color: #333;
  }
  li.active > a{
    color: #fff;
  }
}

.tab-content{
  .tab-pane.active{
    & > h4{
      margin: 50px 10px 5px;
      &:first-child{
        margin: 20px 10px 5px;
      }
    }
  }

  .admin-activity-item{
    padding: 10px;
    position: relative;
    .admin-activity-warp{
      width: 100%;
      border-radius: 6px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
    .thumbnail {
      position: relative;
      // height: 400px;
      img{
        width: 100%;
      }
      .justify-content__space-between{
        display: none;
        background: rgba(0,0,0,0.3);
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 10px 0;
        a{
          color: #fff;
          font-size: 14px;
          i{
            font-size: 20px;
          }
        }
        .flex-item {
          cursor: pointer;
          color: #FFF;
          &:hover{
            color: #ccc;
          }

        }
      }
      &:hover{
        .justify-content__space-between{
          display: flex;
        }
      }
      .activite-blank-img{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .desc{
          font-size: 14px;
          color: #999;
          font-weight: bold;
          text-align: center;
          bottom: 30px;
          position: absolute;
        }
      }
    }
    div.activity-title{
      height: 70px;
      display: flex;
      padding: 10px;
      align-items: center;
      h4{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: inherit;
        margin: 0;
        font-size: 16px;
      }
      small{
        display: block;
        color: #999999;
      }
      img{
        height: 32px;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
  }
}
.activity_klass_item{
  display: flex;
  align-items: center;
  height: 260px;
  width: 200px;
  margin: 10px;
  flex-direction: column;
  box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  img{
    size: 50px;
    padding-top: 30px;
  }
  h4{
    margin-top: 15px;
    font-size: 16px;
    margin-bottom: 5px;
  }
  p{
    font-size: 12px;
    color: #999;
    margin: 0 15px 20px;
    font-weight: 400;
    line-height: 17px;
    text-align: justify;
  }
}
::v-deep {
  .el-image {
    display: block;
  }
  .el-dialog__body {
    padding: 10px;
  }
  .preview {
    .el-dialog__header {
      border-bottom: none;
      .el-dialog__headerbtn .el-dialog__close {
        font-size: 30px;
        font-weight: bold;
        color: #FFF;
      }
    }
    .el-dialog__body {max-height: 100vh; overflow: hidden;}
    .el-dialog {
      margin-top: 10px !important;
      background: transparent;
      box-shadow: none;

    }
  }
}
</style>
