/*
 * author lgm
 * 首页
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm, urlParams = Utils.getUrlParams();
	$(function() {
		var fns = {};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {}
		});
		//5.11 卖家主页
		var memberId = urlParams.memberId;
		Utils.getSimpleJson({
			url: "/front/member/sellerHome/",
			params: {
				memberId: memberId
			},
			fn: function(data) {
				vm.$set("othersell", data);
				vm.$nextTick(function(){
					$("title").html("卖家“"+ vm.othersell.nickName +"”");
				});
			}
		});
		//5.12 卖家宝贝
		var userId = urlParams.memberId;
		Utils.getSimpleJson({
			url: "/front/member/sellerGoods/",
			params: {
				memberId: userId,
				pageSize:10,
				pageNo:10
			},
			fn: function(data) {
				vm.$set("othersellgoods", data);
			}
		});

	}

})(document, window, jQuery, Utils);