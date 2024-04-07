<template>
	<view class="u-w-full">
		<view class="u-flex">
			<!-- 	<view class="u-m-r-30" :style="{
				width:'width:'+lableWidth+'rpx'
			}">{{lable}}</view> -->
			<view class="u-m-r-30">{{lable}}</view>
			<view class="u-flex-1">
				<u-input :placeholder="placeholder" :value="value" inputAlign="right" :height="99"
					:custom-style="inputStyle" :disabled="!editEnable" :maxlength="maxlength" :type="type"  @click="click" @input="input">
				</u-input>
			</view>
			<u-icon name="arrow-right" color="#BFBFBF" size="28" class="u-m-l-18" v-if="showMoreIcon"></u-icon>
		</view>
		<u-line color="#e4e7ed" border-style="solid" :hair-line="false" />
	</view>
</template>

<script>
	export default {
		model: {
			prop: 'value',
			event: 'changeVal'
		},
		props: {
			lableWidth: {
				type: Number,
				default: 150
			},
			lable: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: 'text'
			},
			maxlength: {
				type: String | Number,
				default: 140
			},
			value: {
				type: String,
				event: 'changeVal'
			},
			placeholder: {
				type: String,
				default: '请输入'
			},
			valueColor: {
				type: String,
				default: '#BFBFBF'
			},
			editEnable: {
				type: Boolean,
				default: false
			},
			showMoreIcon: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				inputStyle: {
					fontSize: '28rpx',
					color: this.valueColor
				}
			}
		},
		methods: {
			input(val) {
				this.$emit('changeVal', val)
			},
			click() {
				this.$emit('click')
			}
		}
	}
</script>

<style>
	.u-w-full {
		height: 99rpx;
		line-height: 99rpx;
	}
</style>
