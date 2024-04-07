<template>
  <view class="container">
    <!-- 筛选栏 -->
    <!-- <u-sticky> -->
    <view class="header">
      <view class="u-p-20 top">
        <view class="date" @click="showTimePicker = true">
          <FkhIcon name="riqi" color="#BFBFBF" class="u-m-r-12"></FkhIcon>
          <text
            :style="{ color: query.needMaterialsTime ? '#222' : '#BFBFBF' }"
            >{{ query.needMaterialsTime || "选择需求日期" }}</text
          >
        </view>
      </view>
      <view class="u-p-b-10 top">
        <u-tabs
          count="count"
          font-size="28"
          bar-height="4"
          gutter="24"
          height="50"
          :list="tabs"
          :offset="[0, 15]"
          :active-color="mainColor"
          :current="currentTab"
          @change="click"
        ></u-tabs>
      </view>
      <u-line color="#d9d9d9" />
    </view>
    <!-- </u-sticky> -->
    <!-- 运单列表 -->
    <d-refresh-load
      ref="dRefreshLoad"
      @loadMore="loadMore"
      @pullDownRefresh="pullDownRefresh"
      autoLoad
    >
      <view class="record-list">
        <view
          class="need-material-record-item u-flex u-row-between u-p-l-32 u-p-r-32 u-p-b-0 u-m-b-16"
          v-for="(item, index) in list"
          :key="index"
        >
          <view class="left u-flex-col u-font-xs">
            <view class="title u-font-bold u-font-28"
              >{{
                $appUtils.timeFormatYYYYMMDD(
                  item.needMaterialsTime,
                  "yyyy年mm月dd日"
                )
              }}需求{{ item.num }}{{ item.productUnit }}</view
            >
            <view class="time">发起时间：{{ item.createTime }}</view>
          </view>
          <view class="right">
            <view v-if="item.status && item.status.value === 0">
              <u-button
                :custom-style="customStyle"
                size="medium"
                shape="circle"
                type="primary"
                @click="confirm(item)"
              >
                确认
              </u-button>
            </view>
            <view v-else-if="item.status && item.status.value !== 0">
              <u-tag
                v-if="item.status.value === 1"
                text="已确认"
                mode="light"
                bg-color="#2ea84f4d"
                border-color="#fff"
                color="#2EA84F"
                shape="square"
              />
              <u-tag
                text="已取消"
                v-if="item.status.value === 2"
                mode="light"
                bg-color="#ccc"
                border-color="#fff"
                color="#595959"
                shape="square"
              />
              <u-tag
                text="已失效"
                v-if="item.status.value === 3"
                mode="light"
                bg-color="#ccc "
                border-color="#fff"
                color="#595959"
                shape="square"
              />
            </view>
          </view>
        </view>
      </view>
    </d-refresh-load>
    <u-empty
        marginTop="260"
        v-if="list.length === 0 && !searchFocus"
        mode="order"
        text="暂无数据"
      ></u-empty>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
    <!-- 筛选弹出层 -->
    <u-calendar
      mode="date"
      safe-area-inset-bottom
      max-date="2050-12-31"
      :active-bg-color="vuex_main_color"
      range-bg-color="rgba(203, 74, 43, 0.1)"
      :range-color="vuex_main_color"
      v-model="showTimePicker"
      @change="changeTime"
      @reset="resetTime"
    ></u-calendar>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      currentTab: 0,
      searchFocus: false,
      scrollTop: 0,
      waybillSn: "",
      id: "",
      type: "1",
      page: 1,
      showTimePicker: false,
      query: {
        status: "",
        queryString: "",
        needMaterialsTime: "",
      },
      tabs: [
        { value: "", name: "全部" },
        { value: 0, name: "待确认", count:' ' },
        { value: 1, name: "已确认" },
        { value: 2, name: "已取消" },
        { value: 3, name: "已失效" },
      ],
      customStyle: {
        padding: "32rpx",
        height: "64rpx",
      },
      list: [],
    };
  },
  computed: {
    // vuex_roleKey:1-采购商，2-供应商
    ...mapState(["vuex_roleKey"]),
    mainColor() {
      return this.$store.state.vuex_main_color;
    },
  },
  async onLoad(params) {
    this.id = params.id;
    this.search();
  },
  methods: {
    focusSearch() {
      this.searchFocus = true;
      this.page = 1;
      this.list = [];
    },
    searchPage() {
      uni.pageScrollTo({
        scrollTop: 0,
      });
      this.$nextTick(() => {
        this.$refs.dRefreshLoad.dOnPullDownRefresh();
      });
      this.searchFocus = false;
    },
    async search() {
      try {
        this.getNeedMaterialNum()
        const queryData = Object.assign({}, this.query, {
          page: this.page,
          supplierOrderId: this.id,
          tenantId: this.vuex_user.tenantId,
        });
        queryData.needMaterialsTime = queryData.needMaterialsTime
          ? queryData.needMaterialsTime + " 23:59:59"
          : "";
        const res = await this.$u.api.needMaterialsOrdersPage(queryData);
        if (this.page === 1) this.list = [];
        this.list = this.list.concat(res.records);
        this.$refs.dRefreshLoad.endSuccess(
          res.records ? res.records.length : 0
        );
      } catch (error) {}
    },
    //获取待确认需求数量
    async getNeedMaterialNum(){
      const res = await this.$u.api.needMaterialsOrdersPage({
        status: 0,
        limit: 1,
        tenantId: this.vuex_user.tenantId,
      })	
      this.tabs[1].count = res.records.length
    },
    changeTime(e) {
      this.query.needMaterialsTime = e.result;
      this.showTimePicker = false;
      this.searchPage();
    },
    resetTime() {
      this.query.needMaterialsTime = "";
      this.searchPage();
    },
    async confirm(item) {
      try {
        const res = await this.$u.api.needMaterialsConfirm({ id: item.id });
        const currentIndex = this.list.findIndex((i) => i.id === item.id);
        this["list"][currentIndex]["status"] = { value: 1, desc: "已确认" };
        this.searchPage();
        this.$appUtils.toastOk('操作成功')
      } catch (error) {}
    },
    click(val) {
      this.currentTab = val;
      this.query.status = this.tabs[val].value;
      this.searchPage();
    },
    pullDownRefresh(pageNo) {
      this.page = pageNo;
      this.search();
    },
    loadMore(pageNo) {
      this.page = pageNo;
      this.search();
    },
  },

  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },

  onPullDownRefresh() {
    this.$nextTick(() => {
      this.$refs.dRefreshLoad.dOnPullDownRefresh();
    });
  },
  onReachBottom() {
    this.$nextTick(() => {
      this.$refs.dRefreshLoad.dOnReachBottom();
    });
  },
};
</script>

<style lang="scss" scoped>
::v-deep.container {
  background-color: $page-bg-color;
  min-height: 100vh;
  .u-tab-item{
    .u-badge{
      font-size: 0 !important;
      width: 4px;
      height: 4px;
      padding: 4px
    }
  }
  .header {
    background-color: #fff;
    width: 100vw;
    position: fixed;
    z-index: 970;
    // top: 0;
    .date {
      padding: 16rpx 24rpx;
      background-color: $page-bg-color;
      border-radius: 100rpx;
    }
  }
  .top {
    background-color: #fff;
  }
  .record-list {
    padding: 200rpx 20rpx 0;
    // background-color: $page-bg-color;
    .need-material-record-item {
      height: 150rpx;
      background-color: #fff;
      border-radius: 8rpx;
      .left {
        justify-content: space-evenly;
        height: 100%;
      }
    }
  }
}
</style>
