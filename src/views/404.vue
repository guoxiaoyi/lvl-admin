<template>
  <div class="wscn-http404-container">
    <div class="container text-center error-404">
      <img :src="require('@/assets/404_images/404.png')" class="error">
      <h1>页面未找到</h1>
    </div>
    <p class="text-center">访问地址有误，或数据已删除，请核对后再试。</p>
    <div class="container text-center">
      <a href="/admin" class="button">返回首页</a>
      <a href="javascript:;" class="button" onClick="javascript :history.back(-1);">上一页</a>
    </div>
    <div class="footer text-center"> &copy; 2024 立返利</div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  },
  mounted() {
    // const base_url = process.env.NODE_ENV === 'production' ? 'https://admin.lifanli.cn' : 'https://admin.lfl5.cn'
    // if (process.env.NODE_ENV === 'production') {
    //   window.location.href = `${base_url}/public/404.html`
    // }
  }
}
</script>

<style lang="scss" scoped>
body, img, p, span, a, h1{
  margin: 0px;
  padding: 0px;
}
body{
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
html{
  font-size: 62.5%;
}
a {
  text-decoration: none;
}

.container{
  width: 38%;
  margin: 0 auto;
}

.text-center{
  text-align: center;
}
.container img{
  width: 100%;
  vertical-align: middle;
}
/*.container.error-500{
  width:70.4rem;
}
.container.error-404{
  width:72.2rem;
}
.container.error-503{
  width:72rem;
}
.container.error-maintenance{
  width:72.4rem;
}*/
h1{
  font-size: 28px;
  font-weight: normal;
  color: #333333;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
}
p.text-center{
  color: #666;
  font-size: 16px;
  padding-bottom: 45px;
}
img.error{
  margin-top: 15%;
  margin-left: -30px;
  margin-bottom: 30px;
}
a.button{
  display: inline-block;
  width: 114px;
  height: 40px;
  border-radius: 4px;
  background: #f64348;
  color: #FFF;
  line-height: 40px;
  font-size: 16px;
  margin: 0px 5px;
  box-sizing: border-box;
}
.footer{
  font-size: 16px;
  color: #9a9a9a;
  position: fixed;
  line-height: 40px;
  bottom: 20px;
  width: 100%;
}
@media (max-width:480px){
  .container{
    max-width: 320px!important;
    width: 70%;
  }
  img.error{
    margin-top: 35%;
    margin-left: auto;
    margin-bottom: 20px;
  }
  h1{
    font-weight: bold;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  p.text-center{
    font-size: 14px;
    white-space: nowrap;
  }
  a.button{
    display: none;
  }
  .footer{
    font-size: 12px;
    bottom: 15px;
  }
}
/*
@media screen and (min-width:360px) and (max-width:374px) and (orientation:portrait) {
    html { font-size: 70.3%; }
}
@media screen and (min-width:375px) and (max-width:383px) and (orientation:portrait) {
    html { font-size: 73%; }
}
@media screen and (min-width:384px) and (max-width:399px) and (orientation:portrait) {
    html { font-size: 75%; }
}
@media screen and (min-width:400px) and (max-width:413px) and (orientation:portrait) {
    html { font-size: 78%; }
}
@media screen and (min-width:414px) and (max-width:431px) and (orientation:portrait){
    html { font-size: 80%; }
}
@media screen and (min-width:432px) and (max-width:479px) and (orientation:portrait){
    html { font-size: 84%; }
}*/
@media (max-width:1300px){
  html { font-size: 50.5%; }
  a.button{
    width: 102px;
    height: 36px;
    line-height: 36px;
  }
}

</style>
