<template>
	<view class="container">
		<u-navbar back-text=" " title="下单成功" :border-bottom="false" :custom-back="customBack"></u-navbar>
		<view class="u-m-b-80">
			<view v-if="planFreePay == '1'" class="top-tip u-p-l-32 u-m-b-10 u-font-28 u-font-bold">
				<u-icon name="error-circle" class="u-m-r-6"></u-icon>
				<text>该笔订单为先货后款，请按结算周期回款。</text>
			</view>
			<view v-if="payMode == '2'" class="top-tip u-p-l-32 u-m-b-10 u-font-28 u-font-bold">
				<u-icon name="error-circle" class="u-m-r-6"></u-icon>
				<text>该笔订单使用了授信支付，请记得及时还款。</text>
			</view>
			<view v-if="success=='0'" class="top-tip u-p-l-32 u-m-b-10 u-font-28 u-font-bold">
				<u-icon name="error-circle" class="u-m-r-6"></u-icon>
				<text>订单未成功支付，请进入订单管理模块支付订单。</text>
			</view>
		</view>
		
		<view class="u-m-t-38">
			<u-empty text="下单成功" mode="list" src="/static/images/contract/xia_dan_cheng_gong.png">
				<view slot="bottom" class="btns u-m-t-32">
					<u-button size="mini" :custom-style="customStyle" shape="circle" type="default" @click="backToIndex">返回首页</u-button>
					<u-button size="mini" :custom-style="customStyle" shape="circle" type="primary" @click="seeOrder">查看订单</u-button>
				</view>
			</u-empty>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			payMode: '',
			planFreePay:'',
			success:'',
			customStyle: {
				padding: '10rpx 32rpx',
				marginRight: '32rpx',
				marginLeft: '32rpx',
				height: '64rpx'
			}
		}
	},
	onLoad(params) {
		this.payMode = params.payMode
		this.success = params.success
		this.planFreePay = params.planFreePay //0:先款后货，1:先货后款
	},
	methods: {
		customBack() {
			uni.switchTab({
				url:'/pages/contract/index'
			})
		},
		backToIndex() {
			uni.switchTab({
				url: '/pages/index/index'
			})
		},
		seeOrder() {
			uni.switchTab({
				url: '/pages/order/index'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.top-tip {
	background-color: #fdf3e5;
	color: #f28b00;
	line-height: 72rpx;
}
.btns {
	.u-btn {
		padding: 10rpx 32rpx;
	}
	.u-btn + .u-btn {
		margin-left: 32rpx;
	}
}
</style>
