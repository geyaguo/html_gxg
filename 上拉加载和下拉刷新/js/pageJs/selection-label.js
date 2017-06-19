/*
	选择标签页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			choiceLabel:function(me){
				var choiceLabel = {
					id:me.attr("cid"),
					name:me.html()
				};
				localStorage.setItem("baoma-choiceLabel",JSON.stringify(choiceLabel));
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
				label:[]
			}
		});
		
		Utils.getSimpleJson({
			url: "/front/categorys/"+JSON.parse(localStorage.getItem("baoma-choiceSubClassify")).id,
			fn: function(data) {
				vm.label = data;
			}
		});
		
	}

})(document, window, jQuery, Utils);