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
				mineinfo: {}
			}
		});
		//4.2 个人信息
		Utils.getSimpleJson({
			url: "/front/member/mineInfo",
			fn: function(data) {
				vm.mineinfo = data;
			}
		});
		
		
	}

})(document, window, jQuery, Utils);