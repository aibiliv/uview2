<template>
	<view class="container" :class="vuex_roleKey == 2 ? 'supplier' : showFooter ? '' :'showPopup'">
		<!-- 合同卡片 -->
		<scroll-view style="height:100%" scroll-y>
			<view class="u-p-l-24 u-p-r-24">
			<view class="card-container">
				<ContractCard v-if="contractDetail" :detail="contractDetail" :showFooter.sync="showFooter">
					<template #header>
						<view class="header">
							<u-button class="back-btn" type="info" size="mini" shape="circle" :custom-style="customStyle" @click="back">
								<u-icon name="arrow-left"></u-icon>
							</u-button>
							<text v-if="contractDetail.payType.includes('2') && contractDetail.creditAmount && contractDetail.creditAmount >0" style="color: #723e21">
								已授信（账期时长{{ contractDetail.billTime || '--' }}天）
							</text>
						</view>
					</template>
				</ContractCard>
			</view>
			<!-- 授信额度统计 -->
			<view v-if="contractDetail.payType.includes('2') && contractDetail.creditAmount && contractDetail.creditAmount >0" class="total-amount u-flex u-padding-32">
				<view class="u-flex u-row-between">
					<view class="img u-padding-6 u-m-r-12"><image src="../../static/images/contract/total_amount.png" mode=""></image></view>
					<view class="right u-flex-col">
						<view class="u-font-36">{{ moneyFormatter(contractDetail.creditAmount) }}</view>
						<view class="u-font-28 color-gray">授信额度</view>
					</view>
				</view>
				<view class="u-flex u-row-between">
					<view class="img u-padding-6 u-m-r-12"><image src="../../static/images/contract/rest_amount.png" mode=""></image></view>
					<view class="right u-flex-col">
						<view class="u-font-36">{{ moneyFormatter(contractDetail.residueAmount) }}</view>
						<view class="u-font-28 color-gray">剩余额度</view>
					</view>
				</view>
			</view>
			<!-- 合同商品列表 -->

			<view class="content u-m-t-32">
				<view class="u-p-l-20 u-p-t-30 u-m-l-0 u-p-b-20 title-item">
					<text class="u-font-32 u-font-bold u-m-r-10">合同商品</text>
					<u-tag type="info" shape="circle" size="mini" :text="productNum"></u-tag>
				</view>
				<GoodItem v-for="(good, i) in contractDetail.contractProductList" :key="i" :goodDetail="good">
					<template #price></template>
					<template #input>
						<view class="input-btn" v-show="vuex_roleKey == 1 && contractDetail.contractStatus === 1">
							<u-input
								width="200"
								v-if="good.showInput"
								:border-color="vuex_main_color"
								v-model="good.buyNum"					
								type="number"
								focus
								border
								placeholder=" "
								:clearable="false"
								:custom-style="customInputStyle"
								@change="changeNum"
							/>
							<view v-else class="cart-div" @click="clickGood(good)">
								<image src="../../static/images/contract/cart.png" mode=""></image>
							</view>
						</view>
					</template>
				</GoodItem>
			</view>
			<!-- 修订记录 -->
			<view class="u-m-t-32" v-if="contractDetail.effectiveRecord && contractDetail.effectiveRecord.length > 0">
				<view class="u-p-l-20 u-p-t-30 u-m-l-0 u-p-b-20 title-item"><text class="u-font-32 u-font-bold u-m-r-10">修订记录</text></view>
				<u-cell-group :border="false">
					<u-cell :arrow="false" :border-bottom="false" v-for="(item, index) in contractDetail.effectiveRecord" :key="index">
						<view slot="title" class="color-black">
							<text class="u-m-r-20">{{ index > 0 ? '续签' : '上传' }}</text>
							<text class="">{{ item.createTime }}</text>
						</view>
						<view slot="label">
							<text class="color-gray">合同有效期 {{ item.startTime.split(' ')[0] + ' 至 ' + item.endTime.split(' ')[0] }}</text>
						</view>
					</u-cell>
				</u-cell-group>
			</view>
			</view>
			</scroll-view>
			<!-- footer -->
			<view v-show="showFooter" v-if="vuex_roleKey == 1 && contractDetail.contractStatus === 1" class="footer u-flex u-row-between u-padding-32 u-font-28">
				<view class="left">
					<text class="color-gray">合计：</text>
					<text class="price" v-if="totalMoney">￥</text>
					<text class="price u-font-36" v-if="totalMoney">{{ moneyFormatter(totalMoney).split('.')[0] + '.' }}</text>
					<text class="price" v-if="totalMoney">{{ moneyFormatter(totalMoney).split('.')[1] ? moneyFormatter(totalMoney).split('.')[1] : '00'}}</text>
				</view>
				<view class="btn"><u-button shape="circle" type="primary" size="medium" :disabled="!totalMoney" @click="toBuy">去下单</u-button></view>
			</view>
		
	</view>
</template>

<script>
import ContractCard from '@/components/contract/ContractCard.vue'
import GoodItem from './components/GoodItem.vue'
import { moneyFormatter } from '@/common/app-utils.js'
import { mapState, mapGetters } from 'vuex'
export default {
	options: { styleIsolation: 'shared' },
	components: {
		ContractCard,
		GoodItem
	},
	data() {
		return {
			moneyFormatter,
			contractDetail: {
				payType: '',
				contractProductList: []
			},
			goodList: [],
			customStyle: {
				backgroundColor: 'rgba(0,0,0,0.4)',
				borderRadius: '100rpx',
				marginLeft: '24rpx',
				marginRight: '20rpx',
				lineHeigth: '42rpx',
				color: '#fff'
			},
			customInputStyle: {
				width: '200rpx'
			},
			showFooter:true
		}
	},
	computed: {
		productNum(){
			return this.contractDetail&&this.contractDetail.contractProductList&&this.contractDetail.contractProductList.length
		},
		totalMoney() {
			let money = 0
			this.contractDetail.contractProductList.map(good => {
				money += Number(good.buyNum) * good.productContractPrice
			})
			if (isNaN(money)) money = 0
			return money
		}
	},
	onLoad(params) {
		this.$nextTick(function() {
			this.contractId = params.id
			this.getContractDetail()
		})
	},
	onShow() {
		// this.getContractDetail()
		uni.hideKeyboard()
	},
	methods: {
		async getContractDetail() {
			const data = await this.$u.api.getContractDetail({ id: this.contractId })
			this.contractDetail = data
			this.contractDetail.contractProductList.map(item => {
				item.imageFullUrl = item.fileUrlPrefix + item.imageUrl
				this.$set(item, 'showInput', false)
				this.$set(item, 'buyNum', '')
			})
		},
		back() {
			uni.navigateBack({ delta: 1 })
		},
		clickGood(good) {
			good.showInput = true
		},
		toBuy() {
			uni.navigateTo({
				url: `./ConfirmPurchase?detail=${encodeURIComponent(JSON.stringify(this.contractDetail))}&totalMoney=${this.totalMoney}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.header {
		height: inherit;
		line-height: 256rpx;
	}
.container {
	box-sizing: border-box;
	height: 100vh;
	// overflow-y: scroll;
	background-color: $page-bg-color;
	// padding: 24rpx;
	padding-top: 0;
	padding-bottom: 160rpx;
	margin-bottom: 0;
	// .back-btn{
	// 	position: fixed;
	// 	top: 70rpx;
	// 	left: 12rpx;
	// }
	&.showPopup{
		margin-bottom: 132rpx;
		padding-bottom: 0;
	}
	&.supplier{
		padding-bottom: 20rpx;
	}
	.card-container {
		margin: 0 -24rpx;
		.top {
			height: 100rpx;
		}
	}
	.total-amount {
		justify-content: space-around;
		margin-top: -60rpx;
		border-radius: 20rpx;
		background-color: #fff;
		height: 156rpx;
		.img {
			font-size: 0;
			image {
				width: 64rpx;
				height: 64rpx;
			}
		}
	}
	::v-deep.content {
		background-color: #fff;
		border-radius: 16rpx;
		.input-btn {
			.u-input__input {
				width: 130rpx !important;
			}
			.u-input--border:focus {
				outline-color: $main-color;
				box-shadow: 0 0 10px rgba($color: $main-color, $alpha: 0.6);
			}
			.u-btn {
				padding: 12rpx 32rpx;
			}
		}
	}
	.cart-div {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64rpx;
		height: 64rpx;
		background-color: rgba(203, 74, 43, 0.1);
		border-radius: 50rpx;
		image {
			width: 32rpx;
			height: 32rpx;
		}
	}
	.title-item {
		background-color: #fff;
		border-bottom: 1rpx solid $border-color;
	}
	.footer {
		width: 100vw;
		background-color: #fff;
		position: fixed;
		z-index: 2;
		bottom: 0;
		// margin-left: -26rpx;
		border-top: 1rpx solid $border-color;
		.price {
			color: $main-color;
		}
		.u-btn {
			padding: 12rpx 32rpx;
		}
	}
}
</style>
