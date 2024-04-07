<template>
	<view class="container u-p-30">
		<view>
			<u-form :model="form" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item prop="contactName" :border-bottom="false" :defaultPadding="false">
					<view class="u-w-full">
						<view class="u-flex">
							<view class="u-m-r-30" style="width: 150rpx;">联系人</view>
							<view class="u-flex-1">
								<u-input placeholder="请输入联系人" v-model="form.contactName" inputAlign="right" :height="99"
									></u-input>
							</view>
						</view>
						<u-line color="#e4e7ed" border-style="solid" :hair-line="false" />
					</view>
				</u-form-item>
			</u-form>

			<u-form :model="form" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item prop="contactPhone" :border-bottom="false" :defaultPadding="false">
					<view class="u-w-full">
						<view class="u-flex">
							<view class="u-m-r-30" style="width: 150rpx;">联系电话</view>
							<view class="u-flex-1">
								<u-input placeholder="请输入联系电话" @focus="focusPhone" v-model="form.contactPhone" maxlength="11"
									inputAlign="right" :height="11">
								</u-input>
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
	export default {
		data() {
			return {
				contactPhoneback:'',//联系电话备份一份
				form: {
					contactName: '',
					contactPhone: ''
				},
				errorType: ['toast'],
				rules: {
					contactName: [{
						required: true,
						message: '请输入联系人',
						trigger: ['change', 'blur'],
					}],
					contactPhone: [{
						required: true,
						message: '请输入联系电话',
						trigger: 'blur',
					},{
						validator: (rule, value, callback) => this.$u.test.mobile(value),
						message: '手机号码格式不正确',
						trigger: 'blur',
					}]
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(e) {
			let vuex_user = this.$store.state.vuex_user
			if (vuex_user) {
				this.form.contactName = vuex_user.detail.contactName
				this.form.contactPhone = vuex_user.detail.contactPhone
				this.contactPhoneback = this.form.contactPhone
			}
		},
		methods: {
			focusPhone(){
				this.contactPhoneback = undefined
				this.form.contactPhone = ''
			},
			submit() {
				if(!this.form.contactPhone){
					this.$u.toast('请输入联系电话');
					return
				}else{
					this.$refs.uForm.validate(valid => {
						if (valid) {
							// let form = {
							// 	userContactReq: this.form
							// }
							this.$u.api.updateContact(this.form).then(res => {
								this.$u.toast('联系人设置成功');
								this.$appUtils.navigateBackDelay(1000,2)
							})
						}
					});
				}
				
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
