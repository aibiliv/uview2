<template>
	<view class="container">
		<view class="u-p-30">
			<!-- <view class="divider-line "></view> -->

			<view class="u-flex u-row-between u-p-t-38 u-p-b-38" @click="addImage">
				<view class="u-main-color u-font-32">头像</view>
				<view class="u-flex">
					<u-avatar v-if="avatar" :src="avatar"></u-avatar>
					<u-avatar v-else src="../../static/images/avatar-d.png" size="102"></u-avatar>
					<u-icon name="arrow-right" color="#c0c4cc" size="28" class="u-m-l-18"></u-icon>
				</view>
			</view>
			<view class="divider-line "></view>
			<view class="u-flex u-row-between u-p-t-38 u-p-b-38">
				<view class="u-main-color u-font-32">手机号</view>
				<view class="u-flex">
					<view class="color-theme u-font-28">{{vuex_user.userMobile}}</view>
				</view>
			</view>
			<view class="u-flex u-row-between u-p-t-38 u-p-b-38">
				<view class="u-main-color u-font-32">登录账号</view>
				<view class="u-flex">
					<view class="color-theme u-font-28">{{vuex_user.userAcc}}</view>
				</view>
			</view>
			<view class="divider-line"></view>

			<view class="u-flex u-row-between u-p-t-38 u-p-b-38">
				<view class="u-main-color u-font-32">账号名称</view>
				<view class="u-flex">
					<view class="color-theme u-font-28">{{vuex_user.userName}}</view>
				</view>
			</view>
			<view class="divider-line "></view>

			<view class="u-flex u-row-between u-p-t-38 u-p-b-38">
				<view class="u-main-color u-font-32">账号状态</view>
				<view class="u-flex">
					<view class="color-theme u-font-28" style="color: #03B915;" v-if="vuex_user.userStatus">
						{{vuex_user.userStatus.desc}}
					</view>
				</view>
			</view>
			<view class="divider-line "></view>

			<view class="u-flex u-row-between u-p-t-38 u-p-b-38" @click="changePwd">
				<view class="u-main-color u-font-32">修改密码</view>
				<view class="u-flex">
					<u-icon name="arrow-right" color="#c0c4cc" size="28" class="u-m-l-18"></u-icon>
				</view>
			</view>
			<view class="divider-line "></view>

			<view class="u-m-t-80">
				<u-button type="primary" style="width: 80%;" class="u-m-t-60" @click="logout">退出登录</u-button>
			</view>
		</view>

		<!-- <view class="footer">
			<view style="width: 100%;">
				<u-button type="primary" style="width: 100%;" class="u-m-t-20">退出登录</u-button>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: '',
				userInfo: {},
				exitStyle: {
					backgroundColor: '#c0c4cc',
					height: '100rpx',
					width: '660rpx',
					color: '#fff1cf',
					fontSize: '36rpx',
					borderRadius: '50rpx'
				},
			}
		},
		onLoad() {
			this.userInfo = this.$store.state.vuex_user;
			this.avatar = this.userInfo?.userPicture
		},
		methods: {
			upLoadImage(localPath, index) {
				// this.signBillImages[index] = localPath;
				this.$forceUpdate()
				var that = this;
				let Authorization = 'Bearer ' + this.$appUtils.getToken()
				let url = this.$u.http.config.baseUrl + '/v1/file/uploadImage';
				uni.uploadFile({
					url: url,
					filePath: localPath,
					name: 'image',
					header: {
						Authorization: Authorization
					},
					formData: {
						'type': 8
					},
					success: (uploadFileRes) => {
						this.avatar = localPath
						let j = JSON.parse(uploadFileRes.data);
						console.log(j)
						that.userInfo.userPicture = j.data.value;
						that.updateUserInfo();
					}
				});
			},
			updateUserInfo() {
				let params = {
					id: this.userInfo.id,
					userPicture: this.userInfo.userPicture
				}
				this.$u.api.updateUserIcon(params).then(res => {
					this.$u.toast('头像已修改')
				})
			},
			addImage(index) {
				var that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有'original', 
					sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log(JSON.stringify(res.tempFilePaths));
						that.upLoadImage(res.tempFilePaths[0], index)
					}
				});
			},
			changePwd() {
				uni.navigateTo({
					url: 'reset-password'
				})
			},
			logout() {
				console.log('-----logout----');
				this.$u.api.userLogout().then(res => {
					console.log('---res---', res);
					this.$u.vuex('vuex_token', '');
					this.$u.vuex('vuex_user', '');
					this.$u.vuex('vuex_user_password', '');
					uni.clearStorage();
					this.$appUtils.reLaunchLogin();
				});
			}
		}
	}
</script>

<style>
	.avatar {
		width: 102px;
		height: 102px;
		background-color: #d7e0e4;
	}

	.footer {
		position: fixed;
		bottom: 60rpx;
		left: 30rpx;
		right: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
</style>
