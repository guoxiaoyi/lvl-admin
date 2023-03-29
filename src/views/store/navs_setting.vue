<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex">
          <div class="phone-frame">
            <iframe id="previewer" :src="detail.url+ '/preview'" />
          </div>
          <div class="home_page_edit">
            <div class="nav-choose">
              <div class="nav-button-warp">
                <p :class="{active: nav_data.isDefault === true}" @click="nav_data.isDefault = true">默认导航</p>
                <p :class="{active: nav_data.isDefault === false}" @click="nav_data.isDefault = false">自定义导航</p>
              </div>
              <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
            </div>
            <el-form class="navs" label-width="110px">
              <div v-for="(item, index) in nav_data.list" :key="item.id" class="item">
                <div class="top"> 导航 {{ index + 1 }}
                  <span v-if="!nav_data.isDefault" class="close" @click="remove(item)">×</span>
                </div>
                <el-form-item label="导航名称">
                  <el-input v-model="item.name" :disabled="nav_data.isDefault" />
                </el-form-item>
                <el-form-item label="链接页面">
                  <el-select v-model="item.type" :disabled="nav_data.isDefault" @change="changeType(item)">
                    <el-option
                      v-for="(n, idx) in navs_type"
                      :key="idx"
                      :label="n.value"
                      :value="n.key"
                    >
                      {{ n.value }}
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="链接地址">
                  <el-input v-model="item.url" :disabled="nav_data.isDefault || item.type !== 'StoreNavs::Custom'" />
                </el-form-item>
                <el-form-item label="导航图标">
                  <el-button v-if="!nav_data.isDefault" type="text" @click="openSelectIcon(item)">选择图标</el-button>
                  <br v-if="!nav_data.isDefault">
                  <i class="fa" :class="'fa-' + item.icon" style="font-size:40px;color:#666;" />
                </el-form-item>
              </div>
            </el-form>
            <div class="add_nav" :class="{disabled: nav_data.list.length >= 5}" @click="add"> 添加导航 </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择图标" :visible.sync="select_icon.show">
      <div class="icon-list">
        <i v-for="icon in icons" :key="icon" class="fa" :class="'fa-'+icon" @click="setIcon(icon)" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tab from '@/components/Tabs/store/point.vue'
import point_store from '@/api/point_store'
import { mapGetters } from 'vuex'
export default {
  components: {
    tab
  },
  data() {
    return {
      detail: {},
      submitting: false,
      nav_data: {
        isDefault: true,
        list: []
      },
      select_icon: {
        show: false,
        item: {}
      },
      navs_type: [],
      icons: [
        'lfl-home', 'lfl-gift', 'lfl-order', 'lfl-user', 'bars',
        'shopping-cart', 'th-large', 'bar-chart-o', 'bookmark-o',
        'calendar-check-o', 'paper-plane-o', 'share-alt', 'star-o',
        'television', 'envelope-open-o', 'commenting-o', 'heart-o',
        'icon-cuxiao', 'icon-jifen', 'icon-fuzhuang', 'icon-fuzhuangpeishi',
        'icon-jiancai', 'icon-jingxuan', 'icon-jiaju', 'icon-jiushui',
        'icon-meizhuang', 'icon-muying', 'icon-quan', 'icon-shipin',
        'icon-shoucang', 'icon-tongzhuang', 'icon-wanju', 'icon-zhibo',
        'icon-a-4-dingdan', 'icon-a-4-fenlei', 'icon-a-4-geren', 'icon-a-4-gouwuche',
        'icon-a-4-jiang', 'icon-a-4-zhuye', 'icon-a-1-dingdan', 'icon-a-1-fenlei',
        'icon-a-1-geren', 'icon-a-1-gouwuche', 'icon-a-1-jiang', 'icon-a-1-zhuye',
        'icon-a-2-dingdan', 'icon-a-2-fenlei', 'icon-a-2-geren', 'icon-a-2-gouwuche',
        'icon-a-2-jiang', 'icon-a-3-dingdan', 'icon-a-2-zhuye', 'icon-a-3-gouwuche'
      ]
    }
  },
  computed: {
    ...mapGetters([
      'account'
    ])
  },
  watch: {
    'nav_data.isDefault'() {
      point_store.navs_setting({ isDefault: this.nav_data.isDefault }).then(response => {
        this.nav_data['list'] = response.data
      })
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '商城装修', path: { name: 'RoleIndex' }}
    ])
    this.nav_data['isDefault'] = this.account.store.defaultNavs
    point_store.detail().then(response => {
      this.detail = response.data
    })
    point_store.navs_setting({ isDefault: this.nav_data.isDefault }).then(response => {
      this.nav_data['list'] = response.data
    })
    point_store.navs_type().then(response => {
      this.navs_type = response.data
    })
  },
  methods: {
    submit() {
      const data = this.nav_data
      data.list.forEach(item => {
        delete item.id
      })
      this.submitting = true
      point_store.setNavsSetting(data).then(response => {
        this.$message.success('更新成功')
        this.submitting = false
        window.location.reload()
      }).catch(_err => {
        this.submitting = false
      })
    },
    setNav(isDefault) {

    },
    openSelectIcon(data) {
      this.select_icon.show = true
      this.select_icon.item = data
    },
    setIcon(data) {
      this.nav_data.list.find(i => i.id === this.select_icon.item.id).icon = data
      this.select_icon.show = false
      this.select_icon.item = {}
    },
    remove(data) {
      this.nav_data.list = this.nav_data.list.filter(i => { return i.id !== data.id })
    },
    add() {
      if (this.nav_data.list.length < 5) {
        this.nav_data.list.push({
          icon: '',
          id: Date.now(),
          name: '',
          type: '',
          url: ''
        })
      }
    },
    changeType(data) {
      const url = this.navs_type.find(i => i.key === data.type).url
      this.nav_data.list.find(i => i.id === data.id).url = url
    }
  }
}
</script>

<style lang="scss" scoped>
.navs {
  display: flex;
  width: 640px;
  flex-wrap: wrap;
  justify-content: space-between;
  .item {
    width: 310px;
    border: 1px #ddd solid;
    margin-bottom: 20px;
    .top {
      margin-bottom: 10px;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      background: #f5f5f5;
      height: 40px;
      align-items: center;
    }
  }
}
.flex {
  display: flex;
  justify-content: center;
  .home_page_edit {
    margin-left: 20px;
  }
  .nav-choose {
    display: flex;
    font-size: 14px;
    height: 40px;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 15px;
    justify-content: space-between;
    .nav-button-warp{
      display: flex;
      p {
        padding: 10px 30px;
        cursor: pointer;
        border: 1px black solid;
        position: relative;
        &.active {
          border: 1px red solid;
          position: relative;
          &:before{
            content: "\f00c";
            font: normal normal normal 14px/1 FontAwesome;
            position: absolute;
            color: white;
            background: red;
            position: absolute;
            right: 0;
            top: 0;
            padding:2px;
          }
        }
        &+p{
          margin-left: 10px;
        }
      }
    }
  }
}
.close {
  float: right;
  font-size: 21px;
  font-weight: bold;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.2;
  cursor: pointer;
}
.icon-list {
  display: flex;
  flex-wrap: wrap;
  i {
    font-size: 34px;
    margin: 20px;
  }
}
.add_nav {
  width: 310px;
  border: 1px #ccc dashed;
  text-align: center;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  &.disabled {
    opacity: 0.5;
  }
}
</style>
