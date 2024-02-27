<template>
  <nav class="navbar">
    <div class="container flex justify-content__space-between items-center">
      <img src="@/assets/sign_in_logo.png" class="logo">
      <div>
        <el-button type="danger" @click="redirect('/lmp/portal/admin/sign_up')">
          <i class="fa fa-sign-in" />
          免费试用
        </el-button>
        <el-button @click="redirect('/lmp/portal/admin/sign_in')">
          <i class="fa fa-user" />
          登录
        </el-button>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  methods: {
    redirect(url) {
      window.location.href = url
    }
  }
}
</script>
