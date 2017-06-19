/*
	宝贝详情(我发布的)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//分享到朋友
			shareFriend:function(me){
				$(".share-mask").show().find(".share-friend-box").show().siblings().hide();
				
			},
			//分享到微信
			shareWx:function(me){
				$(".share-mask").show().find(".share-wx-box").show().siblings().hide();
			},
			//制作链接
			makeLink:function(me){
				$(".make-link-box").show().siblings().hide()
			},
			//关闭遮罩层
			cancelMask:function(me){
				me.parents(".share-mask").hide();
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