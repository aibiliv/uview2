<template>
	<view>
		<slot></slot>
		<!-- <view class="u-font-28 u-m-t-60 u-flex u-row-center" v-if="noData">暂无数据</view> -->
		<view class="u-m-t-60 u-text-center">
			<!-- <u-empty class="u-m-t-60" :mode="emptyMode" :text="emptyText" v-if="noData"></u-empty> -->
		</view>
		<view class="u-flex u-row-center u-col-center" style="height:100rpx;background-color: unset;">
			<text v-if="showLoadMore">{{loadMoreText}}</text>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			autoLoad: {
				type: Boolean,
				default: true
			},
			pageSize: {
				type: Number,
				default: 10
			}
		},
		data() {
			return {
				loadMoreText: "加载中...",
				showLoadMore: false,
				page: 1,
				noMoreData: false,
				noData: false,
				isInitOk: false
			}
		},
		created() {},
		mounted() {
			console.log("-----mounted----------")
			this.$nextTick(function() {
				if (this.autoLoad) {
					console.log("-----autoLoad----------")
					this.pullDownRefresh();
				}
			})
		},
		unmounted() {
			// this.data = [];
			this.loadMoreText = "加载更多";
			this.showLoadMore = false;
			this.isInitOk = false;
		},
		methods: {
			setPage(page) {
				this.page = page;
				if (this.page == 1) {
					this.loadMoreText = "加载中...";
					this.showLoadMore = false;
					this.noData = false
					this.noMoreData = false;
					this.isInitOk = false;
				}
			},
			endSuccess(dataLenth) {
				if (this.page == 1 && dataLenth == 0) {
					this.noData = true;
				} else {
					this.noData = false;
				}
				this.noMoreData = !dataLenth || dataLenth < this.pageSize;
				if (this.noMoreData) {
					this.loadMoreText = "没有更多数据了!"
				}
				// console.log("this.noMoreData:" + this.noMoreData)
				// this.$forceUpdate()
				// this.showLoadMore = false;
				this.isInitOk = true;
			},
			dOnReachBottom() {
				console.log("onReachBottom");
				if (this.noMoreData) {
					this.loadMoreText = "没有更多数据了!"
					return;
				}
				if (!this.isInitOk) {
					return;
				}

				this.showLoadMore = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.page++;
						console.log("this.page:" + this.page)
						this.loadMore(this.page);
					}, 300);
				})


			},
			dOnPullDownRefresh() {
				console.log('onPullDownRefresh');
				this.loadMoreText = "加载中...";
				this.showLoadMore = false;
				this.page = 1;
				this.noData = false
				this.noMoreData = false;
				this.isInitOk = false;
				this.pullDownRefresh();
			},
			pullDownRefresh() {
				console.log("pullDownRefresh");
				if (this.isInitOk) {
					uni.pageScrollTo({
						scrollTop: 0
					})
				}
				setTimeout(() => {
					this.$emit('pullDownRefresh', this.page)
				}, 300);
			},
			loadMore() {
				this.$emit('loadMore', this.page)
			}
		}
	}
</script>

<style>

</style>
