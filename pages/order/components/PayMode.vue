<template>
	<view class="pay-mode">
		<u-cell-group :border="false">
			<u-radio-group v-model="supplementObj.payMode" @change="change">
				<u-cell :border-bottom="false" :arrow="false"  v-if="supplementObj.payMode === 2 || supplementObj.payCreditShow === 1">
					<view slot="title" class="u-font-bold u-font-32 color-black">授信支付</view>
					<view slot="label" class="u-font-24">剩余额度 {{ supplementObj && supplementObj.residueAmount }} 元</view>
					<image slot="icon" style="width: 40rpx;height:40rpx" class="u-m-r-20" src="@/static/images/contract/shouxin.png"></image>
					<u-radio size="40" shape="circle" :name="2" :active-color="vuex_main_color"></u-radio>
				</u-cell>
				<u-cell :border-bottom="false" :arrow="false"  v-if="supplementObj.payMode === 1 || supplementObj.payOfflineShow === 1">
					<view slot="title" class="u-font-bold u-font-32 color-black">线下支付</view>
					<view slot="label" class="u-font-24">账户余额{{supplementObj.remainingAmount}}元</view>
					<image slot="icon" style="width: 40rpx;height:40rpx" class="u-m-r-20" src="@/static/images/contract/xianxia.png"></image>
					<u-radio size="40" shape="circle" :name="1" :active-color="vuex_main_color"></u-radio>
				</u-cell>
				<u-cell :border-bottom="false" :arrow="false"  v-if="supplementObj.payMode === 3 || supplementObj.payOnlineShow === 1">
					<view slot="title" class="u-font-bold u-font-32 color-bfbfbf">在线支付</view>
					<image slot="icon" style="width: 40rpx;height:40rpx" class="u-m-r-20" src="@/static/images/contract/zaixian.png"></image>
					<u-radio size="40" shape="circle" :name="3" disabled></u-radio>
				</u-cell>
			</u-radio-group>
		</u-cell-group>
	</view>
</template>

<script>
import { mapState } from 'vuex'
export default {
	props: {
		supplementObj: {
			type: Object,
			default: () => {}
		}
		// type: {
		// 	type:String|Number,
		// 	default:''
		// },
	},
	data() {
		return {
			
		}
	},
	computed: {
		...mapState(['vuex_main_color'])
	},
	methods: {
		change(val) {
			this.supplementObj.payMode = val
			console.log('index', val)
			this.$emit('changePayMode', val)
		}
	}
}
</script>

<style></style>
