<template>
  <view>
    <map
      id="map"
      :latitude="latitude"
      :longitude="longitude"
      :style="{ width: '100vw', height: mapHeight }"
      :scale="4"
      :markers="markers"
      @markertap="markertap"
      @callouttap="callouttap"
    >
      <!--自定义气泡-->
      <cover-view slot="callout">
        <block v-for="(item, index) in markers" :key="index">
          <cover-view class="customCallout" :marker-id="item.id">
            <cover-view class="content">
              <view> {{ item.id }} 内容 </view>
            </cover-view>
          </cover-view>
        </block>
      </cover-view>
    </map>
  </view>
</template>
<script>
export default {
  // props: {
  // 	markers: {
  // 		type: Array,
  // 		default: () => []
  // 	}
  // },
  data() {
    return {
      map: null,
      mapHeight: "100vh",
      id: 0, // 使用 marker点击事件 需要填写id
      latitude: 30.5728,
      longitude: 104.0668,
      markers: [
        {
          id: 1,
          latitude: 39.9042,
          longitude: 116.4074,
          customCallout: { display: "BYCLICK" },
        },
        {
          id: 2,
          latitude: 39.3434,
          longitude: 117.3616,
          customCallout: { display: "BYCLICK" },
        },
        {
          id: 3,
          latitude: 31.2304,
          longitude: 121.4737,
          customCallout: { display: "BYCLICK" },
        },
        {
          id: 4,
          latitude: 29.5638,
          longitude: 106.5516,
          customCallout: { display: "ALWAYS" },
        },
        {
          id: 5,
          latitude: 30.5728,
          longitude: 104.0668,
          customCallout: { display: "ALWAYS" },
            // callout: {
            //   content: "川A·88888", // 车牌信息
            //   display: "BYCLICK",
            //   fontWeight: "bold",
            //   color: "#222", //文本颜色
            //   fontSize: "12px",
            //   bgColor: "#ffffff", //背景色
            //   padding: 5, //文本边缘留白
            //   textAlign: "center",
            // },
        },
      ],
      // 标记点
      covers: [
        {
          id: 1,
          width: 42,
          height: 42,
          rotate: 270,
          latitude: 34.259428,
          longitude: 108.94704,
          iconPath: require("@/static/images/order/up.png"),
          callout: {
            content: "川A·88888", // 车牌信息
            display: "ALWAYS",
            fontWeight: "bold",
            color: "#222", //文本颜色
            fontSize: "12px",
            bgColor: "#ffffff", //背景色
            padding: 5, //文本边缘留白
            textAlign: "center",
          },
          anchor: {
            x: 0.5,
            y: 0.5,
          },
        },
      ],
    };
  },
  onReady() {
    // 创建map对象
    this.map = uni.createMapContext("map");
  },
  mounted() {
    uni.getLocation({
      type: "gcj02", // 使用国测局坐标系统
      success: (res) => {
        this.latitude = res.latitude;
        this.longitude = res.longitude;
      },
    });
  },
  methods: {
    markertap(e) {
      console.log("e1", e);
    },
    callouttap(e) {
      console.log("e2", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.map-item {
  width: 100px;
  height: 40px;
}
.customCallout {
  box-sizing: border-box;
  background-color: #fff;
  background: #ffffff;
  box-shadow: 0px 4rpx 16px 0px rgba(189, 191, 193, 0.4);
  border-radius: 4rpx;
  display: inline-flex;
  padding: 6rpx 24rpx;
  justify-content: center;
  align-items: center;
  color: #2a7be2;
}
</style>
