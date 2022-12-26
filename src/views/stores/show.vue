<template>
  <div class="app-container">
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex store_info">
          <div class="flex col-6 items-center">
            <img class="img-circle" src="https://s3.cn-north-1.amazonaws.com.cn/lifanli-development/stores/logos/000/000/001/small/0_%281%29.jpeg?1662453891" alt="0 %281%29" width="60" height="60">
            <div>
              <p>
                <span class="name">账户名称：活动商户</span>
              </p>
              <p>
                <span class="name">账户ID：4517239960</span>
              </p>
            </div>
          </div>

          <div class="flex col-6 items-center">
            <div>
              <p>
                <span class="name">企业名称：辽宁尼尔科达环保材料有限公司</span>
              </p>
              <p>
                <span class="name">
                  实名认证：
                  <a class="certificated-label" href="/admin/account_changes/current_certification">已认证</a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel panel-default">
  
  <div class="panel-heading">
    <i class="fa fa-store-edition lfl-text-danger"></i> 当前版本
  </div>
  <div class="store_edition_row table-responsive">
  <table class="table store_edition">
    <tbody><tr>
      <td>
        <p>基本信息：</p>
        <p>
          <span>平台版本：</span><br>
          旗舰版
        </p>
        <p>
          <span>有效期至：</span><br>
          2023-11-18
        </p>
        <p>
          <span>管理员数量：</span><br>
          10
        </p>
        <p>
          <span>服务器配置：</span><br>
          独立服务器（基准处理能力50次/秒）x1台
        </p>
      </td>
      <td>
        <p>旗舰版：</p>
        <ul>
      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>二维码营销
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>基础防窜
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>公众号营销
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>卡券核销
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>基础账户系统
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>企业微信
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>基础数据分析
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>导购返利
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>基础用户管理
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>会员注册
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>黑名单
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>分享有礼
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>短信群发
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>集卡活动
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>附加礼品
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>高级抽奖规则
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>复购红包
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>会员运营
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>一码多扫
  </li>

      <li>
      <span class="text-muted"><i class="fa fa-lfl-times-circle"></i> 高级数据分析<span>
  </span></span></li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>积分商城
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>渠道卡券核销
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>产品管理
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>追溯防窜
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>防伪溯源
  </li>

      <li>
      <span class="text-muted"><i class="fa fa-lfl-times-circle"></i> 智能数据大屏<span>
  </span></span></li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>渠道管理
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>开心种树小游戏
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>子活动
  </li>

      <li>
      <i class="fa fa-lfl-check-circle lfl-text-success"></i>子管理员系统
  </li>

</ul>

      </td>
      <td>
        <p>增值功能：</p>
          <p class="text-muted text-center more_editions">
            更多增值功能正在开发中，敬请期待
          </p>
      </td>
    </tr>
  </tbody></table>
  </div>

</div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '我的账户' }
    ])
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
  margin-left: -15px;
  margin-right: -15px;
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
