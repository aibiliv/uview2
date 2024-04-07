<template>
	<view class="container u-p-24">
		<!-- 地址 -->
		<view class="address u-m-b-24">
			<u-cell-group :border="false">
				<u-cell :border-bottom="false" @click="clickAddress">
					<template #title>
						<view class="u-font-24" v-if="curAddress && curAddress.id">
							<text v-if="curAddress.isDefault" class="default-address-tag">默认地址</text>
							<text class="color-black u-m-r-20">{{ curAddress.contactName }}</text>
							<text class="color-black">{{ curAddress.contactPhone }}</text>
						</view>
						<view class="u-font-26" v-else>请选择收货地址</view>
					</template>
				</u-cell>
			</u-cell-group>
			<view class="address-detail color-595959 u-font-24 u-p-l-32 u-p-r-60 u-p-b-24">{{ curAddress && curAddress.address }}</view>
			<view class="address-bottom"><image src="../../static/images/contract/address_bottom.png" mode=""></image></view>
		</view>
		<!-- 合同商品列表 -->
		<view class="contract-goods">
			<OrderItem>
				<template #title>
					<view class="title">
						<view class="u-font-28">{{ contractDetail.contractNum }}</view>
						<view class="u-font-bold u-font-32">{{ contractDetail.contractName }}</view>
					</view>
				</template>
				<GoodItem v-for="(good, j) in goodList" :key="j" :goodDetail="good">
					<template #label>
						<view class="u-font-24">
							<text>￥</text>
							<text class="u-font-36 u-font-bold">
								{{
									good.productContractPrice
										.toFixed(2)
										.toString()
										.split('.')[0] + '.'
								}}
							</text>
							<text>
								{{
									good.productContractPrice
										.toFixed(2)
										.toString()
										.split('.')[1]
								}}/{{ good.productUnit }}
							</text>
						</view>
					</template>
					<template #price>
						<view style="height: 60rpx"></view>
					</template>
					<view slot="num">× {{ good.buyNum }}</view>
				</GoodItem>
				<template #footer>
					<view></view>
				</template>
			</OrderItem>
		</view>

		<!-- 付款模式 -->

		<view class="pay-mode">
			<u-cell-group :border="false">
				<u-cell :arrow="false">
					<view slot="title">
						<text class="color-gray">付款模式：</text>
						<!-- 对于合同，计划免支付时，取：先货后款；反之，取：先款后货 -->
						<text class="color-black">{{ contractDetail.planFreePay ? '先货后款' : '先款后货' }}</text>
					</view>
				</u-cell>
				<u-radio-group v-model="payMode" v-if="!contractDetail.planFreePay">
					<u-cell :border-bottom="false" :arrow="false" v-if="contractDetail && contractDetail.payType.includes('2')">
						<view slot="title" class="u-font-bold u-font-32 color-black">授信支付</view>
						<view slot="label" class="u-font-24">剩余额度 {{ contractDetail.residueAmount }} 元</view>
						<image slot="icon" style="width: 40rpx;height:40rpx" class="u-m-r-20" src="@/static/images/contract/shouxin.png"></image>
						<u-radio size="40" shape="circle" :name="2" :active-color="mainColor"></u-radio>
					</u-cell>
					<u-cell :border-bottom="false" :arrow="false" v-if="contractDetail && contractDetail.payType.includes('1')">
						<view slot="title" class="u-font-bold u-font-32 color-black">线下支付</view>
						<view slot="label" class="u-font-24">账户余额 {{ remainingAmount }} 元</view>
						<image slot="icon" style="width: 40rpx;height:40rpx" class="u-m-r-20" src="@/static/images/contract/xianxia.png"></image>
						<u-radio size="40" shape="circle" :name="1" :active-color="mainColor"></u-radio>
					</u-cell>
					<u-cell :border-bottom="false" :arrow="false" v-if="contractDetail && contractDetail.payType.includes('3')">
						<view slot="title" class="u-font-bold u-font-32 color-bfbfbf">在线支付</view>
						<image slot="icon" style="width: 40rpx;height:40rpx" class="u-m-r-20" src="@/static/images/contract/zaixian.png"></image>
						<u-radio size="40" shape="circle" :name="3" disabled></u-radio>
					</u-cell>
				</u-radio-group>
			</u-cell-group>
		</view>
		<!-- footer -->
		<view class="footer u-flex u-row-between u-padding-32 u-font-28">
			<view class="left">
				<text class="color-gray">合计：</text>
				<text class="price">￥</text>
				<text class="price u-font-36">{{ moneyFormatter(totalMoney).split('.')[0] + '.' }}</text>
				<text class="price">{{ moneyFormatter(totalMoney).split('.')[1] }}</text>
			</view>
			<view class="btn">
				<u-button size="medium" shape="circle" :custom-style="customStyle" type="default" @click="cancel">取消</u-button>
				<u-button shape="circle" type="primary" :custom-style="customStyle" size="medium" @click="confirmBuy">确认采购</u-button>
			</view>
		</view>
		<!-- 输入密码弹出层 -->
		<!-- <u-popup class="password-modal" v-model="showModal" mode="center" closeable @close="closeModal" border-radius="20" height="300">
			<view class="u-p-l-50 u-p-r-50 u-p-b-50">
				<view class="modal-title u-font-bold u-font-36 u-text-center u-m-t-56 u-m-b-36">请输入支付密码</view>
				<u-message-input :maxlength="6" :breathe="false" :value="password" disabled-keyboard focus dot-fill></u-message-input>
			</view>
		</u-popup> -->
		<!-- 数字键盘 -->
		<u-keyboard
			ref="uKeyboard"
			mode="number"
			v-model="showBoard"
			:random="true"
			:mask-close-able="false"
			:confirm-btn="false"
			:cancel-btn="false"
			:show-tips="false"
			@change="valChange"
			@cancel="closeModal"
			@backspace="backspace"
		>
			<view >
				<view class="u-flex u-p-r-32 u-p-t-32" style="flex-direction: row-reverse;">
					<u-icon name="close" size="32" @click="closeModal"></u-icon>
				</view>
				<view class="modal-title u-font-bold u-font-36 u-text-center u-m-t-36 u-m-b-36">请输入支付密码</view>
				<!-- <u-message-input :maxlength="6" :breathe="false" :value="password" disabled-keyboard focus dot-fill></u-message-input> -->
			</view>
		</u-keyboard>
	</view>
</template>

<script>
import OrderItem from '@/components/order/OrderItem.vue'
import GoodItem from '@/components/order/GoodItem.vue'
import { moneyFormatter } from '@/common/app-utils.js'
import { MD5 } from '@/common/adminmd5.js'
export default {
	components: {
		OrderItem,
		GoodItem
	},
	data() {
		return {
			contractDetail: {
				payType:''
			},
			curAddress: {},
			moneyFormatter,
			customStyle: {
				padding: '12rpx 32rpx',
				height: '64rpx',
				marginLeft: '16rpx'
			},
			remainingAmount: '',
			goodList: [],
			payMode: '', //支付方式：1-线下，2-授信，3-在线
			showBoard: false,
			showModal: false,
			password: '',
			totalMoney: 0,
			planToken: null,
			planObj: null
		}
	},
	computed: {
		mainColor() {
			return this.$store.state.vuex_main_color
		},
		titleStyle() {
			return {
				fontSize: '24rpx',
				color: '#222222'
			}
		}
	},
	onLoad(params) {
		this.getToken()
		this.getAddressByProducts()

		this.$nextTick(function() {
			this.contractDetail = params.detail && JSON.parse(decodeURIComponent(params.detail))
			this.payMode = !this.contractDetail.planFreePay &&  this.contractDetail.payType?.includes('2') ? 2 : '' //先款后货时默认选中授信
			this.getRemainingAmount()
			this.totalMoney = Number(params.totalMoney)
			this.goodList = this.contractDetail.contractProductList.filter(good => good.buyNum)
			this.goodList.map(good => {
				good.title = `${good.productName}${good.productAttrValue && '【' + good.productAttrValue + '】'}`
				good.productImg =  good.imageUrl;
				good.prefixUrl = good.fileUrlPrefix;
			})
		})
	},
	onShow(){
		 this.showBoard = false
	},
	methods: {
		//获取计划令牌，防止重复提交
		async getToken() {
			const data = await this.$u.api.getContractToken()
			this.planToken = data.value
		},
		async getAddressByProducts() {
			const data = await this.$u.api.getAddressByProducts()
			this.curAddress = this.curAddress.id ? this.curAddress : data.find(item => item.isDefault)
		},
		// 获取余额
		async getRemainingAmount() {
			const { value } = await this.$u.api.getRemainingAmount({ projectId: this.contractDetail.projectId })
			this.remainingAmount = value
		},
		clickAddress() {
			this.$u.route(`/pages/user/address?from=contract`)
		},
		//在地址页面选中地址后返回本页面时
		async otherFun(id) {
			const data = await this.$u.api.getAddressByProducts()
			this.curAddress = data.find(item => item.id === id)
		},
		cancel() {
			uni.navigateBack({ delta: 1 })
		},
		async confirmBuy() {
			if (!this?.curAddress?.id) {
				this.$u.toast('请选择收货地址')
				return
			}
			//如果没有设置支付密码则跳转到设置支付密码页面
			if(!this.vuex_isSetPayPwd){
				this.$u.route('/pages/user/pay-password')
				return
			}
			if(!this.payMode && !this.contractDetail.planFreePay){
				this.$u.toast('请选择支付方式')
				return
			}
			// 商品参数
			let products = []
			this.goodList.map(good => {
				let item = {
					productId: good.productId,
					productTitle: good.productName,
					productAttrId: good.productAttrId,
					productAttrTitle: good.productAttr,
					productAttrValue: good.productAttrValue,
					productUnit: good.productUnit,
					productPrice: Number(good.productContractPrice).toFixed(2),
					num: good.buyNum,
					sumPrice: good.buyNum * good.productContractPrice
				}
				products.push(item)
			})
			// 输入密码前, 先生成计划，计划生成后才能输入密码
			const queryData = {
				payMode: this.payMode,
				contractId: this.contractDetail.id,
				addressId: this.curAddress.id,
				address: this.curAddress.address,
				purchaseType: 2,
				tradeAmount: Number(this.totalMoney).toFixed(2),
				status: 1,
				products,
				planToken: this.planToken
			}
			try {
				// 生成计划后弹出密码输入
				const data = await this.$u.api.contractCreate(queryData)
				this.planObj = data
				if (this.contractDetail.planFreePay) {
					uni.navigateTo({
						url: `./SuccessOrder?payMode=&success=1&planFreePay=1`
					})
					return
				}
				this.password = ''
				uni.hideTabBar()
				this.showModal = true
				this.showBoard = true
			} catch {
				this.getToken()
			}
		},
		closeModal() {
			// uni.showTabBar()
			this.showModal = false
			this.showBoard = false
			this.password = ''
			uni.navigateTo({
				url: `./SuccessOrder?payMode=${this.payMode}&success=0&planFreePay=${this.contractDetail.planFreePay?1:0}`
			})
		},
		// 按键被点击(点击退格键不会触发此事件)
		async valChange(val) {
			this.password += val
			if (this.password.length === 6) {
				const queryData = {
					amount: Number(this.totalMoney).toFixed(2),
					payMode: this.payMode,
					payPassword: MD5(this.password),
					planId: this.planObj.planId
				}
				try {
					const data = await this.$u.api.contractPay(queryData)
					uni.navigateTo({
						url: `./SuccessOrder?payMode=${this.payMode}&success=1&planFreePay=${this.contractDetail.planFreePay?1:0}`
					})
				} catch (e) {
					// B.F-40002为密码错误，不跳转下个页面，其他错误可以跳到下单成功的页面
					if (e.code === 'B.F-40002') {
						this.password = ''
					}
				}
			}
		},
		// 退格键被点击
		backspace() {
			// 删除value的最后一个字符
			if (this.password.length) this.password = this.password.substr(0, this.password.length - 1)
		}
	}
}
</script>

<style lang="scss" scoped>
::v-deep.password-modal {
	.u-char-item {
		background-color: #f5f5f5;
		border: 0;
	}
}
.container {
	height: max-content;
	background-color: $page-bg-color;
	padding-bottom: 100rpx;
	overflow-y: scroll;
	.address {
		background-color: #fff;
		// border-radius: 16rpx 16rpx 0 0;
		.default-address-tag {
			margin-right: 20rpx;
			padding: 2rpx 10rpx;
			border-radius: 2rpx;
			color: #fff;
			background: linear-gradient(to left, #68645c, #222222);
		}
		.address-bottom {
			font-size: 0;
			image {
				width: 100%;
				height: 6rpx;
			}
		}
	}
	.contract-goods {
		.title {
			padding: 0 32rpx 28rpx;
			margin: 0 -32rpx;
			line-height: 46rpx;
			border-bottom: 1px solid #ebebeb;
		}
	}
	.footer {
		width: 100vw;
		background-color: #fff;
		position: fixed;
		z-index: 2;
		bottom: 0;
		margin-left: -26rpx;
		border-top: 1px solid $border-color;
		.price {
			color: $main-color;
		}
	}
}
::v-deep.pay-mode .u-radio {
	float: unset !important;
}
</style>
