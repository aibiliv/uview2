<template>
	<view class="">
		<!-- 输入密码弹出层 -->
		<!-- <u-popup class="password-modal" v-model="showModal" mode="center" @close="closeModal" border-radius="20" height="300">
			<view class="u-p-l-50 u-p-r-50 u-p-b-50">
				<view class="modal-title u-font-bold u-font-36 u-text-center u-m-t-56 u-m-b-36">请输入支付密码</view>
				<u-message-input :maxlength="6" :breathe="false" :value="password" disabled-keyboard focus dot-fill></u-message-input>
			</view>
		</u-popup> -->
		<!-- 数字键盘 -->
		<u-keyboard
			ref="uKeyboard"
			mode="number"
			v-model="showBoard"
			:random="true"
			:mask-close-able="false"
			:confirm-btn="false"
			:cancel-btn="false"
			:show-tips="false"
			@change="valChange"
			@cancel="closeModal"
			@backspace="backspace"
		>
		<!-- <view class="u-p-l-50 u-p-r-50 u-p-b-50"> -->
		<view >
			<view class="u-flex u-p-r-32 u-p-t-32" style="flex-direction: row-reverse;">
				<u-icon name="close" size="32" @click="closeModal"></u-icon>
			</view>
			<view class="modal-title u-font-bold u-font-36 u-text-center u-m-t-36 u-m-b-36">请输入支付密码</view>
			<!-- <u-message-input :maxlength="6" :breathe="false" :value="password" disabled-keyboard focus dot-fill></u-message-input> -->
		</view>
		</u-keyboard>
	</view>
</template>

<script>
export default {
	data() {
		return {
			password: '',
			showModal: false,
			showBoard: false
		}
	},
	mounted() {
		this.showBoard = false
	},
	methods: {
		show() {
			this.password = ''
			uni.hideTabBar()
			this.showModal = true
			this.showBoard = true
		},
		closeModal() {
			// uni.showTabBar()
			this.showModal = false
			this.showBoard = false
			this.password = ''
		},
		// 按键被点击(点击退格键不会触发此事件)
		valChange(val) {
			this.password += val
			if (this.password.length === 6) {
				this.$emit('finish', this.password)
			}
		},
		clear(){
			this.password = ''
		},
		// 退格键被点击
		backspace() {
			// 删除value的最后一个字符
			if (this.password.length) this.password = this.password.substr(0, this.password.length - 1)
		}
	}
}
</script>

<style></style>
