/*
	我的粉丝(卖家)页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			getListData: function(end, isUp, ctype) {
				//5.8 我的粉丝
				Utils.getSimpleJson({
					url: "/front/member/myFans",
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
			//拉黑
			defriend: function(me) {
				if(me.attr("data-type")) {
					var defriendTit = "已取消";
				} else {
					var defriendTit = "已拉黑";
				};
				Utils.ajax({
					type: "PATCH",
					url: "/front/member/myBlacks/" + me.parent().attr("cid"),
					fn: function(data) {
						me.hide().siblings(".silence-img").show();
						layer.open({
							content: defriendTit,
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
				imgUrl: constant.imgPre,
				pageNo: 0,
				data: []
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