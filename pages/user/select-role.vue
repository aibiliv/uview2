<template>
	<view class="page-center u-m-l-48 u- u-m-r-48" style="position: relative;">
		<view class="top-text-1 top-text">您好！</view>
		<view class="top-text u-flex">
			<view class="u-m-r-10">欢迎来到二叠纪商城</view>
		</view>
		<view class="content u-m-t-80">
			<!-- 参数 roleKey  在采购商登录就传 1  供应商传2 -->
			<view>
				<view class="select-role-item" @click="selectRole(1)">
					<image src="/static/images/login/bg-role1.jpg" class="bg" />
					<image src="/static/images/login/role1-icon.png" class="icon" />
					<view>采购商登录</view>
				</view>

				<view class="select-role-item u-m-t-32" @click="selectRole(2)">
					<image src="/static/images/login/bg-role2.jpg" class="bg" />
					<image src="/static/images/login/role2-icon.png" class="icon" />
					<view class="color-222">供应商登录</view>
				</view>
				<view class="u-flex u-m-t-20 color-595959 u-row-between">
					<view @click="goIndex">游客模式</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad() {},
		methods: {
			selectRole(type) {
				this.$u.vuex('vuex_roleKey', type);
				uni.navigateTo({
					url: '/pages/user/login'
				})
			},
			goIndex() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		}
	};
</script>

<style lang="scss">
	.select-role-item {
		width: 654rpx;
		height: 180rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			border-radius: 6rpx;
		}

		.icon {
			height: 84rpx;
			width: 84rpx;
			z-index: 100;
		}

		view {
			margin-left: 16rpx;
			font-size: 32rpx;
			color: #ffffff;
			font-weight: 500;
			z-index: 100;
		}
	}

	.content {
		background-color: white;
		// position: absolute;
		margin-top: 0rpx;
		width: 100%;
		// border-top-left-radius: 40rpx;
		// border-top-right-radius: 40rpx;
	}

	.top-text-1 {
		margin-top: 220rpx !important;
		// margin-left: 48rpx !important;
		font-size: 48rpx !important;
	}

	.top-text {
		width: 100%;
		// position: absolute;
		margin-top: 40rpx;
		// margin-left: 48rpx;
		color: #222222;
		font-size: 48rpx;
		font-weight: bold;
	}

	.top-bg {
		width: 100%;
		height: 421rpx;
		position: absolute;
		top: 0;
	}

	.select-account-box {

		display: flex;
		flex-direction: column;
		align-items: center;

		.title {
			padding: 48rpx 48rpx 18rpx 48rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #222222;
		}

		.item {
			margin-bottom: 10rpx;
			width: 534rpx;
			min-height: 110px;
			background: #F5F5F5;
			border-radius: 8rpx;
			border: 1rpx solid #D9D9D9;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 16rpx 32rpx;
		}

		.active {
			background: rgba(203, 74, 43, 0.1) !important;
			border: 1px solid #CB4A2B !important;
		}

		.btn {
			padding: 22rpx 0;
			flex: 1;
			text-align: center;
		}
	}
</style>
