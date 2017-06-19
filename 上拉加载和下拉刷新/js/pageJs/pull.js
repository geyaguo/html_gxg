/*
 * author lgm
 * 
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			getListData: function(end, isUp) {
				Utils.getSimpleJson({
					url: "/front/goods",
					params: {
						pageSize: 2,
						pageNo: isUp ? (vm.pageNo + 1) : 1
					},
					fn: function(data) {
						vm.pageNo = data.pageNo;
						vm.pageData = isUp ? (vm.pageData.concat(data.voList)) : (data.voList);
						end(!data.hasNext);
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
				pageData: [],
				pageNo: 0
			}
		});
		
		Utils.pullLoad({
			root: $(".outerScroller"),
			downEnable: true,
			downFn: function(end){
				fns.getListData(end, false);
			},
			upFn: function(end){
				fns.getListData(end, true);
			}
		});
	}

})(document, window, jQuery, Utils);