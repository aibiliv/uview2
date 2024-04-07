import store from "@/store"
import Vue from 'vue'
const bus = new Vue()


function loginAndGoto(path) {
	if (getToken()) {
		if (path && path != '') {
			uni.navigateTo({
				url: path
			});
		}
		return
	}
	if (path && path != '') {
		uni.navigateTo({
			url: '/pages/user/login?targetUrl=' + path
		});
	} else {
		uni.navigateTo({
			url: "/pages/user/login"
		});
	}
}

function getPrevPage() {
	let pages = getCurrentPages(); //获取所有页面栈实例列表
	let nowPage = pages[pages.length - 1]; //当前页页面实例
	let prevPage = pages[pages.length - 2]; //上一页页面实例
	return prevPage
}

function formatePhone(phone) {
	if (phone && phone.length != 11) {
		return phone
	}
	if (phone && uni.$u.test.mobile(phone)) {
		return phone.substring(0, 3) + '****' + phone.substring(phone.length - 4, phone.length)
	}
}

function formateIdNo(idNo) {
	if (idNo) {
		return idNo.substring(0, 6) + '*********' + idNo.substring(idNo.length - 4, idNo.length)
	}
}

function getToken() {
	let vuex_token = store.state.vuex_token;
	if (!vuex_token) {
		vuex_token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW1fYXBwX2lkIjoxMTIsInVzZXJfbmFtZSI6InpoYW5neWFvMDYiLCJzY29wZSI6WyJhbGwiXSwicm9sZXMiOlt7ImlkIjozNTAsInJvbGVOYW1lIjoi6YeH6LSt5ZWG5YaF572u6KeS6ImyIiwiYXBwS2V5IjoiZmtoX21hbGwiLCJyb2xlS2V5IjoiUFVSQ0hBU0UifV0sImNsaWVudF90eXBlIjoie1widmFsdWVcIjozLFwiZGVzY1wiOlwi5aSa56ef5oi35a2Q5bqU55SoLeS4muWKoeezu-e7n1wifSIsImV4cCI6MTY1ODQ1Mzg1OCwidGVuYW50X2FwcF9pZCI6LTk5OTksInVzZXIiOiJ7XCJ0eXBlXCI6XCJhdXRob3JpemF0aW9uVXNlclwiLFwiaWRcIjo4MDE1LFwidXNlcm5hbWVcIjpcInpoYW5neWFvMDZcIixcIm1vYmlsZVwiOlwiMTg3OTM5MTU0MjNcIixcInVzZXJUeXBlXCI6e1widmFsdWVcIjozLFwiZGVzY1wiOlwi5bmz5Y-w55So5oi3Lei0p-S4u1wifSxcImVudGVycHJpc2VUeXBlXCI6MSxcInRlbmFudElkXCI6ODAxNSxcInRlbmFudEFwcElkXCI6LTk5OTksXCJzeXN0ZW1BcHBJZFwiOjExMixcInJvbGVzXCI6W3tcImlkXCI6MzUwLFwicm9sZU5hbWVcIjpcIumHh-i0reWVhuWGhee9ruinkuiJslwiLFwiYXBwS2V5XCI6XCJma2hfbWFsbFwiLFwicm9sZUtleVwiOlwiUFVSQ0hBU0VcIn1dLFwiY29tcGFueUlkXCI6MTE1LFwiZXh0ZW5kXCI6e319IiwiYXV0aG9yaXRpZXMiOlsi6YeH6LSt5ZWG5YaF572u6KeS6ImyIl0sImp0aSI6ImY4OE9pd0huY2tsSEpUYWRPcjlLVFBIenQ5cyIsImNsaWVudF9pZCI6ImZraF9tYWxsIn0.Gw6-PaYu-grIDAAz2yaycorr81xedXtk_kYUU9zi_as'
	}
	return vuex_token;
}

function lunchLogin() {
	if (!getToken()) {
		uni.navigateTo({
			url: "/pages/user/login"
		});
	}
}

//收发货计划 ，对客商来说是相反的描述
function convertPlanType(value) {
	// if (value) {
	// 	if (value.indexOf('发货') != -1) {
	// 		return value.replace("发货",
	// 			"收货")
	// 	} else if (value.indexOf('收货') != -1) {
	// 		return value.replace("收货",
	// 			"发货")
	// 	}
	// }
	return value
}

function reLaunchLogin() {
	uni.reLaunch({
		url: '/pages/user/login'
	});
}

function loginOut() {
	uni.clearStorage();
	uni.$u.vuex('vuex_user', null);
	uni.$u.vuex('vuex_token', '');
}

function getPlatform() {
	return uni.getSystemInfoSync().platform;
}

function put(k, v) {
	uni.setStorageSync(k, v)
}

function get(k) {
	return uni.getStorageSync(k)
}

function toastOk(message) {
	uni.showToast({
		title: '操作成功',
		// icon: 'success',
		image: '/static/images/ok_icon.png'
	})
}

function navigateBackDelay(delay, delta) {
	setTimeout(() => {
		uni.navigateBack({ delta })
	}, delay)
}

function alert(message, okCallback) {
	uni.showModal({
		content: message,
		title: '提示',
		showCancel: false,
		success: (res) => {
			if (res.confirm) {
				okCallback()
			}
		}
	})
}
// 添加千分号 num 数值(Number或者String)  cent 要保留的小数位  isThousand 是否需要千分位 0:不需要,1:需要
const formatNum = (num, cent, isThousand) => {
  let sign = ''
  if (num == null || num == undefined || num == 'undefined' || num == '') {
    num = 0
  }
  if (cent == undefined || cent == 'undefined' || cent == '') {
    cent = 2
  }
  if (isThousand == undefined || isThousand == 'undefined' || isThousand== '') {
    isThousand = 1
  }
  num = num.toString().replace(/\$|\,/g, '')
  // 检查传入数值为数值类型
  if (isNaN(num)) {
    num = '0'
  }
  // 获取符号(正/负数)
  sign = num == (num = Math.abs(num))

  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001) // 把指定的小数位先转换成整数.多余的小数位四舍五入
  let cents = num % Math.pow(10, cent) // 求出小数位数值
  num = Math.floor(num / Math.pow(10, cent)).toString() // 求出整数位数值
  cents = cents.toString() // 把小数位转换成字符串,以便求小数位长度

  // 补足小数位到指定的位数
  while (cents.length < cent) {
    cents = '0' + cents
  }

  if (isThousand) {
    // 对整数部分进行千分位格式化.
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3))
    }
  }

  if (cent > 0) return (sign ? '' : '-') + num + '.' + cents
  else return (sign ? '' : '-') + num
}
const moneyFormatter = (money) => {
	return formatNum(money, 2, 1)
}

const numFormatter = (numStr) => {
	return formatNum(numStr, 3, 1)
}


function getPic(prefixUrl, imageUrl) {
	return prefixUrl + imageUrl
}

function timeFormatYYYYMMDD(dateTime, fmt = 'yyyy-mm-dd') {
	// if (dateTime && dateTime.indexOf(":" != -1)) {
	// 	return dateTime.substring(0, dateTime.length - ' 00:00:00'.length)
	// }
	if (fmt == 'yyyy-mm-dd') {
		return dateTime
	} else if (fmt == 'yyyy年mm月dd日') {
		return (dateTime.split(' ')[0].replace("-", "年").replace("-", "月")) + '日'
	}
	return dateTime;
}
module.exports = {
	lunchLogin: lunchLogin,
	reLaunchLogin: reLaunchLogin,
	loginAndGoto: loginAndGoto,
	getToken: getToken,
	loginOut: loginOut,
	getPlatform: getPlatform,
	getPrevPage: getPrevPage,
	formatePhone: formatePhone,
	formateIdNo: formateIdNo,
	toastOk: toastOk,
	convertPlanType: convertPlanType,
	navigateBackDelay: navigateBackDelay,
	alert: alert,
	moneyFormatter,
	numFormatter,
	getPic: getPic,
	bus,
	timeFormatYYYYMMDD
}
