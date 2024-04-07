import { mapGetters } from "vuex";
import store from "@/store";

export default {
  data() {
    return {
     // 自定义tabbar数据
     tabbar_purchaser: [
        {
          pagePath: "/pages/index/index",
          iconPath: "/static/images/tabbar/index_n.png",
          selectedIconPath: "/static/images/tabbar/index_a.png",
          text: "首页",
        },
        {
          pagePath: "/pages/contract/index",
          iconPath: "/static/images/tabbar/hetong_n.png",
          selectedIconPath: "/static/images/tabbar/hetong_a.png",
          text: "合同",
        },
        {
          pagePath: "/pages/order/index",
          iconPath: "/static/images/tabbar/order_n.png",
          selectedIconPath: "/static/images/tabbar/order_a.png",
          text: "订单",
        },
        {
          pagePath: "/pages/me/me",
          iconPath: "/static/images/tabbar/me_n.png",
          selectedIconPath: "/static/images/tabbar/me_a.png",
          text: "我的",
        },
      ],
      tabbar_supplier: [
        {
          pagePath: "/pages/contract/index",
          iconPath: "/static/images/tabbar/hetong_n.png",
          selectedIconPath: "/static/images/tabbar/hetong_a.png",
          text: "合同",
        },
        {
          pagePath: "/pages/order/index",
          iconPath: "/static/images/tabbar/order_n.png",
          selectedIconPath: "/static/images/tabbar/order_a.png",
          text: "订单",
        },
        {
          pagePath: "/pages/needMaterial/NeedMaterial",
          iconPath: "/static/images/tabbar/yaoliao_n.png",
          count: store.getters.vuex_needMaterialsNum,
          // isDot: true,
          selectedIconPath: "/static/images/tabbar/yaoliao_a.png",
          text: "需求",
        },
        {
          pagePath: "/pages/me/me",
          iconPath: "/static/images/tabbar/me_n.png",
          selectedIconPath: "/static/images/tabbar/me_a.png",
          text: "我的",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['vuex_needMaterialsNum']),
    tabbarIndex(){
      let index = 0 
      if (this.vuex_roleKey == 2) index = 3
      return index 
    }
  },
  watch:{
    vuex_needMaterialsNum:{
        handler(val){
            this.tabbar_supplier[2].count = val
        }
    }
  }
};
