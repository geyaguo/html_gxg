/*
	选择城市页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//显示子分类的模拟页面
			childrenClassify:function(me){
				$(".selection-city-area").show().animate({left:0},200);
			},
			//隐藏子分类的模拟页面
			deteleChildrenClassify:function(me){
				me.parents(".selection-city-area").animate({left:"23.4375rem"},200,function(){me.parents(".selection-city-area").hide()})
			},
			//点击城市
			choiceArea:function(me){
				Utils.getSimpleJson({
					url: "/core/adminAreas",
					params: {
						provinceId:me.attr("cid"),
						cityId:me.attr("aid")
					},
					fn: function(data) {
						vm.areaList = data;
					}
				});
				$(".selection-city-area").show().animate({left:0},200);
				
				vm.provinceCityArea.provinceId = me.attr("cid");
				vm.provinceCityArea.provinceName = me.attr("cname");
				vm.provinceCityArea.cityId = me.attr("aid");
				vm.provinceCityArea.cityName = me.attr("aname");
			},
			//选择地区
			pitchOn:function(me){
				me.addClass("active").find(".pitch-on").show();
				me.siblings().removeClass("active").find(".pitch-on").hide();
				
				vm.provinceCityArea.areaId = me.attr("cid");
				vm.provinceCityArea.areaName = me.attr("name");
				localStorage.setItem("baoma-provinceCityArea",JSON.stringify(vm.provinceCityArea));
				history.go(-1);
				
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				cityList:[],
				areaList:[],
				provinceCityArea:{}			
			}
		});
		Utils.muiInit();
		mui.ready(function() {
			var list = document.getElementById('list');
			//列表高度
			list.style.height = (document.body.offsetHeight - $(".header").height()-$(".location-city").height()) + 'px';
			//初始化搜索功能
			window.indexedList = new mui.IndexedList(list);
		});
		
		//4 省市区联动列表
		Utils.getSimpleJson({
			url: "/core/adminAreas/cityList",
			fn: function(data) {
				console.log(data);
				vm.cityList = data.allCityList;
			}
		});
	}

})(document, window, jQuery, Utils);