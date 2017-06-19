/*我的设置-手机号*/

(function(document, window, $, Utils) {
	'use strict';
	var vm, urlParams = Utils.getUrlParams();
	$(function() {
		var fns = {
			//宝贝评分
			evaluateScore: function(me) {
				var index = me.index();
				vm.goodsScore = -1;
				$(".xing_wrapper span").each(function(i, ele) {
					if(i <= index) {
						$(ele).addClass("xing_active");
						vm.goodsScore++;
					} else {
						$(ele).removeClass("xing_active");
					}
				});
			},
			shopScore: function(me) {
				me.addClass("shopScore_active").siblings().removeClass("shopScore_active");
				vm.$set("shopScoreKey", me.attr("score-key"));
			},
			//修改昵称-保存
			issueTalk: function(me) {
				var form = me.parents("form");
				Utils.formValidate({
					form: form,
					fn: function() {
						//4.12.9 订单评价
						Utils.ajaxSubmit({
							form: form,
							url: "/front/buyerOrders/tradeComment",
							params: {
								"order.id": urlParams.id,
								starScore: vm.goodsScore + 1,
								type: vm.shopScoreKey
							},
							fn: function(data) {
								history.go(-1);
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
				attention: false,
				goodsScore: 4,
				shopScoreKey: "TRADE_COMMENT_GOOD",
				shopScoreObj: {
					TRADE_COMMENT_GOOD: "好评，卖家此次交易将得到全部积分",
					TRADE_COMMENT_ORDINARY: "中评，卖家此次交易将只得到50%的交易积分",
					TRADE_COMMENT_NO_GOOD: "差评，卖家此次交易将不会得到交易积分"
				}
			}
		});

	}

})(document, window, jQuery, Utils);