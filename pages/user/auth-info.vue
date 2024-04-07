<template>
	<view class="container">
		<view class="auth-status-bg u-p-l-32 u-flex auth-ing" v-if="vuex_user.authStatus <= 1">
			<image src="/static/images/warn-icon.png" class="u-m-r-20"></image>
			<view>账号认证中</view>
		</view>
		<view class="auth-status-bg u-p-l-32 u-flex" v-if="vuex_user.authStatus == 2">
			<image src="/static/images/ok_icon.png" class="u-m-r-20"></image>
			<view>账号已认证</view>
		</view>
		<view class="auth-status-bg u-p-l-32 u-flex auth-ing" v-if="vuex_user.authStatus == 3">
			<image src="/static/images/warn-icon.png" class="u-m-r-20"></image>
			<view>账号认证失败</view>
		</view>
		<view class="u-p-l-32 u-p-r-32"
			v-if="vuex_user.detail.businessLicense && vuex_user.detail.businessLicense != ''">
			<view class="title-info">账号信息</view>
			<view class="divider-line" />
			<d-key-value lable="认证账号" :value="vuex_user.loginAccount"></d-key-value>
			<d-key-value lable="注册号码" :value="vuex_user.parentMobile"></d-key-value>
			<d-key-value lable="联系人" :value="vuex_user.detail.contactName"></d-key-value>
			<d-key-value lable="联系电话" :value="vuex_user.detail.contactPhone"></d-key-value>

			<view class="title-info">企业信息</view>
			<view class="divider-line"></view>
			<d-key-value lable="企业名称" :value="vuex_user.detail.companyName"></d-key-value>
			<d-key-value lable="社会信用代码" :value="vuex_user.detail.businessLicense"></d-key-value>
			<d-key-value lable="企业地址" :value="vuex_user.detail.companyAddr"></d-key-value>
			<d-key-value lable="注册资本" :value="vuex_user.detail.registeredCapital/10000+'万元'"></d-key-value>
			<d-key-value lable="注册日期" :value="vuex_user.detail.registeredTime.split(' ')[0]"></d-key-value>
			<d-key-value lable="营业期限" v-if="vuex_user.detail.businessTerm.length < 12"
				:value="vuex_user.detail.businessTerm"></d-key-value>
			<d-key-value lable="营业期限" v-if="vuex_user.detail.businessTerm.length > 12"
				:value="vuex_user.detail.businessTerm.split(',')[0].split(' ')[0]+' 至 '+vuex_user.detail.businessTerm.split(',')[1].split(' ')[0]">
			</d-key-value>
			<d-key-value lable="法人姓名" :value="vuex_user.detail.corpName"></d-key-value>
			<d-key-value lable="法人身份证" :value="vuex_user.detail.corpIdno"></d-key-value>

			<view class="title-info">证件信息</view>
			<view class="divider-line" />

			<view class="u-p-l-32 card-list u-m-t-40">
				<image :src="$appUtils.getPic(vuex_user.detail.prefixUrl,vuex_user.detail.backIdCardUrl)"
					mode="widthFix" style="border: 1px solid #f5f5f5;" v-if="vuex_user.detail.frontIdCardUrl"></image>
				<image src="./static/images/me/id_card_1.jpg" mode="widthFix" v-else></image>
				<image :src="$appUtils.getPic(vuex_user.detail.prefixUrl,vuex_user.detail.frontIdCardUrl)"
					mode="widthFix" style="border: 1px solid #f5f5f5;" v-if="vuex_user.detail.frontIdCardUrl"></image>
				<image src="./static/images/me/id_card_2.jpg" mode="widthFix" v-else>
				</image>
				<image :src="$appUtils.getPic(vuex_user.detail.prefixUrl,vuex_user.detail.businessLicenseUrl)"
					mode="widthFix" style="border: 1px solid #f5f5f5;" v-if="vuex_user.detail.businessLicenseUrl"></image>
				<image src="./static/images/me/zhizhao.jpg" mode="widthFix" v-else></image>
			</view>
		</view>
		<view class="u-p-l-32 u-p-r-32"
			v-if="!vuex_user.detail.businessLicense || vuex_user.detail.businessLicense == ''">
			<view class="title-info">账号信息</view>
			<view class="divider-line" />
			<d-key-value lable="认证账号" :value="vuex_user.loginAccount"></d-key-value>
			<d-key-value lable="注册号码" :value="vuex_user.parentMobile"></d-key-value>


			<view class="title-info">身份信息</view>
			<view class="divider-line"></view>
			<d-key-value lable="姓名" :value="vuex_user.detail.corpName"></d-key-value>
			<d-key-value lable="身份证号" :value="vuex_user.detail.corpIdno"></d-key-value>
			<d-key-value lable="联系电话" :value="vuex_user.detail.contactPhone"></d-key-value>
			<view class="title-info">证件信息</view>
			<view class="divider-line" />

			<view class="u-p-l-32 card-list u-m-t-40">
				<image :src="$appUtils.getPic(vuex_user.detail.prefixUrl,vuex_user.detail.backIdCardUrl)"
					mode="widthFix" v-if="vuex_user.detail.frontIdCardUrl"></image>
				<image src="./static/images/me/id_card_1.jpg" mode="widthFix" v-else></image>
				<image :src="$appUtils.getPic(vuex_user.detail.prefixUrl,vuex_user.detail.frontIdCardUrl)"
					mode="widthFix" v-if="vuex_user.detail.frontIdCardUrl"></image>
				<image src="./static/images/me/id_card_2.jpg" mode="widthFix" v-else>
				</image>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				// vuex_user: this.$store.state.vuex_user
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.auth-ing {
		background: #FDF3E5 !important;
		color: #F28B00 !important;
	}

	.auth-status-bg image {
		width: 32rpx;
		height: 32rpx;
	}

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
