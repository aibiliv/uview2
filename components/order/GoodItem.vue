<template>
	<!-- 订单商品 -->
	<view class="good-item u-flex u-row-between u-p-t-20 u-p-b-20">
		<view class="left u-flex u-row-between u-font-sm">
			<view class="image-container" v-if="goodDetail.productImg">
				<image :src="`${goodDetail.prefixUrl||''}${goodDetail.productImg}`" mode=""></image>
				<!-- <image src="../../static/images/contract/purchase_bg.jpg" mode=""></image> -->
			</view>
			
			<view class="good-desc">
				<view class="good-name fs-28r">
					<text>{{ goodDetail.productTitle || goodDetail.productName }}</text>
					<text v-if="goodDetail.productAttrValue">{{ '【' + goodDetail.productAttrValue + '】' }}</text>
				</view>

				<slot name="label">
					<view class="good-label">
						<!-- <text class="good-tag" v-for="(tag, i) in goodDetail.tags" :key="i">{{ tag }}</text> -->
						<text class="good-tag" v-if="goodDetail.paymentMode && goodDetail.paymentMode.desc">{{ goodDetail.paymentMode.desc }}</text>
						<text class="good-tag" v-if="goodDetail.payMode && goodDetail.payMode.desc">{{ goodDetail.payMode.desc }}</text>
					</view>
				</slot>
			</view>
		</view>
		<view class="right u-row-between u-font-xs">
			<slot name="price">
				<!-- <view v-if="goodDetail.adjustmentDTOList && goodDetail.adjustmentDTOList.length > 0">
					<view class="u-font-24 color-theme text-right" style="line-height: 0;">
						单价已调整
					</view>
					<view class="color-theme">
						<text class="price u-font-bold u-font-28 u-m-r-6">{{ '￥' + moneyFormatter(goodDetail.productPrice) }}</text>
						<text>/{{ goodDetail.productUnit }}</text>
					</view>
				</view> -->
				<view v-if="goodDetail.isBargaining && goodDetail.isBargaining.value === 1">
					<view class="u-font-24 color-theme" style="line-height: 0;text-align: right;">
						已议价
					</view>
					<view class="color-theme">
						<text class="price u-font-bold u-font-28 u-m-r-6">{{ '￥' + moneyFormatter(goodDetail.productPrice) }}</text>
						<text>/{{ goodDetail.productUnit }}</text>
					</view>
				</view>
				<view v-else>
					<text class="price u-font-bold u-font-28 u-m-r-6">{{ '￥' +  moneyFormatter(goodDetail.productPrice) }}</text>
					<text>/{{ goodDetail.productUnit }}</text>
				</view>		
			</slot>
			<view class="num color-gray" style="float:right">
				<slot name="num">× {{ goodDetail.num }}</slot>
			</view>
		</view>
	</view>
</template>

<script>
import { moneyFormatter } from '@/common/app-utils.js'
export default {
	props: {
		goodDetail: {
			type: Object,
			default: () => {}
		}
	},
	components: {},
	data() {
		return {
			moneyFormatter
		}
	},
	mounted() {
	},
	methods: {}
}
</script>

<style lang="scss" scoped>
.good-item {
	color: $text-black;
	// border-bottom: 1px solid #ebebeb;
	line-height: 2.5;
	.image-container {
		background-color: $page-bg-color;
		border-radius: 16rpx;
		margin-right: 20rpx;
		font-size: 0;
		image {
			border-radius: 16rpx;
			width: 140rpx;
			height: 140rpx;
		}
	}
	.good-tag {
		margin-right: 10rpx;
		padding: 6rpx 16rpx;
		border-radius: 5rpx;
		color: #595959;
		background-color: rgba($color: $main-color, $alpha: 0.1);
	}
}
</style>
