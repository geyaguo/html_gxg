/*
 * author lgm
 * 首页
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//上拉加载回调函数
			getListData: function(end, isUp) {
				//4.1 我的
				Utils.getSimpleJson({
					url: "/front/member/memberBrowses",
					params: {
						pageSize: 1,
						pageNo: isUp ? (vm.pageNo ? (vm.pageNo + 1) : 1) : 1,
					},
					fn: function(data) {
						vm.pageNo = data.pageNo;
						vm.$set("historygoods", (isUp ? ((vm.historygoods ? vm.historygoods : []).concat(data.voList)) : data.voList));
						end(!data.hasNext);
					}
				});
			},
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				pageNo:0
			}
		});
		//上拉加载
		Utils.pullLoad({
			root: $("body"),
			upFn: function(end) {
				fns.getListData(end, true);
			}
		});

	}

})(document, window, jQuery, Utils);