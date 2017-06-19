/*
	发布宝贝页面
 */

(function(document, window, $, Utils) {
	'use strict';
	var vm;
	var urlParams = Utils.getUrlParams();
	$(function() {
		var fns = {
			auction: function(me) {
				me.addClass("active").siblings().removeClass("active");
				vm.tabShow = true;
			},
			fixedPrice: function(me) {
				me.addClass("active").siblings().removeClass("active");
				vm.tabShow = false;
			},
			//上传图片
			upImg: function(me) {
				Utils.asyncImg({
					fn: function(data) {
						vm.imgKey.push(data.key);
						vm.imgArr.push(data.imgPath);
					}
				})
			},
			//删除图片
			deleteImg: function(me) {
				me.parent().remove();
				vm.imgKey.splice(me.parent().index(), 1);
			},
			//存储为草稿
			saveDraft: function(me) {
				vm.isDraft = true;
				$(".issue-btn").click();
			},
			//发布按钮
			issue: function(me) {
				//				layer.open({
				//					content: '<div style="text-align: center;"><img style="width:1.625rem;height:1.625rem;margin-top:0.9375rem;" src="img/27.png" /><h2 style="text-align: center;height:1.3125rem;line-height:1.3125rem;font-family: PingFangSC-Regular;font-size: 0.9375rem;color: #FFFFFF;margin-bottom:0.75rem;">描述不能为空</h2></div>',
				//					skin: 'msg',
				//					time: 2 //2秒后自动关闭
				//				});

				Utils.ajaxSubmit({
					type: "POST",
					form: me.siblings("form"),
					url: "/front/memberGoods",
					params: {
						"isDraft": vm.isDraft, //是否为草稿
						"auctionType": me.siblings("form").attr("tab-attr"),
						"summary": $(".describe-input").val(),
						"imgList": vm.imgKey.join(),
						"closeDate": vm.choiceDate,
						"category.id": vm.choiceSubClassify.id,
						"goodsTag.id": vm.choiceLabel.id,
						"province.id": vm["province.id"],
						"city.id": vm["city.id"],
						"district.id": vm["district.id"]
					},
					fn: function(data) {
						vm.isDraft = false;
						layer.open({
							content: '发布成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						//未测试方便先隐藏
						/*localStorage.removeItem("baoma-choiceSubClassify");
						localStorage.removeItem("baoma-choiceLabel");
						localStorage.removeItem("baoma-choiceDate");
						localStorage.removeItem("baoma-provinceCityArea");
						setTimeout(function() {
							history.go(-1);
						}, 300)*/

						//测试支付----------
						console.log(data);
						//ping++支付(微信公众号支付)
						/*var charge = data; //调取服务端要给你返回的charge的API；也就是AJAX返回的charge;
						pingpp.createPayment(charge, function(result, err) {
							console.log(result);
							console.log(err.msg);
							console.log(err.extra);
							if(result == "success") {
								// 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
								alert('支付成功');
								setTimeout(function() {
									history.go(-1)
								}, 300);
							} else if(result == "fail") {
								// charge 不正确或者微信公众账号支付失败时会在此处返回
								alert('支付失败');
							} else if(result == "cancel") {
								// 微信公众账号支付取消支付
								alert('取消支付');
							}
						});*/
						//测试支付结束--------
					}
				});
			},
			//选择邮费方式
			choicePostage: function(me) {
				me.siblings().find(".choice-img").hide();
				me.find(".choice-img").show();
				vm.postageEnum = me.attr("postage-type");
				vm.postageEnumName = me.find(".share-mask-bottom-list-name").html();
				me.parents(".share-mask").hide();
			},
			choicePostageMask: function(me) {
				$(".share-mask").show()
			},
			cancelMask: function(me) {
				me.parents(".share-mask").hide();
			},
			//打开发布秘籍
			openMask: function(me) {
				$(".issue-method").show();
			},
			//关闭发布秘籍
			closeMask: function(me) {
				me.parents(".issue-method").hide();
			}
		};
		window.fns = fns;
		init();
	});

	//入口方法
	function init() {
		vm = Utils.vueInit({
			vueData: {
				imgKey: [],
				imgArr: [],
				choiceSubClassify: null,
				choiceLabel: null,
				choiceDate: null,
				locationCity: null,
				"province.id": null,
				"city.id": null,
				"district.id": null,
				tabShow: true,
				isDraft: false,
				postageEnum: null,
				postageEnumName: null
			}
		});

		//获取分类
		vm.choiceSubClassify = JSON.parse(localStorage.getItem("baoma-choiceSubClassify"));
		//获取标签
		vm.choiceLabel = JSON.parse(localStorage.getItem("baoma-choiceLabel"));
		//获取时间
		vm.choiceDate = localStorage.getItem("baoma-choiceDate");

		if(JSON.parse(localStorage.getItem("baoma-provinceCityArea"))) {
			var provinceCityArea = JSON.parse(localStorage.getItem("baoma-provinceCityArea"));
			vm.locationCity = provinceCityArea.provinceName + provinceCityArea.cityName + provinceCityArea.areaName;
			vm["province.id"] = provinceCityArea.provinceId;
			vm["city.id"] = provinceCityArea.cityId;
			vm["district.id"] = provinceCityArea.areaId;
		} else {
			//定位城市 ....
			Utils.getLocationGaoDe(function(data) {
				vm.locationCity = data.addressObj.province + data.addressObj.city + data.addressObj.district;
				//13 获取省市区Id
				Utils.getSimpleJson({
					url: "/core/adminAreas/placeId",
					params: {
						provinceName: encodeURIComponent(data.addressObj.province),
						cityName: encodeURIComponent(data.addressObj.city),
						areaName: encodeURIComponent(data.addressObj.district)
					},
					fn: function(data) {
						vm["province.id"] = data.province.id;
						vm["city.id"] = data.city.id;
						vm["district.id"] = data.area.id;
					}
				});
			}, function(data) {
				console.log("定位失败");
			});
		};

	}

})(document, window, jQuery, Utils);