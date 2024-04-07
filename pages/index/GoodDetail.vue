<template>
	<view class="product-detail">
		<u-navbar class="navbar" title=" " :border-bottom="false" :background="{ background: 'unset' }"></u-navbar>
		<u-swiper :list="imgList" height="750" indicator-pos="bottomRight" mode="number"></u-swiper>
		<view class="product-title u-p-32">
			<view class="u-flex u-row-between">
				<view class="price color-theme">
					<text>￥</text>
					<text v-if="splitPrice[0]" class="u-font-48">{{ splitPrice[0].split('.')[0] }}.</text>
					<text v-if="splitPrice[0]" class="u-font-28">{{ splitPrice[0].split('.')[1] }}</text>
					<text v-if="splitPrice[1]" class="u-font-48">-{{ splitPrice[1].split('.')[0] }}.</text>
					<text v-if="splitPrice[1]" class="u-font-28">{{ splitPrice[1].split('.')[1] }}</text>
					<text class="u-font-28">/{{ detail.unit }}</text>
				</view>
				<view class="is-saled color-gray">
					月售
					<text class="color-black u-m-l-4 u-m-r-4">{{ detail.salesVolume }}</text>
					{{ detail.unit }}
				</view>
			</view>
			<view style="line-height: 60rpx;">
				<text class="self-tag u-m-r-10 u-font-20" v-if="detail.source && detail.source.value === 1">自营</text>
				<text class="u-font-bold u-font-36">{{ detail.title }}</text>
			</view>
			<view class="u-m-t-10">
				<u-tag size="mini" class="u-m-r-15" :text="deliveryStr" mode="light" bg-color="#EBEBEB" border-color="#EBEBEB" color="#595959" />
				<u-tag size="mini" class="u-m-r-15" text="先款后货" mode="light" bg-color="#EBEBEB" border-color="#EBEBEB" color="#595959" />
				<u-tag
					size="mini"
					class="u-m-r-15"
					text="在线支付 | 线下支付"
					mode="light"
					bg-color="#EBEBEB"
					border-color="#EBEBEB"
					color="#595959"
				/>
			</view>
			<view class="u-flex u-row-between u-m-t-24" v-if="detail.source && detail.source.value === 2">
				<view>
					<text class="shop-tag u-m-r-8" v-if="vuex_roleKey == 1">店</text>
					<text class="shop-tag u-m-r-6" v-else>直营</text>
					<text class="u-font-bold">{{ detail.shopName }}</text>
				</view>
				<view class="u-font-20">
					<text class="shop-tag u-m-r-10">资质已审查</text>
					<text class="shop-tag">企业已认证</text>
				</view>
			</view>
		</view>
		<!-- 商品规格和配送范围 -->
		<view class="good-content u-m-t-24">
			<view class="good-attrs u-p-b-24" v-if="attrs && attrs.length > 0 && detail.attrValue">
				<view class="color-gray u-font-28 u-m-b-20">商品规格</view>
				<view class="u-m-r-15 u-m-b-15" style="display: inline-block;" v-for="(attr, index) in attrs" :key="index">
					<u-tag
						:text="attr.attrValue"
						mode="light"
						bg-color="#EBEBEB"
						border-color="#EBEBEB"
						color="#595959"
					/>
				</view>
			</view>
			<view class="good-address u-p-b-24 u-m-t-20">
				<view class="color-gray u-font-28">配送范围</view>
				<view class="u-m-t-16 u-font-28">{{ areaList }}</view>
			</view>
		</view>
		<!-- 商品详情 -->
		<u-divider class="u-m-t-60 u-m-b-32" color="#979797" bg-color="unset">商品详情</u-divider>

		<!-- 图片 -->
		<view class="img-list">
			<view class="img-item" v-for="(img, index) in imgList" :key="index"><image :src="img" mode=""></image></view>
		</view>
		<!-- 商品描述 -->
		<view class="u-p-32">
			<u-table align="left" padding="10rpx 20rpx" border-color="#D9D9D9">
				<u-tr>
					<u-td width="180rpx" class="u-text-center">商品分类</u-td>
					<u-td width="504rpx">
						<view v-if="detail.productCategoryParent && detail.productCategoryParent.length > 0">
							<text v-for="(item, index) in detail.productCategoryParent" :key="index">
								{{ item }}
								<i v-if="index != detail.productCategoryParent.length - 1">/</i>
							</text>
						</view>

						<text v-else>-</text>
					</u-td>
				</u-tr>
				<u-tr>
					<u-td width="180rpx">计量单位</u-td>
					<u-td width="504rpx">{{ detail.unit }}</u-td>
				</u-tr>
				<u-tr>
					<u-td width="180rpx">商品产地</u-td>
					<u-td width="504rpx">{{detail.production}}</u-td>
				</u-tr>
				<u-tr><u-td>商品描述</u-td></u-tr>
				<u-tr>
				
				</u-tr>
				<view class="u-p-20 good-desc" >
					<u-parse :html="detail.content"></u-parse>
				</view>
			</u-table>
		</view>
		<!-- 推荐商品 -->
		<!-- <u-divider class="u-m-t-60 u-m-b-32" color="#979797" bg-color="unset">推荐商品</u-divider> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail: {},
		}
	},
	computed: {
		imgList(){
			let arr = []
				this.detail.imageList&& JSON.parse(this.detail.imageList).map((item)=>{
					let url = this.detail.prefixUrl + item
					arr.push(url)
				})
				console.log('arr',arr)
			return arr
		},
		splitPrice() {
			let priceMin = this.detail?.priceRange?.split('-')[0]
			let priceMax = this.detail?.priceRange?.split('-')[1]
			return [priceMin, priceMax]
		},
		attrs() {
			return this.detail.attrList ? JSON.parse(this.detail.attrList) : []
		},
		areaList() {
			return this.detail.area ? JSON.parse(this.detail.area).join('丨') : []
		},
		deliveryStr(){
			return this.detail.source.value===1 ? '包到' : '自取'
		}
	},
	onLoad(params) {
		this.id = params.id
		this.getDetail()
	},
	methods: {
		async getDetail() {
			const data = await this.$u.api.productDetail({ id: this.id })
			this.detail = data
		}
	}
}
</script>

<style lang="scss" scoped>
.navbar {
	height: 0;
}
.product-detail {
	background-color: $page-bg-color;
	.product-title {
		background-color: #fff;
	}
	.self-tag {
		background-color: $main-color;
		padding: 1rpx 8rpx;
		color: #fff;
		border-radius: 4rpx;
	}
	.good-content {
		padding: 24rpx 32rpx;
		background-color: #fff;
		.good-attrs {
			border-bottom: 1rpx solid #d9d9d9;
		}
	}
	.good-desc{
		border-right: 1rpx solid $border-color;
		border-bottom: 1rpx solid $border-color;
	}
	.img-list {
		.img-item {
			font-size: 0;
			image {
				width: 750rpx;
				height: 750rpx;
			}
		}
	}
	.shop-tag {
		background: linear-gradient(to right, #DDBD6A, #FFEBCC);;
		padding: 2rpx 8rpx;
		color: #000;
		border-radius: 4rpx;
	}
}
</style>
