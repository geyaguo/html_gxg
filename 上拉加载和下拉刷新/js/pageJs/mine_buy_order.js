/*我的订单*/

(function(document, window, $, Utils) {
	'use strict';
	var vm, urlParams = Utils.getUrlParams();
	$(function() {
		var fns = {
			getOrderData: function(end, isUp, orderStatus) {
				Utils.getSimpleJson({
					url: "/front/buyerOrders/mine",
					params: {
						pageSize: 5,
						pageNo: isUp ? (vm[orderStatus + "pageNo"] ? (vm[orderStatus + "pageNo"] + 1) : 1) : 1,
						status: orderStatus
					},
					fn: function(data) {
						vm.$set((orderStatus + "pageNo"), data.pageNo);
						vm.$set((orderStatus + "pageData"), (isUp ? ((vm[orderStatus + "pageData"] ? vm[orderStatus + "pageData"] : []).concat(data.voList)) : (data.voList)))
						vm.$nextTick(function() {
							Utils.timeRemainHandle();
						});
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
			vueData: {}
		});
		$(".ekoo-tab-body ul").each(function(index, ele) {
			var windowHeight = $(window).height();
			$(ele).css({
				"height": "" + (windowHeight - $(".order_title").height()) + "px",
				"overflow-y": "auto"
			});
			var orderStatus = $(".ekoo-tab-head>li").eq(index).attr("order-status");
			Utils.pullLoad({
				root: $(ele),
				upFn: function(end) {
					fns.getOrderData(end, true, orderStatus);
				}
			});
		});
		if(urlParams && urlParams.orderStatus) {
			$(".ekoo-tab-head li[order-status=" + urlParams.orderStatus + "]").click();
		}
	}

})(document, window, jQuery, Utils);