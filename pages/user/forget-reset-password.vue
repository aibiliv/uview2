<template>
	<view class="container u-p-30">
		<view class="">
			<u-form-item prop="password" :border-bottom="false" :defaultPadding="false">
				<view class="u-w-full">
					<view class="u-flex">
						<view class="u-m-r-30" style="width: 150rpx;">新密码</view>
						<view class="u-flex-1">
							<u-input placeholder="请输入新密码" v-model="form.password" type="password" maxlength="18"
								inputAlign="right" :height="99" :custom-style="inputStyle">
							</u-input>
						</view>
					</view>
					<u-line color="#e4e7ed" border-style="solid" :hair-line="false" />
				</view>
			</u-form-item>

			<u-form-item prop="passwordConfirm" :border-bottom="false" :defaultPadding="false">
				<view class="u-w-full">
					<view class="u-flex">
						<view class="u-m-r-30" style="width: 150rpx;">确认密码</view>
						<view class="u-flex-1">
							<u-input placeholder="请输入确认密码" v-model="form.passwordConfirm" type="password" maxlength="18"
								inputAlign="right" :height="99" :custom-style="inputStyle"></u-input>
						</view>
					</view>
					<u-line color="#e4e7ed" border-style="solid" :hair-line="false" />
				</view>
			</u-form-item>
			</u-form>


		</view>

		<view class="common-footer">
			<view style="width: 100%;" class="u-p-l-32 u-p-r-32">
				<u-button type="primary" @click="submit" shape="circle">保存</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	// import MD5JS from '@/common/md5_u.min.js'
	import FKHMD5 from "@/common/fkhmd5.js";
	export default {
		data() {
			return {
				form: {
					password: '',
					passwordConfirm: ''
				},
				errorType: ['toast'],
				rules: {
					password: [{
						required: true,
						message: '请输入新密码',
						trigger: ['change', 'blur'],
					}],
					passwordConfirm: [{
						required: true,
						message: '请输入确认密码',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(e) {
			// this.username = e.username;
			// console.log('===e=', this.username);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if (/[\u4e00-\u9fa5]/.test(this.form.password) ||
							/[\u4e00-\u9fa5]/.test(this.form.passwordConfirm)) {
							this.$u.toast('密码不能包含中文')
							return;
						}
						if (this.form.password != this.form.passwordConfirm) {
							this.$u.toast('两次密码不一致')
							return;
						}
						var that = this;
						var safePwd = FKHMD5.md5(this.form.password);
						this.$u.api.updatePassword({
							newPassword: safePwd
						}).then(res => {
							uni.showModal({
								title: '密码修改成功',
								showCancel: false,
								confirmText: '确定',
								success() {
									that.$appUtils.loginOut()
									that.$appUtils.reLaunchLogin();
								}
							})
						});
					}
				});
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
