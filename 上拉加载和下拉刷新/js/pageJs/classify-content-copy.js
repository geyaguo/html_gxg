/*
	分类内容(copy)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//点击筛选
			filtrate:function(me){
				$(".mask").show();
				me.find(".classify-filtrate-list").slideDown(200);
			},
			//关闭遮罩层
			closeMask:function(me){
				me.hide();
				$(".classify-filtrate-list").slideUp(100,function(){});
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
		
	}

})(document, window, jQuery, Utils);