<template>
	<!-- 订单 -->
	<view class="order-item u-p-t-32 u-p-l-32 u-p-r-32 u-p-b-0 u-m-b-16">
		<view class="header u-row-between u-font-xs">
			<view class="title"><slot name="title"></slot></view>
			<view class="status u-font-bold u-font-28"><slot name="status"></slot></view>
		</view>
		<view class="content"><slot name="default"></slot></view>
		<slot name="footer">
			<view class="footer u-flex u-row-between">
				<view class="create-time u-font-xs color-gray">{{ orderDetail && orderDetail.createTime }}</view>
				<view class="btns"><slot name="btns"></slot></view>
			</view>
		</slot>
	</view>
</template>

<script>
export default {
	props: {
		orderDetail: {
			type: Object,
			default: () => {}
		}
	},
	components: {},
	data() {
		return {}
	},
	onLoad() {},
	methods: {}
}
</script>

<style lang="scss" scoped>
.order-item {
	background-color: #ffffff;
	border-radius: 10rpx;
	.header {
		display: flex;
		.title {
			width: 100%;
			line-height: 36rpx;
		}
		.status {
			width: max-content;
			color: $main-color;
		}
	}
	.footer {
		position: relative;
		height: 107rpx;
		.btns {
			display: flex;
		}
	}
}
</style>
