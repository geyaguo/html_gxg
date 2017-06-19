/*
	发货(卖家)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	var urlParams = Utils.getUrlParams();
	$(function() {
		var fns = {
			//确认发货
			sureBtn:function(me){
				Utils.ajax({
					url:"/front/sellerOrder/invoice/"+urlParams.id,
					params:{
						expressCompanyId:vm.express.cid,
						waybillNo:$(".expressNum").val()
					},
					fn:function(data){
						localStorage.removeItem("baoma-choiceExpress");
						layer.open({
							content: '已发货',
							skin: 'msg',
							time: 1 
						});
						setTimeout(function(){
							history.go(-2)
						},300)
					}
				})
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				data:null,
				express:null,
				imgUrl:constant.imgPre
			}
		});
		
		//选择快递公司
		if(localStorage.getItem("baoma-choiceExpress")){
			vm.express = JSON.parse(localStorage.getItem("baoma-choiceExpress"));
		};
		
		//5.14.4 发货详情
		Utils.getSimpleJson({
			url:"/front/sellerOrder/invoice/"+urlParams.id,
			fn:function(data){
				console.log(data);
				vm.data = data;
			}
		})
		
		
	}

})(document, window, jQuery, Utils);