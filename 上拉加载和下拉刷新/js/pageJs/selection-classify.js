/*
	选择分类页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	$(function() {
		var fns = {
			//显示子分类的模拟页面
			childrenClassify: function(me) {
				$(".children-classify").addClass("page-into-with-right");
				vm.subClassifyTit = me.html();
				//1 分类列表查询
				Utils.getSimpleJson({
					url: "/front/categorys",
					params:{
						id:me.attr("cid")
					},
					fn: function(data) {
						vm.subClassify = data;
					}
				});
			},
			//隐藏子分类的模拟页面
			deteleChildrenClassify: function(me) {
				$(".children-classify").removeClass("page-into-with-right");
			},
			//选择子分类
			choiceSubClassify:function(me){
//				location.href="issue-treasure.html";
				var choiceSubClassify = {
					id:me.attr("cid"),
					name:me.html()
				};
				localStorage.setItem("baoma-choiceSubClassify",JSON.stringify(choiceSubClassify));
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
				classify:{},
				subClassify:{},
				subClassifyTit:null
			}
		});
		
		
		//1 分类列表查询
		Utils.getSimpleJson({
			url: "/front/categorys",
			fn: function(data) {
				vm.classify = data;
			}
		});

	}

})(document, window, jQuery, Utils);