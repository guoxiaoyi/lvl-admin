<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div style="display: flex; justify-content: center;">
          <div class="preview iphone-frame phone-frame orange" :class="theme">
            <div class="preview-w">
              <el-image :src="require('@/assets/point_store_theme/preview.png')" width="100%" />
              <nav class="preview-main-header">
                <div class="pull-left">{{ account.store.name }}</div>
                <div class="pull-right"> <i class="fa fa-navicon" /> 菜单 </div>
              </nav>
              <div class="preview-banner">
                <div class="preview-user-info">
                  <el-image :src="require('@/assets/avatar_small_missing.jpg')" class="img" />
                  {{ account.store.name }}
                </div>
                <div class="preview-card">
                  <div>
                    <p>我的积分</p>
                    <big>0<small>积分</small></big>
                  </div>
                  <div>
                    <p>我的零钱</p>
                    <big>0.00<small>元</small> </big>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="margin-left: 20px;">
            <div class="theme-select">
              <p style="margin:unset;padding-left:20px;">请选择主题颜色</p>
              <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
            </div>
            <div class="theme-wrapper">
              <div v-for="item in detail" :key="item.code">
                <span :style="'background:'+item.color" :class="{checked: theme === item.code}" @click="select(item.code)">
                  <i />
                </span>
                {{ item.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import point_store from '@/api/point_store'
import tab from '@/components/Tabs/store/point.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    tab
  },
  data() {
    return {
      detail: [],
      theme: '',
      submitting: false
    }
  },
  computed: {
    ...mapGetters([
      'account'
    ])
  },
  mounted() {
    this.theme = this.account.store.theme
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '商城装修', path: { name: 'RoleIndex' }}
    ])
    point_store.point_store_theme().then(response => {
      this.detail = response.data
    })
  },
  methods: {
    select(code) {
      this.theme = code
    },
    submit() {
      this.submitting = true
      point_store.edit_point_store_theme({ theme: this.theme }).then(response => {
        this.$message.success('更新成功')
        window.location.reload()
        this.submitting = false
      }).catch(_err => {
        this.submitting = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$themplates: "orange", "pumpkin", "burnt_umber", "rose_red", "default", "crimson", "green_sea", "nephritis", "grass_green", "deep_blue", "cyanine_blue", "belize_hole", "wisteria", "midnight_blue", "inkiness";
$themplate-colors: #F7971E, #F35622, #A55C2B, #FA4E88, #F64348, #A40000, #16A085, #27AE60, #0D8600, #289BF0, #00B3CE, #2980B9, #7138CC, #1E3C72, #333333;

.preview.iphone-frame {
  height: auto;
  position: relative;
  img{
    width: 100%;
  }
  .preview-w{
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid #c8c8c8;
    border-radius: 4px;
    overflow: hidden;
  }
  .preview-main-header{
    position: absolute;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0px 15px;
    box-sizing: border-box;
    top:0px;
    color: #FFF;
  }
  .preview-user-info{
    padding-top: 16px;
    font-size: 16px;
    text-align: center;
    color: #FFF;
    margin-bottom: 16px;
    .img{
      width: 55px;
      height: 55px;
      border-radius: 50%;
      display: block;
      margin: 0 auto;
      margin-bottom: 7px;
    }
  }
  .preview-card{
    margin: 10px;
    background: #FFF;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    text-align: center;
    overflow-x: hidden;
    div{
      width: 50%;
      float: left;
      padding-top: 25px;
      padding-bottom: 5px;
      p{
        font-size: 12px;
        color: #666;
      }
      big{
        font-family: 'dincondensed_bold';
        font-size: 40px;
        small{
          font-size: 10px;
          font-weight: normal;
          margin-left: 4px;
        }
      }
    }
  }

  @each $themplate in $themplates{
    $i: index($themplates, $themplate);
    &.#{$themplate}{
      .preview-main-header{
        background-color: nth($themplate-colors, $i);
      }
      .preview-banner{
        position: absolute;
        width: 100%;
        top: 40px;
        background: url("~@/assets/point_store_theme/user_center_#{$themplate}.png") no-repeat;
        background-size: 100%;
        big{
          color: nth($themplate-colors, $i);
        }
      }
    }
  }
}
.theme-wrapper {
  width: 400px;
  border: 1px solid #e6e6e6;
  padding: 60px 0 40px 0;
  display: flex;
  flex-wrap: wrap;
  div {
    display: inline-block;
    width: 33%;
    padding-top: 0;
    margin-bottom: 20px;
    text-align: center;
    span {
      width: 40px;
      height: 40px;
      display: block;
      margin: 0 auto;
      border-radius: 4px;
      margin-bottom: 5px;
      position: relative;
      cursor: pointer;
      &.checked i{
        display: block;
        width: 40px;
        height: 40px;
        background: url('~@/assets/theme_selected.png') no-repeat center center;
        position: absolute;
        top:0;
        left: 50%;
        margin-left: -20px;
      }
    }
  }
}
.theme-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #eee;
  margin-bottom: 20px;
}
</style>
