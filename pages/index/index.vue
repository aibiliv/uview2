<template>
	<view>
		<view class="container" style="position: relative;">

			<view class="head" style="position: fixed;">
				<image class="top-bg" src="/static/images/banner.jpg"></image>
				<view class="top-info" :style="{
							paddingTop:parseInt(topInfoTop) + 'px',
							paddingRight:parseInt(topInfoRight) + 'px'

						}">
					<view class="u-flex">
						
						<view class="logo">
							<image src="/static/images/logo.png" style="width: 48rpx;height: 36rpx;"></image>
						</view>
						<view class="u-flex-1 u-m-l-12">
							<view class="u-font-32 u-font-bold color-white">二叠纪电商</view>
							<view class="u-font-20 u-m-t-6" style="color: #ffffff80;"> Permian Sand&Gravel Mall</view>
						</view>
						<!-- #ifdef APP-PLUS || MP-WEIXIN ||H5 -->
						<view class="message" style="position: relative;" @click="$u.route('/pages/user/message')">
							<u-icon name="chat" color="#FFFFFF" size="36"></u-icon>
							<u-badge type="error" :count="vuex_messageNum ? vuex_messageNum : 0" :offset="[0, 0]"></u-badge>
						</view>
						<!-- #endif -->
					</view>

					<view class="search color-white u-flex">
						<view class="" @click="actionSheetShow = true">
							<text class="u-m-r-12">{{cur_area.areaName || '请选择'}}</text>
							<u-icon name="arrow-down" color="#FFFFFF" size="24"></u-icon>
						</view>				
						<view style="width: 1rpx; height: 40rpx;background: #fff;" class="u-m-r-20 u-m-l-18"></view>
						<view class="u-flex-1">
						<u-search
							placeholder="输入关键词搜索"
							placeholder-color="#fff"
							color="#fff"
							v-model="title"
							action-text=" "
							bgColor="unset"
							search-icon=" "
							@blur="search"
							@clear="search"
						></u-search>
						</view>
						<u-icon name="search" color="#FFFFFF" size="24" @click="getHomeProductList"></u-icon>
					</view>
				</view>

				<view class="top-gap"></view>
			</view>
			<view class="body">
				<view style="height: 336rpx;width: 750rpx;"></view>

				<view class="body-bottom">
					<view class="u-m-l-32 u-m-r-32 u-m-t-32" v-if="contractInfo && contractInfo.id" @click="clickContract(contractInfo)">
						<contract-card :detail="contractInfo" :showFileBtn="false">
							<template #content>
								<view class="tags">
									<view v-for="(good, index) in contractInfo.contractProductList" :key="index" class="tag u-font-24">
									{{ good.productName }}
									<text v-if="good.productAttrValue">{{ '【' + good.productAttrValue + '】' }}</text>
									</view>
								</view>
							</template>
						</contract-card>
						<view style="height: 18rpx;"></view>
					</view>
					<view class="product-title u-m-l-32 u-m-b-20">全部商品</view>
					<view class="bottom-flag"></view>
					<view class="u-m-l-32" style="display: flex;flex-direction: row;flex-wrap: wrap;">
						<view v-for="(item, index) in flowList" class="u-m-r-30 goods-item" @click="goProductDetail(item)" :key="index">
							<view style="font-size: 0;">
								<!-- todo:mode="widthFix" -->
								<image class="product-water-image" :src="getPic(item)" style="width:100%; height:327rpx" >
								</image>
							</view>

							<view class="u-p-12 u-p-b-20 u-m-b-30" style="background-color: #fff; border-radius: 0 0 10rpx 10rpx;">
								<view>
									<text class="product-water-tag-owner u-m-r-8" v-if="item.source.value == 1">自营</text>
									<text class="product-water-title u-flex-1">{{ item.title }}</text>
								</view>
								<view class="product-water-price">
									<text class="u-font-24">￥</text>
									<text class="u-font-36">{{ splitPrice(item)[0] + '.' }}</text>
									<text class="u-font-24">{{ splitPrice(item)[1]}}/{{item.unit}}起</text>
								</view>
								<view class="product-water-shop"><image v-if="item.source.value == 2" src="@/static/images/shop-icon.png"></image>
								<text class="u-font-24 u-m-l-10">{{ item.shopName }}</text>	
								</view>
							</view>
						</view>


						<!--
						<u-waterfall v-model="flowList" ref="uWaterfall">
							<template v-slot:left="{ leftList }">
								<view class="product-water-warter" v-for="(item, index) in leftList" :key="index">
									<u-lazy-load threshold="-450" borderRadiusTop="10" :image="getPic(item)" :index="index">
									</u-lazy-load>
									<view class="u-p-12">
										<view>
											<text class="product-water-tag-owner u-m-r-8"
												v-if="item.source.value == 1">自营</text>
											<text class="product-water-title u-flex-1">{{ item.title }}</text>
										</view>
										<view class="product-water-price">
											<text class="u-font-24">￥</text>
											{{ item.priceRange }}
											<text class="u-font-24">/{{item.unit}}</text>
										</view>
										<view class="product-water-shop">{{ item.shopName || '二叠纪电商'}}</view>
									</view>
								</view>
							</template>
							<template v-slot:right="{ rightList }">
								<view class="product-water-warter" v-for="(item, index) in rightList" :key="index">
									<u-lazy-load threshold="-450" borderRadiusTop="10" :image="getPic(item)" :index="index">
									</u-lazy-load>
									<view class="u-p-12">
										<view>
											<text class="product-water-tag-owner u-m-r-8"
												v-if="item.source.value == 1">自营</text>
											<text class="product-water-title u-flex-1">{{ item.title }}</text>
										</view>

										<view class="product-water-price">
											<text class="u-font-24">￥</text>
											{{ item.priceRange }}
											<text class="u-font-24">/{{item.unit}}</text>
										</view>
										<view class="product-water-shop">{{ item.shopName || '二叠纪电商'}}</view>
									</view>

								</view>
							</template>
						</u-waterfall> -->


					</view>
					<u-loadmore v-if="flowList && flowList.length > 0" bg-color="unset" :status="loadStatus" @loadmore="addRandomData" :load-text="loadText">
					</u-loadmore>
					<u-empty  v-else text="暂无商品" mode="search"></u-empty>
				</view>
			</view>
			<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback" name="areaName"
				:showSearch="false"></u-action-sheet>
		</view>
		<!-- <u-tabbar :list="vuex_roleKey == 2 ? vuex_tabbar_supplier : vuex_tabbar_purchaser"></u-tabbar> -->
    	<u-tabbar :list="vuex_roleKey == 2 ? tabbar_supplier : tabbar_purchaser"></u-tabbar>

	</view>
</template>

<script>
	import UniSocket from "@/common/uni.socket.js"
	import ContractCard from '@/components/contract/ContractCard.vue'
	import tabbarMixin from "@/common/tabbar.mixin.js"
	import { areaCodeUserUtil } from '@/common/areaCodeUtil.js'
	export default {
		mixins: [tabbarMixin],
		data() {
			return {
				loadStatus: 'nomore',
				showGoods: true,
				flowList: [],
				list: [],
				contractInfo: '',
				menuButtonInfo: '',
				topInfoTop: uni.upx2px(100),
				topInfoRight: uni.upx2px(32),
				page: 1,
				actionSheetList: [],
				actionSheetShow: false,
				cur_area: {},
				loadText: {
					loadmore: '加载更多',
					loading: '努力加载中',
					nomore: '没有更多数据了！'
				},
				socket:undefined,
				title:''
			}
		},
		components: {
			ContractCard
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.topInfoTop = this.menuButtonInfo.top - ((uni.upx2px(64) - this.menuButtonInfo.height) / 2)
			this.topInfoRight = uni.upx2px(750) - (this.menuButtonInfo.left - uni.upx2px(14))
			// #endif
			this.getAreaList();
			if(this.vuex_token){
				this.judgeIsSetPayPwd()
				if (this.vuex_roleKey == 1) {
					this.initSocket();
				}		
			}
		},
		onShow(){
			if(this.vuex_token){
				this.getHomeContract();	
			}
			this.getHomeProductList();
			this.$appUtils.bus.$off().$on('changeArea',(val)=>{
				this.cur_area = val
			})
		},
		onReachBottom() {
			// this.loadStatus = 'loading';
			// // 模拟数据加载
			// setTimeout(() => {
			// 	this.page++
			// 	this.getHomeProductList();
			// }, 1000);
		},
		methods: {
			async search(){
				this.getHomeProductList(); 
				this.showGoods = true
			},
			initSocket() {
				this.destroySocket()
				var that = this;
				let token = 'Bearer ' + this.$appUtils.getToken()
				let areaCode = areaCodeUserUtil[this.vuex_userName] || this.vuex_area
				let roleKey = this.vuex_roleKey
				let url =  this.$config.baseUrl.replace('http', 'ws')+"/webSocket/"
				
				this.socket = new UniSocket({
					// ws://192.168.8.126:18126
					// wss://staging.fkhwl.com
					url: url + token + "/1658224856554index/"+areaCode+"/"+roleKey,
					heartRate: 30000
				})
				this.socket.on('connectioned', function() {
					console.log('连接成功～～');
				})

				this.socket.on('connectioned', function() {

				}, true);

				this.socket.on('HEARTBEAT', function(data) {
					console.log('HEARTBEAT: ', data);
				})

				this.socket.on('messageNum', function(data) {
					console.log('messageNum: ', data);
				}, true)

				this.socket.on("*", function({
					data
				}) {
					console.log('data',data)
					if (data.type === 'HEARTBEAT') {
						console.log(data);
					}
				})

				this.socket.on("**", function(data) {
					if (data && data.data) {
						if (data.data.indexOf('messageNum') != -1) {
							let JSONDataData = JSON.parse(data.data)
							console.log('JSONDataData',JSONDataData)
							if (JSONDataData.type && JSONDataData.type == 'messageNum') {
								that.$u.vuex('vuex_messageNum', JSONDataData.count);
							}
						}else{
							that.$u.vuex('vuex_messageNum', data.data);
						}
					}
				})
			},
			destroySocket(){
				if(this.socket){
					this.socket.removeEventByName('connectioned')
					this.socket.removeEventByName('HEARTBEAT')
					this.socket.removeEventByName('messageNum')
					this.socket.removeEventByName('*')
					this.socket.removeEventByName('**')
					this.socket.killApp()
					this.socket.close()
					this.socket = null
				}
			},
			getPic(item) {
				return item.prefixUrl + item.imageUrl
			},
			splitPrice(item) {
			      let priceRange = item.priceRange?.split('-')[0]
			      return priceRange.split('.')
			    },
			async	judgeIsSetPayPwd(){
				const {value} = await this.$u.api.selectPayPassword()
				this.$u.vuex('vuex_isSetPayPwd', value);
			},
			// 点击actionSheet回调
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.cur_area = this.actionSheetList[index]
				this.$u.vuex('vuex_area', this.actionSheetList[index].areaCode);
				this.$nextTick(() => {
					this.contractInfo = undefined
					if(this.vuex_token){
						this.judgeIsSetPayPwd()
						this.getHomeContract();
						this.initSocket();
					}
					this.getHomeProductList();
				})
			},
			getHomeContract() {
				this.$u.api.getHomeContract().then(res => {
					this.contractInfo = res
				})
			},
			clickContract(item) {
				uni.navigateTo({
					url: `/pages/contract/ContractDetail?id=${item.id}`
				})
			},
			getAreaList() {
				this.$u.api.getAreaList().then(res => {
					this.actionSheetList = res
					for (var i = 0; i < res.length; i++) {
						let area = res[i]
						let vuex_area = this.$store.state.vuex_area;
						if (area.areaCode == vuex_area) {
							this.cur_area = area
							break
						}
					}
				})
			},
			remove(id) {
				this.$refs.uWaterfall.remove(id);
			},
			clear() {
				this.$refs.uWaterfall.clear();
			},
			getHomeProductList() {
				this.$u.api.getHomeProductList({
					page: this.page,
          title:this.title
				}).then(res => {
					this.flowList = res
				})
			},
			goProductDetail(item){
				this.$u.route(`/pages/index/GoodDetail?id=${item.id}`)
			}
		}
		,
		destroyed() {
			this.destroySocket()
		}
	}
</script>

<style lang="scss">
	.container {

		height: 100%;
	}

	.body {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		height: 100%;
		width: 100%;
		.body-bottom {
			background-color: $page-bg-color;
			// border-top-left-radius: 24rpx;
			// border-top-right-radius: 24rpx;
			padding: 50rpx 0;
		}

		.product-title {
			font-size: 36rpx;
			color: #222;
			font-weight: 500;
		}

		.bottom-flag {
			margin-top: -30rpx;
			margin-bottom: 30rpx;
			margin-left: 34rpx;
			width: 48rpx;
			height: 10rpx;
			background: linear-gradient(225deg, #FFBD69 0%, #FF8838 100%);
			border-radius: 5rpx;
		}
	}

	.head {
		z-index: 2;
		width: 100%;
		height: 360rpx;
		position: absolute;
		left: 0;
		top: 0;

		.top-gap {
			position: absolute;
			left: 0;
			bottom: 0;
			height: 24rpx;
			width: 750rpx;
			background-color: $page-bg-color;
			border-top-left-radius: 24rpx;
			border-top-right-radius: 24rpx;
			z-index: 1000;
		}

		.top-bg {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 2;
			left: 0;
			top: 0;
		}

		.top-info {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 2;
			left: 0;
			top: 0;
			// padding-top:calc(var(--status-bar-height) + 12rpx)  ;
			// padding-top: calc(100rpx);
			// padding-left: 32rpx;
			padding: 100rpx 32rpx 0 32rpx;

			.logo {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				width: 64rpx;
				height: 64rpx;
				background: #FFFFFF;
				border-radius: 50%;
			}

			.message {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				width: 64rpx;
				height: 64rpx;
				margin-top: -14rpx;
				background: rgba(0, 0, 0, 0.4);
				border-radius: 50%;

			}

			.search {
				margin-top: 50rpx;
				width: 686rpx;
				height: 72rpx;
				background: rgba(0, 0, 0, 0.3);
				border-radius: 36rpx;
				padding-left: 36rpx;
				padding-right: 32rpx;
			}
		}


	}

	.product-water-warter {
		border-radius: 16rpx;
		margin: 16rpx;
		margin-left: 16rpx;
		// margin-right: 16rpx;
		background-color: #fff;
		// padding: 16rpx;
		position: relative;
	}

	.u-close {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
	}

	.product-water-img-wrap {}

	// .product-water-image {
	// 	width: 100%;
	// 	// border-radius: 8rpx;
	// 	border-top-left-radius: 8rpx;
	// 	border-top-right-radius: 8rpx;
	// }

	.product-water-title {
		font-size: 28rpx;
		margin-top: 10rpx;
		color: #222;
		word-break: break-all;
	}

	.product-water-tag {
		display: flex;
		margin-top: 10rpx;
	}

	.product-water-tag-owner {
		background: linear-gradient(225deg, #E78156 0%, #CB4A2B 100%);
		color: #ffffff;
		padding: 3rpx 8rpx 2rpx;
		border-radius: 2rpx;
		text-align: center;
		font-size: 20rpx;
	}

	.product-water-tag-text {
		border: 2rpx solid $u-type-primary;
		color: $u-type-primary;
		margin-left: 20rpx;
		border-radius: 50rpx;
		line-height: 1;
		padding: 4rpx 14rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
	}

	.product-water-price {
		font-size: 30rpx;
		color: $u-type-primary;
		margin-top: 10rpx;
		font-weight: 500;
	}

	.product-water-shop {
		font-size: 0;
		color: #595959;
		margin-top: 20rpx;
		image{
			width: 32rpx;
			height: 32rpx;
			vertical-align: bottom;
		}
	}

	.product-water-image {
		background-color: #c0c4cc;
		width: 100%;
		height: 330rpx;
		border-top-left-radius: 8rpx;
		border-top-right-radius: 8rpx;
	}

	.goods-item {
		width: calc(375rpx - 48rpx);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;

		.tag {
			display: inline-block;
			margin-bottom: 10rpx;
			padding: 4rpx 12rpx;
			border-radius: 8rpx;
			background-color: rgba($color: #222, $alpha: 0.2);
			margin-right: 10rpx;
		}
	}
</style>
