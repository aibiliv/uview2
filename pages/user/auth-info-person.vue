<template>
	<view class="container">
		<view class="auth-status-bg u-p-l-32 u-flex">
			<view>账号已认证</view>
		</view>
		<view class="u-p-l-32 u-p-r-32">
			<view class="title-info">账号信息</view>
			<view class="divider-line" />
			<d-key-value lable="认证账号" value="ACCOUNT"></d-key-value>
			<d-key-value lable="注册号码" value="141****5127"></d-key-value>

			<view class="title-info">身份信息</view>
			<view class="divider-line" />
			<d-key-value lable="姓名" value="成都新源科技有限公司"></d-key-value>
			<d-key-value lable="身份证号" value="456469216554831351546DL"></d-key-value>
			<d-key-value lable="联系电话" value="上海上海市卢湾区兴华胡同981号"></d-key-value>

			<view class="title-info">证件信息</view>
			<view class="divider-line" />

			<view class="u-p-l-32 card-list u-m-t-40">
				<image src="./static/images/me/id_card_1.jpg" mode="widthFix"></image>
				<image src="./static/images/me/id_card_2.jpg" mode="widthFix"></image>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.auth-status-bg {
		width: 750rpx;
		height: 72rpx;
		background: #E0F2E5;
		font-size: 28rpx;
		font-weight: 500;
		color: #2EA84F;
		line-height: 72rpx;
	}

	.title-info {
		width: 100%;
		height: 100rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #222222;
		line-height: 100rpx;
	}

	.card-list image {
		width: 620rpx;
		height: 400rpx;
		margin-bottom: 40rpx;
	}
</style>
