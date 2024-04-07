<template>
	<view class="order-detail-content">
		<!--运单统计 -->
		<view class="waybill-total u-font-24" :class="isTcs && onTheWayTotal > 0 ? '' : 'bg-black'">
			全部运单
			<text class="u-m-l-6 u-m-r-2">{{ order.waybillTotal }} 个</text>
			<text class="u-m-l-10" v-if="isTcs && onTheWayTotal > 0">| 在途运单 {{ onTheWayTotal || 0 }} 个</text>
		</view>
		<view class="address u-m-b-20 u-p-b-10">
			<!-- 地址 -->
			<view class="u-flex-1 m-b--10 u-p-b-12">
				<view style="font-weight: 500;" class="m-b--10">
					<!-- <text class="default-address u-m-r-12 u-p-l-12  u-p-r-12 u-p-t-2 u-p-b-2">默认地址</text> -->
					<text class="u-font-bold u-font-24 color-black">{{ order.contactName }}</text>
					<text class="u-m-l-16 u-font-24 u-font-bold color-black">{{ order.contactPhone }}</text>
				</view>
				<view class="color-gray u-m-t-12 u-font-24">{{ order.address }}</view>
			</view>
			<!--  部分发货(采购订单状态为4，销售订单状态为3)和已结束(采购订单状态为5，销售订单状态为4)和已暂停的订单有交货进度条，supplementOrderId有值时为补单，不显示交货进度条 -->
			<view class="u-m-t-6 u-p-b-0 progress" v-if="
					order.orderNo &&
						!order.supplementOrderId &&
						order.status &&
						((vuex_roleKey == 2 && order.status.value === 3) || order.status.value === 4 || order.status.value === 5 || order.status.value === 6)
				">
				<view class="u-flex u-row-between u-font-28 m-b--20">
					<view class="color-gray">
						{{ vuex_roleKey == 1 ? '已交货：' : '已发货：' }}{{ order.realNum ?order.realNum:'0'  }}{{ order.productUnit }}
					</view>
					<view class="color-black">{{ percent.toFixed(2) }}%</view>
				</view>
				<u-line-progress height="16" :percent="percent" :round="false" :show-percent="false"
					active-color="#72C989"></u-line-progress>
			</view>
		</view>

		<OrderItem class="order-item" :orderDetail="order">
			<template #title>
				<view v-if="order.productSource && order.productSource.value === 2">
					<view class="shop-tag u-m-r-6" v-if="vuex_roleKey == 1">
						<image style="width: 36rpx;height: 36rpx;vertical-align: bottom;" src="@/static/images/shop-icon.png"></image>
					</view>
					<view class="shop-tag u-m-r-6"  v-else>
						<image style="width: 36rpx;height: 36rpx;vertical-align: bottom;" src="@/static/images/shop-icon.png"></image>
						<text class="u-m-l-10 fs-28r">直营</text>
					</view>
					<text class="u-font-bold fs-28r" v-if="order.shopName">{{ order.shopName }}</text>
				</view>
				<view v-else>
					<view>
						<text class="self-tag u-m-r-6"
							v-if="order.productSource && order.productSource.value === 1">{{vuex_roleKey == 1 ? '自营' :'合同'}}</text>
						<text class="u-font-bold fs-28r">{{ order.contractNum ? '【' + order.contractNum + '】' : '' }}</text>
					</view>
					<view class="u-font-bold fs-26r">{{ order.contractName }}</view>
				</view>
			</template>
			<template #status>
				<view style="width: max-content">{{ order.status && order.status.desc }}</view>
			</template>
			<!-- <GoodItem v-for="(good, j) in order.goodList" :key="j" :goodDetail="good"></GoodItem> -->
			<GoodItem :goodDetail="order"></GoodItem>
			<view slot="footer"></view>
		</OrderItem>
		<view class="cell-list">
			<u-cell-group :border="false">
				<u-cell :arrow="false" :border-bottom="false">
					<view slot="title"><text class="color-gray">订单编号</text></view>
					<text class="color-black">{{ order.orderNo }}</text>
				</u-cell>
				<u-cell :arrow="false" :border-bottom="false">
					<view slot="title"><text class="color-gray">下单时间</text></view>
					<text class="color-black" :border-bottom="false">{{ order.createTime }}</text>
				</u-cell>
				<u-cell :arrow="false" :border-bottom="false">
					<view slot="title"><text class="color-gray">配送模式</text></view>
					<text class="color-black" :border-bottom="false">{{ isTcs ? '平台承运' : '商家承运' }}</text>
				</u-cell>
				<u-cell :arrow="false" :border-bottom="false">
					<view slot="title">
						<text class="color-gray">{{ vuex_roleKey == 1 ? '已交货金额' : '已发货金额' }}</text>
					</view>
					<text
						class="color-black u-font-bold">￥{{ vuex_roleKey == 1 ? order.totalPrice : order.shouldPay }}</text>
				</u-cell>
				<u-cell :arrow="false" :border-bottom="false">
					<view slot="title"><text class="color-gray">已支付金额</text></view>
					<text class="color-black u-font-bold">￥{{ order.payedAmount }}</text>
				</u-cell>
				<u-cell :arrow="false" :border-bottom="false">
					<view slot="title"><text class="color-gray">已优惠金额</text></view>
					<text class="color-black u-font-bold">￥{{ order.discounts || '0.00' }}</text>
				</u-cell>
				<u-cell :arrow="false" :border-bottom="false" v-if="vuex_roleKey == 1">
					<view slot="title"><text class="color-gray">已开票金额</text></view>
					<text class="color-black u-font-bold">￥{{ order.invoiceAmount }}</text>
				</u-cell>
			</u-cell-group>
		</view>

		<view v-if="order.adjustmentDTOList && order.adjustmentDTOList.length > 0" class="adjust-price u-m-t-20">
			<!-- <view class="warning-color">
				<u-icon class="u-m-r-10" name="info-circle"></u-icon>
				单价已调整
			</view> -->
			<view class="cell-list u-m-t-10">
				<u-cell-group :border="false">
					<u-cell :arrow="false" :border-bottom="false">
						<view slot="title"><text class="color-gray">初始价格</text></view>
						<text class="color-black">{{ order.productInitialPrice }}元/{{ order.productUnit }}</text>
					</u-cell>
					<u-cell v-for="(item, index) in order.adjustmentDTOList" :key="index" :arrow="false" :border-bottom="false">
						<view slot="title">
							<text class="color-gray">{{ item.createTime }} 调整</text>
						</view>
						<text class="color-black">{{ item.price }}元/{{ item.productUnit }}</text>
					</u-cell>
				</u-cell-group>
			</view>
		</view>
		<!-- 如果是区间单价并且没有调过价 -->
		<!-- <view v-if="
				order.contractProductListDTO &&
					order.contractProductListDTO.productContractPriceLow &&
					(!order.adjustmentDTOList || (order.adjustmentDTOList && order.adjustmentDTOList.length === 0))
			" class="adjust-price u-m-t-20">
			<view class="warning-color">
				<u-icon class="u-m-r-10" name="info-circle"></u-icon>
				该价格为合同商品区间单价最高值，单价未调整
			</view>
		</view> -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import OrderItem from '@/components/order/OrderItem.vue'
	import GoodItem from '@/components/order/GoodItem.vue'
	export default {
		components: {
			OrderItem,
			GoodItem
		},
		props: {
			isTcs: {
				type: String | Number,
				default: ''
			},
			onTheWayTotal: {
				type: String | Number,
				default: 0
			},
			order: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {}
		},
		mounted() {},
		computed: {
			...mapState(['vuex_roleKey']),
			percent() {
				if(this.order.deliveryRate){
					return (this.order.deliveryRate).toFixed(2) * 100
				}
				return 0
			}
		}
	}
</script>

<style lang="scss" scpoed>
	.waybill-total {
		border-radius: 16rpx 16rpx 0 0;
		background: linear-gradient(to right, #367bf5, #679dfe);
		color: #fff;
		padding: 8rpx 22rpx;

		&.bg-black {
			background: linear-gradient(to right, #222222, #68645c);
		}
	}

	.m-t--30 {
		margin-top: -30rpx;
	}

	.m-t--20 {
		margin-top: -20rpx;
	}

	.m-b--10 {
		margin-bottom: -10rpx;
	}

	.m-b--20 {
		margin-bottom: -20rpx;
	}

	.address {
		padding: 20rpx 20rpx 0;
		background-color: #fff;
		// border-radius: 8rpx;
		line-height: 1.8;
		border-radius: 0 0 16rpx 16rpx;
	}

	.progress {
		margin-top: -20rpx;
	}

	.default-address {
		width: 96px;
		height: 32px;
		font-size: 20rpx;
		font-weight: 500;
		color: #ffffff;
		font-size: 20rpx;
		line-height: 20px;
		background: linear-gradient(225deg, #68645c 0%, #222222 100%);
		border-radius: 2px;
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

	.adjust-price {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 16rpx;
	}

	.warning-color {
		color: #f28b00;
	}
</style>
