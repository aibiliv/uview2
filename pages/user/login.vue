<template>
  <view class="page-center u-m-l-48 u- u-m-r-48" style="position: relative">
    <view class="navbar" v-if="step == 2" @click="backToStep1"
      ><u-icon name="arrow-left"></u-icon
    ></view>
	<u-count-to :startVal="30" :endVal="500"></u-count-to>
    <view class="top-text-1 top-text">您好！</view>
    <view class="top-text u-flex">
      <view class="u-m-r-10">欢迎来到二叠纪电商</view>
      <view v-if="step == 2">
        <view class="cai-falg" v-if="vuex_roleKey == 1">采购</view>
        <view class="gong-flag" v-else>供应</view>
      </view>
    </view>
    <view class="content u-m-t-80">
      <!-- 参数 roleKey  在采购商登录就传 1  供应商传2 -->
      <view v-if="step == 1">
        <view class="select-role-item" @click="selectRole(1)">
          <image src="/static/images/login/bg-role1.jpg" class="bg" />
          <image src="/static/images/login/role1-icon.png" class="icon" />
          <view>采购商登录</view>
        </view>

        <view class="select-role-item u-m-t-32" @click="selectRole(2)">
          <image src="/static/images/login/bg-role2.jpg" class="bg" />
          <image src="/static/images/login/role2-icon.png" class="icon" />
          <view class="color-222">供应商登录</view>
        </view>

        <view class="u-flex u-m-t-20 color-595959 u-row-between"
          ><view @click="goIndex">游客模式</view></view
        >
		
      </view>
      <view v-show="step == 2">
        <u-form
          :model="loginForm"
          :rules="rules"
          ref="uForm"
          :errorType="errorType"
        >
          <u-form-item :border-bottom="false" prop="userName">
            <view class="login-cell-bg u-flex">
              <image
                src="/static/images/login/phone.png"
                class="left-icon"
              ></image>
              <u-input
                placeholder="请输入登录账号"
                class="u-p-l-20 u-m-r-44 u-flex-1"
                maxlength="32"
                placeholderStyle="color: #262C3A;"
                v-model="loginForm.userName"
                :custom-style="inputStyle"
                :height="99"
              ></u-input>
            </view>
          </u-form-item>

          <u-form-item :border-bottom="false" prop="password">
            <view class="login-cell-bg u-flex">
              <image
                src="/static/images/login/lock.png"
                class="left-icon"
              ></image>
              <u-input
                placeholder="请输入登录密码"
                placeholderStyle="color: #262C3A;"
                class="u-p-l-20 u-m-r-44 u-flex-1"
                v-model="loginForm.password"
                type="password"
                :passwordIcon="false"
                :custom-style="inputStyle"
                :height="99"
              ></u-input>
            </view>
          </u-form-item>
        </u-form>

        <view class="u-flex color-595959 u-font-24 u-m-t-24">
          <u-checkbox-group>
            <u-checkbox v-model="checked" shape="circle"></u-checkbox>
          </u-checkbox-group>
          <view>
            已阅读并同意签署
            <span style="color: #cb4a2b" @click="seeRegistAgreement"
              >《注册协议》</span
            >
            <!-- 和 <span @click="goPrivate" style="color: #CB4A2B ;">《平台服务协议》</span> -->
          </view>
        </view>
        <view class="u-m-t-38">
          <u-button
            @click="accountLogin"
            class="login-btn"
            type="primary"
            :disabled="!checked"
            shape="circle"
            >登&nbsp;录</u-button
          >
        </view>
        <view class="u-flex u-m-t-20 color-595959 u-row-between">
          <view @click="goIndex">游客模式</view>
          <!-- <view @click="forget">忘记密码</view> -->
        </view>
      </view>
    </view>

    <view class="footer" v-if="step == 2">
      <view class="color-8C8C8C u-font-24">其他方式</view>
      <view class="login-wechat u-m-t-32" @tap="wechatLogin">
        <!-- <u-icon name="weixin-fill" color="#2EA84F" size="50"></u-icon> -->
        <image
          style="width: 48rpx; height: 39rpx"
          src="/static/images/login/weichat.png"
        ></image>
        <!-- <button type="primary" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">获取微信手机号</button> -->
      </view>
    </view>

    <u-popup
      v-model="showSelectAccount"
      mode="bottom"
      width="660"
      :border-radius="8"
    >
      <view class="select-account-box">
        <view class="title">选择登录账号</view>

        <view
          class="item"
          v-for="(item, index) in usersList"
          :key="index"
          :class="index == accountSelected ? 'active' : ''"
          @click="selectAccount(index)"
        >
          <view class="u-font-24 color-8C8C8C">{{ item.loginAccount }}</view>
          <view class="color-595959 u-m-t-8">{{ item.userName }}</view>
        </view>

        <view class="u-flex u-font-36 u-m-t-50" style="width: 100%">
          <view class="btn" @click="showSelectAccount = false">取&nbsp;消</view>
          <view class="color-theme btn" @click="confirmLoginThisAccount"
            >确&nbsp;定</view
          >
        </view>
      </view>
    </u-popup>

    <u-popup v-model="showWechatPop" mode="bottom" :border-radius="0" closeable>
      <view class="u-p-36 wechat-login">
        <view v-if="wechatLoginStep == 1">
          <view class="u-flex">
            <image
              src="/static/images/logo.png"
              style="width: 32rpx; height: 24rpx"
            ></image>
            <view class="u-m-l-20 u-m-r-10 u-font-bold">二叠纪电商</view>
            <view>申请使用</view>
          </view>

          <view
            class="u-font-36 u-font-bold u-text-center"
            style="margin-top: 90rpx"
            >微信账号登录二叠纪电商小程序</view
          >

          <button @tap="getUserProfile">授权用户信息</button>
        </view>
        <view v-else-if="wechatLoginStep == 2">
          <view class="u-flex">
            <image
              src="/static/images/logo.png"
              style="width: 32rpx; height: 24rpx"
            ></image>
            <view class="u-m-l-20 u-m-r-10 u-font-bold">二叠纪电商</view>
            <view>申请使用</view>
          </view>

          <view
            class="u-font-36 u-font-bold u-text-center"
            style="margin-top: 90rpx"
            >您的手机号码</view
          >
          <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            微信一键授权
          </button>
        </view>
      </view>
    </u-popup>
    <u-popup
      v-model="showRegistPop"
      height="70%"
      width="90%"
      mode="center"
      :border-radius="20"
      closeable
    >
      <view class="u-p-50"
        ><u-parse
          :html="vuex_roleKey == 1 ? protocolText : supProtocolText"
        ></u-parse
      ></view>
    </u-popup>
    <Verify
      @success="success"
      :mode="'pop'"
      :captchaType="'blockPuzzle'"
      ref="verify"
      :imgSize="{ width: '310px', height: '155px' }"
      @onCaptchagGetOk="onCaptchagGetOk"
    ></Verify>
  </view>
</template>

<script>
import FKHMD5 from "@/common/fkhmd5.js";
import Verify from "@/components/verify/verify";
export default {
  data() {
    return {
      loginAction: 1,
      checked: true,
      wechatLoginStep: 1,
      showWechatPop: false,
      showRegistPop: false,
      step: 1,
	  show: false,
      showSelectAccount: false,
      supProtocolText: "",
      protocolText: "",
      loginForm: {
        userName: "",
        password: "",
        roleKey: "",
      },
      errorType: "toast",
      rules: {
        userName: [
          {
            required: true,
            message: "请输入帐号",
            trigger: "blur",
          },
          {
            min: 5,
            max: 20,
            message: "帐号长度在5到20个字符",
            trigger: ["change", "blur"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"],
          },
        ],
        authCode: [
          {
            required: true,
            message: "请输入验证码",
            trigger: ["change", "blur"],
          },
        ],
      },
      inputStyle: {
        fontSize: "28rpx",
      },
      code: "",
      captchaVO: {
        captchaVerification: "",
      },
      wechatLoginParams: {
        openId: "",
        sessionKey: "",
        userInfo: "",
        loginForm: "",
      },
      usersList: null, //多个账号数组
      accountSelected: 0, // 多账号时默认选中第一个
      uuid: null,
    };
  },
  components: {
    Verify,
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  onLoad() {
    this.getSystemConfig();
  },
  methods: {
    backToStep1() {
      this.loginForm = {
        userName: "",
        password: "",
        roleKey: "",
      };
      this.step = 1;
    },
    loginOk(ret) {
      this.$u.vuex("vuex_token", ret.accessToken);
      this.$u.vuex("vuex_area", ret.areaCode);
      this.$u.api
        .getUserInfo({
          isDesensitization: false,
        })
        .then((res) => {
          ///登录成功 记录当前用户
          console.log("----user info----", res);
          this.$u.vuex("vuex_user", res);
          if (this.vuex_roleKey == 1) {
            uni.reLaunch({
              url: "/pages/index/index",
            });
          } else {
            uni.reLaunch({
              url: "/pages/me/me",
            });
          }
        });
    },
    selectRole(type) {
		this.$store.commit('$uStore', {
				name:'vuex_roleKey',value: type
			})
			console.log('vuex_roleKey',this.$store.state.vuex_roleKey);
    //   this.$u.vuex("vuex_roleKey", type);
      this.step = 2;
    },
    showVerify() {
      // #ifdef H5 || MP-WEIXIN
      // uni.reLaunch({
      // 	url: '/pages/index/index'
      // });
      // return
      // #endif
      this.$nextTick(() => {
        this.$refs.verify.show();
      });
    },
    onCaptchagGetOk(res) {
      // console.log(JSON.stringify(res));
      // this.captchaVO = res
    },
    success(data) {
      this.$refs.verify.close();
      // console.log(JSON.stringify(data));
      // this.captchaVO.captchaType = "blockPuzzle"
      this.captchaVO.captchaVerification = data.captchaVerification;
      if (this.loginAction == 1) {
        this.login();
      } else {
        this.wechatLoginStep1();
      }
    },
    // 小程序获取手机号码
    getPhoneNumber(e) {
      console.log("-----------成功获取到手机号----------", e);
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        this.$u.api
          .bindPhone({
            encryptedData: encodeURIComponent(e.detail.encryptedData),
            iv: encodeURIComponent(e.detail.iv),
            openId: this.wechatLoginParams.openId,
            sessionKey: this.wechatLoginParams.sessionKey,
            userInfo: this.wechatLoginParams.userInfo,
            loginForm: this.wechatLoginParams.loginForm,
          })
          .then((ret) => {
            this.showWechatPop = false;
            // console.log(ret)
            this.loginOk(ret);
          });
      } else {
        this.showWechatPop = false;
        // this.$u.toast(e.detail.errMsg)
      }
    },
    //微信登录
    async getCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: "weixin",
          success: (res) => {
            console.log(JSON.stringify(res));
            this.code = res.code;
            return resolve(res.code);
          },
          fail: (err) => {
            uni.showToast({
              title: "微信登录授权失败",
              icon: "none",
            });
            return reject(null);
          },
        });
      });
    },
    //获取用户信息
    getUserProfile() {
      let that = this;
      this.code = this.getCode();
      uni.getUserProfile({
        lang: "zh_CN",
        desc: "微信登录", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(JSON.stringify(res));
          //向服务器发送登录请求
          this.wechatCodeLogin(this.code, res.userInfo);
        },
        fail: (err) => {
          // that.$u.toast(JSON.stringify(err))
        },
      });
    },
    getCaptcha() {
      // console.log('-------获取验证码------');
      this.$u.api.getCaptcha({}).then((res) => {
        // console.log('res====', typeof(res));
      });
    },
    loginErrorCheck(err, loginAgain) {
      if (err.code == "-99" && this.loginAction == 2) {
        //如果没有绑定手机
        this.wechatLoginParams.openId = err.data.openId;
        this.wechatLoginParams.sessionKey = err.data.sessionKey;
        this.wechatLoginStep2();
      } else if (
        err.code == "B.F-1" ||
        err.code == "B.F-2" ||
        err.code == "B.F-3"
      ) {
        this.showSelectAccount = false;
        let msg = "检测到您未登录过此系统，是否使用此账号登录此系统";
        let extend = "1";
        if (err.code == "B.F-2") {
          msg = err.message;
          extend = "2";
        } else if (err.code == "B.F-3") {
          msg = err.message;
          extend = "3";
        }
        uni.showModal({
          content: msg,
          showCancel: true,
          success: (res) => {
            if (res.confirm) {
              loginAgain(extend);
            }
          },
        });
      }
    },
    wechatCodeLogin(code, userInfo, extend) {
      if (!this.captchaVO.captchaVerification) {
        this.$u.toast("验证码校验失败");
        return;
      }
      //保存用户信息
      this.wechatLoginParams.userInfo = userInfo;
      let form = {
        code: code,
        loginForm: {
          username: userInfo && userInfo.loginAccount,
          code: code,
          roleKey: this.$store.state.vuex_roleKey,
        },
        uuid: this.uuid,
        captchaVO: this.captchaVO,
      };
      if (extend) {
        form.loginForm.extend = extend;
      }
      //保存绑定手机号需要的信息
      this.wechatLoginParams.loginForm = form.loginForm;
      this.$u.api
        .wxLogin2(form)
        .then((res) => {
          this.showWechatPop = false;
          // this.loginOk(res)
          // 如果usersList有多条，则需要用户选择要登录的账号
          if (res.usersList.length > 0) {
            this.accountSelected = 0;
            this.usersList = res.usersList;
            this.uuid = res.uuid;
            this.showSelectAccount = true;
          } else {
            this.loginOk(res.wxTokenVO);
          }
          //登录成功
        })
        .catch((err) => {
          this.showWechatPop = false;
          console.log("wechatCodeLogin", err);
          this.loginErrorCheck(err, (ext) => {
            this.wechatCodeLogin(code, userInfo, ext);
          });
        });
    },
    wechatLogin() {
      if (!this.checked) {
        uni.showToast({
          icon: "none",
          title: "请先勾选协议",
        });
        return;
      }
      this.loginAction = 2;
      this.showVerify();
    },
    wechatLoginStep1() {
      this.showWechatPop = true;
      this.wechatLoginStep = 1;
    },
    wechatLoginStep2() {
      this.showWechatPop = true;
      this.wechatLoginStep = 2;
    },
    accountLogin() {
      if (!this.loginForm.userName) {
        uni.showToast({ icon: "none", title: "请输入账号" });
        return;
      }
      if (!this.loginForm.password) {
        uni.showToast({ icon: "none", title: "请输入密码" });
        return;
      }
      this.$u.vuex("vuex_userName", this.loginForm.userName);
      this.loginAction = 1;
      this.showVerify();
    },

    login(extend, user) {
      if (!this.captchaVO.captchaVerification) {
        this.$u.toast("验证码校验失败");
        return;
      }
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          uni.showLoading();
          var safePwd = FKHMD5.md5(this.loginForm.password);
          let form = {
            loginForm: {
              username: (user && user.loginAccount) || this.loginForm.userName,
              password: safePwd,
              roleKey: this.$store.state.vuex_roleKey,
            },
            captchaVO: this.captchaVO,
          };
          if (extend) {
            form.loginForm.extend = extend;
          }
          this.$u.api
            .userLogin(form)
            .then((res) => {
              // this.usersList = null
              // // 如果usersList有多条，则需要用户选择要登录的账号
              // if(res.usersList.length > 0){
              // 	this.accountSelected = 0
              // 	this.usersList = res.usersList
              // 	this.uuid = res.uuid
              // 	this.showSelectAccount = true
              // }else {
              // this.loginOk(res.wxTokenVO)
              // }
              this.loginOk(res);
            })
            .catch((err) => {
              this.loginErrorCheck(err, (ext) => {
                this.login(ext);
              });
            })
            .finally(() => {
              uni.hideLoading();
            });
        } else {
          // console.log('验证失败');
        }
      });
    },
    //选择账号
    selectAccount(index) {
      this.accountSelected = index;
    },
    // 登录选中的账号
    async confirmLoginThisAccount() {
      try {
        const queryData = {
          loginForm: JSON.parse(JSON.stringify(this.loginForm)),
        };
        queryData.loginForm.roleKey = this.$store.state.vuex_roleKey;
        queryData.user = this.usersList[this.accountSelected];
        queryData.loginForm.password = FKHMD5.md5(queryData.loginForm.password);
        queryData.uuid = this.uuid;

        const res = await this.$u.api.loginWithUser(queryData);
        this.showSelectAccount = false;
        this.loginOk(res);
      } catch (err) {
        this.loginErrorCheck(err, async (ext) => {
          if (this.loginAction === 1) {
            this.login(ext, this.usersList[this.accountSelected]);
          } else if (this.loginAction === 2) {
            const queryData = {
              uuid: err.data,
              loginForm: {
                roleKey: this.$store.state.vuex_roleKey,
                username: this.usersList[this.accountSelected].loginAccount,
                extend: ext,
              },
            };
            const res2 = await this.$u.api.loginFirst(queryData);
            this.loginOk(res2);
          }
        });
      }
    },
    goIndex() {
      this.$u.vuex("vuex_token", "");
      this.$u.vuex("vuex_user", "");
      this.$u.vuex("vuex_messageNum", 0);
      this.$u.vuex("vuex_user_password", "");
      uni.clearStorage();
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
    forget() {
      this.$u.route("/pages/user/forget-password");
    },
    getSystemConfig() {
      this.$u.api.getSystemConfig().then((res) => {
        this.protocolText = res.protocolText;
        this.supProtocolText = res.supProtocolText;
      });
    },
    seeRegistAgreement() {
      this.showRegistPop = true;
    },
  },
};
</script>

<style lang="scss">
.navbar {
  position: fixed;
  top: 100rpx;
  left: 32rpx;
}
.select-role-item {
  width: 654rpx;
  height: 180rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 6rpx;
  }

  .icon {
    height: 84rpx;
    width: 84rpx;
    z-index: 100;
  }

  view {
    margin-left: 16rpx;
    font-size: 32rpx;
    color: #ffffff;
    font-weight: 500;
    z-index: 100;
  }
}

.login-wechat {
  width: 100rpx;
  height: 100rpx;
  background: rgba(46, 168, 79, 0.1);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  margin-bottom: 98rpx;
  bottom: 0rpx;
}

.content {
  background-color: white;
  // position: absolute;
  margin-top: 0rpx;
  width: 100%;
  // border-top-left-radius: 40rpx;
  // border-top-right-radius: 40rpx;
  z-index: 100;
}

.top-text-1 {
  margin-top: 220rpx !important;
  // margin-left: 48rpx !important;
  font-size: 48rpx !important;
}

.top-text {
  width: 100%;
  // position: absolute;
  margin-top: 40rpx;
  // margin-left: 48rpx;
  color: #222222;
  font-size: 48rpx;
  font-weight: bold;
}

.top-bg {
  width: 100%;
  height: 421rpx;
  position: absolute;
  top: 0;
}

.login-cell-bg {
  width: 660rpx;
  // width: 100%;
  // margin-left: 44rpx;
  // margin-right: 44rpx;
  height: 99rpx;
  // background-color: #f4f5f7;
  // border: solid #333 1rpx;
  // box-shadow: 0rpx 0rpx 27rpx 0rpx rgba(0, 0, 0, 0.19);
  align-items: center;
  border-radius: 10rpx;
  border-bottom: #ebebeb solid 1rpx;
}

.login-btn {
  // 	color: white;
  width: 100%;
  height: 99rpx;
  // 	font-size: 30rpx;
  // 	border-radius: 10rpx;
  // 	background-color: $u-type-primary;
  font-size: 36rpx;
}

.left-icon {
  width: 40rpx;
  height: 40rpx;
}

.select-account-box {
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    padding: 48rpx 48rpx 18rpx 48rpx;
    font-size: 36rpx;
    font-weight: 500;
    color: #222222;
  }

  .item {
    margin-bottom: 10rpx;
    width: 534rpx;
    min-height: 56px;
    background: #f5f5f5;
    border-radius: 8rpx;
    border: 1rpx solid #d9d9d9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 16rpx 32rpx;
  }

  .active {
    background: rgba(203, 74, 43, 0.1) !important;
    border: 1px solid #cb4a2b !important;
  }

  .btn {
    padding: 22rpx 0;
    flex: 1;
    text-align: center;
  }
}

.wechat-login {
  button {
    margin-top: 80rpx;
    margin-bottom: 40rpx;
    color: #ffffff;
    background-color: #58be6c;
  }
}

.cai-falg {
  width: 80rpx;
  height: 48rpx;
  background: #cb4a2b;
  border-radius: 8rpx;
  color: #ffffff;
  font-size: 28rpx;
  line-height: 48rpx;
  text-align: center;
}

.gong-flag {
  width: 80rpx;
  height: 48rpx;
  background: linear-gradient(225deg, #68645c 0%, #222222 100%);
  border-radius: 8rpx;
  color: #ffffff;
  font-size: 28rpx;
  line-height: 48rpx;
  text-align: center;
}
</style>
