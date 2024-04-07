

// #ifdef MP-WEIXIN
let baseUrl;
const envVersion = __wxConfig.envVersion
console.log('envVersion',envVersion)
//envVersion: 'develop',    //开发版
//envVersion: 'trial',          //体验版
//envVersion: 'release',     //正式版

if(envVersion == 'release'){
	// 正式版
  baseUrl = 'https://www.edj-sc.com/mall-wxmini-api'
}else if(envVersion == 'trial'){
	// 体验版
  baseUrl = 'https://staging.fkhwl.com/mall-wxmini'
}else {
	// 开发版
	// baseUrl = "http://192.168.8.130:18126"
	// baseUrl = "http://192.168.8.127:18126"
	// baseUrl = "http://192.168.8.137:18126"
	// baseUrl = 'http://192.168.8.126:18126'
	baseUrl = 'https://staging.fkhwl.com/mall-wxmini'
}
export default {
	baseUrl
}
// #endif

// #ifdef APP-PLUS || H5
let baseUrl;
if (process.env.NODE_ENV === 'development') {
	// baseUrl = "http://192.168.8.130:18126"
	// baseUrl = "http://192.168.8.127:18126"
	// baseUrl = "http://192.168.8.137:18126"
	// baseUrl = 'http://192.168.8.126:18126'
	// baseUrl = 'https://staging.fkhwl.com/mall-wxmini'
	baseUrl = 'https://www.edj-sc.com/mall-wxmini-api'
} else {
	// 生产环境
	baseUrl = 'https://www.edj-sc.com/mall-wxmini-api'
}
export default {
	baseUrl
}
// #endif
