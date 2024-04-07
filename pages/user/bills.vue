<template>
	<view class="container u-p-20">
		<d-refresh-load ref="dRefreshLoad" @loadMore="loadMore" @pullDownRefresh="pullDownRefresh" autoLoad>
			<view v-for="(item,index) in datas" :key="index" class="u-m-b-20 item" @click="goDetail(item)">

				<view class="u-flex u-row-between">
					<view class="bill-no" v-if="item.invoiceUseType.value==2">发票号码{{item.invoiceNumber}}</view>
					<view class="bill-balck" v-if="item.invoiceUseType.value!=2">发票号码{{item.invoiceNumber}}</view>
					<view class="u-font-32 color-red" v-if="item.invoiceUseType.value==2">
						<text class="u-font-bold">-{{item.invoiceAmount.toFixed(2) || 0.00}}</text>
						<text class="color-8C8C8C u-m-l-10">元</text>
					</view>
					<view class="u-font-32 color-222" v-if="item.invoiceUseType.value!=2">
						<text class="u-font-bold">{{item.invoiceAmount.toFixed(2) || 0.00}}</text>
						<text class="color-8C8C8C u-m-l-10">元</text>
					</view>
				</view>

				<view class="u-m-t-20 u-font-24">
					<text class="color-8C8C8C">发票代码：</text>{{item.invoiceCode}}
				</view>
				<view class="u-m-t-10 u-font-24">
					<text class="color-8C8C8C">出票时间：</text>{{item.drawerTime}}
				</view>
			</view>
		</d-refresh-load>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				datas: []
			}
		},
		onPullDownRefresh() {
			this.$nextTick(() => {
				this.$refs.dRefreshLoad.dOnPullDownRefresh();
			})
		},
		onReachBottom() {
			this.$nextTick(() => {
				this.$refs.dRefreshLoad.dOnReachBottom();
			})
		},
		onLoad(options) {

		},
		methods: {
			goDetail(item) {
				this.$u.route('/pages/user/bill-detail?id=' + item.id)
			},
			loadMore(pageNo) {
				this.getDatas(pageNo);
			},
			pullDownRefresh(pageNo) {
				this.getDatas(pageNo);
			},
			getDatas(page) {
				this.$u.api.invoicePage({
					page: page
				}).then(res => {
					if (page === 1) {
						this.datas = [];
					}
					//设置列表数据
					if (res.records) {
						this.datas = this.datas.concat(res.records)
					}
					this.$refs.dRefreshLoad.endSuccess(res.records ? res.records.length : 0)
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $u-bg-color;
		// background-color: #EA3D2F;
	}

	.bill-no {
		padding: 4rpx 16rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		background: rgba(234, 61, 47, 0.15);
		border-radius: 8rpx;
		font-weight: 700;
		color: #EA3D2F;
	}

	.bill-balck {
		padding: 4rpx 16rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		background: #F5F5F5;
		border-radius: 8rpx;
		font-weight: 700;
	}

	.item {
		border-radius: 8rpx;
		background: #fff;
		padding: 32rpx 24rpx;
	}
</style>
