/*我的订单(卖家)页面*/

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	var vm, urlParams = Utils.getUrlParams();
	$(function() {
		var fns = {
			getOrderData: function(end, isUp, orderStatus) {
				Utils.getSimpleJson({
					url: "/front/sellerOrder/mine",
					params: {
						pageSize: 5,
						pageNo: isUp ? (vm[orderStatus + "pageNo"] ? (vm[orderStatus + "pageNo"] + 1) : 1) : 1,
						orderStatus: orderStatus
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
			},
			//当面交易
			faceTransaction: function(me) {
				layer.open({
					content: '确认当面交易之后，商品进入7天确认期，7天后自动默认收货。',
					btn: ['继续', '取消'],
					yes: function(index) {
						alert("继续当面交易");
						Utils.ajax({
							type:"PATCH",
							url:"/front/sellerOrder/"+me.attr("cid"),
							fn:function(data){
								me.remove();
								layer.open({
									content: '等待买家同意',
									skin: 'msg',
									time: 1 //2秒后自动关闭
								});
							}
						})
						layer.close(index);
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
				imgUrl: constant.imgPre
			}
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