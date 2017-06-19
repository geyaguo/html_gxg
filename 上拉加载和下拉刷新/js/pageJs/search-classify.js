/*
	搜索页面
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
			vueData: {
				recommendData:[],
				historysData:[]
			}
		});
		
		//1.3 搜索-推荐属性
		Utils.getSimpleJson({
			url: "/front/search/recCategorys",
			fn: function(data) {
				console.log(data);
				vm.recommendData = data;
			}
		});
		
		//搜索历史
		Utils.getSimpleJson({
			url: "/front/search/historys",
			fn: function(data) {
				console.log(data);
				vm.historysData = data;
			}
		});
		
		//输入框右下角为"搜索"按钮
		document.getElementById("form").onsubmit = function() {
			var searchText =encodeURIComponent($(".search-input").val());
			location.href="search-classify-content.html?searchText="+searchText;
			return false;
		};
		
	}

})(document, window, jQuery, Utils);