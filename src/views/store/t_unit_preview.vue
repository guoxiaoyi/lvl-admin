<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          追溯功能概览
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-heading no-border-bottom">
        <h4 style="font-size: 16px; font-weight: 400">功能介绍</h4>
      </div>
      <div class="panel-body">
        <ul class="flex flex-wrap card-scene">
          <li v-for="(scene, index) in scenes" :key="index" class="col-6">
            <dl class="flex">
              <dt><img :src="require('@/assets/t_units/' + scene.image)"></dt>
              <dd>
                <h4>{{ scene.title }}</h4>
                <p>{{ scene.desc }}</p>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
      <div class="panel-heading no-border-bottom">
        <h4 style="font-size: 16px; font-weight: 400">追溯防窜流程</h4>
      </div>
      <div class="panel-body">
        <ul class="flex card-step">
          <li class="col-3 flex">
            <div class="step"><span>第一步</span></div>
            <div class="content">
              <h4>生成追溯码</h4>
              <div class="sub-step">
                <p> 1.进入<span>【追溯码管理】</span>模块 </p>
                <p> 2.创建追溯码、套码 </p>
                <p> 3.设置追溯码生成级别、追溯码数量 </p>
              </div>
              <router-link :to="{name: 'LevelTunitExportIndex'}"> 点击跳转&gt;&gt;</router-link>
            </div>
          </li>
          <li class="col-3 flex">
            <div class="step"><span>第二步</span></div>
            <div class="content">
              <h4>创建批次</h4>
              <div class="sub-step">
                <p> 1.进入<span>【生产批次管理】</span>模块 </p>
                <p> 2.创建生产批次</p>
                <p> 3.选择产品、套码规格</p>
                <p> 4.关联追溯码或套码 </p>
                <p> 5.生产入库 </p>
              </div>
              <router-link :to="{name: 'TUnitBatchesNew'}"> 点击跳转&gt;&gt;</router-link>
            </div>
          </li>
          <li class="col-3 flex">
            <div class="step"><span>第三步</span></div>
            <div class="content">
              <h4>产品出入库</h4>
              <div class="sub-step">
                <p>1.进入<span>【库存管理】</span>模块</p>
                <p>2.创建出、入库单 </p>
                <p>3.扫产品码添加产品 </p>
                <p>4.完成出入库 </p>
              </div>
              <router-link :to="{name: 'TChannelProductsIndex'}"> 点击跳转&gt;&gt;</router-link>
            </div>
          </li>
          <li class="col-3 flex">
            <div class="step"><span>第四步</span></div>
            <div class="content">
              <h4>追溯防窜</h4>
              <div class="sub-step">
                <p> 1.用户扫码查看追溯信息</p>
                <p> 2.渠道举报窜货、自动生成窜货预警 </p>
              </div>
              <router-link :to="{name: 'FleeingIndex'}"> 点击跳转&gt;&gt;</router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scenes: [
        {
          image: 'qr.png',
          title: '追溯码管理',
          desc: '可以为每个产品附上独立的身份编号，帮助产品的出库、入库、销售等各个环节形成完善的产品信息追溯闭环。'
        },
        {
          image: 'defense.png',
          title: '产品防窜',
          desc: '可全程监控产品的流向，防止渠道跨区域窜货。实时监督产品流向，若出现窜货，可根据系统预警数据，快速处理。'
        },
        {
          image: 'manage.png',
          title: '库存管理',
          desc: '管理产品的库存信息、批次信息、追溯码信息等，进行产品的各类出、入库操作，保证产品的来源可追溯、去向可查证。'
        },
        {
          image: 'rebate.png',
          title: '入库返利',
          desc: '设置入库返利规则，对产品入库渠道进行返利，帮助商家推动出、入库，更好的完善追溯流程。'
        }
      ]
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯功能概览' }
    ])
  }
}
</script>

<style lang="scss" scoped>
.no-border-bottom {
  border-bottom: none;
}
.card-scene{
  margin-left: -15px;
  margin-right: -15px;
  [class^='col-']{
    padding: 10px 15px;
    dl{
      height: 100%;
      border: 1px dashed #BBB;
      padding: 30px;
      border-radius: 8px;
      img{
        width: 40px;
        margin-right: 20px;
      }
      h4{
        margin-top: 0;
      }
      p{
        margin-bottom: 0;
        font-size: 14px;
        color: rgba(136, 136, 136, 1);
      }
    }
  }
}
.card-step{
  margin-left: -15px;
  margin-right: -15px;
  [class^='col-']{
    flex-direction: column;
    &:first-child{
      .step{
        margin-left: 15px;
      }
    }
    &:last-child{
      .step{
        margin-right: 15px;
      }
    }
  }
  .step{
    position: relative;
    height: 24px;
    text-align: center;
    span{
      display: inline-block;
      line-height: 24px;
      border-radius: 24px;
      color: #FFF;
      background: rgba(243, 69, 65, 1);
      text-align: center;
      font-size: 14px;
      padding: 0 11px;
      position: relative;
      z-index: 1;
    }
    &:after{
      display: block;
      content: '';
      width: 100%;
      height: 1px;
      background: rgba(243, 69, 65, 1);
      top: 12px;
      position: absolute;
    }
  }
  .content{
    padding: 40px 26px;
    background: rgba(248, 248, 248, 1);
    margin: 10px 15px;
    border-radius: 8px;
    height: 100%;
    h4{
      margin-bottom: 20px;
    }
    .sub-step{
      min-height: 120px;
    }
    p{
      color: rgba(153, 153, 153, 1);
      margin-bottom: 5px;
      span{
        color: #000;
      }
    }
  }
}
</style>
