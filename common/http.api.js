// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
let userLoginUrl = '/v1.0.0/mall/login';
let wxLoginUrl = '/v1.0.0/mall/wxLogin';
let loginOutUrl = '/v1.0.0/mall/logout'
let getUserInfoUrl = '/auth/v1.0.0/mySelf/getUser'
let getWalletByUserUrl = '/auth/v1.0.0/mySelf/getWalletByUser'
let getHomeProductListUrl = '/v1.0.0/home/getProductList'
let productDetailUrl = '/v1.0.0/home'
let getHotlineUrl = '/v1.0.0/home/getHotline'
let getAreaListUrl = '/v1.0.0/home/getAreaList'
let getHomeContractUrl = '/auth/v1.0.0/users/getContract'
let invoiceDetailUrl = '/auth/v1.0.0/mySelf/invoiceDetail'
let invoicePageUrl = '/auth/v1.0.0/mySelf/invoicePage'
let userAddressPageUrl = '/auth/v1.0.0/userAddress/selectPage'
let userAddressUrl = '/auth/v1.0.0/userAddress'
let getUserAddressByIdUrl = '/auth/v1.0.0/userAddress/getUserAddressById'
let userAddressStatusUrl = '/auth/v1.0.0/userAddress/status'
let updateContactUrl = '/auth/v1.0.0/users/updateContact'
let updatePasswordUrl = '/auth/v1.0.0/users/updatePassword'
let bindPhoneUrl = '/v1.0.0/mall/bindPhone'
let selectPayPasswordUrl = '/auth/v1.0.0/users/selectPayPassword'
let savePayPasswordUrl = '/auth/v1.0.0/users/savePayPassword'
let updatePayPasswordUrl = '/auth/v1.0.0/users/updatePayPassword'
let addPayPasswordGetCodeUrl = '/auth/v1.0.0/users/mobileCode1'
let addPasswordGetCodeUrl = '/auth/v1.0.0/users/mobileCode2'
let systemConfigurl = '/v1.0.0/mall/config/getSystemConfig'

let offLineAccountUrl = '/auth/v1.0.0/mySelf/offLineAccount'
let messageListUrl = '/auth/v1.0.0/users/page'
let messageReadAllUrl = '/auth/v1.0.0/users/readAll'
let messageSignReadUrl = '/auth/v1.0.0/users/signReaded'
let messageDeleteUrl = '/auth/v1.0.0/users'
let getMobileNumFUrl = '/auth/v1.0.0/users/getMobileNumF'
let verifyPasswordUrl = '/auth/v1.0.0/users/verifyPassword'
let resetPasswordUrl = '/auth/v1.0.0/users/resetPassword'



// -------合同开始--------
let contractListUrl = '/auth/v1.0.0/contract/page'
let contractDetailUrl = '/auth/v1.0.0/contract/detail'
let remainingAmountUrl = '/auth/v1.0.0/contract/project/remainingAmount'
let getAddressByProductsUrl = '/auth/v1.0.0/contract/getAddressByProducts'
let contractCreateUrl = '/auth/v1.0.0/contract/create'
let contractTokenUrl = '/auth/v1.0.0/contract/prepare'
let contractPayUrl = '/auth/v1.0.0/contract/pay'
// ----------合同结束---------

// -------订单开始--------
// 采购商订单
let orderListUrl = '/auth/v1.0.0/buyerOrders/page'
let buyerOrdersDetailUrl = '/auth/v1.0.0/buyerOrders'
let lastTransportWayUrl = '/auth/v1.0.0/buyerOrders/waybill/lastTransportWay'
let changeOrderNumUrl = '/auth/v1.0.0/buyerOrders/changeOrderNum'
let orderRepayUrl = '/auth/v1.0.0/buyerOrders/rePay'
let orderRepayInfoUrl = '/auth/v1.0.0/buyerOrders/rePayInfo'
let waybillListUrl = '/auth/v1.0.0/buyerOrders/waybill/list'
let buyerOrderCancelUrl = '/auth/v1.0.0/buyerOrders/cancel'


// 供应商订单
let supplierOrderListUrl = '/auth/v1.0.0/supplierOrders/table/page'
let supplierOrdersDetailUrl = '/auth/v1.0.0/supplierOrders'
let supplierLastTransportWayUrl = '/auth/v1.0.0/supplierOrders/waybill/lastTransportWay'
let supplierDeliveryGoodsUrl = '/auth/v1.0.0/supplierOrders/deliveryGoods'
let supplierOrderAuditUrl = '/auth/v1.0.0/supplierOrders/audit'
let supplierOrderWaybillListUrl = '/auth/v1.0.0/supplierOrders/waybill/page'
let supplierAuditUrl = '/auth/v1.0.0/mySelf/supplierAudit'
// ----------订单结束---------

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处没有使用传入的params参数
	let userLogin = (params = {}) => vm.$u.http.post(userLoginUrl, params);
	let userLogin2 = (params = {}) => vm.$u.http.post('/v1.0.0/mall/login2', params);
	// 微信登录
	let wxLogin = (params = {}) => vm.$u.http.post(wxLoginUrl, params);
	let wxLogin2 = (params = {}) => vm.$u.http.post('/v1.0.0/mall/wxLogin2', params);
	// 手机号下有多账号时选中某个账号登录
	let loginWithUser = (params = {}) => vm.$u.http.post('/v1.0.0/mall/loginWithUser', params);
	// 多账号时某个账号首次登录此系统
	let loginFirst = (params = {}) => vm.$u.http.post('/v1.0.0/mall/loginFirst', params);

	//登出
	let userLogout = (params = {}) => vm.$u.http.get(userLogoutUrl, params);
	//获取用户信息
	let getUserInfo = (params = {}) => vm.$u.http.get(getUserInfoUrl, params);
	//获取用户钱包信息
	let getWalletByUser = (params = {}) => vm.$u.http.get(getWalletByUserUrl, params);
	//获取在线账户余额
	let ciccAccountListTotalBalance = (params = {}) => vm.$u.http.get('/auth/v1.0.0/mySelf/getTotalBalance', params);
	//登出
	let loginOut = (params = {}) => vm.$u.http.get(loginOutUrl, params);
	//首页商品列表
	let getHomeProductList = (params = {}) => vm.$u.http.get(getHomeProductListUrl, params);
	//商品详情
	let productDetail = (params = {}) => vm.$u.http.get(productDetailUrl, params);
	//获取客服热线
	let getHotline = (params = {}) => vm.$u.http.get(getHotlineUrl, params);
	//首页区域列表
	let getAreaList = (params = {}) => vm.$u.http.get(getAreaListUrl, params);
	//首页合同
	let getHomeContract = (params = {}) => vm.$u.http.get(getHomeContractUrl, params);
	//发票详情
	let invoiceDetail = (params = {}) => vm.$u.http.get(invoiceDetailUrl, params);
	//发票列表
	let invoicePage = (params = {}) => vm.$u.http.get(invoicePageUrl, params);
	//用户地址列表
	let userAddressPage = (params = {}) => vm.$u.http.get(userAddressPageUrl, params);
	//用户地址新增
	let userAddressAdd = (params = {}) => vm.$u.http.post(userAddressUrl, params);
	//用户地址编辑
	let userAddressUpdate = (params = {}) => vm.$u.http.put(userAddressUrl, params);
	//用户地址删除
	let userAddressDelete = (id, params = {}) => vm.$u.http.delete(userAddressUrl + "?id=" + id, params);
	//用户地址详情
	let getUserAddressById = (params = {}) => vm.$u.http.delete(getUserAddressByIdUrl, params);
	//用户地址设置默认地址
	let userAddressStatus = (id, params = {}) => vm.$u.http.put(userAddressStatusUrl + "?id=" + id, params);
	//用户设置联系人
	let updateContact = (params = {}) => vm.$u.http.post(updateContactUrl, params);
	//用户设置联系人
	let updatePassword = (params = {}) => vm.$u.http.post(updatePasswordUrl, params);
	//微信登录绑定手机号
	let bindPhone = (params = {}) => vm.$u.http.post(bindPhoneUrl, params);
	//是否有支付密码
	let selectPayPassword = (params = {}) => vm.$u.http.get(selectPayPasswordUrl, params);
	//新增支付密码
	let savePayPassword = (params = {}) => vm.$u.http.post(savePayPasswordUrl, params);
	//修改支付密码
	let updatePayPassword = (params = {}) => vm.$u.http.post(updatePayPasswordUrl, params);
	//新增支付密码-获取验证码
	let addPayPasswordGetCode = (params = {}) => vm.$u.http.post(addPayPasswordGetCodeUrl, params);
	//新增支付密码-获取验证码
	let addPasswordGetCode = (params = {}) => vm.$u.http.post(addPasswordGetCodeUrl, params);
	//离线账户
	let offLineAccount = (params = {}) => vm.$u.http.get(offLineAccountUrl, params);
	//消息列表
	let messageList = (params = {}) => vm.$u.http.get(messageListUrl, params);
	//全部已读
	let messageReadAll = (params = {}) => vm.$u.http.get(messageReadAllUrl, params);
	//消息以读
	let messageSignRead = (params = {}) => vm.$u.http.get(messageSignReadUrl, params);
	//消息以读
	let messageDelete = (id, params = {}) => vm.$u.http.delete(messageDeleteUrl + "?id=" + id, params);
	//查询手机号是否已注册
	let getMobileNumF = (params = {}) => vm.$u.http.get(getMobileNumFUrl, params);
	//忘记密码(先验证)
	let verifyPassword = (params = {}) => vm.$u.http.post(verifyPasswordUrl, params);
	//忘记密码（重置）
	let resetPassword = (params = {}) => vm.$u.http.post(resetPasswordUrl, params);
	//系统配置
	let getSystemConfig = (params = {}) => vm.$u.http.get(systemConfigurl, params);
	





	//合同--获取合同列表
	let getContractList = (params = {}) => vm.$u.http.get(contractListUrl, params);
	//合同--获取合同详情
	let getContractDetail = (params = {}) => vm.$u.http.get(contractDetailUrl, params);
	//合同--返回项目未分配余额
	let getRemainingAmount = (params = {}) => vm.$u.http.get(remainingAmountUrl, params);
	//合同--获取用户地址集合(支付页面-包含是否可选)
	let getAddressByProducts = (params = []) => vm.$u.http.post(getAddressByProductsUrl, params);
	//合同--生成计划
	let contractCreate = (params = []) => vm.$u.http.post(contractCreateUrl, params);
	//合同--计划令牌--防止重复提交
	let getContractToken = (params = []) => vm.$u.http.get(contractTokenUrl, params);
	//合同--计划支付
	let contractPay = (params = []) => vm.$u.http.post(contractPayUrl, params);


	//采购商订单--获取订单列表
	let getOrderList = (params = {}) => vm.$u.http.get(orderListUrl, params);
	//采购商订单--获取订单详情
	let getBuyerOrdersDetail = (params = {}) => vm.$u.http.get(buyerOrdersDetailUrl, params);
	//采购商订单--订单所有在途车辆定位
	let lastTransportWay = (params = {}) => vm.$u.http.get(lastTransportWayUrl, params);
	//采购商订单--调整订单数量
	let changeOrderNum = (params = {}) => vm.$u.http.post(changeOrderNumUrl, params);
	//采购商订单--补款
	let orderRepay = (params = {}) => vm.$u.http.post(orderRepayUrl, params);
	//采购商订单--获取补款支付信息
	let orderRepayInfo = (params = {}) => vm.$u.http.get(orderRepayInfoUrl, params);
	//采购商订单--运单分页
	let waybillList = (params = {}) => vm.$u.http.get(waybillListUrl, params);
	//采购商订单--取消订单
	let buyerOrderCancel = (params = {}) => vm.$u.http.get(buyerOrderCancelUrl, params);
	


	//供应商订单--获取订单列表
	let getSupplierOrderList = (params = {}) => vm.$u.http.get(supplierOrderListUrl, params);
	//供应商订单--获取订单详情
	let getSupplierBuyerOrdersDetail = (params = {}) => vm.$u.http.get(supplierOrdersDetailUrl, params);
	//供应商订单--订单所有在途车辆定位
	let supplierLastTransportWay = (params = {}) => vm.$u.http.get(supplierLastTransportWayUrl, params);
	//供应商订单--供应商发货
	let supplierDeliveryGoods = (params = {}) => vm.$u.http.get(supplierDeliveryGoodsUrl, params);
	//供应商订单--供应商审核
	let supplierOrderAudit = (params = {}) => vm.$u.http.put(`${supplierOrderAuditUrl}?id=${params.id}&auditResult=${params.auditResult}`);
	//供应商订单--运单分页
	let supplierOrderWaybillList = (params = {}) => vm.$u.http.get(supplierOrderWaybillListUrl, params);


	//供应商需求--需求列表分页
	let needMaterialsOrdersPage = (params = {}) => vm.$u.http.get('/auth/v1.0.0/needMaterialsOrders/page', params);
	//供应商需求--确认需求单
	let needMaterialsConfirm = (params = {}) => vm.$u.http.get('/auth/v1.0.0/needMaterialsOrders/confirm', params);

	//供应商审核计划按钮
	let supplierAudit = (params = {}) => vm.$u.http.get(supplierAuditUrl, params);
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.http.api(因为vm就是this，也即this.$u.http.api)下
	vm.$u.api = {
		userLogin,
		userLogin2,
		wxLogin,
		wxLogin2,
		loginWithUser,
		loginFirst,
		getUserInfo,
		loginOut,
		getHomeProductList,
		productDetail,
		getAreaList,
		getHomeContract,
		invoiceDetail,
		invoicePage,
		userAddressPage,
		supplierAudit,
		userAddressPage,
		userAddressAdd,
		userAddressUpdate,
		userAddressDelete,
		getUserAddressById,
		userAddressStatus,
		updateContact,
		updatePassword,
		getWalletByUser,
		bindPhone,
		selectPayPassword,
		savePayPassword,
		updatePayPassword,
		getContractList,
		getContractDetail,
		getRemainingAmount,
		getAddressByProducts,
		contractCreate,
		getContractToken,
		contractPay,
		getOrderList,
		getBuyerOrdersDetail,
		lastTransportWay,
		changeOrderNum,
		orderRepay,
		orderRepayInfo,
		buyerOrderCancel,
		waybillList,
		getSupplierOrderList,
		getSupplierBuyerOrdersDetail,
		supplierLastTransportWay,
		supplierDeliveryGoods,
		supplierOrderAudit,
		supplierOrderWaybillList,
		offLineAccount,
		messageList,
		messageReadAll,
		messageSignRead,
		messageDelete,
		getMobileNumF,
		addPayPasswordGetCode,
		addPasswordGetCode,
		verifyPassword,
		resetPassword,
		getSystemConfig,
		ciccAccountListTotalBalance,
		needMaterialsOrdersPage,
		needMaterialsConfirm
	};
}

export default {
	install
}
