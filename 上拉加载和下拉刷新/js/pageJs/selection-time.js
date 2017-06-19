/*
	选择时间页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//选择时间
			choiceDate:function(me){
				localStorage.setItem("baoma-choiceDate",me.parent().attr("date")+" "+me.html()+":00");
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
				date:moment(),
				tomorrow:moment().add(1, 'days'),
				after_tomorrow:moment().add(2, 'days'),
				after_after_tomorrow:moment().add(3, 'days'),
				after_after_after_tomorrow:moment().add(4, 'days')
			}
		});
	}

})(document, window, jQuery, Utils);