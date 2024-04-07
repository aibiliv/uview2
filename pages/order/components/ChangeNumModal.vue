<template>
	<!-- 调整数量弹窗 -->
	<u-modal
		ref="numModal"
		v-model="visible"
		width="630"
		:async-close="true"
		:title="title"
		:title-style="titleStyle"
		:show-cancel-button="showCancelbutton"
		:confirm-color="vuex_main_color"
		@confirm="confirm"
		@cancel="cancel"
	>
		<view class="u-p-t-40 u-p-l-20 u-p-r-20 u-p-b-20">
			<view class="u-flex u-row-between">
				<u-button
					style="line-height: 28rpx;"
					:custom-style="isActive === 1 ? isActiveStyle : buttonStyle"
					size="medium"
					type="default"
					@click="add"
				>
					<u-icon class="u-m-r-8" name="plus-circle" size="32"></u-icon>
					追加
				</u-button>
				<u-button
					style="line-height: 28rpx;"
					:custom-style="isActive === 2 ? isActiveStyle : buttonStyle"
					size="medium"
					type="default"
					@click="minus"
				>
					<u-icon class="u-m-r-8" name="minus-circle" size="32"></u-icon>
					削减
				</u-button>
			</view>
			<view class="input-div u-m-t-20"><u-input v-model="money" focus placeholder="请输入调整数量" type="digit" border @input="input" /></view>
		</view>
	</u-modal>
</template>

<script>
	import {mapState} from 'vuex'
export default {
	props: {
		title: { type: String, default: '调整订单数量' },
		show: { type: Boolean, default: false },
		showCancelbutton: { type: Boolean, default: true }
	},
	data() {
		return {
			visible: false,
			isActive: 1,
			titleStyle: {
				fontWeight: 'bold'
			},
			buttonStyle: {
				width: '274rpx',
				height: '80rpx',
				fontSize: '28rpx'
			},
			isActiveStyle: {
				width: '274rpx',
				height: '80rpx',
				borderColor: this.$store.state.vuex_main_color,
				color: this.$store.state.vuex_main_color,
				backgroundColor: 'rgba(202, 75, 43, 0.1)'
			},
			money: '',
			changeType:0
		}
	},
	computed:{
		...mapState(['vuex_main_color'])
	},
	watch: {
		show: {
			handler(val) {
				this.visible = val
			},
			immediate: true
		}
	},
	onShow() {
		this.money = ''
	},
	methods: {
		input(val){
			val = (val.match(/^\d*(\.?\d{0,3})/g)[0]) || ''
			this.$nextTick(()=>{
				this.money = val
			})
		},
		add() {
			this.isActive = 1
			this.changeType=0
			this.money = ''
		},
		minus() {
			this.isActive = 2
			this.changeType=1
			this.money = ''
		},
		confirm() {
			if(!this.money||this.money <= 0){
				uni.showToast({
					title:'请输入正数',
					icon: 'none'
				})
				this.$refs.numModal.clearLoading()
				return
			}
			
			this.$emit('update:show', false)
			this.$emit('confirm',{
				changeNum:this.money,
				changeType:this.changeType,
			})
			this.money = ''
		},
		cancel() {
			this.$emit('update:show', false)
			this.$emit('cancel', this.money)
			this.money = ''
		}
	}
}
</script>

<style lang="scss"></style>
