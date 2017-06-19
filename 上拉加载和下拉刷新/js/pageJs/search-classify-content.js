/*
	搜索(内容)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	var urlParams = Utils.getUrlParams();
	$(function() {
		var fns = {
			getListData: function(end, isUp) {
				Utils.getSimpleJson({
					url: "/front/search/goods",
					params: {
						pageSize: 2,
						pageNo: isUp ? (vm.pageNo + 1) : 1,
						keyword: vm.searchText
					},
					fn: function(data) {
						vm.$set("dataList", (isUp ? ((vm["dataList"] ? vm["dataList"] : []).concat(data.voList)) : (data.voList)));
						end(!data.hasNext);
						console.log(vm.dataList);
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
				pageNo:0,
				imgUrl:constant.imgPre,
				searchText: decodeURIComponent(urlParams.searchText)
			}
		});

		
		Utils.pullLoad({
			root: $("body"),
			upFn: function(end) {
				fns.getListData(end, true);
			}
		});

		//输入框右下角为"搜索"按钮
		document.getElementById("form").onsubmit = function() {
			location.replace("search-classify-content.html?searchText=" + vm.searchText);
			return false;
		};
	}

})(document, window, jQuery, Utils);