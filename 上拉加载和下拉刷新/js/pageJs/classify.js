/*
	分类页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//选择分类
			selectionSort: function(me) {
				me.addClass("active").siblings().removeClass("active");
				//$("body").scrollTop($(".classify-list-box")[me.index()].offsetTop-$(".classify-list-box")[0].offsetTop);
				$(window).unbind("scroll");
				$('body').animate({
					scrollTop: $(".classify-list-box")[me.index()].offsetTop - $(".classify-list-box")[0].offsetTop
				}, 300, function() {
					$(window).scroll(fns.windowScroll);
				});
			},
			windowScroll: function() {
				var scrollTop = $("body").scrollTop();
				for(var i = 0; i < $(".classify-list-box").length; i++) {
					if(scrollTop >= $(".classify-list-box")[i].offsetTop - $(".classify-list-box")[0].offsetTop) {
						$(".classify-page-list").eq(i).addClass("active").siblings().removeClass("active");
					}
				}
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				recommendList:[],
				classifyList:[],
				imgUrl:constant.imgPre
			}
		});
		//滚动时
		$(window).scroll(fns.windowScroll);
		
		//2.1 推荐分类
		Utils.getSimpleJson({
			url: "/front/categorys/recommend",
			fn: function(data) {
				vm.recommendList = data;
				//vue渲染完数据之后在执行该方法
				vm.$nextTick(function() {
					
				});
			}
		});
		//2 分类列表层级查询
		Utils.getSimpleJson({
			url: "/manager/categorys",
			fn: function(data) {
				vm.classifyList = data;
				//vue渲染完数据之后在执行该方法
				vm.$nextTick(function() {
					
				});
			}
		});
	}

})(document, window, jQuery, Utils);