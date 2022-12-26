<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          绑定企业微信
        </a>
      </li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="flex flex-wrap">
        <div class="text-center wework-logo">
          <img width="208" :src="require('@/assets/wework_logo.png')" alt="Wework logo">
          <div class="wework-status">
            <div v-if="result.authorized && result.state === 'completed'" class="completed">
              <button> 已绑定企业微信</button>
              <dl>
                <dt>企业的主体名称：</dt>
                <dd> {{ result.corpName }} </dd>
              </dl>
              <dl>
                <dt>认证到期时间：</dt>
                <dd> {{ result.verifiedEndTime }} </dd>
              </dl>
              <dl>
                <dt>企业微信id:</dt>
                <dd> {{ result.corpid }} </dd>
              </dl>
            </div>
            <div v-else class="">
              <router-link v-if="is_binding" :to="{name: 'WeworkAuthorize'}" class="el-button el-button--success">
                绑定企业微信
              </router-link>
              <el-tooltip v-else effect="dark" content="使用企业微信功能，需先鄉定微信公众号" placement="top">
                <el-button type="info">绑定企业微信</el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="flex-item wework-info-area">
          <div class="title">
            <h3>企业微信-实现私域精准营销</h3>
            <p>借助多种平台活动吸粉获客，通过添加客户微信等连接微信能力，助力企业高效管理和维系客户，实现精准营销。</p>
            <a target="blank" href="http://admin.lifanli.cn/lgp/portal/help/articles/169?cid=3">企业微信开通指南</a>
          </div>

          <ul class="flex flex-wrap wework-func">
            <li class="col-6">
              <dl class="flex">
                <dd class="flex-item">
                  <h5>吸粉获客</h5>
                  <p>借助多种平台活动类型，帮助企业把全渠道客户沉淀到企业微信进行服务。</p>
                </dd>
              </dl>
            </li>
            <li class="col-6">
              <dl class="flex">
                <dd class="flex-item">
                  <h5>智能分流</h5>
                  <p>客户微信扫码添加企业微信，自动分流给不同员工接待，轻松承接海量客户。</p>
                </dd>
              </dl>
            </li>
            <li class="col-6">
              <dl class="flex">
                <dd class="flex-item">
                  <h5>分类标记</h5>
                  <p>支持系统自动标记和人工打标签，借助标签给不同客户分类，精细化管理。</p>
                </dd>
              </dl>
            </li>
            <li class="col-6">
              <dl class="flex">
                <dd class="flex-item">
                  <h5>离职继承</h5>
                  <p>企业可查看并管理员工添加的微信客户，对离职员工的客户重新分配，保护客户资产。</p>
                </dd>
              </dl>
            </li>
            <li class="col-6">
              <dl class="flex">
                <dd class="flex-item">
                  <h5>客户朋友圈</h5>
                  <p>企业可统一创建内容，店员确认后发表到客户朋友圈，也可查看店员发表的内容，打造企业专属个性化朋友圈，树立品牌形象。</p>
                </dd>
              </dl>
            </li>
            <li class="col-6">
              <dl class="flex">
                <dd class="flex-item">
                  <h5>精准运营</h5>
                  <p>可将企业的新品和活动信息通过群发助手发送给目标客户，帮助客户及时了解动态；定向推送不同的运营方案，助力精准营销。</p>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
      </div>
      <!-- <div v-if="Object.keys(result).length" class="panel-footer">
        <el-button v-if="result.departmentList.length === '0' || result.userList.length === '0'" :disabled="true" type="success">
          应用可见范围为空，不能拉取数据
        </el-button>
        <el-button v-else type="success" :disabled="result.isPulling" @click="getPull">
          拉取信息{{ result.isPulling ? '中' : '' }}
        </el-button>
      </div> -->
    </div>
  </div>
</template>
<script>
import wework from '@/api/we_work'
export default {
  data() {
    return {
      result: { }
    }
  },
  computed: {
    is_binding() {
      return this.$store.getters.account.wechatProfile
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '企业微信' }, { title: '企业微信概况' }
    ])
    this.getInfo()
  },
  methods: {
    getInfo() {
      wework.getAuthInfo().then(response => {
        this.result = response.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .new-show {
    padding-top: 20px;
    padding-bottom: 20px;
    min-height: 80vh;
  }
  .title {
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 30px;
    h3 {
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 24px;
    }
    p {
      margin-bottom: 10px;
    }
  }
  dd, dl, h5, p {
    padding: 0;
    margin: 0;
  }
  .wework-logo {
    width: 300px;
    img {
      padding: 20px;
    }
  }
  .flex {
    display: flex;
    &.flex-wrap {
      flex-wrap: wrap;
    }
    .flex-item {
      flex: 1;
    }
    .col-6 {
      width: 50%;
      flex: 0 0 50%;
      padding: 10px;
      dl {
        height: 100%;
        background: #F8F8F8;
        padding: 20px 25px;
        h5 {
          font-size: 16px;
          margin-bottom: 10px;
        }
        p {
          font-size: 14px;
          color: #888888;
        }
      }
    }
  }
  .completed {
    button {
      border: 1px solid #a5a5a5;
      display: inline-block;
      padding: 10px 20px;
      background: #FFF;
      border-radius: 5px;
      margin-bottom: 30px;
    }
    dl {
      padding-left: 40px;
      text-align: left;
      margin-bottom: 25px;
      dt {
        color: #999898;
      }
      dd {
        color: #252525;
        margin-top: 7px;
      }
    }
  }
</style>
