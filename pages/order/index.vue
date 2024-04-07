<template>
	<view>
	<view class="container">
		<!-- 筛选栏 -->
		<!-- <u-sticky> -->
		<view class="top u-p-24 u-p-b-0">
			<view class="page-title u-flex u-row-between u-font-36" v-if="vuex_user">
				<view class="u-font-bold">{{ vuex_roleKey === 1 ? '采购订单' : '销售订单' }}</view>
				<!-- <view class="message" @click.stop="$u.route('/pages/user/message')">
					<u-icon name="chat" color="#FFFFFF" size="36"></u-icon>
					<u-badge type="error" :count="vuex_messageNum ? vuex_messageNum : 0" :offset="[100, 200]"></u-badge>
				</view> -->
				<!-- <view class="message" @click="$u.route('/pages/user/message')">
					<u-icon name="chat" color="#000" size="46"></u-icon>
					<u-badge type="error" :count="vuex_messageNum ? vuex_messageNum : 0" :offset="[100, 210]"></u-badge>
				</view> -->
			</view>
			<view class="search-bar u-p-b-12">
				<u-search
					placeholder="根据商品/合同搜索订单"
					v-model="query.queryString"
					showAction
					:actionText="filterTime.startTime && filterTime.endTime ? '已筛选' : '筛选'"
					bgColor="#F5F5F5"
					:animation="false"
					:actionStyle="actionStyle"
					@custom="custom"
					@blur="searchPage1"
					@focus="focusSearch"
					@clear="searchPage1"
				></u-search>
			</view>
			<u-tabs
				count="count"
				font-size="28"
				bar-height="4"
				gutter="24"
				height="50"
				:list="tabs"
				:offset="[0, -5]"
				:active-color="vuex_main_color"
				:current="currentTab"
				@change="click"
			></u-tabs>
		</view>
		<!-- </u-sticky> -->
		<!-- 订单列表 -->
		<d-refresh-load ref="dRefreshLoad" @loadMore="loadMore" @pullDownRefresh="pullDownRefresh" autoLoad>
			<view class="order-list u-p-24" v-if="orderList.length > 0">
				<OrderItem v-for="(order, i) in orderList" :key="i" :orderDetail="order" @click.native="clickOrder(order)">
					<template #title>
						<view v-if="order.productSource && order.productSource.value === 2">
							<view class="shop-tag u-m-r-6" v-if="vuex_roleKey == 1">
								<image style="width: 36rpx;height: 36rpx;vertical-align: bottom;" src="@/static/images/shop-icon.png"></image>
							</view>
							<view class="shop-tag u-m-r-6" v-else>
								<image style="width: 36rpx;height: 36rpx;vertical-align: bottom;" src="@/static/images/shop-icon.png"></image>
								<text class="u-m-l-10 fs-28r">直营</text>
							</view>
							<text class="u-font-bold fs-28r">{{ order.shopName }}</text>
						</view>
						<view v-else>
							<view class="u-m-b-6">
								<text class="self-tag u-m-r-6">
									{{ vuex_roleKey == 1 ? '自营' : '合同' }}
								</text>
								<text class="u-font-bold fs-28r">{{ order.contractNum ? '【' + order.contractNum + '】' : '' }}</text>
							</view>
							<view class="u-font-bold fs-26r">{{ order.contractName }}</view>
						</view>
					</template>
					<template #status>
						<view style="width: max-content">{{ order.status && order.status.desc }}</view>
					</template>
					<GoodItem v-for="(good, j) in order.products" :key="j" :goodDetail="good"></GoodItem>
					<!-- 部分发货(采购订单状态为4，销售订单状态为3)和已结束(采购订单状态为5，销售订单状态为4)和已暂停的订单有交货进度条，supplementOrderId有值时为补单，不显示交货进度条 -->
					<view
						class="u-m-t-16 u-p-b-10 progress"
						v-if="
							order.orderNo &&
								!order.supplementOrderId &&
								order.status &&
								((vuex_roleKey == 2 && order.status.value === 3) ||
									order.status.value === 4 ||
									order.status.value === 5 ||
									order.status.value === 6)
						"
					>
						<view class="u-flex u-row-between u-font-sm">
							<view class="color-gray">
								{{ vuex_roleKey == 1 ? '已交货：' : '已发货：' }}{{ order.realNum ? order.realNum : 0 }}{{ order.productUnit }}
							</view>
							<view class="u-font-bold">{{ percent(order).toFixed(2) }}%</view>
						</view>
						<u-line-progress
							height="16"
							:percent="percent(order)"
							:round="false"
							:show-percent="false"
							active-color="#72C989"
						></u-line-progress>
					</view>
					<template #btns>
						<!-- 采购商拥有的按钮 -->
						<view v-if="vuex_roleKey == 1">
							<!-- 订单已结束且已核验通过 -->
							<view
								v-if="order.orderNo && order.status.value === 5 && order.settlementStatus && order.settlementStatus.value === 1"
								class="finish-status"
							>
								<image src="../../static/images/order/yi_jie_suan.png" mode=""></image>
							</view>
							<u-button
								v-if="order.planNo && order.status && (order.status.value === 0 || order.status.value === 1)"
								:custom-style="customStyle"
								size="medium"
								shape="circle"
								type="default"
								@click="showModal('cancel', order)"
							>
								取消
							</u-button>
							<!-- 订单状态为 待发货、部分发货时有调整数量按钮 -->
							<u-button
								v-if="order.orderNo && order.status && (order.status.value === 3 || order.status.value === 4)"
								:custom-style="customStyle"
								size="medium"
								shape="circle"
								type="default"
								@click="changeNum(order)"
							>
								调整数量
							</u-button>
							<!-- 非三方的，合同下单的待支付才能支付-->
							<!-- <u-button
								v-if="order.contractId && !order.shopId && order.planNo && order.status && order.status.value === 0"
								:custom-style="customStyle"
								size="medium"
								shape="circle"
								type="primary"
								@click="showModal('pay', order)"
							>
								支付
							</u-button> -->
							<!-- 非三方的，非代用合同的才能补款-->
							<!-- <u-button
								v-if="order.contractId && order.tenantId === vuex_user.tenantId && order.orderNo && order.isRepay === 0"
								:custom-style="customStyle"
								size="medium"
								shape="circle"
								type="primary"
								@click="supplement(order)"
							>
								补款
							</u-button> -->
						</view>
						<!-- 供应商拥有的按钮 -->
						<view v-if="vuex_roleKey == 2">
							<view v-if="order.orderNo && order.status.value === 4 && order.settlementStatus === 2" class="finish-status">
								<image src="../../static/images/order/yi_jie_suan.png" mode=""></image>
							</view>
							<u-button
								v-if="order.planNo && order.planStatus == 5"
								:custom-style="customStyle"
								size="medium"
								shape="circle"
								type="default"
								@click="showModal('auditFalse', order)"
							>
								驳回
							</u-button>
							<u-button
								v-if="order.planNo && order.planStatus == 5"
								:custom-style="customStyle"
								size="medium"
								shape="circle"
								type="primary"
								@click="showModal('auditTrue', order)"
							>
								通过
							</u-button>
							<u-button
								v-if="
									order.orderNo &&
										order.productSource &&
										order.productSource.value === 2 &&
										order.status.value !== 3 &&
										order.status.value !== 4
								"
								:custom-style="customStyle"
								size="medium"
								shape="circle"
								type="primary"
								@click="delivery(order)"
							>
								发货
							</u-button>
						</view>
					</template>
				</OrderItem>
			</view>
		</d-refresh-load>
		<u-empty marginTop="260" v-if="orderList.length === 0 && !searchFocus" mode="order" text="暂无订单"></u-empty>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<!-- 筛选弹出层 -->
		<u-calendar
			mode="range"
			safe-area-inset-bottom
			:active-bg-color="vuex_main_color"
			range-bg-color="rgba(203, 74, 43, 0.1)"
			:range-color="vuex_main_color"
			v-model="showTimePicker"
			@change="changeTime"
			@reset="resetTime"
		></u-calendar>
		<!-- 补款弹出层 -->
		<u-popup class="popup" v-model="visible" mode="center" border-radius="20" :mask-close-able="false" width="630" @close="closeSupplement">
			<view class="u-p-l-32 u-p-r-32 u-p-b-32">
				<view class="u-font-bold u-font-36 u-text-center u-m-t-56 u-m-b-36">订单补款</view>
				<view class="">
					<view class="u-font-28 u-p-l-20 u-m-b-20">待补款金额：{{ supplementObj.price }}元</view>
					<view class="input-div">
						<u-input
							v-model="supplementObj.money"
							focus
							type="digit"
							placeholder="请输入本次补款金额"
							border
							@input="supplementMoneyInput"
						/>
					</view>
					<view style="margin: 0 -20rpx 20rpx;">
						<PayMode v-if="visible" ref="payMode" :supplementObj="supplementObj" @changePayMode="changePayMode"></PayMode>
					</view>
				</view>
				<view class="footer u-flex">
					<u-button :custom-style="popupButtonStyle" size="medium" shape="circle" type="default" @click="closeSupplement">取消</u-button>
					<u-button :custom-style="popupButtonStyle" :disabled="payMode == 3" size="medium" shape="circle" type="primary" @click="submitSupplement">确定</u-button>
				</view>
			</view>
		</u-popup>
		<!-- 调整数量弹窗 -->
		<ChangeNumModal :show.sync="numModal.show" @confirm="confrimNum"></ChangeNumModal>
		<!-- 支付弹窗 -->
		<InputPasswordModal ref="inputPasswordModal" @finish="finish" />
		<!-- 确认模态框 -->
		<u-modal
			v-model="modal.show"
			:title="modal.title"
			:content="modal.content"
			show-cancel-button
			@confirm="confirm"
			@cancel="cancel"
			:confirm-color="vuex_main_color"
			:confirm-text="confirmText"
		></u-modal>
		<!-- 发货模态框 -->
		<u-modal v-model="deliveryModal.show" title="选择发货地址" show-cancel-button @confirm="confirmDelivery" @cancel="cancelDelivery">
			<!-- 地址 -->
			<view class="address">
				<u-cell-group :border="false">
					<u-cell :border-bottom="false" @click="clickAddress">
						<template #title>
							<view class="u-font-24" v-if="curAddress && curAddress.id">
								<text v-if="curAddress.isDefault" class="default-address-tag">默认地址</text>
								<text class="color-black u-m-r-20">{{ curAddress.contactName }}</text>
								<text class="color-black">{{ curAddress.contactPhone }}</text>
							</view>
							<view class="u-font-26" v-else>请选择发货地址</view>
						</template>
					</u-cell>
				</u-cell-group>
				<view class="address-detail color-595959 u-font-24 u-p-l-32 u-p-r-60 u-p-b-24">{{ curAddress && curAddress.address }}</view>
				<view class="address-bottom"><image src="../../static/images/contract/address_bottom.png" mode=""></image></view>
			</view>
		</u-modal>
	</view>
	<u-tabbar :list="vuex_roleKey == 2 ? tabbar_supplier : tabbar_purchaser"></u-tabbar>
	<!-- <u-tabbar :list="vuex_roleKey == 2 ? vuex_tabbar_supplier : vuex_tabbar_purchaser"></u-tabbar> -->
	</view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import OrderItem from '@/components/order/OrderItem.vue'
import GoodItem from '@/components/order/GoodItem.vue'
import PayMode from './components/PayMode.vue'
import ChangeNumModal from './components/ChangeNumModal.vue'
import InputPasswordModal from './components/InputPasswordModal.vue'
import { moneyFormatter } from '@/common/app-utils.js'
import tabbarMixin from "@/common/tabbar.mixin.js"
import { MD5 } from '@/common/adminmd5.js'
export default {
	mixins: [tabbarMixin],
	components: {
		OrderItem,
		GoodItem,
		PayMode,
		ChangeNumModal,
		InputPasswordModal
	},
	data() {
		return {
			showTimePicker: false,
			searchFocus:false,
			filterTime: {
				startTime: '',
				endTime: ''
			},
			scrollTop: 0,
			query: {
				status: '',
				queryString: ''
			},
			page: 1,
			visible: false,
			supplementObj: {
				price: '',
				money: '',
				remainingAmount: '',
				payMode: ''
			},
			payMode: '',
			modal: {
				show: false,
				content: '', //提示语
				title: '',
				type: '', //模态框的业务类型，取消，审核通过和驳回
				data: {} //当前操作的数据
			},
			numModal: {
				orderId: '',
				show: false,
				detail: ''
			},
			deliveryModal: {
				show: false,
				data: {}
			},
			curAddress: {
				id: '',
				contactName: '',
				address: '',
				contactPhone: '',
				isDefault: ''
			},
			customStyle: {
				padding: '32rpx',
				height: '64rpx'
			},
			popupButtonStyle: {
				width: '256rpx',
				height: '64rpx'
			},
			currentTab: 0,
			buyerTabs: [
				{
					id: '',
					name: '全部'
				},
				{
					id: 0,
					name: '待支付'
				},
				{
					id: 1,
					name: '待采购'
				},
				{
					id: 2,
					name: '备货中'
				},
				{
					id: 3,
					name: '待发货'
				},
				{
					id: 4,
					name: '部分发货'
				},
				{
					id: 5,
					name: '已结束'
				},
				{
					id: 6,
					name: '已暂停'
				},
				{
					id: -1,
					name: '未接单'
				}
			],
			supplierTabs: [
				{
					id: '',
					name: '全部'
				},
				{
					id: 0,
					name: '待确认'
				},
				{
					id: 2,
					name: '备货中'
				},
				{
					id: 3,
					name: '部分发货'
				},
				{
					id: 4,
					name: '已结束'
				},
				{
					id: 1,
					name: '待承运方确认'
				},
				{
					id: -1,
					name: '已驳回'
				}
			],
			orderList: []
		}
	},
	computed: {
		// vuex_roleKey:1-采购商，2-供应商
		// ...mapState(['vuex_roleKey']),

		tabs() {
			return this.vuex_roleKey === 1 ? this.buyerTabs : this.supplierTabs
		},
		confirmText() {
			let str = '确定'
			if (this.modal.type === 'auditTrue') str = '通过'
			if (this.modal.type === 'auditFalse') str = '驳回'
			return str
		},
		actionStyle() {
			return this.filterTime.startTime && this.filterTime.endTime
				? {
						color: this.vuex_main_color,
						fontSize: '12px',
						fontWeight: 'bold'
				  }
				: {
						color: '#8C8C8C',
						fontSize: '12px',
						fontWeight: 'bold'
				  }
		}
	},
	watch: {
		vuex_area: {
			handler(val) {
				this.searchPage1()
			}
		}
	},
	async onShow() {
		// await this.appLogin() //登录拦截
		console.log('vuex_roleKey',this.vuex_roleKey);
		// uni.hideTabBar()
		// this.$nextTick(function() {
		// 	this.$refs.inputPasswordModal?.closeModal()
		// })
		// this.search()
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop
	},
	onPullDownRefresh() {
		this.$nextTick(() => {
			this.$refs.dRefreshLoad.dOnPullDownRefresh()
		})
	},
	methods: {
		...mapActions(['appLogin']),
		supplementMoneyInput(val) {
			val = val.match(/^\d*(\.?\d{0,2})/g)[0] || null
			this.$nextTick(() => {
				this.supplementObj.money = val
			})
		},
		search() {
			this.vuex_roleKey === 1 && this.getOrderList()
			this.vuex_roleKey === 2 && this.getSupplierOrderList()
		},
		focusSearch() {
			this.searchFocus = true
			this.page = 1
			this.orderList = []
		},
		searchPage1() {
			uni.pageScrollTo({
				scrollTop: 0
			})
			this.$nextTick(() => {
				this.$refs.dRefreshLoad.dOnPullDownRefresh()
			})
			this.searchFocus = false
		},
		// 获取采购商订单
		async getOrderList() {
			const queryData = Object.assign({}, this.query, this.filterTime, {
				page: this.page
			})
			const res = await this.$u.api.getOrderList(queryData)
			if (this.page === 1) this.orderList = []
			this.orderList = this.orderList.concat(res.records)
			this.$refs.dRefreshLoad.endSuccess(res.records ? res.records.length : 0)
			// 采购订单列表合并了PC端的采购计划和采购订单
			this.orderList.map(order => {
				// if (order.products && order.products.length > 0) {
				// 	order.products.map(good => {
				// 		good.prefixUrl = order.prefixUrl
				// 		good.payMode = order.payMode
				// 		good.paymentMode = order.paymentMode
				// 	})
				// }
				// 基于合同下的订单
				if (order.contractProductListDTO && Object.keys(order.contractProductListDTO).length > 0) {
					order.contractProductListDTO.productPrice = order.productPrice
					order.contractProductListDTO.paymentMode = order.paymentMode
					order.contractProductListDTO.payMode = order.payMode
					// 如果有调价记录就将调价记录并入
					let product = uni.$u.deepMerge(order.contractProductListDTO, {
						adjustmentDTOList: order.adjustmentDTOList,
						num: order.num,
						prefixUrl: order.prefixUrl,
						productImg: order.productImg
					})
					order.products = [product]
				} else if (order.products && order.products.length > 0) {
					order.products.map(good => {
						good.prefixUrl = order.prefixUrl
						good.payMode = order.payMode
						good.paymentMode = order.paymentMode
					})
				} else {
					const product = uni.$u.deepMerge({}, order)
					order.products = [product]
				}
				// 补款状态repayStatus.value：0-待补款，1-补款中，2-补款成功
				// order.isRepay =>-1-不需要补款 0-待补款，1-补款中
				// 待补款金额
				const rep = Number(order.repayAmount) - Number(order.repaidAmount)
				// 待补款金额大于0时，出现补款按钮
				if (rep > 0) {
					// 未发起补款 repayStatus为null,或value为0或者value为3部分补款
					//status订单状态：1.待采购，2.备货中，3.待发货，4.部分发货，5.已结束
					const repayStatus = order.repayStatus ? order.repayStatus : {}
					if (
						Number(order.repaidAmount) < Number(order.repayAmount) &&
						(!repayStatus?.value || repayStatus?.value === 3) &&
						order?.status?.value === 5
					) {
						order.isRepay = 0
					} else {
						order.isRepay = ''
					}
				} else {
					// 不需要补款-预付金额大于等于交货金额时
					order.isRepay = -1
				}
				// 补款中-发起了补款，若是在线支付，则提交付款信息后，补款按钮转变为“查看补款收款账号”按钮3-4修改为"i"
				if (order?.repayStatus?.value == 1 && order?.repayMethod?.value == 3) {
					order.isRepay = 1
				}
				// 补款中-发起了补款，若是线下支付，则提交付款信息后，补款按钮转变为“查看补款收款账号”按钮3-4修改为"i"
				if (order?.repayStatus?.value == 1 && order?.repayMethod?.value == 1) {
					order.isRepay = 2
				}
			})
		},
		//获取供应商订单
		async getSupplierOrderList() {
			const queryData = Object.assign({}, this.query, this.filterTime, {
				page: this.page
			})
			const res = await this.$u.api.getSupplierOrderList(queryData)
			if (this.page === 1) this.orderList = []
			this.orderList = this.orderList.concat(res.records)
			this.$refs.dRefreshLoad.endSuccess(res.records ? res.records.length : 0)
			// 订单列表合并了PC端的计划和订单
			this.orderList.map(order => {
				// if (order.products && order.products.length > 0) {
				// 	order.products.map(good => {
				// 		good.prefixUrl = order.prefixUrl
				// 		good.payMode = order.payMode
				// 		good.paymentMode = order.paymentMode
				// 	})
				// }
				// 基于合同下的订单
				if (order.contractProductListDTO && Object.keys(order.contractProductListDTO).length > 0) {
					order.contractProductListDTO.productPrice = order.productPrice
					order.contractProductListDTO.paymentMode = order.paymentMode
					order.contractProductListDTO.payMode = order.payMode
					let product = uni.$u.deepMerge({}, order)
					order.products = [product]
				} else if (order.products && order.products.length > 0) {
					order.products.map(good => {
						good.prefixUrl = order.prefixUrl
						good.payMode = order.payMode
						good.paymentMode = order.paymentMode
					})
				} else {
					const product = uni.$u.deepMerge({}, order)
					order.products = [product]
				}
			})
		},
		percent(order) {
			return order.deliveryRate.toFixed(2) * 100
		},
		// 点击筛选
		custom(val) {
			this.showTimePicker = true
			uni.hideTabBar()
		},
		changeTime(e) {
			console.log('e', e)
			this.filterTime = {
				startTime: e.startDate + ' 00:00:00',
				endTime: e.endDate + ' 23:59:59'
			}
			this.showTimePicker = false
			// uni.showTabBar()
			this.searchPage1()
		},
		resetTime() {
			console.log('sss')
			this.filterTime = {
				startTime: '',
				endTime: ''
			}
			// uni.showTabBar()
			this.searchPage1()
		},
		// 点击tab
		click(val) {
			this.currentTab = val
			this.query.status = this.tabs[val].id
			this.searchPage1()
		},
		// 点击订单进入详情,deliveryMode=1时为TCS承运
		clickOrder(item) {
			if (!item.orderNo) return
			let url = `./OrderDetail?id=${item.id}&isTcs=${item.deliveryMode.value === 1 ? 1 : ''}&isRepay=${item.isRepay}`
			if (item.contractId) {
				url += `&contractId=${item.contractId}`
			}
			if (item.projectId) {
				url += `&projectId=${item.projectId}`
			}
			uni.navigateTo({
				url: url
			})
		},
		// 点击支付
		pay() {
			this.$refs.inputPasswordModal.show()
		},
		//取消、通过、驳回都可以打开模态框
		showModal(type, data) {
			let title = '取消订单'
			let content = '确定要取消该订单吗？'
			if (type === 'auditTrue') {
				title = '订单审核通过'
				content = ''
			} else if (type === 'auditFalse') {
				title = '订单审核驳回'
				content = ''
			} else if (type === 'pay') {
				title = '订单支付'
				content = `支付金额：${moneyFormatter(data.tradeAmount)}`
			}
			this.modal = {
				title,
				type,
				content,
				data,
				show: true
			}
			uni.hideTabBar()
		},
		async confirm() {
			//取消订单
			if (this.modal.type === 'cancel') {
				const data = await this.$u.api.buyerOrderCancel({
					planId: this.modal.data.id
				})
				this.showSuccess()
				this.searchPage1()
			}
			//供应商审核通过和驳回
			else if (this.modal.type === 'auditTrue') {
				const data = await this.$u.api.supplierOrderAudit({
					id: this.modal.data.id,
					auditResult: 1
				})
				this.showSuccess()
				this.searchPage1()
			} else if (this.modal.type === 'auditFalse') {
				const data = await this.$u.api.supplierOrderAudit({
					id: this.modal.data.id,
					auditResult: 0
				})
				this.showSuccess()
				this.searchPage1()
			}
			//支付
			else if (this.modal.type === 'pay') {
				//如果没有设置支付密码则跳转到设置支付密码页面
				if (!this.vuex_isSetPayPwd) {
					this.$u.route('/pages/user/pay-password')
					return
				}
				this.$refs.inputPasswordModal.show()
			}
		},
		async cancel() {
			this.modal = {
				show: false,
				content: '',
				title: '',
				type: '',
				data: {}
			}
			// uni.showTabBar()
		},
		// 点击调整数量
		changeNum(order) {
			this.numModal = {
				orderId: order.id,
				show: true
			}
		},
		// 提交调整数量
		async confrimNum(val) {
			const queryData = {
				...val,
				orderId: this.numModal.orderId
			}
			const data = await this.$u.api.changeOrderNum(queryData)
		},
		// 点击补款
		async supplement(order) {
			// 获取余额
			const res = await this.$u.api.orderRepayInfo({
				id: order.id
			})
			this.supplementObj = res
			let projectParam = undefined
			if (order.projectId) {
				projectParam = { projectId: order.projectId }
			}
			const { value } = await this.$u.api.getRemainingAmount(projectParam)
			this.supplementObj.remainingAmount = value
			this.supplementObj.id = order.id
			this.supplementObj.productId = order.productId
			if (order.repayMethod.value) {
				this.supplementObj.payMode = order.repayMethod.value
				this.payMode = order.repayMethod.value
			} else {
				this.supplementObj.payMode = undefined
				for (let i = 0; i < this.supplementObj.payModes.length; i++) {
					if (this.supplementObj.payModes[i] === 1) {
						this.supplementObj.payOfflineShow = 1
						if (!this.supplementObj.payMode) {
							this.supplementObj.payMode = 1
							this.payMode = 1
						}
					}
					if (this.supplementObj.payModes[i] === 2) {
						this.supplementObj.payMode = 2
						this.payMode = 2
						this.supplementObj.payCreditShow = 1
					}
					if (this.supplementObj.payModes[i] === 3) {
						this.supplementObj.payOnlineShow = 1
					}
				}
			}
			uni.hideTabBar()
			this.visible = true
		},
		// 补款提交
		submitSupplement() {
			if (!this.supplementObj.money) {
				this.$u.toast('请输入补款金额')
				return
			}
			//如果没有设置支付密码则跳转到设置支付密码页面
			if (!this.vuex_isSetPayPwd) {
				this.$u.route('/pages/user/pay-password')
				return
			}
			this.$refs.inputPasswordModal.show()
		},
		changePayMode(val) {
			this.payMode = val
		},
		// 支付密码输入完毕
		async finish(password) {
			if (this.payMode == 3) return
			if (this.visible) {
				//补款的弹窗
				const queryData = {
					id: this.supplementObj.id,
					repaidAmount: this.supplementObj.money, // 补款金额
					repayMethod: this.payMode, // 支付方式
					password: MD5(password),
					amount: this.supplementObj.price,
					productId: this.supplementObj.productId
				}
				try {
					console.log(queryData)
					const data = await this.$u.api.orderRepay(queryData)
					this.visible = false
					// uni.showTabBar()
					this.showSuccess()
					this.searchPage1()
					this.$refs.inputPasswordModal.closeModal()
				} catch (e) {
					this.$refs.inputPasswordModal.clear()
				}
			} else {
				//支付的弹窗
				const queryData = {
					amount: Number(this.modal.data.tradeAmount).toFixed(2),
					payMode: this.modal.data.payMode && this.modal.data.payMode.value,
					payPassword: MD5(password),
					planId: this.modal.data.id
				}
				try {
					const data = await this.$u.api.contractPay(queryData)
					this.showSuccess()
					this.searchPage1()
					this.$refs.inputPasswordModal.closeModal()
				} catch (e) {
					this.$refs.inputPasswordModal.clear()
				}
			}
		},
		closeSupplement() {
			this.supplementObj.money = ''
			this.visible = false
			// uni.showTabBar()
		},
		async delivery(order) {
			const data = await this.$u.api.getAddressByProducts()
			this.curAddress = this.curAddress.id ? this.curAddress : data.find(item => item.isDefault)
			this.curAddress = this.curAddress || {
				id: undefined,
				contactName: '',
				address: '',
				contactPhone: '',
				isDefault: undefined
			}
			this.deliveryModal = {
				show: true,
				data: order
			}
			uni.hideTabBar()
		},
		clickAddress() {
			this.$u.route(`/pages/user/address?from=order`)
		},
		//在地址页面选中地址后返回本页面时
		async otherFun(id) {
			const data = await this.$u.api.getAddressByProducts()
			this.curAddress = data.find(item => item.id === id)
		},
		async confirmDelivery() {
			if (!this?.curAddress?.id) {
				this.$u.toast('请选择发货地址')
				return
			}
			const queryData = {
				orderId: this.deliveryModal.data.id,
				address: this.curAddress.address,
				addressId: this.curAddress.id
			}
			const data = await this.$u.api.supplierDeliveryGoods(queryData)
			this.showSuccess()
			this.searchPage1()
		},
		cancelDelivery() {
			this.curAddress = {}
			this.deliveryModal = {
				show: false,
				data: {}
			}
			// uni.showTabBar()
		},
		showSuccess() {
			this.$appUtils.toastOk('操作成功')
		},
		loadMore(pageNo) {
			this.page = pageNo
			this.search()
		},
		pullDownRefresh(pageNo) {
			this.page = pageNo
			this.search()
		}
	},
	onReachBottom() {
		this.$nextTick(() => {
			this.$refs.dRefreshLoad.dOnReachBottom()
		})
	}
}
</script>

<style lang="scss">
page {
	background-color: $page-bg-color;
}
</style>
<style lang="scss" scoped>
::v-deep.container {
	// background-color: $page-bg-color;

	.top {
		width: 100vw;
		background-color: #fff;
		position: fixed;
		top: 0;
		z-index: 2;

		.page-title {
			padding: 80rpx 180rpx 26rpx 26rpx;
			line-height: 46rpx;
		}
	}

	.message {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 64rpx;
		height: 64rpx;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 50%;
	}
	.order-list {
		margin-top: 340rpx;

		.order-item {
			border-bottom: 1px solid #ebebeb;
		}
	}

	.progress {
		border-bottom: 1px solid #ebebeb;
	}

	.u-btn {
		margin-left: 16rpx;
	}

	.self-tag {
		background-color: $main-color;
		padding: 1rpx 8rpx;
		color: #fff;
		border-radius: 4rpx;
	}

	.shop-tag {
		display: inline-block;
		// background-color: #ddbd6a;
		padding: 1rpx 8rpx;
		color: #000;
		border-radius: 4rpx;
	}

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

	.finish-status {
		position: absolute;
		bottom: -8rpx;
		right: -32rpx;

		image {
			width: 120rpx;
			height: 120rpx;
		}
	}

		.pay-mode{
				.u-radio-group{
					width:calc(100% + 40rpx);
					.u-radio{
						float:right !important;
					}
				}
			}
	
}

</style>
