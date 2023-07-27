# 商户后台

[简体中文]

**演示地址:** https://admin.lfl5.cn/admin

## 运行
```bash
# install dependency
yarn install

# develop
yarn dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
yarn build:stage

# build for production environment
yarn build:prod
```
## 组件说明
- 选择礼品弹窗
```bash
<template>
	<div class="app-container">
		<goods-dialog v-if="goodsModal" :show.sync="goodsModal" :except="['other', 'coupon']" :type-in="typeIn">
			<template slot="action" slot-scope="row">
				<el-button type="text" @click="select(row.data)">选择</el-button>
			</template>
		</goods-dialog>
	</div>
</template>
<script>			     
import GoodsDialog from '@/components/Goods/modal.vue'
export default {
	components: { GoodsDialog },
	data() {
		goodsModal: false,
		typeIn: {
			red_pack: [{ value: '小额红包', key: 'Good::CashGood' }]
		}
	}
}
</script>
 
```