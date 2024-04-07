<template>
	<view style="display: inline-block;" @tap="click">
		<u-icon :name="name" custom-prefix="fkh-icon" :size="size" :color="color"></u-icon>
	</view>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				default: ''
			},
			size: {
				type: String,
				default: '28'
			},
			color: {
				type: String,
				default: '#222'
			},
		},

		data() {
			return {
			}

		},
		methods: {
			click() {
				this.$emit('click')
			},
		}
	}
</script>

<style>

</style>
