<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 新建微页面 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="micro-page-template">
        <div class="template-col">
          <div class="micro-page-template__item">
            <router-link :to="{ name: 'MicroPageNew' }" class="blank-template">
              <p>新建空白页</p>
            </router-link>
          </div>
        </div>
        <div v-for="(item, index) in list" :key="index" class="template-col">
          <div class="micro-page-template__item">
            <img :src="require('@/assets/micro_page_templates/'+index+'.png')">
            <div class="flex justify-content__space-between">
              <router-link :to="{ name: 'MicroPageNew', query: { template: index }}" class="flex-item text-center">
                <i class="fa fa-plus-circle" /><br>新建
              </router-link>
              <a href="javascript:void(0)" class="flex-item text-center" @click="preview(item, index)">
                <i class="fa fa-eye" /><br>预览
              </a>
            </div>
            <div class="template-new">
              <h3>{{ item.title }}</h3>
            </div>
          </div>
        </div>
        <div class="template-col">
          <div class="micro-page-template__item">
            <div class="blank-template">
              <p class="more">
                <span>更多模板</span>
                <span>敬请期待</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      width="920px"
      title="模板预览"
      append-to-body
      :visible.sync="modal.preview"
      top="8vh"
    >
      <div class="flex">
        <div class="phone-frame" style="margin: 0 auto;">
          <iframe id="previewer" :src="modal.url+'/demo'" />
        </div>
        <div class="preview-panel">
          <div class="panel panel-default">
            <div class="panel-body">
              <h4>{{ modal.data.title }}</h4>
              <p>
                <span style="color:#5cb85c">免费</span><br>
                永久使用<br> <br>
                扫描二维码预览<br>
                预览效果仅供参考，请以实际投放效果为准
              </p>
              <VueQr ref="Qrcode" :text="modal.url" :size="200" />
              <hr>
              <el-button @click="cancel">取消</el-button>
              <el-button type="success" @click="$router.push({ name: 'MicroPageNew', query: { template: modal.template }})">使用模板</el-button>
            </div>
          </div>

        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import micro_page from '@/api/micro_page'
import VueQr from 'vue-qr'

export default {
  components: {
    VueQr
  },
  data() {
    return {
      list: {},
      modal: {
        preview: false,
        url: '',
        data: {},
        template: null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '新建微页面' }])
    micro_page.templates().then(({ data }) => {
      this.list = data
    })
  },
  methods: {
    preview(data, template) {
      this.modal.template = template
      this.modal.data = data
      this.modal.url = `http://wx7a325a2f8dde05a4.lifanli.cn/mobile/micro_pages/${data.preview_id}`
      this.modal.preview = true
    },
    cancel() {
      this.modal = {
        preview: false,
        url: '',
        data: {},
        template: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.micro-page-template{
    padding: 40px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    .template-col{
      flex: 0 0 25%;
      padding: 20px;
      min-height: 400px;
    }
    .micro-page-template__item{
      box-shadow:0px 4px 5px 0px rgba(0,0,0,0.2);
      border-radius:10px;
      overflow: hidden;
      position: relative;
      height: 100%;
      background: whitesmoke;
      img{
        width: 100%;
      }
      .template-new{
        position: absolute;
        overflow: hidden;
        width: 100%;
        padding: 10px 20px;
        bottom: 0;
        background: #FFF;
        z-index: 1;
        transition: All 0.4s ease-in-out;
        border-top: 1px solid #dedede;
        h3{
          font-size: 14px;
          margin-top: 0;
          margin-bottom: 0;
          line-height: 30px;
        }
        a{

        }
        .btn+.btn{
          margin-left: 10px;
        }
      }
      .justify-content__space-between{
        display: none;
        background: rgba(0,0,0,0.3);
        position: absolute;
        bottom: 50px;
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
        .flex-item:hover{
          color: #ccc;
        }
      }
      &:hover{
        .justify-content__space-between{
          display: flex;
        }
      }
    }
    .blank-template{
      background: rgba(245,245,245,1);
      width: 100%;
      display: table;
      height: 100%;
      &+.template-new{
        display: table !important;
        vertical-align: middle;
        a{
          border:1px solid rgba(204,204,204,1);
          vertical-align: middle;
          display: table-cell;
          text-align: center;
        }
      }
      p{
        text-align: center;
        font-size: 28px;
        display: table-cell;
        vertical-align: middle;
        font-weight: 400;
        color: rgba(204,204,204,1);
        position: relative;
        padding-top: 60px;
        &.more{
          padding-top: 0;
          span{
            display: block;
          }
          &:after, &:before{
            display: none;
          }
        }
        &:after, &:before{
          display: block;
          content: '';
          background: rgba(204,204,204,1);
          left: 50%;
          position: absolute;
          top: 53%;
        }
        &:after{
          width: 58px;
          height: 2px;
          margin-top: -61px;
          margin-left: -29px;
        }
        &:before{
          margin-top: -90px;
          width: 2px;
          height: 57px;
        }
      }
    }
  }
  .home-flag{
    border: 1px #5cb85c solid;
    color:#5cb85c;
    font-size: 75%;
    padding: 2px;
    border-radius: .25em;
  }
  .preview-panel {
    margin-left: 20px;
    width: 400px;
  }
</style>
