/*
	宝贝详情(一口价)页面
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
			vueData: {}
		});
		
	}

})(document, window, jQuery, Utils);