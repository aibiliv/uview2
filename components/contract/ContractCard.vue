<template>
	<!-- 合同卡片 -->
	<view class="contract-card" :class="setCradClass">
		<view class="header" v-if="$slots['header']"><slot name="header"></slot></view>
		<view class="contract-content">
			<view v-if="isCredited && !$slots['header'] && detail.creditAmount && detail.creditAmount > 0" class="credit-tag u-font-24">已授信</view>
			<view class="top u-m-b-12">
				<view class="title">
					<view class="u-font-42">
						<text>{{ detail.contractNum }}</text>
						<u-button v-if="showFileBtn" type="warning" size="mini" shape="circle" :custom-style="customStyle" @click="preview">
							<u-icon name="attach" size="32"></u-icon> 查看附件
						</u-button>
					</view>
					<view class="u-font-lg u-font-bold">{{ detail.contractName }}</view>
				</view>
			</view>

			<view class="content-item">
				<slot name="content">
					<view class="tags" v-if="vuex_roleKey == 1 && payTypeArr && payTypeArr.length && payTypeArr.length > 0">
						<text v-for="(tag, index) in payTypeArr" :key="index" class="tag u-font-24">{{ tagFormatter(tag) }}</text>
					</view>
					<view class="time u-font-28 u-m-t-10">
						<FkhIcon name="riqi" :color="isCredited ? '#723e21' : '#222'" class="u-m-r-10"></FkhIcon>
						<text v-if="detail && detail.effectiveStartTime && detail.effectiveEndTime">
							{{ detail && detail.effectiveStartTime && detail.effectiveStartTime.split(' ')[0] + ' 至 '
							}}{{ detail && detail.effectiveEndTime && detail.effectiveEndTime.split(' ')[0] }}
						</text>
						<view class="u-p-l-10" style="display: inline-block;" v-if="detail.effectiveRecord && detail.effectiveRecord.length > 1">
							<u-icon name="more-circle"></u-icon>
						</view>
					</view>
				</slot>
			</view>

			<slot name="status">
				<view class="status"><image :src="statusImg" mode=""></image></view>
			</slot>
		</view>
		<u-popup v-model="show" mode="bottom" border-radius="14" height="750rpx" closeable :mask-close-able="false" @close="closePopup">
			<view class="u-p-32 u-p-t-80 line-height-2" v-if="contractFile && contractFile.length > 0">
				<view class="color-gray">合同附件</view>
				<view class="color-blue" v-for="(item, index) in contractFile" :key="index" @click="clickFileUrl(item)">{{ item.name }}</view>
			</view>
			<view class="" v-if="appendixFile && appendixFile.length > 0">
				<view class="u-p-l-32 u-p-r-32 u-p-t-0 line-height-2" v-for="(item1, index1) in appendixFile" :key="index1">
					<view class="color-gray" v-if="item1.fullUrlList && item1.fullUrlList.length > 0">附录{{ index1 + 1 }}</view>
					<view class="color-blue" v-for="(item2, index2) in item1.fullUrlList" :key="index2" @click="clickFileUrl(item2)">
						{{ item2.name }}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
const STATUS_MAP = {
	undefined: '',
	'': '',
	null: '',
	'-1': '', //删除
	0: require('@/static/images/contract/dai_sheng_xiao.png'),
	1: require('@/static/images/contract/sheng_xiao_zhong.png'),
	2: require('@/static/images/contract/yi_zhong_zhi.png'),
	3: require('@/static/images/contract/yi_guo_qi.png')
}
export default {
	props: {
		type: {
			type: String,
			default: 'purchase'
		},
		showFileBtn: {
			type: Boolean,
			default: true
		},
		detail: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			show: false
		}
	},
	computed: {
		//是否授信--payType包含2
		isCredited() {
			return this.detail && this.detail.payType && this.detail.payType.includes('2')
		},
		statusImg() {
			return STATUS_MAP[this.detail.contractStatus]
		},
		customStyle() {
			return {
				backgroundColor: 'rgba(255,255,255,0.3)',
				border: 'none',
				marginLeft: '30rpx',
				lineHeigth: '40rpx',
				color: this.isCredited && this.detail.creditAmount && this.detail.creditAmount > 0 ? '#723E21' : '#222'
			}
		},
		//合同状态
		statusFormatter() {
			return STATUS_MAP[this.detail.contractStatus]
		},
		// 支付方式
		payTypeArr() {
			return this.detail && this.detail.payType && this.detail.payType.split(',')
		},
		setCradClass() {
			if (this.type === 'sale') {
				//销售合同
				return 'sale-contract-card'
			} else if (!this.isCredited || !this.detail.creditAmount || this.detail.creditAmount == 0) {
				//采购合同未授信
				return 'no-credit'
			}
			return ''
		},
		//合同附件
		contractFile() {
			let arr = []
			//如果有续签
			if (this?.detail?.effectiveRecord?.length > 0) {
				const fullUrlList = []
				this.detail.effectiveRecord.map(item1 => {			
					item1.efeffectiveFile &&
						JSON.parse(item1.efeffectiveFile).map(item2 => {
							let obj = {
								fullUrl: this.detail.fileUrlPrefix + item2.src,
								name: item2.name
							}
							fullUrlList.push(obj)
						})

				})
				arr = fullUrlList
			} else if (this?.detail?.contractFile) {
				arr = JSON.parse(this.detail.contractFile).map(item => {
					item.fullUrl = this.detail.fileUrlPrefix + item.src
					return item
				})
			}
			return arr
		},
		// 合同附录
		appendixFile() {
			if (this.showFileBtn) {
				let arr = this?.detail?.appendix?.map(item1 => {
						const fullUrlList = []
						item1.appendixFile &&
							JSON.parse(item1.appendixFile).map(item2 => {
								let obj = {
									fullUrl: this.detail.fileUrlPrefix + item2.src,
									name: item2.name
								}
								fullUrlList.push(obj)
							})
						item1.fullUrlList = fullUrlList
						return item1
					})
				return arr
			}
		}
	},
	watch:{
		show:{
			handler(val){
				this.$emit('update:showFooter',!val)
			}
		}
	},
	mounted() { },
	methods: {
		click() {
			this.$emit('click')
		},
		tagFormatter(tag) {
			const TAG_MAP = {
				'1': '线下支付',
				'2': '授信支付',
				'3': '在线支付'
			}
			return TAG_MAP[tag]
		},
		preview() {
			this.show = true
			uni.hideTabBar()
		},
		closePopup() {
			// uni.showTabBar()
		},
		clickFileUrl(item) {
			uni.downloadFile({
				url: item.fullUrl,
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

<style lang="scss" scoped>
.contract-card {
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	background: url(../../static/images/contract/purchase_bg.jpg) no-repeat;
	background-size: cover;
	border-radius: 10rpx;
	margin-bottom: 30rpx;
	// height: 100%;

	.header {
		height: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: -50rpx;
	}

	&.no-credit {
		background: url(../../static/images/contract/sale_bg.png) no-repeat;
		background-size: cover;

		.contract-content {
			color: $text-black;

			.tag {
				color: #fff;
			}
		}
	}

	&.sale-contract-card {
		background: url(../../static/images/contract/sale_bg.png) no-repeat;
		background-size: cover;

		.contract-content {
			.content-item {
				.tags {
					padding: 12rpx 0;
				}
			}
		}
	}

	.contract-content {
		padding: 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: #723e21;
		position: relative;

		.credit-tag {
			position: absolute;
			top: 0;
			right: 0;
			border-radius: 0 20rpx 0 20rpx;
			padding: 5rpx 24rpx;
			line-height: 36rpx;
			color: #ffdd9d;
			background: linear-gradient(to top, #222222, #68645c);
		}

		.status {
			position: absolute;
			bottom: 32rpx;
			right: 20rpx;

			image {
				width: 130rpx;
				height: 130rpx;
			}
		}

		.top {
			display: flex;
			justify-content: space-between;

			.title {
				display: flex;
				justify-content: space-around;
				flex-direction: column;
				line-height: 48rpx;

				.u-font-bold {
					height: 96rpx;
					font-size: 32rpx;
				}
			}

			.status {
				image {
					width: 64rpx;
					height: 64rpx;
					font-size: 0;
				}
			}
		}

		.content-item {
			.tags {
				display: flex;
				justify-content: start;

				.tag {
					padding: 4rpx 12rpx;
					border-radius: 8rpx;
					background-color: rgba($color: #222, $alpha: 0.2);

					&:not(:nth-child(1)) {
						margin-left: 10rpx;
					}
				}
			}
		}
	}
}
.color-blue {
	color: #367bf5;
}
.line-height-2 {
	line-height: 2;
}
</style>
