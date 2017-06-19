/*
	宝贝详情页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	var urlParams = Utils.getUrlParams();
	$(function() {
		var fns = {
			//出价
			bid: function(me) {
				Utils.pwdBox.init({
					html: $("#pay-pwd-template").html(),
					clickFn: function(val) {
						vm.$set("payPwd", (vm.payPwd ? vm.payPwd : "") + String(val));
						console.log(vm.payPwd);
					},
					delFn: function() {
						if(vm.payPwd) {
							vm.payPwd = vm.payPwd.substr(0, vm.payPwd.length - 1);
						}
					}
				});
				vm = Utils.vueInit({
					vueData: vm.$data
				});
			},
			//确定出价
			bidBtn: function() {
				$(".prompt-message").show()
			},
			//清空输入框
			empty: function() {
				if(vm.payPwd) {
					vm.payPwd = "";
				}
			},
			//取消密码弹框
			cancelPwd: function() {
				if(vm.payPwd) {
					vm.payPwd = "";
				};
				Utils.pwdBox.destroy();
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				goodsDetails: null,
				imgUrl: constant.imgPre
			}
		});

		//1.5 商品详情
		Utils.getSimpleJson({
			url: "/front/goods/" + urlParams.cid,
			fn: function(data) {
				vm.goodsDetails = data;
				vm.$nextTick(function() {
					Utils.timeRemainHandle({
						fn:function(me){
							me.html("已结束")
						}
					});
				});
			}
		});

	}

})(document, window, jQuery, Utils);