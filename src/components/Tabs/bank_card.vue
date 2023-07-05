<template>
  <ul class="nav nav-tabs page-tabs">
    <li :class="{'active': ['BankCardIndex', 'BankCardNew', 'BankCardEdit'].includes($route.name)}">
      <router-link :to="{name: 'BankCardIndex'}">提现银行卡设置</router-link>
    </li>
    <li :class="{'active': ['Invoice', 'InvoiceNew', 'InvoiceEdit' ].includes($route.name)}">
      <router-link :to="{name: 'Invoice'}">发票信息设置</router-link>
    </li>
  </ul>
</template>

<script>
export default {

}
</script>

