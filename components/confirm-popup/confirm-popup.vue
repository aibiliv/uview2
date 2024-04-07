<template>
	<view class="main">
		<u-popup v-model="shouldShow" :mask-close-able="false" mode="center" width="80%" border-radius="16">
			<view class="tip-container u-p-40">
				<view class="f-main-color u-font-32 u-font-bold f-center" v-if="false">
					提示
				</view>
				<view class="u-m-t-36 f-center f-main-color" style="font-weight: bold;">
					{{title}}
				</view>

				<view class="u-flex u-m-t-48">
					<view class="left-btn" @click="cancelAction">
						{{leftText}}
					</view>
					<view class=" confirm-btn " @click="comfirmAction">
						{{confirmTitle}}
					</view>

				</view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			confirmTitle: {
				type: String,
				default: '确定'
			},
			leftText: {
				type: String,
				default: '取消'
			},
			title: String,
			shouldShow: Boolean
		},

		data() {
			return {
				// show: this.shouldShow
			}

		},
		methods: {
			comfirmAction() {
				// this.show = !this.show
				this.$emit("comfirmAction")
			},
			cancelAction() {
				this.$emit("cancelAction")

			}
		}
	}
</script>

<style>
	.confirm-btn {
		width: 255rpx;
		height: 64rpx;
		background: #CB4A2B;
		border-radius: 32rpx;
		color: #FFFFFF;
		line-height: 64rpx;
		text-align: center;
	}

	.left-btn {
		width: 255rpx;
		height: 64rpx;
		background: #FFFFFF;
		border-radius: 32rpx;
		color: #595959;
		line-height: 64rpx;
		text-align: center;
	}
</style>
