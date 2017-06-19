/*
	卖家主页页面
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
				goodsData:null,
				imgUrl:constant.imgPre
			}
		});
		
		//5.11 卖家主页
		Utils.getSimpleJson({
			url: "/front/member/sellerHome",
			fn: function(data) {
				vm.data = data;
			}
		});
		
		//5.12 卖家宝贝
		Utils.getSimpleJson({
			url: "/front/member/sellerGoods",
			params:{
				pageSize:4,
				pageNo:1
			},
			fn: function(data) {
				vm.goodsData = data.voList;
			}
		});
	}

})(document, window, jQuery, Utils);