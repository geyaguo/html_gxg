/*
	快递公司(卖家)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//选择快递
			choiceExpress:function(me){
				var choiceExpress = {
					id:me.attr("cid"),
					name:me.attr("cname")
				};
				localStorage.setItem("baoma-choiceExpress",JSON.stringify(choiceExpress))
				history.go(-1);
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
				imgUrl:constant.imgPre
			}
		});
		
		Utils.getSimpleJson({
			url:"/front/sellerOrder/expresses",
			fn:function(data){
				console.log(data);
				vm.data = data;
			}
		})
		
		
	}

})(document, window, jQuery, Utils);