<template>
	<view class="container">
		<!-- <u-navbar></u-navbar> -->
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(e) {
			this.url = e.url;
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	web-view {
		height: 98vh;
	}
</style>
