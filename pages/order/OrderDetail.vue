<template>
	<view class="order-detail-container">
		<view class="header">
			<u-button class="back-btn" type="info" size="mini" shape="circle" :custom-style="customStyle" @click="back">
				<u-icon name="arrow-left"></u-icon>
			</u-button>
		</view>
		<!-- <view v-if="!isTcs" class="u-font-0 no-map-bg"><image src="../../static/images/order/no_map_bg.png" mode=""></image></view> -->
		<!-- <Map v-if="isTcs && onTheWayTotal > 0" :markers="markers"></Map> -->

		<view :class="isTcs && onTheWayTotal > 0 ? 'is-tcs-detail' : 'not-tcs-detail'">
			<u-read-more
				v-if="isTcs && onTheWayTotal > 0"
				ref="uReadMore"
				text-indent="0"
				:default-open="true"
				toggle
				close-text="展开订单详情"
				open-text="收起"
				show-height="320"
				@open="showFooter = true"
				@close="showFooter = false"
			>
				<OrderDetailContent :order="order" :isTcs="isTcs" :onTheWayTotal="onTheWayTotal"></OrderDetailContent>
			</u-read-more>
			<OrderDetailContent v-else :order="order" :isTcs="isTcs"></OrderDetailContent>
		</view>
		<!-- <view class="not-tcs-detail" v-else>
			<view class="">
				<OrderDetailContent :order="order" :isTcs="isTcs"></OrderDetailContent>
			</view>


			</view> -->
		<view class="footer u-flex u-row-between u-padding-32 u-font-28">
			<view class="left"></view>
			<view class="btn">
				<u-button v-if="vuex_roleKey == 2" size="medium" shape="circle" :custom-style="buttonStyle" type="default" @click="seeNeedMaterialRecord">需求记录</u-button>
				<u-button size="medium" shape="circle" :custom-style="buttonStyle" type="default" @click="seeWaybill">查看运单</u-button>
				<u-button
					v-if="vuex_roleKey == 1 && order.status && (order.status.value === 3 || order.status.value === 4)"
					shape="circle"
					type="default"
					:custom-style="buttonStyle"
					size="medium"
					@click="changeNum"
				>
					调整数量
				</u-button>
				<!-- <u-button
					v-if="order.tenantId=== vuex_user.tenantId && contractId && vuex_roleKey == 1 && isRepay == 0"
					shape="circle"
					type="primary"
					:custom-style="buttonStyle"
					size="medium"
					@click="supplement"
				>
					补款
				</u-button> -->
			</view>
		</view>
		<u-popup class="popup" v-model="visible" mode="center" border-radius="20" :mask-close-able="false" width="630" @close="close">
			<view class="u-p-l-32 u-p-r-32 u-p-b-32">
				<view class="u-font-bold u-font-36 u-text-center u-m-t-56 u-m-b-36">订单补款</view>
				<view class="">
					<view class="u-font-28 u-p-l-20 u-m-b-20">待补款金额：{{ supplementObj.price }}元</view>
					<view class="input-div">
						<u-input v-model="supplementObj.money" focus placeholder="请输入本次补款金额" type="digit" border @input="supplementMoneyInput"/>
					</view>
					<view style="margin: 0 -20rpx 20rpx;"><PayMode v-if="visible" ref="payMode" :supplementObj="supplementObj" @changePayMode="changePayMode"></PayMode></view>
				</view>
				<view class="u-flex">
					<u-button :custom-style="popupButtonStyle" size="medium" shape="circle" type="default" @click="close">取消</u-button>
					<u-button :custom-style="popupButtonStyle" size="medium" shape="circle" type="primary" @click="submitSupplement">确定</u-button>
				</view>
			</view>
		</u-popup>
		<!-- 调整数量弹窗 -->
		<ChangeNumModal :show.sync="numModal.show" @confirm="confrimNum"></ChangeNumModal>
		<!-- 支付密码输入弹窗 -->
		<InputPasswordModal ref="inputPasswordModal" @finish="finish" />
	</view>
</template>
<script>
import { mapState } from 'vuex'
// import Map from './components/Map.vue'
import OrderItem from '@/components/order/OrderItem.vue'
import GoodItem from '@/components/order/GoodItem.vue'
import OrderDetailContent from './components/OrderDetailContent.vue'
import PayMode from './components/PayMode.vue'
import ChangeNumModal from './components/ChangeNumModal.vue'
import InputPasswordModal from './components/InputPasswordModal.vue'
import { MD5 } from '@/common/adminmd5.js'
export default {
	components: {
		// Map,
		OrderItem,
		GoodItem,
		OrderDetailContent,
		PayMode,
		ChangeNumModal,
		InputPasswordModal
	},
	data() {
		return {
			visible: false,
			id: '',
			isTcs: '', //非tcs承运不显示地图
			isRepay: '', //是否补款完成
			contractId: '', // 合同id
			markers: [],
			onTheWayTotal:0,//在途运单数量
			numModal: {
				show: false,
				detail: null
			},
			payMode: '',
			customStyle: {
				backgroundColor: 'rgba(0,0,0,0.4)',
				borderRadius: '100rpx',
				marginLeft: '24rpx',
				marginRight: '20rpx',
				lineHeigth: '42rpx',
				color: '#fff'
			},
			buttonStyle: {
				padding: '12rpx 32rpx',
				height: '64rpx',
				marginLeft: '16rpx'
			},
			popupButtonStyle: {
				width: '256rpx',
				height: '64rpx'
			},
			order: {},
			supplementObj: {
				money: '',
				payMode: '',
			},
			showFooter: false
		}
	},
	computed: {
		// vuex_roleKey:1-采购商，2-供应商
		...mapState(['vuex_roleKey']),
		percent() {
			let money  =Number((this.order.realNum / this.order.num)).toFixed(2) * 100
			return money
		}
	},
	onLoad(params) {
		this.$nextTick(function() {
			this.id = params.id
			this.isTcs = params.isTcs
			this.isRepay = params.isRepay
			this.contractId = params.contractId
			this.projectId = params.projectId
			this.getDetail()
			// setTimeout(()=>{
			// 	this.$refs.uReadMore.showMore=true
			// 	this.$refs.uReadMore.toggleReadMore()
			// },200)
			// console.log('sss',this.$refs.uReadMore)
		})
	},
	onShow() {	
		this.$nextTick(function(){
			this.$refs.inputPasswordModal?.closeModal()
		})
	},
	methods: {
		changePayMode(val){
			this.payMode = val
		},
		supplementMoneyInput(val){
			val = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || null
			this.$nextTick(()=>{
				this.supplementObj.money = val
			})
		},
		getDetail(){
			if (this.vuex_roleKey === 1) {
				this.lastTransportWay()
				this.getBuyerOrdersDetail()
			} else if (this.vuex_roleKey === 2) {
				this.getSupplierBuyerOrdersDetail()
				this.supplierLastTransportWay()
			}
		},
		// 采购商订单详情
		async getBuyerOrdersDetail() {
			const data = await this.$u.api.getBuyerOrdersDetail({ id: this.id })
			this.order = data
		},
		// 采购订单获取车辆定位，展示运输中的车辆
		async lastTransportWay() {
			const data = await this.$u.api.lastTransportWay({ id: this.id })
			this.onTheWayTotal = data.filter((item)=>item.runningStatus === 2 ).length
			let markers = []
			data.map((item, index)=>{
				if(item.runningStatus === 2){
					const random = this.$u.random(1, 360)
					const mapPoint={
						id: index,
						width: 42,
						height: 42,
						// rotate: random,
						longitude: item.transportWay?.lng,
						latitude: item.transportWay?.lat,
						iconPath: '/static/images/order/up.png',
						callout: {
							content: item.licensePlateNo, // 车牌信息
							display: 'ALWAYS',
							fontWeight: 'bold',
							color: '#222', //文本颜色
							fontSize: '12px',
							bgColor: '#ffffff', //背景色
							padding: 5, //文本边缘留白
							textAlign: 'center'
						},
						anchor: {
							x: 0.5,
							y: 0.5
						}
					}
					markers.push(mapPoint)
				}
			})
			this.markers = markers
		},
		// 供应商订单详情
		async getSupplierBuyerOrdersDetail() {
			const data = await this.$u.api.getSupplierBuyerOrdersDetail({ id: this.id })
			this.order = data
		},
		// 供应商车辆定位
		async supplierLastTransportWay() {
			const data = await this.$u.api.supplierLastTransportWay({ id: this.id })
			this.onTheWayTotal = data.filter((item)=>item.runningStatus === 2 ).length
			let markers = []
			data.map((item, index)=>{
				if(item.runningStatus === 2){
					const random = this.$u.random(1, 360)
					const mapPoint={
						id: index,
						width: 42,
						height: 42,
						// rotate: random,
						longitude: item.transportWay?.lng,
						latitude: item.transportWay?.lat,
						iconPath: '/static/images/order/up.png',
						callout: {
							content: item?.licensePlateNo, // 车牌信息
							display: 'ALWAYS',
							fontWeight: 'bold',
							color: '#222', //文本颜色
							fontSize: '12px',
							bgColor: '#ffffff', //背景色
							padding: 5, //文本边缘留白
							textAlign: 'center'
						},
						anchor: {
							x: 0.5,
							y: 0.5
						}
					}
					markers.push(mapPoint)
				}
			})
			this.markers = markers
		},
		// 查看运单
		seeWaybill() {
			uni.navigateTo({
				url: `./WaybillList?id=${this.id}&type=1`
			})
		},
		//需求记录
		seeNeedMaterialRecord() {
			uni.navigateTo({
				url: `./NeedMaterialRecord?id=${this.id}`
			})
		},
		// 点击补款
		async supplement() {
			// 获取余额
			const res = await this.$u.api.orderRepayInfo({ id: this.id })
			this.supplementObj = res
			let projectParam = undefined;
			if (this.projectId) {
				projectParam={projectId: this.projectId}
			}
			const {value} = await this.$u.api.getRemainingAmount(projectParam)
			this.supplementObj.remainingAmount = value
			if(this.order.repayMethod.value){
				this.supplementObj.payMode = this.order.repayMethod.value
				this.payMode = this.order.repayMethod.value
			}else{
				this.supplementObj.payMode = undefined		
				for(let i=0;i<this.supplementObj.payModes.length; i++){
					if(this.supplementObj.payModes[i]===1){
						this.supplementObj.payOfflineShow = 1
						if(!this.supplementObj.payMode){
							this.supplementObj.payMode = 1
							this.payMode = 1
						}
					}
					if(this.supplementObj.payModes[i]===2){
						this.supplementObj.payMode = 2
						this.payMode = 2
						this.supplementObj.payCreditShow = 1
					}
					if(this.supplementObj.payModes[i]===3){
						this.supplementObj.payOnlineShow = 1
					}
				}
			}
			this.visible = true
		},
		// 提交补款
		async submitSupplement() {
			if(!this.supplementObj.money) {
				this.$u.toast('请输入补款金额');
				return
			}
			this.$refs.inputPasswordModal.show()
		},
		// 支付密码输入完毕
		async finish(password) {
			const queryData = {
				id: this.id,
				repaidAmount: this.supplementObj.money, // 补款金额
				repayMethod: this.payMode, // 支付方式
				password: MD5(password),
				amount: this.order.price,
				productId: this.order.productId
			}
			try {
				const data = await this.$u.api.orderRepay(queryData)
				this.visible = false
				this.$appUtils.toastOk('操作成功')
				this.getDetail()
				this.$refs.inputPasswordModal.closeModal()
			} catch (e) {
				this.$refs.inputPasswordModal.clear()
			}
		},
		// 点击调整数量
		changeNum() {
			this.numModal = {
				show: true
			}
		},
		// 提交调整数量
		async confrimNum(val) {
			const queryData = {
				...val,
				orderId: this.id
			}
			const data = await this.$u.api.changeOrderNum(queryData)
		},
		close() {
			this.visible = false
			this.supplementObj.money = ''
		},
		back() {
			uni.navigateBack({ delta: 1 })
		}
	}
}
</script>
<style lang="scss" scoped>
.no-map-bg {
	font-size: 0;
	image {
		width: 750rpx;
		height: 320rpx;
	}
}
::v-deep.order-detail-container {
	background-color: $page-bg-color;
	position: relative;
	height: 100vh;
	.cell-list {
		margin-top: -20rpx;
		border-top: 1px solid #ebebeb;
		background-color: #fff;
		padding: 20rpx 0;
		border-radius: 0 0 16rpx 16rpx;
		.u-cell {
			padding: 6rpx 32rpx;
		}
	}
	.header {
		// margin: 0 -24rpx;
		.back-btn {
			position: absolute;
			top: 100rpx;
			left: 10rpx;
		}
	}
	.not-tcs-detail {
		// margin-top: -84rpx;
		padding: 236rpx 24rpx 0;
		height: 320rpx;
		background-image: url('../../static/images/order/no_map_bg.jpg');
		background-size: 750rpx 320rpx;
		.order-detail-content {
			max-height: calc(100vh - 390rpx);
			overflow-y: scroll;
		}
	}
	.is-tcs-detail {
		position: absolute;
		bottom: 150rpx;
		left: 20rpx;
		width: 710rpx;
		max-height: 70vh;
		overflow-y: scroll;
	}
	.pay-mode {
		.u-radio-group {
			width: calc(100% + 40rpx);
			.u-radio {
				float: right !important;
			}
		}
	}
}
	



.footer {
	width: 100vw;
	background-color: #fff;
	position: fixed;
	z-index: 2;
	bottom: 0;
	border-top: 1px solid $border-color;
}
</style>
