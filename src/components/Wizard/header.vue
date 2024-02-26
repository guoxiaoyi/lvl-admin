<template>
  <nav class="navbar navbar-default hidden-print">
    <div class="container-fluid">
      <div class="navbar-header">
        <span class="navbar-toggle collapsed glyphicon glyphicon-menu-hamburger toggle-nav-btn" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        </span>
        <a class="navbar-brand" href="/admin">
          <img alt="利多码" src="/assets/logo_for_admin_white-a4807d6dd19314ba1c76cb857a8a273e9b59620df2d390c4e0a691a762c35ba6.png">
        </a>
      </div>

      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav navbar-right">
          <li class="dark dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
              <i class="fa fa-user fa-fw"></i> 楚俄<span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a rel="nofollow" data-method="delete" href="/admin/sign_out">
                  <i class="fa fa-sign-out fa-fw"></i> 退出
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style lang="scss" scoped>
.navbar {
  width: 100%;
  min-width: 10;
  height: 42px;
  display: flex;
  background: #F34541;
  align-items: center;
  justify-content: space-between;
  img {
    vertical-align: middle;
  }
  .navbar-header a {
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      padding-left: 10px;
      border-left: 1px solid #fff;
      color: #FFF;
    }
  }
  .logo {
    height: 20px;
    margin-right: 10px;
    margin-top: -2px;
  }
  .navbar-header {
    padding: 0 15px;
  }
  &:before, &:after {
    display: none;
  }
}
.navbar-accont-info {
  padding-right: 30px;
  display: flex;
  a {
    color: #FFF;
  }
  & > .item {
    cursor: pointer;
    padding: 10px 15px;
    color: #FFF;
  }
  .envelope {
    background: #f01611;
    display: inline-block;
    cursor: pointer;
    padding: 10px 15px;
    color: #FFF;
  }
  .help{
    background: #da120e;
  }
  .my_account{
    background:#c2100c;
  }
  .caret {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }
  .badge {
    display: inline-block;
    min-width: 10px;
    padding: 3px 7px;
    font-size: 12px;
    font-weight: bold;
    color: #da120e;
    line-height: 1;
    vertical-align: baseline;
    white-space: nowrap;
    text-align: center;
    background-color: #FFF;
    border-radius: 10px;
  }
}
</style>
