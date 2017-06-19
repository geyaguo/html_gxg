/*
 * author lgm
 * 
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {}
		});
		Utils.shake({
			fn: function(){
				alert(1);
			}
		});
	}

})(document, window, jQuery, Utils);