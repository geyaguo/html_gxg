/*
	保证金支付
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			chooseWay:function(me){
				me.children(".choose-no-select").hide().siblings(".choose-select").show();
				me.siblings().children(".choose-no-select").show().siblings(".choose-select").hide();
			},
			//点击支付按钮
			pay: function(me) {
				Utils.pwdBox.init({
					html: $("#pay-pwd-template").html(),
					clickFn: function(val) {
						if(vm.payPwd && vm.payPwd.length>=6){
							return false
						}else{
							vm.$set("payPwd", (vm.payPwd ? vm.payPwd : "") + String(val));
							console.log(vm.payPwd);
							fns.onChange(vm.payPwd);
						};
					},
					delFn: function() {
						if(vm.payPwd) {
							vm.payPwd = vm.payPwd.substr(0, vm.payPwd.length - 1);
							fns.onChange(vm.payPwd);
						}
					}
				});
				vm = Utils.vueInit({
					vueData: vm.$data
				});
			},
			//取消密码弹框
			cancelPwd:function(){
				if(vm.payPwd){
					vm.payPwd = "";
				};
				Utils.pwdBox.destroy();
			},
			//6个密码格子
			onChange:function(me) {
		        for (var k = 0; k < $(".box-list-dot").length; k++) {
		            $(".box-list-dot").eq(k).css("opacity",0)
		        };
		        for (var i = 0; i < me.length; i++) {
		            $(".box-list-dot").eq(i).css("opacity",1)
		        };
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