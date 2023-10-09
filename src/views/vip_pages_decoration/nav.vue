<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex">
          <div class="phone-frame">
            <div class="preview-nav">
              <ul class="mini-nav">
                <li v-for="item in nav_data.list" :key="item.key">
                  <i class="iconfont" :class="item.icon" style="font-size:20px;color:#666;" />
                  {{ item.name }}
                </li>
              </ul>
            </div>
          </div>
          <div class="home_page_edit">
            <div class="nav-choose">
              <div class="nav-button-warp">
                <p :class="{active: nav_data.isDefault === true}" @click="nav_data.isDefault = true">默认导航</p>
                <p :class="{active: nav_data.isDefault === false}" @click="nav_data.isDefault = false">自定义导航</p>
              </div>
            </div>
            <el-form class="navs" label-width="110px">
              <div v-for="(item, index) in nav_data.list" :key="item.id" class="item">
                <div class="top"> 导航 {{ index + 1 }}
                  <span v-if="!nav_data.isDefault && !['Mine', 'Home'].includes(item.type) " class="close" @click="remove(item)">×</span>
                </div>
                <el-form-item label="导航名称">
                  <el-input v-model="item.name" :disabled="nav_data.isDefault" />
                </el-form-item>
                <el-form-item label="链接页面">
                  <el-select v-model="item.type" :disabled="nav_data.isDefault || ['Mine', 'Home'].includes(item.type)" @change="changeType(item)">
                    <el-option
                      v-for="(n, idx) in navs_type"
                      :key="idx"
                      :label="n.value"
                      :value="n.key"
                      :disabled="['Mine', 'Home'].includes(n.key)"
                    >
                      {{ n.value }}
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="item.type === 'Custom'" label="链接地址">
                  <el-input v-model="item.url" :disabled="nav_data.isDefault || item.type !== 'StoreNavs::Custom'">
                    <template slot="append">
                      <el-button type="success" @click="selectMicroPage(item)">选择</el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="导航图标">
                  <el-button v-if="!nav_data.isDefault" type="text" @click="openSelectIcon(item)">选择图标</el-button>
                  <br v-if="!nav_data.isDefault">
                  <i class="fa" :class="'fa-' + item.icon" style="font-size:40px;color:#666;" />
                </el-form-item>
              </div>
            </el-form>
            <div v-if="!nav_data.isDefault && checkPer(['vip_interest_manage'])" class="add_nav" :class="{disabled: nav_data.list.length >= 5}" @click="add"> 添加导航 </div>
            <hr>
            <el-button v-if="checkPer(['vip_interest_manage'])" type="success" :loading="submitting" @click="submit">保存</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择图标" :visible.sync="select_icon.show">
      <div class="icon-list">
        <i v-for="icon in icons" :key="icon" class="iconfont" :class="icon" @click="setIcon(icon)" />
      </div>
    </el-dialog>

    <el-dialog title="更换首页" :visible.sync="micro_page.show">
      <div class="panel panel-default">
        <el-table :data="crud.data">
          <el-table-column prop="title" label="标题">
            <template slot-scope="scope">
              {{ scope.row.title }} <el-tag v-if="scope.row.id === detail.id" type="success" effect="dark">商城首页</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="更新时间" width="200" />
          <el-table-column prop="action" label="操作" width="150">
            <template slot-scope="scope">
              <a :href="`https://admin.${domain}/admin/micro_pages/${scope.row.id}/mobile_demo`" target="_blank">预览</a>
              <!-- <el-button type="text" @click="preview(scope.row)">预览</el-button> -->
              <span>-</span>
              <el-button type="text" @click="select(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="lifanli-pagination">
        <el-pagination
          :page-sizes="[10]"
          :page-size="10"
          :total="page.total"
          :current-page.sync="page.page"
          layout="prev, pager, next, total"
          background
          @size-change="crud.sizeChangeHandler($event)"
          @current-change="crud.pageChangeHandler"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tab from '@/components/Tabs/vip_decortaion.vue'
import vip_miniprogram from '@/api/vip_miniprogram'

import CRUD, { presenter, crud, header } from '@crud/crud'
import { pagination } from '@crud/crud'
import { mapGetters } from 'vuex'

export default {
  components: {
    tab
  },
  mixins: [presenter(), header(), crud(), pagination()],
  data() {
    return {
      detail: {},
      submitting: false,
      nav_data: {
        isDefault: null,
        list: []
      },
      select_icon: {
        show: false,
        item: {}
      },
      micro_page: {
        show: false,
        id: null
      },
      navs_type: [],
      icons: [
        'icon-a-1-geren', 'icon-a-1-fenlei', 'icon-a-1-dingdan', 'icon-a-1-jiang', 'icon-a-1-zhuye',
        'icon-a-2-geren', 'icon-a-2-fenlei', 'icon-a-2-dingdan', 'icon-a-2-jiang', 'icon-a-2-zhuye',
        'icon-a-4-geren', 'icon-a-4-fenlei', 'icon-a-4-dingdan', 'icon-a-4-jiang', 'icon-a-4-zhuye', 
        'icon-zhibo', 'icon-shoucang', 'icon-dingdan-xian', 'icon-yiwancheng-xian', 'icon-daifahuo-xian',
        'icon-daishouhuo-xian', 'icon-cuxiao', 'icon-fuzhuang', 'icon-fuzhuangpeishi', 'icon-jiancai',
        'icon-jingxuan', 'icon-jiaju', 'icon-jiushui', 'icon-meizhuang', 'icon-muying', 'icon-quan',
        'icon-shipin', 'icon-tongzhuang', 'icon-wanju', 'icon-liuliangyunpingtaitubiao02', 'icon-dingdan',
        'icon-iconfontanquan', 'icon-weibiaoti35', 'icon-wode1', 'icon-wode', 'icon-shouye', 'icon-gift',
        'icon-icon--copy'
      ],
      previewUrl: null,
      domain: null
    }
  },
  computed: {
    ...mapGetters([
      'account'
    ])
  },
  watch: {
    'nav_data.isDefault'() {
      vip_miniprogram.navs_setting({ isDefault: this.nav_data.isDefault }).then(response => {
        this.nav_data['list'] = response.data
      })
    },
    'micro_page.show'() {
      this.crud.refresh()
    }
  },
  cruds() {
    return CRUD({ title: '微页面列表', url: '/lmp/v2/admin/micro_page', sort: 'updatedAt,desc', params: { published: true }, size: 10 })
  },
  mounted() {
    this.domain = process.env.VUE_APP_BASE_DOMAIN
    this.nav_data.isDefault = this.account.store.defaultMiniNavs
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '小程序装修', path: { name: 'RoleIndex' }}
    ])
    vip_miniprogram.navs_type().then(response => {
      this.navs_type = response.data
    })
  },
  methods: {
    submit() {
      const data = JSON.parse(JSON.stringify(this.nav_data))
      data.list.forEach(item => {
        delete item.id
      })

      this.submitting = true
      vip_miniprogram.setNavsSetting(data).then(response => {
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
        this.nav_data.list.splice(this.nav_data.list.length - 1, 0, {
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
    },
    selectMicroPage(data) {
      this.micro_page.show = true
      this.micro_page.id = data.id
    },
    select(data) {
      this.nav_data.list.find(i => i.id === this.micro_page.id).url = `/pages/micro/index?id=${data.id}`
      this.nav_data.list.find(i => i.id === this.micro_page.id).pageId = data.id
      this.micro_page.show = false
      this.micro_page.id = null
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
    border: 1px solid #ddd;
    margin-left: 20px;
    padding: 10px;
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
.preview-nav {
  width: 100%;
  height: 100%;
  background: rgba($color: #cccccc, $alpha: 1.0);
  position: relative;
  .mini-nav {
    height: 58px;
    width: 100%;
    background: #FFF;
    position: absolute;
    bottom: 0;
    display: flex;
    li {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 12px;
    }
  }
}
</style>
