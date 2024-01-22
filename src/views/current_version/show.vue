<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          版本信息
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="version_list">
          <div v-for="(features, edition) in groupedFeatures" :key="edition" class="version_list__item">
            <dl>
              <dt>{{ editionsI18n[edition] }}</dt>
              <dd class="title"> 包含功能：</dd>
              <dd class="item">
                <img src="@/assets/current_versions/true.png">{{ edition === 'red_pack' ? editionsI18n[edition] : `${editionsI18n[editionMapping[edition]]}全部功能` }}
              </dd>
              <dd v-for="feature in filteredFuncs(features, edition)" :key="feature.storeColumnName" class="item">
                <img src="@/assets/current_versions/true.png">{{ feature.name }}
              </dd>
            </dl>
            <div v-if="edition === account.store.edition" class="update current">当前版本</div>
            <a v-else-if="preEditions(edition).includes(account.store.edition)" href="javascript:alert('如需升级，请联系您的专属客服！')" class="update">立即升级</a>
          </div>
        </div>
        <h4>功能详情</h4>
        <table class="version_detail">
          <thead>
            <tr>
              <td>版本功能</td>
              <td v-for="(features, edition) in editionsI18n" :key="edition">
                {{ features }} {{ edition === account.store.edition ? '(当前版本)' : '' }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(features, edition) in list" :key="edition">
              <td>
                {{ features.name }}
                <!-- <%= func["name"] %>
                <%= link_to image_tag("exclamation_mark.png", size: "12", style: "margin-bottom:2px"), "javascript:;", role: "button", data: {
                      toggle: "popover",
                      trigger: "hover",
                      container: "body",
                      placement: "auto",
                      html: true,
                      content: t(func["store_column_name"], scope: "activerecord.attributes.store/func_info")
                    } %> -->
              </td>
              <td v-for="(_name, func) in editionsI18n" :key="func">
                <img :src="require('@/assets/current_versions/' + features.editions.includes(func) + '.png' )">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import store_setting from '@/api/store_setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [],
      versions: [],
      editionsI18n: {
        red_pack: '精简版',
        essentials: '基础版',
        marketing: '营销版',
        business: '企业版',
        enterprise: '旗舰版'
      },
      editionMapping: {
        essentials: 'red_pack',
        marketing: 'essentials',
        business: 'marketing',
        enterprise: 'business'
      }
    }
  },
  computed: {
    groupedFeatures() {
      const groupedData = {}
      this.list.forEach(item => {
        item.editions.forEach(edition => {
          const excludedEditions = this.getExcludedEditions(edition)
          if (!groupedData[edition]) {
            groupedData[edition] = []
          }
          if (!excludedEditions.includes(edition)) {
            groupedData[edition].push(item)
          }
        })
      })
      delete groupedData.experience
      return groupedData
    },
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '版本信息' }])
    store_setting.edition_functions().then(({ data }) => {
      this.list = data
    })
  },
  methods: {
    getExcludedEditions(edition) {
      let currentEdition = this.editionMapping[edition]
      const excludedEditions = []

      while (currentEdition) {
        excludedEditions.push(currentEdition)
        currentEdition = this.editionMapping[currentEdition]
      }

      return excludedEditions
    },
    filteredFuncs(funcs, edition) {
      return funcs.filter(func =>
        func.editions.includes(edition) &&
        !func.editions.includes(this.editionMapping[edition])
      )
    },
    preEditions(currentEdition) {
      const editions = []
      let edition = this.editionMapping[currentEdition]
      while (edition) {
        editions.push(edition)
        edition = this.editionMapping[edition]
      }
      return editions
    }
  }
}
</script>

<style lang="scss" scoped>

.version_list {
    display: flex;
    margin-left: -6px;
    margin-right: -6px;
    min-height: 400px;
    .version_list__item {
      flex: 1;
      margin: 6px;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.1);
      border-radius: 4px;
      border: 1px solid #EEEEEE;
      padding: 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      dt {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 90px;
        font-size: 20px;
        color: #333;
        border-radius: 2px;
        position: relative;
        span{
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          height: 20px;
          background: linear-gradient(90deg, #F34541 0%, rgba(243,69,65,0) 100%);
          border-radius: 2px;
          opacity: 0.5;
          font-size: 12px;
          color: #FFFFFF;
          padding: 2px 5px;
          font-weight: normal;
        }
      }
      dd.title {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
        padding: 17px 15px 7px 15px;
      }
      dd.item {
        font-size: 13px;
        color: #999999;
        line-height: 22px;
        padding: 0px 15px;
        display: flex;
        align-items: center;
        img {
          margin-right: 5px;
        }
      }
      .update {
        width: 120px;
        height: 34px;
        background: #DCA545;
        border-radius: 17px;
        margin: 20px auto;
        border-radius: 34px;
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
        cursor: pointer;
        &.current {
          color: #DCA545;
          background: rgba(220,165,69,0.2);
        }
      }
      $bg_colors: #EEE, #FFEAC5, #FFD997, #DCA545, #444444;
      @each $bg_color in $bg_colors{
        $index: index($bg_colors, $bg_color);
        &:nth-child(#{$index}){
          border: 1px solid $bg_color;
          dt {
            background: $bg_color;
            @if $index > 3 {
              color: #FFF;
            }
          }
        }
      }
    }
  }
  .version_detail {
    width: 100%;
    border: 1px solid #DDD;
    border-radius: 6px;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    thead {
      background: #F0F0F0;
      tr {
        td{
          padding: 15px 0;
          font-size: 14px;
          color: #666;
        }
      }
    }
    tbody {
      td {
        height: 40px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
      }
      tr {
        &:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }
    tr {
      td {
        border-left: 1px solid #DDD;
        border-bottom: 1px solid #DDD;
        &:first-child {
          border-left: none;
          padding-left: 20px;
          padding-right: 20px;
        }
        &:nth-child(n+2) {
          width: 14%;
          text-align: center;
        }
      }
    }
  }
  h4 {
    font-size: 24px;
    font-weight: 600;
    color: #333333;
    line-height: 33px;
    margin: 30px 0 20px 0;
    text-align: center;
  }

</style>
