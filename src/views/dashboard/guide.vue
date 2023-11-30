<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          新手入门
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <h3 class="text-center">欢迎您！这里将帮您了解利多码的基本功能</h3>
        <hr>

        <div class="text-center">
          <video
            controls="controls"
            class="img-thumbnail"
            onclick="this.play();"
            poster="https://s3.cn-north-1.amazonaws.com.cn/lifanli/guide_videos/quick_start_poster_20220211.png" 
            width="800px"
          >
            <source src="https://s3.cn-north-1.amazonaws.com.cn/lifanli/globalImage/2022/12/16/43a7e15c87da47d3817e1707c426f05b.mp4" type="video/mp4">
            <embed src="https://s3.cn-north-1.amazonaws.com.cn/lifanli/globalImage/2022/12/16/43a7e15c87da47d3817e1707c426f05b.mp4" type="application/x-shockwave-flash" allowscriptaccess="always" width="800px" allowfullscreen="true">
          </video>

        </div>

        <div class="guide-card guide-step-1">
          <h4><strong>第一步，新建红包或其他礼品</strong></h4>
          <ul>
            <li>新建红包礼品，设置红包金额</li>
            <li>也可以创建其他类型的礼品</li>
            <li>礼品可以作为活动的奖品</li>
          </ul>
          <router-link :to="{name: 'GoodsListNew'}" target="_blank" class="el-button el-button--success">新建礼品</router-link>
        </div>

        <div class="guide-card guide-step-2">
          <h4><strong>第二步，创建活动</strong></h4>
          <ul>
            <li>二维码可以提前生成，在创建活动时添加</li>
            <li>有丰富的活动类型可供选择，也可自定义活动页面</li>
            <li>将上一步创建的礼品作为活动的奖品，<br>用户扫码参与活动就可以获得相应的礼品</li>
          </ul>
          <router-link :to="{name: 'ActivityListNew'}" target="_blank" class="el-button el-button--success">创建活动</router-link>
        </div>

        <div class="guide-card guide-step-3">
          <h4><strong>第三步，查看活动码、兑奖订单</strong></h4>
          <ul>
            <li>活动创建完成后，在活动详情内查看并预览活动二维码</li>
            <li>也可以查看已经兑奖订单信息</li>
            <li>二维码印刷成不干胶或卡片，就可以开始活动</li>
          </ul>
          <router-link :to="{name: 'ActivityIndex'}" target="_blank" class="el-button el-button--success">查看活动</router-link>
        </div>

        <div class="guide-card">
          <div class="flex">
            <div class="col-6">

              <h4>更多帮助</h4>
              <ul>
                <li>看到  <el-tooltip class="item" effect="dark" content="我会帮您更好的了解使用过程中的功能点" placement="top">
                  <el-button type="text"><i class="fa fa-question-circle-o" /></el-button> </el-tooltip> 图标，鼠标放上去可以获得进一步帮助</li>
                <li><a href="/lgp/portal/help" target="_blank">帮助文档</a>，帮您详细了解平台功能</li>
                <li><a href="javascript:void(0);" class="online-help">联系我们</a>，专业售后，帮您解决问题</li>
              </ul>
            </div>
            <div class="col-6">

              <h4>常见问题</h4>
              <ul>
                <li><a href="/lgp/portal/help/articles/23?cid=2" target="_blank">怎么限制用户参与活动次数？</a></li>
                <li><a href="/lgp/portal/help/articles/29?cid=2" target="_blank">活动如何更改奖项？</a></li>
                <li><a href="/lgp/portal/help/articles/26?cid=2">如何添加礼品库存？</a></li>
              </ul>
            </div>
          </div>
        </div>

        <hr>
        <div class="text-center">
          <router-link :to="{ name: 'Dashboards' }" class="el-button el-button--success">
            <i class="fa fa-home" /> 返回首页
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '新手入门' }
    ])
  }
}
</script>

<style lang="scss" scoped>

.guide-card {
  margin: 40px auto;
  padding: 40px;
  max-width: 800px;
  border: 1px solid #eeeeee;
  background: #fff no-repeat right;
  background-size: auto 200px;
}

.guide-step-1 {
  background-image: url("~@/assets/guide_1_bg.png");
}
.guide-step-2 {
  background-image: url("~@/assets/guide_2_bg.png");
  background-size: auto 170px;
}
.guide-step-3 {
  background-image: url("~@/assets/guide_3_bg.png");
  background-size: auto 180px;
}

.play_link{
  .video_cover_img{
    max-width: 160px;
    display: block;
  }
}

.videos{
  .media {
    padding: 20px 0px;
    border-bottom: 1px #eee solid;
  }
}

strong {
  color: #d8120e;
  padding: 0px 3px;
}
</style>
