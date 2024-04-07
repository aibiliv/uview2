<template>
	<view class="container">
		<view class="u-flex u-row-between u-m-b-18 u-m-l-32 u-m-r-32">
			<view class="color-8C8C8C">共{{total}}条消息</view>
			<view class="color-theme u-font-bold" @click="readAllTip">全部已读</view>
		</view>

		<d-refresh-load ref="dRefreshLoad" @loadMore="loadMore" @pullDownRefresh="pullDownRefresh" autoLoad>
			<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in datas" :key="item.id"
				@click="click" :options="item.isRead===1 ? delOptions: options" @open="open">
				<view class="item u-p-t-20 u-p-l-32 u-p-r-32">
					<view class="u-flex u-col-top ">
						<view class="read-box" style="position: relative;">
							<!-- <u-badge type="error" count="7" :offset="[0, 0]"></u-badge> -->
							<u-badge :is-dot="true" type="error" :offset="[0, 0]" v-if="item.isRead!=1"></u-badge>
							<view class="read" :class="item.isRead==1?'is-read':''">
								{{convetType(item.type)}}
							</view>
						</view>

						<view class="u-flex-1 u-m-l-32">
							<view class="u-flex u-row-between">
								<view>{{convetType(item.type)}}通知</view>
								<view class="color-8C8C8C u-font-22">{{item.createTime}}</view>
							</view>

							<view class="u-m-t-14 color-8C8C8C u-font-24">{{item.content}}</view>
						</view>
					</view>
					<view class="divider-line u-m-t-20" style="margin-left: 108rpx;"></view>
				</view>
			</u-swipe-action>
		</d-refresh-load>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				total: 0,
				datas: [],
				delOptions: [
					{
						text: '删除',
						style: {
							color: '#ffffff',
							backgroundColor: '#EA3D2F'
						}
					}
				],
				options: [{
						text: '已读',
						style: {
							color: '#8C8C8C',
							backgroundColor: '#F5F5F5'
						}
					},
					{
						text: '删除',
						style: {
							color: '#ffffff',
							backgroundColor: '#EA3D2F'
						}
					}
				]
			}
		},
		onLoad() {

		},
		onPullDownRefresh() {
			this.$nextTick(() => {
				this.$refs.dRefreshLoad.dOnPullDownRefresh();
			})
		},
		onReachBottom() {
			this.$nextTick(() => {
				this.$refs.dRefreshLoad.dOnReachBottom();
			})
		},
		methods: {
			deleteMessage(index) {
				let item = this.datas[index];
				this.$u.api.messageDelete(item.id).then(res => {
					this.datas.splice(index, 1);
					this.$u.toast('删除成功');
				})
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.datas[index].show = true;
				this.datas.map((val, idx) => {
					if (index != idx) this.datas[idx].show = false;
				})
			},
			click(index, index1) {
				let delIndex = 1
				if(this.datas[index].isRead === 1){
					delIndex = 0
				}
				if (index1 == delIndex) {
					uni.showModal({
						title: '确认删除消息？',
						success: (res) => {
							if (res.confirm) {
								this.datas[index].show = false;
								this.$forceUpdate();
								this.deleteMessage(index)
							}
						}
					})
				} else {
					this.datas[index].show = false;
					this.$forceUpdate();
					this.signRead(this.datas[index]);
				}
			},
			readAllTip() {
				uni.showModal({
					title: '确认把消息标记为全部已读？',
					success: (res) => {
						if (res.confirm) {
							this.readAll()
						}
					}
				})
			},
			readAll() {
				this.$u.api.messageReadAll().then(res => {
					this.$nextTick(() => {
						this.$refs.dRefreshLoad.dOnPullDownRefresh();
					})
				})
			},
			signRead(item) {
				this.$u.api.messageSignRead({
					id: item.id
				}).then(res => {
					item.isRead = 1
				})
			},
			loadMore(pageNo) {
				this.getDatas(pageNo);
			},
			pullDownRefresh(pageNo) {
				this.getDatas(pageNo);
			},
			convetType(type) {
				switch (type) {
					case 1:
						return '合同'
					case 2:
						return '采购'
					case 3:
						return '销售'
					case 4:
						return '交易'
					case 5:
						return '授信'
					case 6:
						return '账号'
					case 7:
						return '平台'
					case 8:
						return '付款'
					case 9:
						return '发票'
					case 10:
						return '店铺'
					default:
						return '未知'
				}
			},
			getDatas(page) {
				this.$u.api.messageList({
					page: page
				}).then(res => {
					if (page === 1) {
						this.datas = [];
					}
					this.total = res.total
					//设置列表数据
					if (res.records) {
						res.records.forEach((item, index) => {
							item.show = false
						})
						this.datas = this.datas.concat(res.records)
					}
					this.$refs.dRefreshLoad.endSuccess(res.records ? res.records.length : 0)
				})
			}
		}
	}
</script>

<style>
	.read-box {
		width: 76rpx;
		height: 76rpx;
	}

	.read {
		width: 76rpx;
		height: 76rpx;
		background: rgba(203, 74, 43, 0.1);
		font-size: 24rpx;
		font-weight: 400;
		color: #CB4A2B;
		text-align: center;
		line-height: 76rpx;
		border-radius: 50%;
	}

	.is-read {
		color: #8c8c8c !important;
		background: rgba(34, 34, 34, 0.1) !important;
	}
</style>
