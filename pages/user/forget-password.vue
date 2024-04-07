<template>
	<view class="container">
		<view class="u-p-30">
			<u-form :model="form" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item prop="mobile" :defaultPadding="false" :border-bottom="false">
					<view class="u-w-full">
						<view class="u-flex">
							<view class="u-m-r-30 u-font-32" style="width: 170rpx;">手机号码</view>
							<view class="u-flex-1">
								<u-input placeholder="请输入手机号码"  maxlength="11" v-model="form.mobile" type="number" 
									inputAlign="right" :height="99" :custom-style="inputStyle"></u-input>
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
								<u-input placeholder="请输入手机验证码" v-model="form.mobileCode" type="number"
									inputAlign="right" :height="99" :custom-style="inputStyle"></u-input>
							</view>
							<view v-if="disable" class="color-theme u-p-l-32" @click="phoneFlaseHandle">获取验证码</view>
							<view v-else class="color-theme u-p-l-32" @click="showVerify">获取验证码</view>
						</view>
						<u-line color="#EBEBEB" border-style="solid" :hair-line="false" />
					</view>
				</u-form-item>
			</u-form>

			<u-button type="primary" class="u-m-t-60" @click="submit" :disabled="(!form.mobile || !form.mobileCode) || disable"
				shape="circle">下一步
			</u-button>
		</view>
		<u-toast ref="uToast" />
		<Verify @success='success' :mode="'pop'" :captchaType="'blockPuzzle'" ref="verify"
			:imgSize="{width:'310px',height:'155px'}"></Verify>
	</view>
</template>

<script>
	import Verify from "@/components/verify/verify"
	export default {
		
		data() {
			const getMobileNum = async (rule, value, callback) => {
				const res = await this.$u.api.getMobileNumF({
					mobile: this.form.mobile
				})
				this.disable = false
				if (res === true) {
					this.disable = true
					this.$refs.uToast.show({
										title: '该账号未注册',
										type: 'error'
									})
					callback(new Error('该账号未注册'))
				}
			}
			return {
				disable:true,
				form: {
					mobile: '',
					mobileCode: ''
				},
				inputStyle: {
					fontSize: '28rpx'
				},
				errorType: ['toast'],
				rules: {
					mobile: [
						{
							required: true,
							message: '请输入手机号码',
							trigger: [ 'blur']
						},
						{ validator: getMobileNum, trigger: 'blur' },
					],
					mobileCode: [{
						required: true,
						message: '请输入手机验证码',
						trigger: ['change', 'blur'],
					}]
				},
				captchaVO: {
					captchaVerification: ''
				}
			}
		},
		components: {
			Verify
		},
		onLoad() {

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
		async	addPayPasswordGetCode() {
				let form = {
					mobile:this.form.mobile,
					captchaVO: this.captchaVO
				}
			const res = await this.$u.api.addPasswordGetCode(form)
				this.$refs.verify.close();
				this.$refs.uToast.show(
					{
						title:'发送成功',
						type: 'success'
					}
				)
			},
			success(data) {
				this.$refs.verify.close();
				console.log(JSON.stringify(data));
				this.captchaVO.captchaVerification = data.captchaVerification
				this.addPayPasswordGetCode();
			},
			phoneFlaseHandle(){
				if(!this.form.mobile) {
					this.$refs.uToast.show(
						{
							title:'请输入手机号码',
							type: 'error'
						}
					)
				}						
			},
			showVerify() {
				this.$refs.verify.show();
			},
			submit() {
				this.$refs.uForm.validate( async(valid) => {
					if (valid) {
					const { uuid } = await this.$u.api.verifyPassword(this.form)
					console.log('data',uuid)
					this.$u.route('./forget-reset-password')
						// this.$u.api.savePayPassword({
						// 	mobileCode: this.form.mobileCode,
						// 	mobile: this.form.mobile
						// }).then(res => {
						// 	this.$u.toast('支付密码设置成功')
						// 	this.$appUtils.navigateBackDelay(1000)
						// });
					}
				});
			},
			fixedClick() {
				this.showMode = "fixed"
			},
			popClick() {
				this.showMode = "pop"
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
