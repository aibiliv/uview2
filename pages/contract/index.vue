<template>
	<view>
		<view class="container u-p-30">
			<d-refresh-load ref="dRefreshLoad" @loadMore="loadMore" @pullDownRefresh="pullDownRefresh" autoLoad>
				<view  v-for="(item, index) in contractList" :key="index"  @click.prevent="clickContract(item)">
					<ContractCard  :detail="item" :showFileBtn="false"></ContractCard>
				</view>
			</d-refresh-load>
			<u-empty marginTop="260" v-if="contractList.length === 0 " mode="order" text="暂无合同"></u-empty>
			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>
		<u-tabbar :list="vuex_roleKey == 2 ? tabbar_supplier : tabbar_purchaser"></u-tabbar>
	</view>
</template>

<script>
// import contractList from './contract.js'
import { mapActions } from 'vuex'
import tabbarMixin from "@/common/tabbar.mixin.js"
import ContractCard from '@/components/contract/ContractCard.vue'
export default {
	mixins: [tabbarMixin],
	components: {
		ContractCard
	},
	data() {
		return {
			page: 1,
			scrollTop: 0,
			contractList: []
		}
	},
	watch:{
		vuex_area:{
			handler(val){
				this.page = 1
				this.getContractList()
			}
		}
	},
	computed: {},
	async onShow() {
		await this.appLogin() //登录拦截
		// this.getContractList()
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop
	},
	onPullDownRefresh() {
		this.page = 1
		this.getContractList()
	},
	methods: {
		...mapActions(['appLogin']),
		async getContractList() {
			const res = await this.$u.api.getContractList({ page: this.page })
			if (this.page === 1) this.contractList = []
			this.contractList = this.contractList.concat(res.records)
			this.$refs.dRefreshLoad.endSuccess(res.records ? res.records.length : 0)
		},
		clickContract(item) {
			uni.navigateTo({
				url: `./ContractDetail?id=${item.id}`
			})
		},
		loadMore(pageNo) {
			this.page = pageNo
			this.getContractList()
		},
		pullDownRefresh(pageNo) {
			this.page = pageNo
			this.getContractList()
		}
	},
	onPullDownRefresh() {
		this.$nextTick(() => {
			this.$refs.dRefreshLoad.dOnPullDownRefresh()
		})
	},
	onReachBottom() {
		this.$nextTick(() => {
			this.$refs.dRefreshLoad.dOnReachBottom()
		})
	}
}
</script>

<style lang="scss" scoped>
.container {
	// background-color: $page-bg-color;
}
</style>
