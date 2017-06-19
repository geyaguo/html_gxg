/*
	我的黑名单(卖家)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			getListData: function(end, isUp, ctype) {
				//5.9 我的黑名单
				Utils.getSimpleJson({
					url: "/front/member/myBlacks",
					params: {
						pageSize: 2,
						pageNo: isUp ? (vm.pageNo ? (vm.pageNo + 1) : 1) : 1
					},
					fn: function(data) {
						console.log(data);
						vm.pageNo = data.pageNo;
						vm.data = isUp ? vm.data.concat(data.voList) : (data.voList);
						end(!data.hasNext);
					}
				});
			},
			//取消拉黑
			defriend: function(me) {
				Utils.ajax({
					type: "PATCH",
					url: "/front/member/myBlacks/" + me.attr("cid"),
					fn: function(data) {
						me.parents(".fans-list").remove();
						layer.open({
							content: "已取消",
							skin: 'msg',
							time: 1 //2秒后自动关闭
						});
					}
				})
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				imgUrl:constant.imgPre,
				pageNo:0,
				data:[]
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