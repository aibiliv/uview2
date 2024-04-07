<template>
	<view class="container">
		<image src="./static/images/me/contact-us-bg.jpg" class="bg-image" mode="aspectFill"></image>
		<view class="info">
			<image src="./static/images/me/contact-us-icon.png" class="t-icon" mode="aspectFill"></image>

			<view class="u-font-24 color-white" style="margin-top: 90rpx;">
				<view style="line-height: 1.7;">
					如果您在使用的过程中遇到任何问题或建议，欢迎您通过以下方式联系我们，我们会在5个工作日内与您取得联系并给予答复。
				</view>
				<view class=" u-m-t-30">
					官方热线：{{phone}}
				</view>
				<view class=" u-m-t-12">
					官方邮箱：{{email}}
				</view>
				<view class=" u-m-t-12">
					{{address}}
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '028-87881880',
				email: 'edj-sc@fkhwl.com',
				address: '成都市天府新区湖畔西路123号成都科学城D区A1栋7楼'
			}
		},
		onShow() {
			this.getSystemConfig();
		},
		methods: {
			getSystemConfig(){
				this.$u.api.getSystemConfig().then(res => {
					console.log(res)
					this.address = res.address 
					this.phone = res.contactNumber
					this.email = res.email
				})
			}
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
		width: 300rpx;
		height: 156rpx;
	}
</style>
