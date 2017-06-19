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
		console.log(urlParams);
		//4.1 我的
		Utils.getSimpleJson({
			url: "/front/buyerOrders/" + urlParams.id,
			fn: function(data) {
				vm.$set("orderdetails", data);
				vm.$nextTick(function() {
					Utils.timeRemainHandle();
				});
				end(!data.hasNext);
			}
		});
	}

})(document, window, jQuery, Utils);