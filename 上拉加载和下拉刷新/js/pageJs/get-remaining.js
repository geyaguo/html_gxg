/*
	捡漏页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//选择时间
			selectTime:function(me){
				me.addClass("active").siblings().removeClass("active")
			},
			//上拉加载回调函数
			getListData: function(end, isUp) {
				//3.1 捡漏列表
				Utils.getSimpleJson({
					url: "/front/leaks",
					params: {
						pageSize: 2,
						pageNo: isUp ? (vm.pageNo ? (vm.pageNo + 1) : 1) : 1
					},
					fn: function(data) {
						vm.pageNo = data.pageNo;
						vm.dataList = isUp ? ((vm.dataList ? vm.dataList : []).concat(data.voList)) : (data.voList);
						end(!data.hasNext);
						console.log(vm.dataList)
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
				dataList:[],
				imgUrl: constant.imgPre
			}
		});
		
		Utils.pullLoad({
			root: $("body"),
			upFn: function(end) {
				fns.getListData(end, true);
			}
		});
		
	}

})(document, window, jQuery, Utils);