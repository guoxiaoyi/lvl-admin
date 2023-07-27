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
// GoodsDialog 接收参数说明
// 礼品有四大类型: [{ key: 'red_pack', value: '红包' }, 
				  { key: 'other', value: '礼品' }, 
				  { key: 'point', value: '积分' }, 
				  { key: 'coupon', value: '优惠券' }]
// show.sync   控制组件显示
// except      不显示哪些类型按钮 数据类型为 Array, 如: ['red_pack', 'other']
// typeIn      分类下的小类 数据类型为 Object, 该参数为满足只显示某个大类型下的小类, 当小类只有1个时，typeIn下拉不可清空
               例如： 只显示 红包 下的 小额红包
			   接口查询条件为 category=red_pack&typeIn=Good::CashGood
			   应传数为 { red_pack: [{ value: '小额红包', key: 'Good::CashGood' }] }
			   
			     
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