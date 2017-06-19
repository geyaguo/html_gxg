/*
	分类内容页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	var urlParams = Utils.getUrlParams(),
		pull = null,
		hasNext = true;
	$(function() {
		var fns = {
			//点击筛选
			filtrate: function(me) {
				$(".mask").show();
				me.find(".classify-filtrate-list").slideDown(200);
			},
			//关闭遮罩层
			closeMask: function(me) {
				me.hide();
				$(".classify-filtrate-list").slideUp(100, function() {});
			},
			getListData: function(end, isUp) {
				//2.2 商品分类查询
				Utils.getSimpleJson({
					url: "/front/goods/classify",
					params: {
						pageSize: 2,
						pageNo: isUp ? (vm.pageNo ? (vm.pageNo + 1) : 1) : 1,
						classId: urlParams.id,
						price: vm.price,
						goodsType: vm.goodsType
					},
					fn: function(data) {
						vm.pageNo = data.pageNo;
						vm.listData = isUp ? (vm.listData.concat(data.voList)) : (data.voList);
						hasNext = data.hasNext;
						end(!data.hasNext);
					}
				});
			},
			//综合排序模拟刷新
			priceSort: function(me) {
				$(".mask").click();
				vm.price = me.attr("data-type");
				if(hasNext) {
					pull.down.callback(pull.end);
				} else {
					pull._end(pull.down, false, false, true);
				}
			},
			//筛选中确定
			filtrateSure:function(me){
				$(".mask").click();
				if($(".postage-type").find(".filtrate-name-img").is(".show-img")){
					vm.isFreeShipping = true;
				}else{
					vm.isFreeShipping = false;
				};
				if($(".shipAddress-type").find(".filtrate-name-img").is(".show-img")){
					vm.shipAddress = true;
				}else{
					vm.shipAddress = false;
				};
				if(hasNext) {
					pull.down.callback(pull.end);
				} else {
					pull._end(pull.down, false, false, true);
				};
			},
			//筛选内容
			filtrateList: function(me) {
				me.find(".filtrate-name-img").toggleClass("show-img");
			},
			//选择商品类型
			goodsType:function(me){
				$(".mask").click();
				vm.goodsType = me.attr("goodsType");
				if(hasNext) {
					pull.down.callback(pull.end);
				} else {
					pull._end(pull.down, false, false, true);
				}
			},
			//重置按钮
			resetBtn:function(me){
				$(".mask").click();
				vm.isFreeShipping = null;
				vm.shipAddress = null;
				$(".filtrate-name-img").removeClass("show-img")
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				pageNo: 0,
				listData: [],
				imgUrl: constant.imgPre,
				price: null,
				goodsType: null,
				isFreeShipping:null,
				shipAddress:null
			}
		});

		pull = Utils.pullLoad({
			root: $("body"),
			downEnable: true,
			downFn: function(end) {
				fns.getListData(end, false);
			},
			upFn: function(end) {
				fns.getListData(end, true);
			}
		});

	}

})(document, window, jQuery, Utils);