<template>
  <footer class="site-footer">
    <div class="container footer-content">
      <el-row>
        <el-col :span="8" :xs="{ span: 24 }">
          <h5>关注我们</h5>
          <p>
            <img src="@/assets/weixin_qr_150x150.jpg" alt="Weixin qr 150x150">
          </p>
        </el-col>
        <el-col :span="8" :xs="24">
          <h5>联系我们</h5>
          <p>
            电话：400-626-9026 <br>
            邮箱：sw@lifanli.cn <br>
            QQ：514341685 <br>
            地址：北京市海淀区学清路六道口<br>金码大厦B座20层
          </p>
        </el-col>
        <el-col :span="8" :xs="24">
          <h5>全国服务热线</h5>
          <p>
            <span class="hotline">
              <i class="fa fa-phone fa-fw" /><i><a href="tel:400-626-9026">400-626-9026</a></i>
            </span>
          </p>
          <p>
            服务时间：<br>
            周一至周六，8：00 至 22：00
          </p>
        </el-col>
      </el-row>
    </div>

    <div class="site-info text-center">
      <a href="http://www.lifanli.cn">© {{ getFullYear }} 利多码</a> | 京ICP备15038871号
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    getFullYear() {
      var current = new Date()
      return current.getFullYear()
    }
  }
}
</script>
