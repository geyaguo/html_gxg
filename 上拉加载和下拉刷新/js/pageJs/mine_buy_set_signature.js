/*我的设置-手机号*/

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//修改个性签名-保存
			saveIntroduce: function(me) {
				var form = me.parents("form");
				Utils.formValidate({
					form: form,
					fn: function() {
						//4.4 个人信息修改
						Utils.ajaxSubmit({
							type: "PUT",
							form: form,
							url: "/front/member/info",
							fn: function(data) {
								history.go(-1);
							}
						});
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
				attention: false
			}
		});

	}

})(document, window, jQuery, Utils);