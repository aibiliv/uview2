<template>
	<view class="container u-p-30">
		<u-navbar :title="title" :custom-back="customBack"></u-navbar>
		<view class="">
			<u-form :model="form" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item prop="contactName" :border-bottom="false" :defaultPadding="false">
					<d-key-value v-if="vuex_roleKey == 1" lable="收货人" placeholder="请填写收货人姓名"
						v-model="form.contactName" editEnable @changeVal="nameInput">
					</d-key-value>
					<d-key-value v-if="vuex_roleKey == 2" lable="发货人" placeholder="请填写发货人姓名"
						v-model="form.contactName" editEnable @changeVal="nameInput">
					</d-key-value>

				</u-form-item>

				<u-form-item prop="contactPhone" :border-bottom="false" :defaultPadding="false">
					<d-key-value v-if="vuex_roleKey == 1" lable="手机号码" placeholder="请填写收货人手机号"
						type="number" maxlength="11" v-model="form.contactPhone" editEnable  @changeVal="phoneInput">
					</d-key-value>
					<d-key-value v-if="vuex_roleKey == 2" lable="手机号码" placeholder="请填写发货人手机号"
						type="number" maxlength="11" v-model="form.contactPhone" editEnable  @changeVal="phoneInput">
					</d-key-value>
				</u-form-item>

				<u-form-item :border-bottom="false" :defaultPadding="false" prop="region">
					<d-key-value lable="所在地区" placeholder="请选择省市区县、乡镇等" :editEnable="false" @click="pickerShow  = true"
						v-model="form.region" showMoreIcon>
					</d-key-value>
				</u-form-item>

				<u-form-item :border-bottom="false" :defaultPadding="false" prop="detailAddress">
					<d-key-value lable="详细地址" placeholder="请填写详细地址、精确到门牌号" v-model="form.detailAddress" @changeVal="detailInput" editEnable>
					</d-key-value>
				</u-form-item>

				<u-form-item :border-bottom="false" :defaultPadding="false">
					<view class="u-w-full">
						<view class="u-flex u-row-between">
							<view class="u-m-r-30">设为默认地址</view>
							<u-switch v-model="isDefault" active-color="#CB4A2B" inactive-color="#BFBFBF"></u-switch>
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

		<u-picker mode="region" v-model="pickerShow" @confirm="regionConfirm"></u-picker>
		<confirm-popup title="是否保存本次修改的信息？" confirmTitle="保存" leftText="不保存" :shouldShow="showUpdateTip"
			@cancelAction="cancelAction" @comfirmAction="comfirmAction" />
	</view>
</template>

<script>
	import { mapActions, mapState } from 'vuex'
	export default {
		data() {
			return {
				title: '新增收货地址',
				showUpdateTip: false,
				isDefault: false,
				pickerShow: false,
				toback:false,
				form: {
					address: '',
					contactName: '',
					contactPhone: '',
					region: '',
					detailAddress: '',
					isDefault: 0
				},
				errorType: ['toast'],
				rules: {
					detailAddress: [{
						required: true,
						message: '请填写详细地址、精确到门牌号',
						trigger: ['change', 'blur'],
					}],
					region: [{
							required: true,
							message: '请选择省市区县、乡镇等',
							trigger: ['change', 'blur'],
					}],
					contactName: [{
						required: true,
						message: '请填写收货人姓名',
						trigger: 'blur',
					}],
					contactPhone: [{
						required: true,
						message: '请填写收货人手机号',
						trigger: ['change', 'blur'],
					},{
						min: 11,
						max: 11,
						message: '手机号码格式不正确',
						trigger: 'blur',
					}]
				},
				supplierRules: {
					detailAddress: [{
						required: true,
						message: '请填写详细地址、精确到门牌号',
						trigger: ['change', 'blur'],
					}],
					region: [{
							required: true,
							message: '请选择省市区县、乡镇等',
							trigger: ['change', 'blur'],
					}],
					contactName: [{
						required: true,
						message: '请填写发货人姓名',
						trigger: 'blur',
					}],
					contactPhone: [{
						required: true,
						message: '请填写发货人手机号',
						trigger: ['change', 'blur'],
					},{
						validator: (rule, value, callback) => this.$u.test.mobile(value),
						message: '手机号码格式不正确',
						trigger: 'blur',
					}]
				}
			}
		},
		computed: {
			// vuex_roleKey:1-采购商，2-供应商
			...mapState(['vuex_roleKey'])
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			let roleKey = this.vuex_roleKey
			if(roleKey===2){
				this.$refs.uForm.setRules(this.supplierRules);
			}
			
		},
		onLoad(options) {
			// this.username = e.username;
			// console.log('===e=', this.username);
			if (options.item) {
				let item = JSON.parse(decodeURIComponent(options.item));
				let lastIndex = item.address.lastIndexOf("-")
				if (lastIndex != -1) {
					this.form.address = item.address;
					this.form.contactName = item.contactName;
					this.form.contactPhone = item.contactPhone;
					this.form.id = item.id;
					this.form.isDefault = item.isDefault;
					this.isDefault = item.isDefault == 1
					this.form.region = item.address.substring(0, lastIndex)
					this.form.detailAddress = item.address.substring(lastIndex + 1, item.address.length)
					this.title = '编辑收货地址'
					let roleKey = this.vuex_roleKey
					if(roleKey === 2){
						this.title = '编辑发货地址'
					}
				}
			}else{
				let roleKey = this.vuex_roleKey
				if(roleKey === 2){
					this.title = '新增发货地址'
				}
			}
		},
		methods: {
			//↓虽然这个是空方法，但是不能删
			otherFun() {},
			detailInput(val){
				this.form.detailAddress = val
			},
			phoneInput(val){
				this.form.contactPhone = val
			},
			nameInput(val){
				this.form.contactName = val
			},
			comfirmAction() {
				this.submitPost()
			},
			cancelAction() {
				this.showUpdateTip = !this.showUpdateTip
				if(this.toback){
					this.$appUtils.navigateBackDelay(500)
					return
				}
			},
			// 选择地区回调
			regionConfirm(e) {
				this.form.region = e.province.label ;
				if(e.city){
					this.form.region +=  '-' + e.city.label 
				}
				if(e.area){
					this.form.region +=  '-' + e.area.label
				}
			},
			customBack(){
				this.toback= true
				if (this.form.id) this.submitTip()
				else this.$appUtils.navigateBackDelay(200)
			},
			submitTip() {
				this.showUpdateTip = true
			},
			submitPost() {
				if (this.form.id) {
					this.$u.api.userAddressUpdate(this.form).then(res => {
						this.$u.toast('修改成功')
						this.$appUtils.navigateBackDelay(1000)
					})
				} else {
					this.$u.api.userAddressAdd(this.form).then(res => {
						this.$u.toast('新增成功')
						this.$appUtils.navigateBackDelay(1000)
					})
				}
			},
			submit() {
				this.form.address = this.form.region + "-" + this.form.detailAddress
				this.form.isDefault = this.isDefault ? 1 : 0
				console.log(JSON.stringify(this.form))
				this.$refs.uForm.validate(valid => {
					if (valid) {
						// if(this.form.id){
						// 	this.submitTip();
						// }else{
							this.submitPost()
						// }
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
