<template>
  <div class="app-container">
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex store_info">
          <div class="flex col-6 items-center">
            <div>
              <p>
                <span class="name">账户名称：{{ account.store.name }}</span>
              </p>
              <p>
                <span class="name">账户ID：{{ account.store.number }}</span>
              </p>
            </div>
          </div>

          <div class="flex col-6 items-center">
            <div>
              <p>
                <span class="name">企业名称：{{ detail.fullname }}</span>
              </p>
              <p>
                <span class="name">
                  实名认证：
                  <span style="cursor: pointer;">
                    <el-tag :type="account.store.certificated ? 'success' : 'danger'" @click="$router.push({ name: 'AccountChangesCurrentCertification' })">
                      {{ account.store.certificated ? '已认证' : '未认证' }}
                    </el-tag>
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <i class="fa fa-store-edition lfl-text-danger" /> 当前版本
      </div>
      <div class="store_edition_row table-responsive">
        <table class="table store_edition">
          <tbody>
            <tr>
              <td>
                <p>基本信息：</p>
                <p>
                  <span>平台版本：</span><br>
                  {{ result.editionText }}
                </p>
                <p>
                  <span>有效期至：</span><br>
                  {{ result.expiresAt }}
                </p>
                <p>
                  <span>管理员数量：</span><br>
                  {{ result.accountNumber }}
                </p>
                <p>
                  <span>服务器配置：</span><br>
                  {{ result.serverEdition }}
                </p>
              </td>
              <td>
                <p>旗舰版：</p>
                <ul>
                  <li v-for="(item, index) in result.editionFunctions" :key="index">
                    <span v-if="item.enabled">
                      <i class="fa fa-lfl-check-circle lfl-text-success" />{{ item.name }}
                    </span>
                    <span v-else class="text-muted">
                      <i class="fa fa-lfl-times-circle" /> {{ item.name }}
                    </span>
                  </li>
                </ul>
              </td>
              <td>
                <p>增值功能：</p>
                <ul v-if="result.moreFunctions.length > 0">
                  <li v-for="(item, index) in result.moreFunctions" :key="index">
                    <span v-if="item.enabled">
                      <i class="fa fa-lfl-check-circle lfl-text-success" />{{ item.name }}
                    </span>
                    <span v-else class="text-muted">
                      <i class="fa fa-lfl-times-circle" /> {{ item.name }}
                    </span>
                  </li>
                </ul>
                <p v-else class="text-muted text-center more_editions">
                  更多增值功能正在开发中，敬请期待
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import account from '@/api/account'
import accountChange from '@/api/accountChange'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      result: {
        moreFunctions: []
      },
      detail: {}
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '我的账户' }
    ])
    account.edition().then(({ data }) => {
      this.result = data
    })
    accountChange.get_company().then(response => {
      this.detail = response.data
    })
  }
}
</script>
<style lang="scss" scoped>
.flex{
  display: flex;
  &.items-center{
    align-items: center;
  }
  &.justify-content__center{
    justify-content: center;
  }
  &.justify-content__space-between{
    justify-content: space-between;
  }
  &.flex-wrap{
    flex-wrap: wrap;
  }
  .flex-item{
    flex: 1;
  }
  &.direction-column{
    flex-direction: column;
  }
  &.direction-row{
    flex-direction: row;
  }
  @each $col in [1,2,3,4,5,6,7,8,9,10,11,12]{
    .col-#{$col} {
      width: 100%/12*$col;
      flex: 0 0 100%/12*$col;
    }
  }
}
.img-circle {
  border-radius: 50%;
  margin: 0 10px;
}
.certificated-label {
  font-size: 12px;
  padding: 2px 8px;
  position: absolute;
  color: #5cb85c;
  background-color: rgba(92,184,92,0.1);
  border-radius: 2px;
}
.lfl-text-danger {
  color: #f64348;
}
.store_edition_row{
  padding: 30px 0;
}
.table.store_edition{
  & > tbody > tr{
    td{
      &:nth-child(1){
        padding-left: 30px;
      }
      border-top: 0;
      width: (100%/3);
      padding: 15px;
      vertical-align: baseline;
      p:first-child{
        font-size: 16px;
        margin-bottom: 20px;
      }
      p {
        margin-bottom: 10px;
        line-height: 1.8em;;

        span{
          color: #999;
        }
      }
    }

    .more_editions{
      margin-top: 100px;
    }
  }
  ul{
    overflow: hidden;
    padding: 0;
    margin: 0;
    li{
      padding: 10px 0px;
      list-style: none;
      width: 50%;
      float: left;
      position: relative;
      color: #333;
      i.fa{
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -7px;
      }
      &::before{
        content: '';
        display: inline-block;
        width: 16px;
        height: 14px;
      }
    }
  }
}
.lfl-text-success {
  color: #449D44;
}
</style>
