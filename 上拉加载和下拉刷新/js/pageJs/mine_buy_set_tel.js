/*我的设置-手机号*/

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//获取验证码
			getYanzhengma: function(me) {
				me.attr("disabled", "disabled");
				var atime = 61;
				var times = setInterval(function() {
					if(atime == 0) {
						btn.removeAttr("disabled").html("获取验证码");
						clearInterval(times);
					} else {
						atime--;
						me.html(atime + "s");
					}
				}, 1000);
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