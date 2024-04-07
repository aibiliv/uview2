<template>
	<view class="container">
		<!-- 筛选栏 -->
		<!-- <u-sticky> -->
		<view class="header">
			<view class="top u-p-20">
				<u-search
					placeholder="根据车牌号搜索运单"
					v-model="waybillSn"
					bgColor="#F5F5F5"
					:animation="false"
					:showAction="false"
					:actionStyle="{ color: '#8C8C8C', fontSize: '12px' }"
					@blur="search"
					@clear="search"
				></u-search>
			</view>
			<view class="u-p-b-20 top">
				<u-tabs
					count="count"
					font-size="28"
					bar-height="4"
					gutter="24"
					height="50"
					:list="list"
					:offset="[0, -5]"
					:active-color="mainColor"
					:current="currentTab"
					@change="click"
				></u-tabs>
			</view>
			<u-line color="#d9d9d9" />
		</view>
		<!-- </u-sticky> -->
		<!-- 运单列表 -->
		<view class="waybill-list">
			<u-collapse :item-style="itemStyle" :head-style="headStyle">
				<u-collapse-item v-for="(item, index) in waybillList" :key="index">
					<!-- <template #title-all> -->
					<view slot="title-all" class="collapse-head u-flex u-row-between">
						<view class="left u-font-28">
							<text class="u-font-bold car-num u-m-r-12">{{ item.licensePlateNo }}</text>
							<text>{{ item.driverName }}</text>
						</view>
						<view class="right u-font-24">
							<u-tag
								v-if="item.runningStatus === 1"
								class="u-m-r-20"
								text="待装车"
								mode="light"
								bg-color="#fdf3e5"
								border-color="#fdf3e5"
								color="#F28B00"
								shape="circle"
							/>
							<u-tag
								text="运输中"
								class="u-m-r-20"
								v-if="item.runningStatus === 2"
								mode="light"
								bg-color="#eaf6ed"
								border-color="#eaf6ed"
								color="#2EA84F"
								shape="circle"
							/>
							<u-tag
								text="已完成"
								class="u-m-r-20"
								v-if="item.runningStatus === 3 && item.refundStatus != 1"
								mode="light"
								bg-color="#F5F5F5 "
								border-color="#F5F5F5"
								color="#595959"
								shape="circle"
							/>
							<u-tag
								text="已关闭"
								class="u-m-r-20"
								v-if="item.runningStatus === 9"
								mode="light"
								bg-color="#F5F5F5"
								border-color="#F5F5F5"
								color="#595959"
								shape="circle"
							/>
							<u-tag
								text="已退货"
								class="u-m-r-20"
								v-if="item.refundStatus === 1"
								mode="light"
								bg-color="#ea3d2f1a"
								border-color="#ea3d2f1a"
								color="#EA3D2F"
								shape="circle"
							/>
							<u-icon name="arrow-down" size="24"></u-icon>
						</view>
					</view>
					<!-- </template> -->
					<view class="collapse-body">
						<view class="desc-item">
							<text class="color-gray">运单编号：</text>
							<text class="color-black">{{ item.waybillNo }}</text>
						</view>
						<view class="desc-item">
							<text class="color-gray">{{ vuex_roleKey === 1 ? '收货净重：' : '发货净重：' }}</text>
							<text class="color-black" v-if="vuex_roleKey === 1">{{ item.receivingNetWeight ? item.receivingNetWeight + item.unit : '--' }}</text>
							<text class="color-black" v-if="vuex_roleKey === 2">{{ item.deliveryNetWeight ? item.deliveryNetWeight + item.unit : '--' }}</text>
						</view>
						<view class="desc-item">
							<text class="color-gray">派单时间：</text>
							<text class="color-black" v-if="item.createTime">{{ item.createTime | date('yyyy-mm-dd hh:MM:ss') }}</text>
						</view>
						<view class="desc-item">
							<text class="color-gray">{{ vuex_roleKey === 1 ? '收货时间：' : '发货时间：' }}</text>
							<text class="color-black" v-if="item.receiveTime && vuex_roleKey === 1">
								{{ item.receiveTime | date('yyyy-mm-dd hh:MM:ss') }}
							</text>
							<text class="color-black" v-if="item.loadingTime && vuex_roleKey === 2">
								{{ item.loadingTime | date('yyyy-mm-dd hh:MM:ss') }}
							</text>
						</view>
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
export default {
	data() {
		return {
			currentTab: 0,
			waybillSn:'',
			id: '',
			type: '1',
			status: '',
			list: [
				{ value: '', name: '全部' },
				{ value: 0, name: '待装车' },
				{ value: 1, name: '运输中' },
				{ value: 2, name: '已完成' },
				{ value: 9, name: '已关闭' },
				{ value: 10, name: '已退货' }
			],
			itemStyle: {
				backgroundColor: '#fff',
				// padding: '10rpx 0',
				borderBottom: '1px solid #EBEBEB'
			},
			headStyle: {
				backgroundColor: '#fff',
				padding: ' 20rpx 32rpx'
			},
			bodyStyle: {
				backgroundColor: '#FAFAFA',
				lineHeight: '68rpx',
				padding: '32rpx',
				height: '290rpx'
			},
			waybillList: []
		}
	},
	computed: {
		// vuex_roleKey:1-采购商，2-供应商
		...mapState(['vuex_roleKey']),
		mainColor() {
			return this.$store.state.vuex_main_color
		}
	},
	async onLoad(params) {
		this.id = params.id
		this.search()
	},
	methods: {
		search() {
			this.vuex_roleKey == 1 && this.getWaybillList()
			this.vuex_roleKey == 2 && this.supplierOrderWaybillList()
		},
		//采购商订单-运单
		async getWaybillList() {
			const queryData = {
				id: this.id,
				status: this.status,
				waybillSn:this.waybillSn,
				limit: 50
			}
			const data = await this.$u.api.waybillList(queryData)
			this.waybillList = data.records
		},
		//供应商订单-运单
		async supplierOrderWaybillList() {
			const queryData = {
				id: this.id,
				status: this.status,
				waybillSn:this.waybillSn,
				limit: 50
			}
			const data = await this.$u.api.supplierOrderWaybillList(queryData)
			this.waybillList = data.records
		},
		click(val) {
			this.currentTab = val
			this.status = this.list[val].value
			this.search()
		}
	}
}
</script>

<style lang="scss" scoped>
::v-deep.container {
	// background-color: $page-bg-color;
		
	.header{
		position: fixed;
		z-index: 970;
		// top: 0;
	}
	.top {
		background-color: #fff;
	}
	.waybill-list {
		padding-top: 184rpx;
		.car-num {
			background-color: $page-bg-color;
			padding: 12rpx 0;
			width: 204rpx;
			display: inline-block;
			text-align: center;
			border-radius: 8rpx;
		}
		.collapse-head {
			width: 100%;
		}
		.collapse-body {
			background-color: #fafafa;
			line-height: 68rpx;
			padding: 26rpx 32rpx;
			// height:290rpx
		}
	}
}
</style>
