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
				voList: {}
			}
		});
		//4.10 关注列表
		Utils.getSimpleJson({
			url: "/front/member/memberAttentions",
			fn: function(data) {
				vm.voList = data;
			}
		});
		
		
	}

})(document, window, jQuery, Utils);