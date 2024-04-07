<template>
	<view>
		<view class="container" v-if="vuex_user">
			<view class="top-info" :style="{
					paddingTop:parseInt(topInfoTop) + 'px',
					paddingRight:parseInt(topInfoRight) + 'px'				
				}">
				<view class="u-flex u-row-between">
					<view @click="actionSheetShow = true">
						<text class="u-m-r-12 color-595959">{{cur_area.areaName || '请选择'}}</text>
						<u-icon name="arrow-down" color="#595959" size="24"></u-icon>
					</view>
					<view class="u-flex u-row-between" style="position: relative;"
						@click="$u.route('/pages/user/account-settings')">
						<view class="message" @click.stop="$u.route('/pages/user/message')">
							<u-icon name="chat" color="#FFFFFF" size="36"></u-icon>
							<u-badge type="error" :count="vuex_messageNum ? vuex_messageNum : 0" :offset="[0, 0]"></u-badge>
						</view>
					</view>
				</view>
				
			</view>

			<view style="position: absolute;left: 0;top: 0;z-index: 1;right: 0;">
				<view style="width: 100%;height: 200rpx;" class="f-bg"></view>
				<view class="u-flex u-row-between u-p-b-62 f-bg">
					<view class="u-flex u-p-l-40 u-p-r-40" style="width:100%">
						<!-- <u-avatar v-if="vuex_user.userPicture" :src="vuex_user.userPicture"></u-avatar> -->
						<image src="/static/images/me/cai-user.png" style="width: 180rpx;height: 128rpx;"
							v-if="vuex_roleKey == 1"></image>
						<image src="/static/images/me/gong-user.png" style="width: 180rpx;height: 128rpx;" v-else></image>
						<!-- 	<u-avatar v-if="" src="/static/images/me/avatar.png" size="148"></u-avatar>
						<u-avatar v-else src="/static/images/me/avatar.png" size="148"></u-avatar> -->
						<view class="fleet-info u-m-l-18 u-font-26"  style="width:100%">
							<view class="u-font-32 color-black">{{vuex_user.companyName || ''}}
								<!-- <u-icon  @click="$u.route('/pages/user/account-settings')" name="setting" style="float:right" size="42"></u-icon> -->
								<FkhIcon name="shezhiline" @click="$u.route('/pages/user/account-settings')" style="float:right" size="38"></FkhIcon>
							</view>

							<view class="u-flex u-m-t-10">
								<view class=" color-595959 ">{{vuex_user.loginAccount}}</view>
								<view class="auth" @click.stop="goAuthInfo()">
									{{getAuthStatusText(vuex_user.authStatus)}}
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="account-balance u-m-l-32 u-p-l-32 u-p-r-32">
					<view class="item">
						<view class="u-font-24" style="color: rgba(255, 255, 255, 0.5);">在线账户</view>
						<view class="color-white u-font-32 u-m-t-10">{{$appUtils.moneyFormatter(onlineAmount).split('.')[0]+'.'}}
						<text class="u-font-24">{{$appUtils.moneyFormatter(onlineAmount).split('.')[1] ? $appUtils.moneyFormatter(onlineAmount).split('.')[1] : '00'}}</text>
						</view>
						
					</view>
					<view class="item" v-if="vuex_roleKey == 1">
						<view class="u-font-24" style="color: rgba(255, 255, 255, 0.5);">授信账户</view>
						<view class="color-white u-font-32 u-m-t-10">{{$appUtils.moneyFormatter(creditAmount).split('.')[0]+'.'}}
						<text class="u-font-24">{{$appUtils.moneyFormatter(creditAmount).split('.')[1] ? $appUtils.moneyFormatter(creditAmount).split('.')[1] : '00'}}</text>
						</view>
					</view>
					<view class="item">
						<view class="u-font-24" style="color: rgba(255, 255, 255, 0.5);">线下账户</view>
						<view class="color-white u-font-32 u-m-t-10">{{$appUtils.moneyFormatter(offlineAmount).split('.')[0]+'.'}}
						<text class="u-font-24">{{$appUtils.moneyFormatter(offlineAmount).split('.')[1] ? $appUtils.moneyFormatter(offlineAmount).split('.')[1] : '00'}}</text>
						</view>
						
					</view>
				</view>

				<view class="u-p-l-40 u-p-r-40">
					<view class="u-flex u-row-between u-p-t-30 u-p-b-30" @click="$u.route('/pages/user/address')">
						<view class="u-flex">
							<image class="left-icon" src="@/static/images/me/address.png"></image>
							<view class="color-222 u-font-32 u-m-l-20">{{addressLabel}}</view>
						</view>

						<u-icon name="arrow-right" color="#BFBFBF" size="28" class="u-m-l-18"></u-icon>
					</view>

					<view class="divider-line "></view>

					<view v-if="vuex_roleKey == 1" class="u-flex u-row-between u-p-t-30 u-p-b-30"
						@click="$u.route('/pages/user/bills')">
						<view class="u-flex">
							<image class="left-icon" src="@/static/images/me/fapiao.png"></image>
							<view class="color-222 u-font-32 u-m-l-20">查看发票</view>
						</view>

						<u-icon name="arrow-right" color="#BFBFBF" size="28" class="u-m-l-18"></u-icon>
					</view>

					<view class="divider-line "></view>

					<view class="u-flex u-row-between u-p-t-30 u-p-b-30" @click="$u.route('/pages/user/about-us')">
						<view class="u-flex">
							<image class="left-icon" src="@/static/images/me/about.png"></image>
							<view class="color-222 u-font-32 u-m-l-20">关于我们</view>
						</view>

						<u-icon name="arrow-right" color="#BFBFBF" size="28" class="u-m-l-18"></u-icon>
					</view>

					<view class="divider-line "></view>

					<view class="u-flex u-row-between u-p-t-30 u-p-b-30" @click="$u.route('/pages/user/contact-us')">
						<view class="u-flex">
							<image class="left-icon" src="@/static/images/me/link-us.png"></image>
							<view class="color-222 u-font-32 u-m-l-20">联系我们</view>
						</view>
						<u-icon name="arrow-right" color="#BFBFBF" size="28" class="u-m-l-18"></u-icon>
					</view>
					<view class="divider-line "></view>
				</view>
				<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback" name="areaName"
					:showSearch="false"></u-action-sheet>
			</view>
		</view>
		<!-- <u-tabbar v-if="showTabbar" :list="vuex_roleKey == 2 ? vuex_tabbar_supplier : vuex_tabbar_purchaser"></u-tabbar> -->

		<u-tabbar v-if="showTabbar" :list="vuex_roleKey == 2 ? tabbar_supplier : tabbar_purchaser"></u-tabbar>
	</view>
</template>

<script>
	import UniSocket from "@/common/uni.socket.js"
	import tabbarMixin from "@/common/tabbar.mixin.js"
	import { areaCodeUserUtil } from '@/common/areaCodeUtil.js'
	import {
		mapState
	} from 'vuex'
	export default {
		mixins: [tabbarMixin],
		data() {
			return {
				menuButtonInfo: '',
				topInfoTop: uni.upx2px(100),
				topInfoRight: uni.upx2px(32),
				onlineAmount: 0.00,
				offlineAmount: 0.00,
				creditAmount: 0.00,
				addressLabel: '收货地址管理',
				actionSheetList: [],
				actionSheetShow: false,
				cur_area: {},
				socket:null,
				showTabbar: false,
				timer: null
			};
		},
		computed: {
			...mapState(['vuex_roleKey'])
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			this.menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.topInfoTop = this.menuButtonInfo.top - ((uni.upx2px(64) - this.menuButtonInfo.height) / 2)
			this.topInfoRight = uni.upx2px(750) - (this.menuButtonInfo.left - uni.upx2px(14))	
			// #endif
			if (this.vuex_roleKey === 2) {
				this.initSocket();
			}
			this.clearTimer()
			this.getNeedMaterialNum()
			this.timer = setInterval(() => {
				this.getNeedMaterialNum()
			}, 10000);
		},
		onShow() {
			this.getOnLineAccount()
			this.getAreaList()
			this.getUserInfo()
			// this.getWalletByUser()
			this.getOffLineAccount();
			if (this.vuex_roleKey === 2) {
				this.addressLabel = '发货地址管理'
			}
		},
		methods: {
			//↓虽然这个是空方法，但是不能删
			otherFun() {},
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
			// 点击actionSheet回调
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.cur_area = this.actionSheetList[index]
				this.$u.vuex('vuex_area', this.actionSheetList[index].areaCode);
				this.$appUtils.bus.$emit('changeArea',this.cur_area)
				this.$nextTick(() => {
					if(this.vuex_token){
						this.getOnLineAccount()
						this.getAreaList()
						this.getUserInfo()
						// this.getWalletByUser()
						this.getOffLineAccount();
						if(this.vuex_roleKey == 2){
							this.initSocket();
						}			
					}
				})
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
					if (data.type === 'HEARTBEAT') {
						console.log(data);
					}
				})
			
				this.socket.on("**", function(data) {
					if (data && data.data) {
						if (data.data.indexOf('messageNum') != -1) {
							let JSONDataData = JSON.parse(data.data)
							if (JSONDataData.type && JSONDataData.type == 'messageNum') {
								that.$u.vuex('vuex_messageNum', JSONDataData.count);
							}
						}
					}else {			
						this.emitToClientNotNameEvents(msg);
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
			goAuthInfo(){
				if(this.vuex_user.authStatus !== 0){
					this.$u.route('/pages/user/auth-info')
				}
			},
			getAuthStatusText(status) {
				switch (status) {
					case 0:
						return '待认证'
					case 1:
						return '认证中'
					case 2:
						return '已认证'
					case 3:
						return '审核未通过'
					default:
						return '待认证'
				}
			},
			getOffLineAccount() {
				//flowModel 采购商为0  供应商为1
				let flowModel = this.vuex_roleKey == 1 ? 0 : 1;
				this.$u.api.offLineAccount({
					flowModel: flowModel
				}).then(res => {
					this.offlineAmount = res.remaining ? res.remaining : 0.00
				});
			},
			getWalletByUser() {
				if (this.$appUtils.getToken()) {
					let creditAmount = 0.00;
					this.$u.api.getWalletByUser().then(res => {
						res.forEach((item, index) => {
							if (item.isCredit) {
								creditAmount += item.remainingQuota ? item.remainingQuota : 0.00
							} 
						})
						this.creditAmount = creditAmount
					});
				}
			},
			// 获取在线账户余额
			async getOnLineAccount() {
			  const res = await this.$u.api.ciccAccountListTotalBalance()
			  this.onlineAmount = res || 0.00 // 总剩余
			},
			getUserInfo() {
				if (this.$appUtils.getToken()) {
					this.$u.api.getUserInfo({
						isDesensitization: true
					}).then(res => {
						///登录成功 记录当前用户
						// console.log('----user info----', res);
						this.$u.vuex('vuex_user', res);
					});
				}
			},
			goUserInfo() {
				uni.navigateTo({
					url: '../user/info'
				});
			},
			goCarReport() {
				this.$u.route('/pages/report/manage/car-list-v2')
			},
			

			//业务需要：定时获取待确认需求数量
			async getNeedMaterialNum(){
				const res = await this.$u.api.needMaterialsOrdersPage({
					status: 0,
					limit: 100,
					tenantId: this.vuex_user.tenantId,
				})	
				this.$u.vuex('vuex_needMaterialsNum',res.total)
				setTimeout(() => {
					
					this.showTabbar = true
				}, 200);
			},
			clearTimer(){
				clearInterval(this.timer)
				this.timer = null
			}
		},
		destroyed() {
			this.destroySocket()
			this.clearTimer()
		}
	};
</script>

<style lang="scss">
	.f-bg {
		background: linear-gradient(320deg, #FFFFFF 0%, #FFFFFF 100%);
	}

	.top-info {
		width: 100%;
		height: 64rpx;
		position: absolute;
		z-index: 2;
		left: 0;
		top: 0;
		padding: 80rpx 32rpx 0 32rpx;

		.message {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			width: 64rpx;
			height: 64rpx;
			background: rgba(0, 0, 0, 0.4);
			border-radius: 50%;

		}
	}

	.auth {
		padding: 0 20rpx;
		height: 37rpx;
		background: linear-gradient(225deg, #FFEBCC 0%, #DDBD6A 100%);
		border-radius: 19rpx;
		font-size: 24rpx;
		color: #222;
		line-height: 37rpx;
		text-align: center;
		font-weight: 500;
		margin-left: 10rpx;
	}

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

	.left-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.status {
		line-height: 40rpx;
		text-align: center;
		width: 73rpx;
		height: 40rpx;
		border: 1rpx solid #03B915; //03B915
		border-radius: 5rpx;
		color: #03B915; //ee7471
	}

	.account-balance {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 686rpx;
		height: 144rpx;
		background: linear-gradient(135deg, #242A42 0%, #4A5067 100%);
		border-radius: 20rpx;

		.item {
			// flex: 1;
			display: flex;
			flex-direction: column;
			height: 100%;
			justify-content: center;
		}
	}
</style>
