/*
 * author lgm
 * 首页
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//上拉加载,下拉刷新回调函数
			getListData: function(end, isUp, ctype) {
				//1.1 首页商品列表
				Utils.getSimpleJson({
					url: "/front/goods",
					params: {
						pageSize: 2,
						pageNo: isUp ? (vm[ctype + "pageNo"] ? (vm[ctype + "pageNo"] + 1) : 1) : 1,
						type: ctype
					},
					fn: function(data) {
						vm.$set((ctype + "pageNo"), data.pageNo);
						vm.$set(ctype, (isUp ? ((vm[ctype] ? vm[ctype] : []).concat(data.voList)) : (data.voList)));
						end(!data.hasNext);
						vm.$nextTick(function() {
							fns.fullText();
							fns.fullTextClick();
							//轮播图
							$('.slideshow').bxSlider({
								auto: true, //自动轮播 
							}).removeClass("slideshow");
						});
					}
				});
			},
			//点击"关注"
			attention: function(me) {
				layer.open({
					content: '关注成功',
					skin: 'msg',
					time: 1 //2秒后自动关闭
				});
				me.hide().siblings(".attention-person-btn").show();
			},
			//点击"已关注"
			cancelAttention: function(me) {
				layer.open({
					content: '取消关注',
					skin: 'msg',
					time: 1 //2秒后自动关闭
				});
				me.hide().siblings(".attention").show();
			},
			//精选tab页中"点赞"
			praise: function(me) {
				/*if(me.find(".praise-character").is(".praise-character-color")) {
					layer.open({
						content: '取消点赞',
						skin: 'msg',
						time: 1 //2秒后自动关闭
					});
					me.find(".praise-img-yes").hide().siblings(".praise-img-no").show();
					me.find(".praise-character").html("赞").removeClass("praise-character-color");
				} else {
					layer.open({
						content: '点赞成功',
						skin: 'msg',
						time: 1 //2秒后自动关闭
					});
					me.find(".praise-img-no").hide().siblings(".praise-img-yes").show();
					me.find(".praise-character").html("24").addClass("praise-character-color");
				}*/
			},
			//判断是否显示"全文"按钮 (要在vue中数据渲染完成后 同样要执行一次)
			fullText: function() {
				$(".describe").map(function() {
					if(this.offsetHeight < this.scrollHeight) {
						//显示了省略号
						$(this).next(".full-text").show();
					} else {
						//$(this).next(".full-text").hide();
						$(this).addClass("describe-all");
					};
				});
			},
			//点击"全文"按钮事件
			fullTextClick: function() {
				$(".full-text").click(function() {
					if($(this).html() == "全文") {
						$(this).prev().css("-webkit-line-clamp", "initial");
						$(this).html("收起");
					} else {
						$(this).prev().css("-webkit-line-clamp", "3");
						$(this).html("全文");
					}
				});
			},
			test: function() {
				Utils.getSimpleJson({
					url: "/front/wx/login",
					fn: function(data) {
						alert("登录成功")
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
				imgUrl: constant.imgPre
			}
		});

		//模拟登录
		Utils.getSimpleJson({
			noAsync: true,
			url:"/front/wx/login",
			fn:function(data){
				console.log("登录成功")
			}
		});

		//上拉加载和下拉刷新
		$(".scroll-wrapper").each(function(index, ele) {
			var windowHeight = $(window).height();
			$(ele).css({
				"height": "" + (windowHeight - $(".tab").height() - $(".footer").height()) + "px",
				"overflow-y": "auto"
			});
			var ctype = $(ele).attr("ctype");
			Utils.pullLoad({
				root: $(ele),
				upFn: function(end) {
					fns.getListData(end, true, ctype);
				}
			});
		});

		//首页中切换精选和关注tab页
		$(".tab-list").on("click", function() {
			$(this).addClass("active").siblings().removeClass("active");
			if($(this).is(".whether-choiceness")) {
				vm.attention = false;
			} else {
				vm.attention = true;
				//vue渲染完数据之后在执行该方法
				vm.$nextTick(function() {
					fns.fullText();
					fns.fullTextClick();
				});
			}
		});

	}

})(document, window, jQuery, Utils);