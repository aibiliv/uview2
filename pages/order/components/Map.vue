<template>
	<view>
		<map
			id="map"
			:latitude="markers[0] && markers[0].latitude"
			:longitude="markers[0] && markers[0].longitude"
			:markers="markers"
			:style="{ width: '100vw', height: mapHeight }"
			:scale="13"
		></map>
	</view>
</template>
<script>
export default {
	props: {
		markers: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			map: null,
			mapHeight: 0,
			id: 0, // 使用 marker点击事件 需要填写id
			title: 'map',
			latitude: 34.263734,
			longitude: 108.934843,
			// 标记点
			covers: [
				{
					id: 1,
					width: 42,
					height: 42,
					rotate: 270,
					latitude: 34.259428,
					longitude: 108.94704,
					iconPath: require('@/static/images/order/up.png'),
					callout: {
						content: '川A·88888', // 车牌信息
						display: 'ALWAYS',
						fontWeight: 'bold',
						color: '#222', //文本颜色
						fontSize: '12px',
						bgColor: '#ffffff', //背景色
						padding: 5, //文本边缘留白
						textAlign: 'center'
					},
					anchor: {
						x: 0.5,
						y: 0.5
					}
				}
			]
		}
	},
	onReady() {
		// 创建map对象
		this.map = uni.createMapContext('map')
		this.mapHeight = '100vh'
	},
	mounted() {},
	methods: {}
}
</script>
