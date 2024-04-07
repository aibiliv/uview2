<template>
	<!-- 订单 -->
	<view class="need-material-item u-p-t-32 u-p-l-32 u-p-r-32 u-p-b-0 u-m-b-16">
		<view class="header u-row-between u-font-xs">
			<view class="title"><slot name="title">{{ detail.title }}</slot></view>
			<view class="status u-font-bold u-font-28"><slot name="status">{{ detail.status }}</slot></view>
		</view>
		<view class="content"><slot name="default"></slot></view>
		<slot name="footer">
			<view class="footer u-flex u-row-between">
				<view class="create-time u-font-xs color-gray">二叠纪 {{ detail && detail.createTime }} 发起</view>
				<view class="btns"><slot name="btns"></slot></view>
			</view>
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
.need-material-item {
	background-color: #ffffff;
	border-radius: 10rpx;
	.header {
		display: flex;
		padding-bottom: 12rpx;
		border-bottom: 1px solid $border-color;
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
		height: 96rpx;
		.btns {
			display: flex;
		}
	}
}
</style>
