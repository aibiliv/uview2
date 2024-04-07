<template>
	<view class="container u-p-30">

		<!-- <view class="u-font-32 u-font-bold">设置新密码</view> -->
		<view class="">
			<u-form :model="form" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item prop="originPassword" :border-bottom="false" :defaultPadding="false">
					<view class="u-w-full">
						<view class="u-flex">
							<view class="u-m-r-30" style="width: 150rpx;">当前密码</view>
							<view class="u-flex-1">
								<u-input placeholder="请输入当前的登录密码" maxlength="32" v-model="form.originPassword" type="password"
									inputAlign="right" :height="99" ></u-input>
							</view>
						</view>
						<u-line color="#e4e7ed" border-style="solid" :hair-line="false" />
					</view>
				</u-form-item>
				<u-form-item prop="password" :border-bottom="false" :defaultPadding="false">
					<view class="u-w-full">
						<view class="u-flex">
							<view class="u-m-r-30" style="width: 150rpx;">新密码</view>
							<view class="u-flex-1">
								<u-input placeholder="请输入新的登录密码" v-model="form.password" type="password" maxlength="32"
									inputAlign="right" :height="99" >
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
								<u-input placeholder="请再次输入新的登录密码" v-model="form.passwordConfirm" type="password"
									maxlength="32" inputAlign="right" :height="99" ></u-input>
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
					originPassword: '',
					password: '',
					passwordConfirm: ''
				},
				errorType: ['toast'],
				rules: {
					originPassword: [{
						required: true,
						message: '请输入当前的登录密码',
						trigger: ['change', 'blur'],
					}],
					password: [{
						required: true,
						message: '请输入新的登录密码',
						trigger: ['change', 'blur'],
					}],
					passwordConfirm: [{
						required: true,
						message: '请再次输入新的登录密码',
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
						if (this.form.password.length < 8 || this.form.password.length > 32) {
							this.$u.toast('密码长度为8-32位')
							return;
						}
						if (this.form.password === this.vuex_user.loginAccount) {
							this.$u.toast('密码不可与账号相同')
							return;
						}
						if (!this.form.password.match(/([A-Z])+/)) {
							this.$u.toast('密码至少包含一个大写字母')
							return;
						}
						if (!this.form.password.match(/([a-z])+/)) {
							this.$u.toast('密码至少包含一个小写字母')
							return;
						}
						if (!(this.form.password.match(/([0-9])+/) || this.form.password.match(/([\W])+/))) {
							this.$u.toast('密码至少包含数字或特殊字符')
							return;
						}
						if (this.form.password.match(/([\u4E00-\u9FA5])+/) || this.form.password.match(/([\s])+/)) {
							this.$u.toast('密码不能含有空格或汉字')
							return;
						}
						if (this.form.password != this.form.passwordConfirm) {
							this.$u.toast('两次输入的密码不一致')
							return;
						}
						var that = this;
						var safeOriginPwd = FKHMD5.md5(this.form.originPassword);
						var safePwd = FKHMD5.md5(this.form.password);
						this.$u.api.updatePassword({
							oldPassword: safeOriginPwd,
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
