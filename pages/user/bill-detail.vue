<template>
	<view class="container u-p-20">
		<view class="u-m-b-20 item">
			<view class="u-flex u-row-between" v-if="bill.invoiceUseType.value == 2">
				<view class="bill-no">发票号码{{ bill.invoiceNum }}</view>
				<view class="u-font-32 color-red">
					<text class="u-font-bold">-{{ $appUtils.moneyFormatter(bill.priceAndTax) }}</text>
					<text class="color-8C8C8C u-m-l-10">元</text>
				</view>
			</view>
			<view class="u-flex u-row-between" v-if="bill.invoiceUseType.value != 2">
				<view class="bill-back">发票号码{{ bill.invoiceNum }}</view>
				<view class="u-font-32 color-black">
					<text class="u-font-bold">{{ $appUtils.moneyFormatter(bill.priceAndTax) }}</text>
					<text class="color-8C8C8C u-m-l-10">元</text>
				</view>
			</view>
			<view class="u-m-t-20 u-font-24">
				<text class="color-8C8C8C">发票代码：</text>
				{{ bill.invoiceCode }}
			</view>
			<view class="u-m-t-10 u-font-24 u-flex u-row-between">
				<view>
					<text class="color-8C8C8C">出票时间：</text>
					{{ bill.drawerTime }}
				</view>
				<view>
					<u-button v-if="bill.pdfUrl" shape="square" size="mini"><text @click="clickFileUrl">查看发票</text></u-button>
					<u-button v-else-if="bill.paperPdfUrl" shape="square" size="mini"><text @click="doPreviewImage(imgList[0].url,0)">查看发票</text></u-button>
					<u-upload v-show="false" ref="uUpload" :file-list="imgList"  max-count="0">查看发票</u-upload>
				</view>
			</view>
		</view>

		<view class="u-m-b-20 info-box">
			<view class="info-title u-m-b-18">销方信息</view>
			<view class="u-flex u-col-top">
				<view class="info-lable">公司名称：</view>
				<view class="u-flex-1">{{ bill.sellerCompanyName }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">公司税号：</view>
				<view class="u-flex-1">{{ bill.sellerTaxNumber }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">公司地址：</view>
				<view class="u-flex-1">{{ bill.sellerCompanyAddress }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">账户号码：</view>
				<view class="u-flex-1">{{ bill.sellerBankCardNum }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">开户银行：</view>
				<view class="u-flex-1">{{ bill.sellerBankName }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">公司电话：</view>
				<view class="u-flex-1">{{ bill.sellerTelNum }}</view>
			</view>
		</view>

		<view class="u-m-b-20 info-box">
			<view class="info-title u-m-b-18">购方信息</view>
			<view class="u-flex u-col-top">
				<view class="info-lable">公司名称：</view>
				<view class="u-flex-1">{{ bill.buyerCompanyName }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">公司税号：</view>
				<view class="u-flex-1">{{ bill.buyerTaxNumber }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">公司地址：</view>
				<view class="u-flex-1">{{ bill.buyerCompanyAddress }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">账户号码：</view>
				<view class="u-flex-1">{{ bill.buyerBankCardNum }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">开户银行：</view>
				<view class="u-flex-1">{{ bill.buyerBankName }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">公司电话：</view>
				<view class="u-flex-1">{{ bill.buyerTelNum }}</view>
			</view>
		</view>

		<view class="u-m-b-20 info-box" v-for="(item, index) in bill.invoiceContentItemDTO" :key="index">
			<view class="info-title u-m-b-18">{{ item.itemName + '【' + item.itemSpec + '】' }}</view>
			<view class="u-flex u-col-top">
				<view class="info-lable-short">单价：</view>
				<view class="u-flex-1">¥{{ $appUtils.moneyFormatter(item.unitPrice) }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable-short">数量：</view>
				<view class="u-flex-1">{{ $appUtils.numFormatter(item.number) }}吨</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable-short">金额：</view>
				<view class="u-flex-1">¥{{ $appUtils.moneyFormatter(item.taxFreeAmount) }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable-short">税率：</view>
				<view class="u-flex-1">{{ item.taxRate * 100 }}%</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable-short">税额：</view>
				<view class="u-flex-1">¥{{ $appUtils.moneyFormatter(item.totalTax) }}</view>
			</view>
			<view class="u-flex u-m-t-18 u-col-top">
				<view class="info-lable">价税合计：</view>
				<view class="u-flex-1">¥{{ $appUtils.moneyFormatter(item.totalPrice) }}</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			bill: {
				billNo: '',
				price: '',
				code: '',
				time: '',
				invoiceUseType: {
					value: null
				}
			},
			imgList: []
		}
	},
	onLoad(options) {
		this.getBillDetail(options.id)
	},
	methods: {
		showInvoicePdf() {},
		getBillDetail(id) {
			this.imgList = []
			this.$u.api
				.invoiceDetail({
					id: id
				})
				.then(res => {
					this.bill = res
					if (this.bill.paperPdfUrl) {
						this.bill.paperPdfUrl.split(',').map(url => {
							this.imgList.push({ url })
						})
					}
				})
		},
		doPreviewImage(url, index) {
			this.$refs.uUpload && this.$refs.uUpload.doPreviewImage(url, index)
		},
		clickFileUrl() {
			uni.downloadFile({
				url: this.bill.pdfUrl,
				success: function(res) {
					var filePath = res.tempFilePath
					uni.openDocument({
						filePath: filePath,
						showMenu: true,
						success: function(res) {
							// console.log('打开文档成功')
						}
					})
				},
				fail: err => {
					console.log('err', err)
				}
			})
		}
	}
}
</script>

<style lang="scss">
page {
	background: $u-bg-color;
}
.bill-no {
	// width: 225rpx;
	padding: 4rpx 16rpx;
	height: 48rpx;
	line-height: 48rpx;
	text-align: center;
	background: rgba(234, 61, 47, 0.15);
	border-radius: 8rpx;
	font-weight: 700;
	color: #ea3d2f;
}

.bill-back {
	// width: 225rpx;
	padding: 4rpx 16rpx;
	height: 48rpx;
	line-height: 48rpx;
	text-align: center;
	background: #f5f5f5;
	border-radius: 8rpx;
	font-weight: 700;
}

.item {
	border-radius: 8rpx;
	background: #fff;
	padding: 32rpx 24rpx;
}

.info-box {
	border-radius: 8rpx;
	background: #fff;
	padding: 40rpx 24rpx;
}

.info-title {
	font-size: 32rpx;
	font-weight: 500;
	color: $u-main-color;
}

.info-lable {
	// width: 140rpx;
	color: #8c8c8c;
}

.info-lable-short {
	// width: 86rpx;
	color: #8c8c8c;
}
</style>
