/*
	实名认证(卖家)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
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
				data:null,
				imgUrl:constant.imgPre
			}
		});
		
		//5.1 我的
		Utils.getSimpleJson({
			url: "/front/member/mineHome",
			fn: function(data) {
				console.log(data);
				vm.data = data;
			}
		});
		
	}

})(document, window, jQuery, Utils);