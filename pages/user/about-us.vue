<template>
	<view class="container">
		<image src="./static/images/me/about-us-bg.jpg" class="bg-image" mode="aspectFill"></image>
		<view class="info">
			<image src="./static/images/me/about-us-icon.png" class="t-icon" mode="aspectFill"></image>
			<view class="u-font-24 color-white u-m-t-20" style="line-height: 1.7;">
				<view>
					二叠纪砂石骨料电商平台是一家专注砂石骨料采购销售的电商平台，提供砂石骨料采购、支付、运输一站式服务。
				</view>
				<view class=" u-m-t-60">
					公司成立于2014年6月20日，总部设在天府之国四川成都，是国内大型综合性 产业链科技公司，下设18个办事机构，6个结算中心，业务覆盖全国各地区。
				</view>
				<view class=" u-m-t-60">
					借助互联网、物联网、区块链与云计算等技术，将大宗产品生产服务的上下游企业与运输单位连接起来，构建分布式智能产业链协同系统，致力于实现大宗产业供应链的数字化、网络化、可视化、智能化、努力提高产业链协同与交易的效率。
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	page {
		width: 100%;
		height: 100%;
	}

	.container {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.bg-image {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}

	.info {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		padding: 80rpx 60rpx 0 60rpx;
	}

	.t-icon {
		width: 254rpx;
		height: 156rpx;
	}
</style>
