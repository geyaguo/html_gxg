/*
	实名认证(卖家个人信息)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//上传照片
			upImg: function(me) {
				Utils.asyncImg({
					fn: function(data) {
						me.siblings("input").val(data.key);
						me.hide().siblings(".information-img").attr('src', data.imgPath).show();
					}
				})
			},
			//提交审核
			sureBtn: function(me) {
				//5.6 实名认证
				Utils.ajaxSubmit({
					type: "POST",
					form: me.parents("form"),
					url: "/front/member/authority",
					fn: function(data) {
						vm.$set("submitSuccess", true);
						$(".progress-bar-sure").animate({
							width: "100%"
						}, 500, function() {
							$(".progress-no-filled").attr("src", "img/gxg-small-sure.png")
						});
					}
				});
			},
			//绑定手机号
			bindBtn: function(me) {
				Utils.pwdBox.init({
					html: $("#pay-pwd-template").html(),
					clickFn: function(val) {
						var state = vm.inputState;
						if(vm[state] && vm[state].length >= 11) {
							return false;
						} else {
							vm.$set(state, (vm[state] ? vm[state] : "") + String(val));
						}
					},
					delFn: function() {
						var state = vm.inputState;
						if(vm[state]) {
							vm[state] = vm[state].substr(0, vm[state].length - 1);
						}
					}
				});
				vm = Utils.vueInit({
					vueData: vm.$data
				});
			},
			emptyTel: function() {
				vm.$set("tel", "");
			},
			//取消密码弹框
			cancelPwd: function() {
				vm.$set("tel", "");
				vm.$set("code", "");
				Utils.pwdBox.destroy();
			},
			switchInputState: function(me) {
				vm.$set("inputState", me.attr("input-state"));
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				inputState: "tel"

			}
		});
	}

})(document, window, jQuery, Utils);