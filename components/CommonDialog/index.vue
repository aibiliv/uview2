<template>
	<u-popup
		class="common-dialog"
		v-model="visible"	
		mode="center"
		border-radius="20"
		:mask-close-able="maskcloseAble"
		:width="width"
		:height="height"
		v-bind="$attrs"
		@close="close"
	>
		<view class="u-p-l-32 u-p-r-32 u-p-b-32">
			<view v-if="title || $slots.title" class="u-font-bold u-font-36 u-text-center u-m-t-56 u-m-b-36">
				<slot name="title">{{ title }}</slot>
			</view>
			<slot name="default"></slot>
			<view v-if="showFooter" class="footer u-flex">
				<slot name="footer">
					<u-button :custom-style="customStyle" size="medium" shape="circle" type="default" @click="cancel">取消</u-button>
					<u-button :custom-style="customStyle" size="medium" shape="circle" type="primary" @click="submit">确定</u-button>
				</slot>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		visible: {
			type: Boolean,
			default: false
		},
		maskcloseAble: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: '630'
		},
		height: {
			type: String,
			default: 'auto'
		},
		showFooter: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			customStyle: {
				width: '256rpx',
				height: '64rpx'
			}
		}
	},
	methods: {
		open() {},
		close() {
			this.$emit('update:visible', false)
			this.$emit('close')
		},
		submit() {
			this.$emit('submit')
		},
		cancel() {
			this.$emit('update:visible', false)
			this.$emit('cancel')
		}
	}
}
</script>

<style></style>
