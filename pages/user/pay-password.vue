<template>
	<view class="container">
		<view class="u-p-30">
			<u-form :model="form" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item prop="payPassword" :defaultPadding="false" :border-bottom="false">
					<view class="u-w-full">
						<view class="u-flex">
							<view class="u-m-r-30 u-font-32" style="width: 170rpx;">支付密码</view>
							<view class="u-flex-1">
								<u-input
									placeholder="请设置支付密码 "
									v-model="form.payPassword"
									type="password"
									inputAlign="right"
									:height="99"
									maxlength="6"
									:custom-style="inputStyle"
								></u-input>
							</view>
						</view>
						<u-line color="#EBEBEB" border-style="solid" :hair-line="false" />
					</view>
				</u-form-item>
				<u-form-item prop="payPasswordConfirm" :defaultPadding="false" :border-bottom="false">
					<view class="u-w-full">
						<view class="u-flex">
							<view class="u-m-r-30 u-font-32" style="width: 170rpx;">确认密码</view>
							<view class="u-flex-1">
								<u-input
									placeholder="请再次输入支付密码"
									v-model="form.payPasswordConfirm"
									type="password"
									inputAlign="right"
									:height="99"
									maxlength="6"
									:custom-style="inputStyle"
								></u-input>
							</view>
						</view>
						<u-line color="#EBEBEB" border-style="solid" :hair-line="false" />
					</view>
				</u-form-item>

				<u-form-item prop="mobileCode" :defaultPadding="false" :border-bottom="false">
					<view class="u-w-full">
						<view class="u-flex">
							<view class="u-m-r-30 u-font-32" style="width: 170rpx;">手机验证码</view>
							<view class="u-flex-1">
								<u-input
									:placeholder="codePlaceHolder"
									v-model="form.mobileCode"
									type="number"
									inputAlign="right"
									:height="99"
									maxlength="6"
									:custom-style="inputStyle"
								></u-input>
							</view>
							<!-- <u-verification-code :seconds="60" ref="uCode" @change="codeChange" change-text="x秒" end-text="获取验证码"></u-verification-code> -->
							<view style="width: 180rpx;text-align: center;" class="color-theme u-p-l-32" @click="showVerify">{{ tips }}</view>
						</view>
						<u-line color="#EBEBEB" border-style="solid" :hair-line="false" />
					</view>
				</u-form-item>
				<!-- 
				<u-form-item prop="randomCode" :defaultPadding="false" :border-bottom="false">
					<view class="u-w-full">
						<view class="u-flex">
							<view class="u-m-r-30 u-font-32" style="width: 170rpx;">图形验证码</view>
							<view class="u-flex-1">
								<u-input placeholder="请输入图形验证码" v-model="form.mobileCode" type="number"
									inputAlign="right" :height="99" :custom-style="inputStyle"></u-input>
							</view>
							<image src=""></image>
							<view class=" u-p-l-32" @click="showVerify">获取验证码</view>
						</view>
						<u-line color="#EBEBEB" border-style="solid" :hair-line="false" />
					</view>
				</u-form-item> -->
			</u-form>
			<view class="common-footer">
				<view style="width: 100%;" class="u-p-l-32 u-p-r-32">
					<u-button
						type="primary"
						class="u-m-t-60"
						@click="submit"
						:disabled="!form.payPassword || !form.mobileCode || !form.payPasswordConfirm"
						shape="circle"
					>
						确&nbsp;定
					</u-button>
				</view>
			</view>
		</view>

		<Verify @success="success" :mode="'pop'" :captchaType="'blockPuzzle'" ref="verify" :imgSize="{ width: '310px', height: '155px' }"></Verify>
	</view>
</template>

<script>
// import MD5JS from '@/common/md5_u.min.js'
// import FKHMD5 from "@/common/fkhmd5.js";
import { MD5 } from '@/common/adminmd5.js'
import Verify from '@/components/verify/verify'
export default {
	data() {
		return {
			form: {
				payPassword: '',
				mobileCode: '',
				payPasswordConfirm: '',
				uuid: this.$u.guid(),
				randomCode: ''
			},
			inputStyle: {
				fontSize: '28rpx'
			},
			codePlaceHolder: '请输入手机验证码',
			errorType: ['toast'],
			rules: {
				payPassword: [
					{
						required: true,
						message: '请输入支付密码',

						trigger: ['change', 'blur']
					},
					{
						min: 6,
						max: 6,
						message: '请输入6位数字密码'
					}
				],
				mobileCode: [
					{
						required: true,
						message: '请输入手机验证码',
						trigger: ['change', 'blur']
					}
				],
				payPasswordConfirm: [
					{
						required: true,
						message: '请再次输入支付密码',
						trigger: ['change', 'blur']
					}
				]
			},
			captchaVO: {
				captchaVerification: ''
			},
			tips: ''
		}
	},
	components: {
		Verify
	},
	onLoad() {
		this.$nextTick(() => {
			this.getRandomCode()
		})
		if (this.vuex_user.parentMobile) {
			this.codePlaceHolder = '手机尾号' + this.vuex_user.parentMobile.substring(7, 11)
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules)
	},
	methods: {
		codeChange(text) {
			this.tips = text
		},
		getCode() {
			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				setTimeout(() => {
					// 这里此提示会被this.start()方法中的提示覆盖
					this.$u.toast('验证码已发送')
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start()
				}, 2000)
			}
		},
		getRandomCode() {},
		async addPayPasswordGetCode() {
			let form = {
				captchaVO: this.captchaVO
			}
			if (this.$refs.uCode.canGetCode) {
				await this.$u.api.addPayPasswordGetCode(form)
				this.$u.toast('验证码已发送')
				this.$refs.uCode.start()
			}
		},
		success(data) {
			this.$refs.verify.close()
			console.log(JSON.stringify(data))
			// this.captchaVO.captchaType = "blockPuzzle"
			this.captchaVO.captchaVerification = data.captchaVerification
			this.addPayPasswordGetCode()
		},
		showVerify() {
			this.$refs.verify.show()
			// this.addPayPasswordGetCode();
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					if (!/^[1-9]\d*$/.test(this.form.payPassword)) {
						this.$u.toast('请输入数字密码')
						return
					}
					if (this.form.payPassword != this.form.payPasswordConfirm) {
						this.$u.toast('两次密码不一致')
						return
					}
					var that = this
					var safePwd = MD5(this.form.payPassword)
					this.$u.api
						.savePayPassword({
							mobileCode: this.form.mobileCode,
							payPassword: safePwd
						})
						.then(res => {
							this.$u.vuex('vuex_isSetPayPwd', true)
							this.$u.toast('支付密码设置成功')
							this.$appUtils.navigateBackDelay(1000)
						})
				}
			})
		},
		fixedClick() {
			this.showMode = 'fixed'
		},
		popClick() {
			this.showMode = 'pop'
		}
	}
}
</script>

<style>
.u-w-full {
	height: 99rpx;
	line-height: 99rpx;
}
</style>
