/*
 * author lgm
 * 
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			test: function() {
				Utils.pwdBox.init({
					maskClose: true,
					className: "test1",
					html: $("#testTemp").html(),
					clickFn: function(val){
						console.log(val);						
					},
					delFn: function(){
						
					}
				});
				vm = Utils.vueInit({
					vueData: vm.$data
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
				testData: "hello word"
			}
		});
	}

})(document, window, jQuery, Utils);