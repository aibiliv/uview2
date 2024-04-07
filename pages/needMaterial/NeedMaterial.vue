<template>
  <view>
    <view class="container">
      <!-- 筛选栏 -->
      <!-- <u-sticky> -->
      <view class="top u-p-24 u-p-b-0">
        <view
          class="page-title u-flex u-row-between u-font-36"
          v-if="vuex_user"
        >
          <view class="u-font-bold">需求列表</view>
        </view>
        <view class="u-flex">
          <view class="u-flex-1 search-bar u-p-b-12">
            <u-search
              placeholder="根据商品/项目搜索"
              v-model="query.keyWords"
              :showAction="false"
              bgColor="#F5F5F5"
              :animation="false"
              @blur="searchPage1"
              @focus="focusSearch"
              @clear="searchPage1"
            ></u-search>
          </view>
          <u-icon
            name="calendar"
            :color="query.needMaterialsTime ? vuex_main_color : '#8c8c8c'"
            size="40"
            class="u-m-l-18"
            @click="showTimePicker = true"
          >
          </u-icon>
        </view>
        <u-tabs
          count="count"
          font-size="28"
          bar-height="4"
          gutter="24"
          height="50"
          sticky
          :list="tabs"
          :offset="[0, 15]"
          :active-color="vuex_main_color"
          :current="currentTab"
          @change="click"
        ></u-tabs>
      </view>
      <!-- </u-sticky> -->
      <d-refresh-load
        ref="dRefreshLoad"
        @loadMore="loadMore"
        @pullDownRefresh="pullDownRefresh"
        autoLoad
      >
        <view class="need-material-list u-p-24" v-if="list.length > 0">
          <NeedMaterialItem
            v-for="(item, index) in list"
            :key="index"
            :detail="item"
            :class="
              item.status.value === 2 || item.status.value === 3
                ? 'all-gray'
                : ''
            "
          >
            <template #title>
              <view>
                <!-- <view class="u-m-b-6">
                  <text class="self-tag u-m-r-6">合同 </text>
                  <text class="u-font-bold fs-28r">{{
                    item.contractNum ? "【" + item.contractNum + "】" : ""
                  }}</text>                
                </view> -->
                <!-- <view class="u-font-bold fs-26r">{{ item.contractName }}</view> -->
                <view class="u-font-bold fs-26r">{{ item.projectName }}</view>
              </view>
            </template>
            <template #status>
              <view style="width: max-content">
                <u-tag
                  v-if="item.status.value === 0"
                  text="待确认"
                  mode="light"
                  bg-color="rgba(242, 139, 0, 0.1)"
                  border-color="#fff"
                  color="#F28B00"
                  shape="square"
                />
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
                <!-- {{ item.status && item.status.desc }} -->
              </view>
            </template>
            <view class="product-name">
              {{
                item.productAttrValue
                  ? item.productTitle + "【" + item.productAttrValue + "】"
                  : item.productTitle
              }}
            </view>
            <view style="line-height: 2"
              ><span class="color-gray">请于</span>
              {{ $appUtils.timeFormatYYYYMMDD(item.needMaterialsTime,'yyyy年mm月dd日') }}
              <span class="color-gray">送货</span> {{ item.num
              }}{{ item.productUnit }} <span class="color-gray">至</span></view
            >
            <view style="line-height: 1.5">{{ item.address }}</view>
            <template #btns>
              <!-- 供应商拥有的按钮 -->
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
            </template>
          </NeedMaterialItem>
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
      <!-- <u-picker v-model="showTimePicker" mode="time" :params="params" @confirm="timePickConfirm"></u-picker> -->
      <u-calendar
        mode="date"
        safe-area-inset-bottom
        :active-bg-color="vuex_main_color"
        max-date="2050-12-31"
        range-bg-color="rgba(203, 74, 43, 0.1)"
        :range-color="vuex_main_color"
        v-model="showTimePicker"
        @change="changeTime"
        @reset="resetTime"
      ></u-calendar>
    </view>
    <u-tabbar :list="vuex_roleKey == 2 ? tabbar_supplier : tabbar_purchaser"></u-tabbar>
    <!-- <u-tabbar :list="vuex_roleKey == 2 ? vuex_tabbar_supplier : vuex_tabbar_purchaser"></u-tabbar> -->
  </view>
</template>

<script>
import { mapState } from "vuex";
import NeedMaterialItem from "./components/NeedMaterialItem.vue";
import tabbarMixin from "@/common/tabbar.mixin.js"
export default {
	mixins: [tabbarMixin],
  components: {
    NeedMaterialItem,
  },
  data() {
    return {
      showTimePicker: false,
      searchFocus: false,
      scrollTop: 0,
      params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
      query: {
        status: "",
        keyWords: "",
        needMaterialsTime: "",
      },
      page: 1,
      customStyle: {
        padding: "32rpx",
        height: "64rpx",
      },
      currentTab: 0,
      tabs: [
        {
          id: "",
          name: "全部",
        },
        {
          id: 0,
          name: "待确认",
          count:' '
        },
        {
          id: 1,
          name: "已确认",
        },
        {
          id: 2,
          name: "已取消",
        },
        {
          id: 3,
          name: "已失效",
        },
      ],
      list: [],
    };
  },
  computed: {
    // vuex_roleKey:1-采购商，2-供应商
    ...mapState(["vuex_roleKey"]),

    actionStyle() {
      return this.query.needMaterialsTime
        ? {
            color: this.vuex_main_color,
            fontSize: "12px",
            fontWeight: "bold",
          }
        : {
            color: "#8C8C8C",
            fontSize: "12px",
            fontWeight: "bold",
          };
    },
  },
  watch: {
    vuex_area: {
      handler(val) {
        this.searchPage1();
      },
    },
    showTimePicker: {
      handler(val) {
        console.log("val", val);
        if (!val) {
          // uni.showTabBar();
        }
      },
    },
  },
  async onShow() {
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onPullDownRefresh() {
    this.$nextTick(() => {
      this.$refs.dRefreshLoad.dOnPullDownRefresh();
    });
  },
  methods: {
    focusSearch() {
      this.searchFocus = true;
      this.page = 1;
      this.list = [];
    },
    searchPage1() {
      uni.pageScrollTo({
        scrollTop: 0,
      });
      
      this.$nextTick(() => {
        this.$refs.dRefreshLoad.dOnPullDownRefresh();
      });
      this.searchFocus = false;
    },
    // 获取需求列表
    async search() {
      try {
        this.getNeedMaterialNum()
        const queryData = Object.assign({}, this.query, {
          page: this.page,
          tenantId: this.vuex_user.tenantId,
        });
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
    async confirmNeedMaterial(item) {
      try {
        const res = await this.$u.api.needMaterialsConfirm({ id: item.id });
        console.log("res", res);
        if (res) {
        }
        this.$appUtils.toastOk('操作成功')
      } catch (error) {}
    },
    // 点击筛选
    custom(val) {
      this.showTimePicker = true;
      uni.hideTabBar();
    },
    timePickConfirm(e) {
      console.log('e',e);
				this.query.needMaterialsTime = e.year + '-' + e.month + '-' + e.day + " 23:59:59";
			},
    changeTime(e) {
      this.query.needMaterialsTime = e.result + " 23:59:59";
      this.showTimePicker = false;
      // uni.showTabBar();
      this.searchPage1();
    },
    resetTime() {
      this.query.needMaterialsTime = ''
      // uni.showTabBar();
      this.searchPage1();
    },
    // 点击tab
    click(val) {
      this.currentTab = val;
      this.query.status = this.tabs[val].id;
      this.searchPage1();
    },
    showSuccess() {
      this.$appUtils.toastOk('操作成功')
    },
    loadMore(pageNo) {
      this.page = pageNo;
      this.search();
    },
    pullDownRefresh(pageNo) {
      this.page = pageNo;
      this.search();
    },
    async confirm(item) {
      try {
        const res = await this.$u.api.needMaterialsConfirm({ id: item.id });
        this.showSuccess();
        this.list = [];
        this.searchPage1();
      } catch (error) {}
    },
  },
  onReachBottom() {
    this.$nextTick(() => {
      this.$refs.dRefreshLoad.dOnReachBottom();
    });
  },
};
</script>

<style lang="scss">
page {
  background-color: $page-bg-color;
}
</style>
<style lang="scss" scoped>
::v-deep.container {
  // background-color: $page-bg-color;
  .u-tab-item{
    .u-badge{
      font-size: 0 !important;
      width: 4px;
      height: 4px;
      padding: 4px
    }
  }
  .top {
    width: 100vw;
    background-color: #fff;
    position: fixed;
    top: 0;
    z-index: 2;

    .page-title {
      padding: 80rpx 180rpx 26rpx 26rpx;
      line-height: 46rpx;
    }
  }
  .need-material-list {
    margin-top: 340rpx;

    .need-material-item {
      border-bottom: 1px solid #ebebeb;
      .product-name {
        margin: 26rpx 0 6rpx;
        color: #2c68ff;
      }
    }
    .all-gray {
      // filter: grayscale(200%);
      color: $text-gray !important;
      .self-tag {
        background-color: $text-gray;
      }
      .product-name {
        color: $text-gray !important;
      }
      .status {
        color: $text-gray !important;
      }
    }
  }
  .self-tag {
    background-color: $main-color;
    padding: 1rpx 8rpx;
    color: #fff;
    border-radius: 4rpx;
  }
  .u-btn {
    margin-left: 16rpx;
  }
}
</style>
