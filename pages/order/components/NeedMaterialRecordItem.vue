<template>
	<!-- 订单 -->
	<view class="need-material-record-item u-flex u-row-between u-p-t-32 u-p-l-32 u-p-r-32 u-p-b-0 u-m-b-16">
		<view class="left u-row-between u-font-xs">
			<view class="title"><slot name="title">{{ detail.title }}</slot></view>
			<view class="status u-font-bold u-font-28"><slot name="status">{{ detail.status }}</slot></view>
		</view>
		<slot name="right">
			
		</slot>
	</view>
</template>

<script>
export default {
	props: {
		detail: {
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
.need-material-record-item {
	background-color: #ffffff;
	border-radius: 10rpx;
	.left {
		display: flex;
		padding-bottom: 12rpx;
		border-bottom: 1px solid $border-color;
		.title {
			width: 100%;
			line-height: 36rpx;
		}
	}

}
</style>
