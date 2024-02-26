<template>
  <div class="navbar navbar-default">
    <div class="navbar-header">
      <a href="/lmp/portal/admin">
        <img src="@/assets/logo.png" class="logo">
        <span>{{ account.store.name }}</span>
      </a>
    </div>
    <div class="navbar-accont-info">
      <el-input ref="copyUrl" v-model="previewCode.content" type="textarea" style="opacity: 0;position: absolute; left: 0; top:0; width: 10px;height: 10px;z-index: -1;" :rows="20" resize="none" />
      <div v-for="(item,index) in navbars" :key="item.kind">
        <a v-if="item.kind === 'envelope'" href="/lmp/portal/admin/notifications" :class="item.kind">
          <span class="el-dropdown-link item">
            <i :class="item.icon" class="fa fa-fw" /> {{ item.name }} <span v-if="item.unread_count" class="badge">{{ item.unread_count }}</span>
          </span>
        </a>

        <el-dropdown v-if="index === 1" trigger="click" class="help">
          <span class="el-dropdown-link item">
            <i class="fa fa-question-circle fa-fw" /> 帮助
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a href="/admin/guide"><i class="fa fa-graduation-cap" /> 新手入门</a>
            </el-dropdown-item>

            <el-dropdown-item>
              <a target="blank" href="/lgp/portal/help">
                <i class="fa fa-life-ring fa-fw" /> 帮助中心
              </a>
            </el-dropdown-item>

            <el-dropdown-item>
              <a target="blank" href="/lmp/portal/admin/docs/api"><i class="fa fa-file fa-fw" /> 接口文档</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-if="item.kind !== 'envelope'" trigger="click" :class="item.kind">
          <span class="el-dropdown-link item">
            <i :class="item.icon" class="fa fa-fw" /> {{ item.name }} <span class="caret" />
          </span>
          <el-dropdown-menu v-if="item.kind === 'preview'" slot="dropdown">
            <el-dropdown-item>
              <div class="text-center">
                <div class="title" style="margin-top: 5px; margin-bottom: 10px;">{{ previewCode.title }}</div>
                <VueQr v-if="previewCode.type === 'link_url'" :text="previewCode.content" class="img-thumbnail" :size="300" />
                <img v-else :src="previewCode.content" class="img-thumbnail" style="width: 150px;">
                <a v-if="previewCode.type === 'link_url'" class="text" @click="copyClicked"><i class="fa fa-copy fa-fw" />复制链接</a>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu v-if="item.kind === 'my_account'" slot="dropdown">
            <el-dropdown-item>
              <router-link :to="{ name: 'StoreShow' }">
                <i class="fa fa-credit-card fa-fw" /> 我的账户
              </router-link>
            </el-dropdown-item>

            <el-dropdown-item>
              <router-link :to="{ name: 'AccountCurrentEdit' }">
                <i class="fa fa-user fa-fw" /> 修改管理员
              </router-link>
            </el-dropdown-item>

            <el-dropdown-item>
              <a href="/admin/accounts/current_edit_password">
                <i class="fa fa-key fa-fw" /> 修改密码
              </a>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <a rel="nofollow" data-method="delete" href="javascript: void(0)" @click="logOut">
                <i class="fa fa-sign-out fa-fw" /> 退出
              </a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueQr from 'vue-qr'
import user from '@/api/user.js'
import account from '@/api/account'
export default {
  components: {
    VueQr
  },
  data() {
    return {
      previewCode: {},
      navbars: [
      ]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'account',
      'menus'
    ])
  },

  mounted() {
    user.getPreviewInfo().then(({ data }) => {
      this.previewCode = data
    })

    if (this.account.store.state === 'enabled') {
      this.navbars = [
        {
          name: '预览',
          title: '预览积分商城',
          icon: 'fa-qrcode',
          kind: 'preview'
        },
        {
          name: '通知',
          icon: 'fa-envelope-o',
          kind: 'envelope',
          link: '/lmp/portal/admin/notifications',
          unread_count: 0
        },
        {
          name: this.account.store.name,
          icon: 'fa-user',
          kind: 'my_account'
        }
      ]
      user.count_read_false().then(({ data }) => {
        this.navbars[1].unread_count = data
      })
    } else {
      this.navbars = [
        {
          name: this.account.store.name,
          icon: 'fa-user',
          kind: 'my_account'
        }
      ]
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logOut() {
      // fetch('/admin/sessions/ajax_logout', {
      //   method: 'delete'
      // }).then(response => {
      //   return response.json()
      // }).then(data => {
      //   if (data.success) {
      //     window.location.href = data.url
      //   }
      // })
      // /admin/sign_out
    },
    copyClicked() {
      console.log(this.$refs.copyUrl)
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    }
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  width: 100%;
  min-width: 10;
  height: 42px;
  display: flex;
  background: #F34541;
  align-items: center;
  justify-content: space-between;
  img {
    vertical-align: middle;
  }
  .navbar-header a {
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      padding-left: 10px;
      border-left: 1px solid #fff;
      color: #FFF;
    }
  }
  .logo {
    height: 20px;
    margin-right: 10px;
    margin-top: -2px;
  }
  .navbar-header {
    padding: 0 15px;
  }
  &:before, &:after {
    display: none;
  }
}
.navbar-accont-info {
  padding-right: 30px;
  display: flex;
  a {
    color: #FFF;
  }
  & > .item {
    cursor: pointer;
    padding: 10px 15px;
    color: #FFF;
  }
  .envelope {
    background: #f01611;
    display: inline-block;
    cursor: pointer;
    padding: 10px 15px;
    color: #FFF;
  }
  .help{
    background: #da120e;
  }
  .my_account{
    background:#c2100c;
  }
  .caret {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }
  .badge {
    display: inline-block;
    min-width: 10px;
    padding: 3px 7px;
    font-size: 12px;
    font-weight: bold;
    color: #da120e;
    line-height: 1;
    vertical-align: baseline;
    white-space: nowrap;
    text-align: center;
    background-color: #FFF;
    border-radius: 10px;
  }
}
::v-deep {
  .el-dropdown {
    font-size: 14px;
    .el-dropdown-link {
      display: inline-block;
      cursor: pointer;
      padding: 10px 15px;
      color: #FFF;
    }
  }
  .el-dropdown-menu__item {
    color: #333;
    padding: 0 !important;
    min-width: 190px;
    font-size: 14px;
    a {
      display: block;
      padding: 3px 20px;
      white-space: nowrap;
      color: #333;
    }
    a:hover {
      background-color: #428bca !important;
      color: #FFF;
    }
    &--divided{
      &:before {
        margin: 0 !important;
      }
    }
    &:focus, &:not(.is-disabled):hover {
      background-color: #FFF;
      color: #333333;
    }
    .text {
      color: #F34541;
      &:hover{
        background-color: transparent !important;
        color: #F34541;
      }
    }
  }
}
.img-thumbnail {
  width: 150px;
}
</style>
