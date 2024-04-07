import Vue from "vue";
import Vuex from "vuex";
import { mainColor } from "../uni.scss";
Vue.use(Vuex);

let lifeData = {};

try {
  // 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
  lifeData = uni.getStorageSync("lifeData");
} catch (e) {}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名,
let saveStateKeys = [
  "vuex_user",
  "vuex_tabbar",
  "vuex_tabbar_supplier",
  "vuex_token",
  "vuex_area",
  "vuex_messageNum",
  "vuex_roleKey",
  "vuex_isSetPayPwd",
];

// 保存变量到本地存储中
const saveLifeData = function (key, value) {
  // 判断变量名是否在需要存储的数组中
  if (saveStateKeys.indexOf(key) != -1) {
    // 获取本地存储的lifeData对象，将变量添加到对象中
    let tmp = uni.getStorageSync("lifeData");
    // 第一次打开APP，不存在lifeData变量，故放一个{}空对象
    tmp = tmp ? tmp : {};
    tmp[key] = value;
    // 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
    uni.setStorageSync("lifeData", tmp);
  }
};
const store = new Vuex.Store({
  state: {
    // 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
    // 加上vuex_前缀，是防止变量名冲突，也让人一目了然
    vuex_user: lifeData.vuex_user
      ? lifeData.vuex_user
      : {
          name: "明月",
        },
    vuex_token: lifeData.vuex_token ? lifeData.vuex_token : "",
    vuex_isSetPayPwd: lifeData.vuex_isSetPayPwd
      ? lifeData.vuex_isSetPayPwd
      : false, // 是否已经设置支付密码，用于支付前判断
    vuex_area: lifeData.vuex_area ? lifeData.vuex_area : "sc",
    vuex_messageNum: lifeData.vuex_messageNum ? lifeData.vuex_messageNum : 0,
    vuex_needMaterialsNum: lifeData.vuex_needMaterialsNum ? lifeData.vuex_needMaterialsNum : 0,
    vuex_roleKey: lifeData.vuex_roleKey ? lifeData.vuex_roleKey : 1,
    vuex_tabbarIndex: lifeData.vuex_roleKey ? lifeData.vuex_roleKey : 0,
    // 如果vuex_version无需保存到本地永久存储，无需lifeData.vuex_version方式
    vuex_version: "1.0.1",
    vuex_demo: "绛紫",
    vuex_userName: "", //！！！！！仅用于获取特定的测试账号，其他地方不要用这个，用vuex_user
    vuex_main_color: mainColor, //全局主题色
    // 自定义tabbar数据
    vuex_tabbar_purchaser: [
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
    vuex_tabbar_supplier: [
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
        count: lifeData.vuex_needMaterialsNum,
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
  },
  getters: {
    vuex_roleKey: (state) => state.vuex_roleKey,
    vuex_needMaterialsNum: (state) => state.vuex_needMaterialsNum,
  },
  mutations: {
    $uStore(state, payload) {
      // 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
      let nameArr = payload.name.split(".");
      let saveKey = "";
      let len = nameArr.length;
      if (len >= 2) {
        let obj = state[nameArr[0]];
        for (let i = 1; i < len - 1; i++) {
          obj = obj[nameArr[i]];
        }
        obj[nameArr[len - 1]] = payload.value;
        saveKey = nameArr[0];
      } else {
        // 单层级变量，在state就是一个普通变量的情况
        state[payload.name] = payload.value;
        saveKey = payload.name;
      }
      // 保存变量到本地，见顶部函数定义
      saveLifeData(saveKey, state[saveKey]);
    },
  },
  actions: {
    appLogin({ state, commit }) {
      return new Promise((resolve, reject) => {
        //判断用户有没有登录
        if (!state.vuex_token) {
          console.log("没有登录");
          uni.navigateTo({
            url: "/pages/user/login",
          });
        } else {
          console.log("已登录");
          resolve();
        }
      });
    },
  },
});

export default store;
