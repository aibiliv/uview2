<template>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		created() {
			//判断是否登录
			let vuex_token = this.$store.state.vuex_token;
			if (!vuex_token) {
				uni.reLaunch({
					// url: "/pages/user/login"
					url: "/pages/index/Map"
				});
			} else {
				if (this.$store.state.vuex_roleKey === 2) {	
					uni.reLaunch({
						url: '/pages/me/me'
					})				
					
				}else{
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}							
			}
		},
		methods: {

		}
	}
</script>

<style>
</style>
