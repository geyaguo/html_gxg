/*
	待发货订单详情(卖家)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	var urlParams = Utils.getUrlParams();
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
				imgUrl: constant.imgPre
			}
		});
		
		//5.14.2 订单详情
		Utils.getSimpleJson({
			url:"/front/sellerOrder/"+urlParams.id,
			fn:function(data){
				vm.data = data;
			}
		})
		
	}

})(document, window, jQuery, Utils);