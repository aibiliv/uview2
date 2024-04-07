<template>
	<view class="container">
		<view style="background-color: #FFFFFF;" class="u-p-l-32 u-p-r-32 u-p-t-32">
			<view class="u-flex u-row-between u-p-t-26 u-p-b-26" @click="clickAuthBtn()">
				<view class="u-flex u-row-between u-flex-1">
					<view class="color-222 u-font-32">认证信息</view>
					<view class="color-bfbfbf">{{ getAuthStatusText(vuex_user.authStatus) }}</view>
				</view>

				<u-icon name="arrow-right" color="#BFBFBF" size="28" class="u-m-l-18"></u-icon>
			</view>

			<view class="divider-line "></view>
			<view class="u-flex u-row-between u-p-t-26 u-p-b-26" @click="$u.route('/pages/user/reset-password')">
				<view class="u-flex  u-row-between u-flex-1">
					<view class="color-222 u-font-32">登录密码</view>
				</view>

				<u-icon name="arrow-right" color="#BFBFBF" size="28" class="u-m-l-18"></u-icon>
			</view>

			<view class="divider-line "></view>
			<view v-if="vuex_roleKey === 1" class="u-flex u-row-between u-p-t-26 u-p-b-26"
				@click="$u.route('/pages/user/pay-password')">
				<view class="u-flex  u-row-between u-flex-1">
					<view class="color-222 u-font-32">支付密码</view>
					<view class="color-bfbfbf">{{ isPayPassword ? '已设置' : '未设置' }}</view>
				</view>

				<u-icon name="arrow-right" color="#BFBFBF" size="28" class="u-m-l-18"></u-icon>
			</view>

			<view class="divider-line "></view>
			<view class="u-flex u-row-between u-p-t-26 u-p-b-26" v-if="vuex_user.authStatus !== 0"
				@click="$u.route('/pages/user/link-person')">
				<view class="u-flex  u-row-between u-flex-1">
					<view class="color-222 u-font-32">联系人</view>
					<view class="color-bfbfbf">
						{{ vuex_user.detail && vuex_user.detail.contactName && vuex_user.detail.contactPhone ? '已设置' : '未设置' }}
					</view>
				</view>

				<u-icon name="arrow-right" color="#BFBFBF" size="28" class="u-m-l-18"></u-icon>
			</view>
			<view class="u-flex u-row-between u-p-t-26 u-p-b-26" v-if="vuex_roleKey === 2">
				<view class="u-flex  u-row-between u-flex-1">
					<view class="color-222 u-font-32">订单自动确认</view>
					<u-switch v-model="isAudit" activeColor="#CB4A2B" @change="supplierAudit"></u-switch>
				</view>
			</view>
			<view class="divider-line"></view>
		</view>

		<view class="exit-login u-m-t-20" @click="exitLogin">退出登录</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				isPayPassword: false,
				isAudit: false
			}
		},
		computed: {
			// vuex_roleKey:1-采购商，2-供应商
			...mapState(['vuex_roleKey'])
		},
		onLoad() {
			this.getIsSetPayPwd()
			this.isAudit = this.vuex_user.supplierAudit === 1
		},
		methods: {
			clickAuthBtn() {
				if (this.vuex_user.authStatus !== 0) {
					this.$u.route('/pages/user/auth-info')
				}
			},
			getIsSetPayPwd() {
				this.$u.api.selectPayPassword().then(res => {
					this.isPayPassword = res.value
				})
			},
			getAuthStatusText(status) {
				switch (status) {
					case 0:
						return '未认证'
					case 1:
						return '认证中'
					case 2:
						return '已认证'
					case 3:
						return '认证失败'
					default:
						return '待认证'
				}
			},
			exitLogin() {
				this.$u.api.loginOut().then(res => {
					this.$u.vuex('vuex_token', '')
					this.$u.vuex('vuex_user', '')
					this.$u.vuex('vuex_roleKey', '')
					this.$u.vuex('vuex_messageNum', 0)
					this.$u.vuex('vuex_user_password', '')
					this.$u.vuex('vuex_area', 'sc');//退出登录后，区域默认为四川区
					uni.clearStorage()
					setTimeout(()=>{
						this.$appUtils.reLaunchLogin()
					},200)
					
				})
			},
			async supplierAudit() {
				const data = await this.$u.api.supplierAudit({
					isAudit: this.isAudit
				})
				this.$appUtils.toastOk('操作成功')
			}
		}
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}

	.exit-login {
		width: 750rpx;
		height: 100rpx;
		background: #ffffff;
		font-size: 36rpx;
		font-weight: 400;
		color: #222222;
		line-height: 100rpx;
		text-align: center;
	}
</style>
