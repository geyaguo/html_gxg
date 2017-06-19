/*
	买家出价条件设置(卖家)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//切换开关
			switchBtn:function(me){
				if(me.is(".mui-active")){
					vm[me.attr("data-type")] = "YES";
				}else{
					vm[me.attr("data-type")] = "NO";
				};
				for(var i=0;i<$(".mui-switch").length;i++){
					if($(".mui-switch").eq(i).is(".mui-active")){
						$(".setBtn").removeAttr("disabled");
						return false;
					}else{
						$(".setBtn").attr("disabled","disabled");
					}
				}
				
			},
			//保存按钮
			sureBtn:function(me){
				Utils.ajax({
					type: "PUT",
					url: "/front/memberAccounts/auctionSetting",
					params:{
						isCheckMobile:vm.isCheckMobile,
						isCheckBreak:vm.isCheckBreak,
						isCheckReturn:vm.isCheckReturn
					},
					fn: function(data) {
						layer.open({
							content: '保存成功',
							skin: 'msg',
							time: 1 //2秒后自动关闭
						});
						setTimeout(function(){
							history.go(-1);
						},300)
					}
				});
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				isCheckMobile:"NO",
				isCheckBreak:"NO",
				isCheckReturn:"NO"
			}
		});
		
	}

})(document, window, jQuery, Utils);