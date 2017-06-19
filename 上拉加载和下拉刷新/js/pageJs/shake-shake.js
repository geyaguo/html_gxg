/*
	摇一摇页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//摇一摇获取数据
			shake: function(me) {
				Utils.getSimpleJson({
					url: "/front/leaks/"+vm.categoryId,
					fn: function(data) {
						vm.data = data;
					}
				})
			},
			classifyId:function(me){
				vm.categoryId = me.attr("cid");
			},
			animate:function(){
				$(".goods").css({
					"opacity": '0',
					"margin-top": '-33.875rem'
				});
				$(".goods").animate({
					"opacity": '1',
					"margin-top": '0'
				}, 300);
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				data: null,
				classifyData: null,
				categoryId:null,
				imgUrl: constant.imgPre
			}
		});

		//1 分类列表查询
		Utils.getSimpleJson({
			url: "/front/categorys",
			fn: function(data) {
				vm.classifyData = data;
				vm.categoryId = data[0].id;
				fns.shake();
				fns.animate();
				vm.$nextTick(function() {
					//使底部可以滚动
					var nav_width = $(".bottom-list").width();
					var nav_num = $(".bottom-list").length;
					$(".bottom-list-box").css("width", nav_width * nav_num + "px");
				});
			}
		});

		//摇一摇
		Utils.shake({
			fn: function() {
				fns.shake();
				fns.animate();
			}
		});
	}

})(document, window, jQuery, Utils);