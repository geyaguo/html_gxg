/*
 * author lgm
 * 首页
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	var type = "CHOICENESS";
	var pageNo = "choicenessNo";
	$(function() {
		var fns = {
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				integral: {}
			}
		});
		//4.9 我的积分
		Utils.getSimpleJson({
			url: "/front/member/mineScore",
			fn: function(data) {
				vm.integral = data;
			}
		});
		
		
	}

})(document, window, jQuery, Utils);