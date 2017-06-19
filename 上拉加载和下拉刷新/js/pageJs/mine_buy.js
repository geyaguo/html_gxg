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
				mine: {}
			}
		});
		//4.1 我的
		Utils.getSimpleJson({
			url: "/front/member/mineHome",
			fn: function(data) {
				vm.mine = data;
			}
		});
	}

})(document, window, jQuery, Utils);