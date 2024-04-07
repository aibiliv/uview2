<script>
	export default {
		// 此处globalData为了演示其作用，不是uView框架的一部分
		globalData: {
			username: '白居易'
		},
		onLaunch() {
			// 1.1.0版本之前关于http拦截器代码，已平滑移动到/common/http.interceptor.js中
			// 注意，需要在/main.js中实例化Vue之后引入如下(详见文档说明)：
			// import httpInterceptor from '@/common/http.interceptor.js'
			// Vue.use(httpInterceptor, app)
			// process.env.VUE_APP_PLATFORM 为通过js判断平台名称的方法，结果分别如下：
			/**
			 * h5，app-plus(nvue下也为app-plus)，mp-weixin，mp-alipay......
			 */
			//判断是否登录
			// let vuex_token = this.$store.state.vuex_token;
			// if (!vuex_token) {
			// 	uni.reLaunch({
			// 		url: "/pages/user/login"
			// 	});
			// } else {
			// 	uni.reLaunch({
			// 		url: '/pages/report/report-list'
			// 	})
			// 	return
			// }
			uni.reLaunch({
				url: '/pages/index/judge'
			})
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "common/app.scss";
	@import "static/common/font/iconfont.css";
</style>
