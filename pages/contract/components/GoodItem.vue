<template>
	<!-- 合同商品 -->
	<view class="good-item u-padding-24">
		<view class="u-flex u-row-between">
			<view class="left u-flex u-row-between u-font-sm">
				<view class="image-container">
					<!-- <image src="../../../static/images/banner.jpg" mode=""></image> -->
					<image :src="goodDetail.imageFullUrl" mode=""></image>
				</view>
				<view class="good-desc">
					<!-- <view class="good-name">
					</view> -->
					<text>{{ goodDetail.productName }}</text>
					<text v-if="goodDetail.productAttrValue">{{ '【' + goodDetail.productAttrValue + '】' }}</text>
					<view>
						<view v-if="goodDetail.intervalPriceSwitch">
							<text class="u-font-26 u-font-bold">￥</text>
							<text class="price u-font-36 u-font-bold">
								{{
									goodDetail.productContractPriceLow
										.toFixed(2)
										.toString()
										.split('.')[0] + '.'
								}}
							</text>
							<text>
								{{
									goodDetail.productContractPriceLow
										.toFixed(2)
										.toString()
										.split('.')[1]
								}}
							</text>
							<text class="u-font-22 color-gray">-</text>
							<text class="price u-font-36 u-font-bold">
								{{
									goodDetail.productContractPrice &&
										goodDetail.productContractPrice
											.toFixed(2)
											.toString()
											.split('.')[0] + '.'
								}}
							</text>
							<text>
								{{
									goodDetail.productContractPrice &&
										goodDetail.productContractPrice
											.toFixed(2)
											.toString()
											.split('.')[1]
								}}/{{ goodDetail.productUnit }}
							</text>
						</view>
						<view v-else>
							<text class="u-font-26 u-font-bold">￥</text>
							<text class="price u-font-36 u-font-bold">
								{{
									goodDetail.productContractPrice &&
										goodDetail.productContractPrice
											.toFixed(2)
											.toString()
											.split('.')[0] + '.'
								}}
							</text>
							<text>
								{{
									goodDetail.productContractPrice &&
										goodDetail.productContractPrice
											.toFixed(2)
											.toString()
											.split('.')[1]
								}}/{{ goodDetail.productUnit }}
							</text>
						</view>
					</view>
				</view>
			</view>
			<view class="right  u-font-xs">
				<view>
					<text class="price u-font-bold">{{ '  ' }}</text>
				</view>
				<view><slot name="input"></slot></view>
			</view>
		</view>
		<view class="total-num u-flex u-flex-wrap">
			<view>
				<text class="color-gray">合同数量：</text>
				<text>{{ goodDetail.num }}</text>
			</view>
			<view class="right">
				<text class="color-gray">{{ vuex_roleKey === 1 ? '已采购：' : '已销售：' }}</text>
				<text>{{ goodDetail.buyerNum }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
export default {
	props: {
		goodDetail: {
			type: Object,
			default: () => {
				return {
					productContractPriceLow: '',
					productContractPrice: ''
				}
			}
		}
	},
	computed: {
		...mapState(['vuex_roleKey'])
	},
	data() {
		return {}
	},
	mounted() {},
	methods: {}
}
</script>

<style lang="scss" scoped>
.good-item {
	// background-color: #fff;
	line-height: 2.5;
	.image-container {
		margin-right: 20rpx;
		font-size: 0;
		border-radius: 16rpx;
		background-color: $page-bg-color;
		image {
			border-radius: 16rpx;
			width: 140rpx;
			height: 140rpx;
		}
	}
	.total-num {
		background-color: $page-bg-color;
		padding: 12rpx;
		margin-top: 20rpx;
		line-height: 1;
		& > view {
			width: 50%;
		}
		.right {
			border-left: 1px solid $border-color;
			padding-left: 20rpx;
		}
	}
}
</style>
