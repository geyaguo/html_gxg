/*我的订单-付款*/

(function(document, window, $, Utils) {
	'use strict';
	var vm, urlParams = Utils.getUrlParams();
	$(function() {
		var fns = {
			//付款方式点击选择radio
			payRadio: function(me) {
				me.toggleClass("radio_current");
				me.parent("li").siblings("li").find("span.radio_bg").removeClass("radio_current");
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {}
		});
		//4.12.5 订单付款详情
		Utils.getSimpleJson({
			url: "/front/buyerOrders/"+urlParams.id+"/payment",
			fn: function(data) {
				vm.$set("orderpay", data);
			}
		});
	}

})(document, window, jQuery, Utils);