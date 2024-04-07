<template>
	<view class="container">
		<u-navbar :title="title"></u-navbar>
		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in datas" :key="item.id" @click="click"
			:options="options" :btnWidth="220" @open="open" @content-click="contentClick">
			<view class="u-p-l-32 u-p-r-32">
				<view class="u-p-t-26 u-p-b-20 u-flex ">
					<view class="u-flex-1">
						<view style="font-weight: 500;"><text class="default-address u-m-r-12"
								v-if="item.isDefault == 1">默认地址</text>
							{{item.contactName}}<text class="u-m-l-12">{{item.contactPhone}}</text>
						</view>

						<view class="color-8C8C8C u-m-t-16">{{item.address}}</view>
					</view>

					<view class="u-p-16" @click.stop="edit(item)">
						<u-icon name="edit-pen" color="#595959" size="32"></u-icon>
					</view>

				</view>
				<view class="divider-line"></view>
			</view>

		</u-swipe-action>

		<view class="footer-gap"></view>

		<view class="common-footer">
			<u-button @click="login" type="primary" shape="circle" class="login-btn">+&nbsp;{{addBtnLabel}}</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				datas: [],
				addBtnLabel: '新增收货地址',
				title: '收货地址管理',
				options: [{
						text: '设为默认',
						style: {
							color: '#8C8C8C',
							backgroundColor: '#F5F5F5'
						}
					},
					{
						text: '删除',
						style: {
							color: '#ffffff',
							backgroundColor: '#EA3D2F'
						}
					}
				],
				from: '', //从哪进入地址列表
			}
		},
		onLoad(params) {
			this.from = params.from
		},
		onShow() {
			this.userAddressPage();
			let roleKey = this.$store.state.vuex_roleKey
			if (roleKey === 2) {
				this.addBtnLabel = '新增发货地址'
				this.title = '发货地址管理'
			}
		},
		methods: {
			//在合同下单或者供应商发货时可以来到这个页面选择或新增地址
			contentClick(index) {
				if (this.from) {
					const id = this.datas[index].id
					let pages = getCurrentPages() // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
					let prevPage = pages[pages.length - 2] //上一页页面实例
					prevPage.$vm.otherFun(id) // 给上一页绑定方法otherFun,传参地址id
					uni.navigateBack()
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效		
				this.datas.map((val, idx) => {
					val.show = false
				})
				this.datas[index].show = true;
			},
			click(index, index1) {
				if (index1 == 1) {
					uni.showModal({
						title: '确认删除地址？',
						success: (res) => {
							if (res.confirm) {
								this.datas[index].show = false;
								this.$forceUpdate();
								this.deleteAddress(index);
							}
						}
					})
				} else {
					this.datas[index].show = false;
					this.$forceUpdate();
					this.setDefault(index);
					// this.$u.toast(`设为默认地址成功`);
				}
			},
			edit(item) {
				this.$u.route('/pages/user/address-add-update?item=' + encodeURIComponent(JSON.stringify(item)))
			},
			login() {
				this.$u.route('/pages/user/address-add-update')
			},
			userAddressPage() {
				this.$u.api.userAddressPage({
					page: 1,
					limit: 999
				}).then(res => {
					this.datas = res.records.map((item)=>{
						item.show = false
						return item
					})
				})
			},
			deleteAddress(index) {
				let item = this.datas[index];
				this.$u.api.userAddressDelete(item.id).then(res => {
					this.datas.splice(index, 1);
					this.$u.toast('删除成功');
				})
			},
			setDefault(index) {
				let item = this.datas[index];
				this.$u.api.userAddressStatus(item.id, {
					id: item.id
				}).then(res => {
					this.datas.splice(index, 1);
					this.$u.toast('设置默认地址成功');
					this.userAddressPage()
				})
			}
		}
	}
</script>

<style>
	.item {
		border-bottom: 1rpx solid #ff0000;
	}

	.default-address {
		width: 96px;
		height: 32px;
		font-size: 20rpx;
		font-weight: 500;
		color: #FFFFFF;
		font-size: 20rpx;
		line-height: 32px;
		background: linear-gradient(225deg, #68645C 0%, #222222 100%);
		border-radius: 2px;
	}

	.login-btn {
		width: 686rpx;
		height: 88rpx;
		background: #CB4A2B;
		border-radius: 44rpx;
	}
</style>
