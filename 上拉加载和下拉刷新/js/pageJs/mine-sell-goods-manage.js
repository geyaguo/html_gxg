/*卖家宝贝管理(卖家)页面*/

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	var vm, urlParams = Utils.getUrlParams();
	$(function() {
		var fns = {
			getOrderData: function(end, isUp, orderStatus) {
				Utils.getSimpleJson({
					url: "/front/memberGoods",
					params: {
						pageSize: 5,
						pageNo: isUp ? (vm[orderStatus + "pageNo"] ? (vm[orderStatus + "pageNo"] + 1) : 1) : 1,
						goodsStatus: orderStatus
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
			//下架商品
			downGoods: function(me) {
				if(me.attr("num") > 0) {
					layer.open({
						content: '该商品已经有人在拍了，若下架将增加一次违约比例。是否继续下架？',
						btn: ['继续', '取消'],
						yes: function(index) {
							downGoods(me);
							layer.close(index);
						}
					});
				} else {
					downGoods(me);
				};

				function downGoods(ele) {
					Utils.ajax({
						type: "PATCH",
						url: "/front/memberGoods/" + ele.attr("cid"),
						fn: function(data) {
							layer.open({
								content: '下架成功',
								skin: 'msg',
								time: 1 //2秒后自动关闭
							});
							ele.parents("li").remove();
						}
					});
				}
			},
			//删除商品
			deleteGoods: function(me) {
				layer.open({
					content: '是否删除宝贝？',
					btn: ['确定', '取消'],
					yes: function(index) {
						layer.close(index);
						Utils.ajax({
							type: "DELETE",
							url: "/front/memberGoods/" + me.attr("cid"),
							fn: function(data) {
								layer.open({
									content: '删除成功',
									skin: 'msg',
									time: 1 //2秒后自动关闭
								});
								me.parents("li").remove();
							}
						});
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