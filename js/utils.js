constant = {
	server_path: "http://202.75.214.41:8092/platform/",
	commonParams: {},
	imgPre: "",
	filePre: "",
}

window.constant = constant;

/* author lgm
 * 全局公用方法
 * */
Utils = {

	//页面事件绑定
	cflagClick: function() {
		$("*[cflag]").unbind("click");
		$("body").on("click", "*[cflag]", function(e) {
			if(!$(this).is(".not-stopPropagation")) {
				e.stopPropagation();
			}
			fns[$(this).attr("cflag")]($(this));
		});
	},

	//mui页面事件绑定
	tap: function() {
		$("*[cflag]").unbind("tap");
		$("body").on("tap", "*[cflag]", function(e) {
			if(!$(this).is(".not-stopPropagation")) {
				e.stopPropagation();
			}
			fns[$(this).attr("cflag")]($(this));
		});
	},

	//mui页面长按事件绑定
	longTap: function() {
		$("*[ltflag]").unbind("longtap");
		$("body").on("longtap", "*[ltflag]", function() {
			fns[$(this).attr("ltflag")]($(this));
		});
	},

	//页面跳转统一处理
	surlClick: function() {
		$("*[surl]").unbind("click");
		$("body").on("click", "*[surl]", function() {
			var surl = $(this).attr("surl"),
				url = '';
			if(surl && surl != "") {
				if(surl.indexOf("{") > -1) {
					surl = surl.replace(/'/g, '"');
					var o = JSON.parse(Utils.formatJsonStr(surl));
					if(o.url) {
						url = o.url;
						if(o.params) {
							url += "?" + Utils.formatParams(o.params);
						}
						window.location.href = url;
					} else {
						alert("请配置surl中的url参数");
					}
				} else {
					window.location.href = surl;
				}
			} else {
				alert("请配置surl");
			}
		});
	},

	//把字符串格式化为标准的能转成json格式的字符串
	formatJsonStr: function(str) {
		str = str.replace(/'/g, '"').replace(/\{[a-zA-z]+\:/g, function(word) {
			if(word.indexOf("\"") > -1) {
				return word;
			} else {
				return '{"' + word.replace(/\{/g, "").replace(/\:/g, "") + '":';
			}
		}).replace(/\,[a-zA-z]+\:/g, function(word) {
			if(word.indexOf("\"") > -1) {
				return word;
			} else {
				return ',"' + word.replace(/\,/g, "").replace(/\:/g, "") + '":';
			}
		});
		return str;
	},

	//页面vue初始化
	//var obj = {vueData:{}, methods: {}, ready: fn, watch: {}, temp: {}}
	vueInit: function(obj) {
		var components = {};
		if(obj.temp) {
			for(var key in obj.temp) {
				var item = obj.temp[key],
					url = item,
					methods = {};
				if(item instanceof Object) {
					url = item.url;
					methods = (item.methods ? item.methods : {});
				}
				$.ajax({
					type: "get",
					url: "component/" + url,
					async: false,
					success: function(rs) {
						components[key] = {
							props: ['tempData', 'extData'], //模板数据，扩展数据
							template: rs,
							methods: methods
						};
					}
				});
			}
		}
		Utils.vueMethodCommon();
		if(obj.watch) {
			for(var key in obj.watch) {
				var flag = ((typeof obj.watch[key] != "function") && obj.watch[key].handler && (typeof obj.watch[key].handler == "function"));
				if(flag) {
					obj.watch[key].deep = true;
				}
			}
		}
		var vm = new Vue({
			el: 'body',
			data: ((obj && obj.vueData) ? obj.vueData : {}),
			ready: ((obj && obj.ready && (typeof obj.ready == "function")) ? obj.ready : function() {}),
			methods: ((obj && obj.methods) ? obj.methods : {}),
			watch: ((obj && obj.watch) ? obj.watch : {}),
			components: components
		});
		return vm;
	},

	//为vue初始化一些常用方法，这样在页面上就可以直接使用了
	vueMethodCommon: function() {
		Vue.prototype.$ = $;
		Vue.prototype.constant = constant;
		Vue.prototype.Utils = Utils;
	},

	//为vue添加一些特殊的处理的方法
	//var obj = {fnName: "", fn: }
	vueMethodAdd: function(obj) {
		Vue.prototype[obj.fnName] = obj.fn;
	},

	//boolean类型转换为字符串
	bTs: function(b) {
		return(b ? "true" : "false");
	},

	//数字格式化为千分位
	formatThousands: function(num) {
		if((num + "").trim() == "") {
			return "";
		}
		if(isNaN(num)) {
			return "";
		}
		num = num + "";
		if(/^.*\..*$/.test(num)) {
			var pointIndex = num.lastIndexOf(".");
			var intPart = num.substring(0, pointIndex);
			var pointPart = num.substring(pointIndex + 1, num.length);
			intPart = intPart + "";
			var re = /(-?\d+)(\d{3})/
			while(re.test(intPart)) {
				intPart = intPart.replace(re, "$1,$2")
			}
			num = intPart + "." + pointPart;
		} else {
			num = num + "";
			var re = /(-?\d+)(\d{3})/
			while(re.test(num)) {
				num = num.replace(re, "$1,$2")
			}
		}
		return num;
	},

	//把时长秒转化为 （时分秒)
	formatSeconds: function(value) {
		var theTime = parseInt(value); // 秒
		var theTime1 = 0; // 分
		var theTime2 = 0; // 小时
		var rs = {
			h: 0,
			m: 0,
			s: 0
		};
		if(theTime > 60) {
			theTime1 = parseInt(theTime / 60);
			theTime = parseInt(theTime % 60);
			if(theTime1 > 60) {
				theTime2 = parseInt(theTime1 / 60);
				theTime1 = parseInt(theTime1 % 60);
			}
		}
		rs.s = parseInt(theTime);
		if(theTime1 > 0) {
			rs.m = parseInt(theTime1);
		}
		if(theTime2 > 0) {
			rs.h = parseInt(theTime2);
		}
		return rs;
	},

	//使用moment做的时间相差处理
	timeHandle: function(time) {
		var text = "";
		if(time) {
			var diff = moment().diff(moment(Number(time))) / 1000;
			if(diff < 60) {
				text = "刚刚";
			} else if(diff >= 60 && diff < 3600) {
				text = (diff / 60).toFixed(0) + "分钟前";
			} else if(diff >= 3600 && diff < 86400) {
				text = (diff / 3600).toFixed(0) + "小时前";
			} else {
				text = moment(Number(time)).format("YYYY-MM-DD HH:mm:ss");
			}
		}
		return text;
	},

	//时间格式化
	timeFormat: function(time, hm, wxType) {
		var text = "";
		var suffix = ((hm && hm.toUpperCase() == "HM") ? " HH:mm" : "");
		var a = moment(),
			b = moment(Number(time));
		var d = a.diff(b, "days"),
			y = a.diff(b, "years");
		if(hm && hm.toUpperCase() == "YMD") {
			text = b.format("YYYY-MM-DD");
		} else {
			if(time) {
				if(d || y) { //跨天或跨年
					if(y) { //跨年
						text = b.format("YYYY年MM月DD日" + suffix);
					} else {
						text = b.format("MM月DD日" + suffix);
					}
					if(wxType && wxType == "wxType") {
						text = '<h1 class="time">' + b.format("DD") + '<span>' + b.format("MM") + '月</span></h1>';
					}
				} else {
					text = b.format("HH:mm");
					if(wxType && wxType == "wxType") {
						text = '<h1 class="today">今天</h1>';
					}
				}
			}
		}
		return text;
	},

	//把数字转成数组倒叙返回，用于v-for循环时，直接的数字遍历倒叙问题
	reverseNumArr: function(num1, num2) {
		var arr = [];
		for(var i = (num2 ? (num1 - 1) : 0); i < (num2 ? num2 : num1); i++) {
			arr[(num2 ? (i - (num1 - 1)) : i)] = i + 1;
		}
		return arr.reverse();
	},

	//阿拉伯数字转成中文（一，二，三）
	//需要引入js/plugins/numToChineseNum/numToChineseNum.js
	numToChineseNum: function(num) {
		return ekoo_2017_numToChineseNum.init(String(num));
	},

	//系统中常用的简单的获取json数据的请求
	//var obj = {params: {}, url: "",fn: ,noAsync: error, type: ""}
	getSimpleJson: function(obj) {
		if(obj) {
			var urlFlag = (obj.url.indexOf(".json") > -1 || obj.url.indexOf("http://") > -1 || obj.url.indexOf("https://") > -1);
			obj.url = (obj.url ? (urlFlag ? obj.url : (constant.server_path + obj.url)) : "");
			$.ajax({
				cache: false,
				type: (obj.type ? obj.type : "GET"),
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				data: $.extend((obj.params ? obj.params : {}), constant.commonParams),
				url: obj.url,
				dataType: "json",
				async: (obj.noAsync ? false : true),
				success: function(data) {
					if(urlFlag) {
						if(obj.fn && (typeof obj.fn == "function")) {
							obj.fn(data);
						}
					} else {
						if(data.success) {
							if(obj.fn && (typeof obj.fn == "function")) {
								obj.fn(data.resultData, data);
							}
						} else {
							alert('服务器错误<br>' + data.errorCtx.errorCode + '：' + data.errorCtx.errorMsg);
						}
					}
				},
				error: function(data) {
					if(obj.error && (typeof obj.error == "function")) {
						obj.error(data.responseJSON);
					} else {
						if(data.responseJSON && data.responseJSON.errorCtx) {
							alert('服务器错误<br>' + data.responseJSON.errorCtx.errorCode + '：' + data.responseJSON.errorCtx.errorMsg);
						} else {
							alert("接口报错了，请检查！！！<br>" + this.url);
						}
					}
				}
			});
		} else {
			alert("请配置参数");
		}
	},

	//封装ajax
	//var obj = {type: "", params:{},url: "", fn: , noAsync: , error:,}
	ajax: function(obj) {
		if(obj) {
			var urlParams = Utils.getUrlParams();
			var params = $.extend((obj.params ? obj.params : {}), constant.commonParams);
			obj.type = (obj.type ? obj.type : ((urlParams && urlParams.pageType) ? Utils.getReqType(urlParams.pageType) : "POST"));
			if(obj.type && (obj.type.toUpperCase() == "PUT" || obj.type.toUpperCase() == "DELETE")) {
				params["_method"] = obj.type.toUpperCase();
				obj.type = "POST";
			}
			var urlFlag = (obj.url.indexOf(".json") > -1 || obj.url.indexOf("http://") > -1 || obj.url.indexOf("https://") > -1);
			obj.url = (obj.url ? (urlFlag ? obj.url : (constant.server_path + obj.url)) : "");
			$.ajax({
				cache: false,
				data: params,
				type: obj.type,
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				url: obj.url,
				dataType: "json",
				async: (obj.noAsync ? false : true),
				success: function(data) {
					if(data.success || urlFlag) {
						if(obj.fn && (typeof obj.fn == "function")) {
							obj.fn(data);
						}
					} else {
						alert('服务器错误<br>' + data.errorCtx.errorCode + '：' + data.errorCtx.errorMsg);
					}
				},
				error: function(data) {
					if(obj.error && (typeof obj.error == "function")) {
						obj.error(data.responseJSON);
					} else {
						if(data.responseJSON && data.responseJSON.errorCtx) {
							alert('服务器错误<br>' + data.responseJSON.errorCtx.errorCode + '：' + data.responseJSON.errorCtx.errorMsg);
						} else {
							alert("接口报错了，请检查！！！<br>" + this.url);
						}
					}
				}
			});
		} else {
			alert("请配置obj");
		}
	},

	//ajaxSubmit封装
	//var obj = {form: ,type: "", params:{},url: "", fn: , error: ,noXhrFields: false}
	ajaxSubmit: function(obj) {
		if(obj) {
			var urlParams = Utils.getUrlParams();
			obj.type = (obj.type ? obj.type : ((urlParams && urlParams.pageType) ? Utils.getReqType(urlParams.pageType) : "POST"));
			var params = $.extend((obj.params ? obj.params : {}), constant.commonParams);
			if(obj.type && (obj.type.toUpperCase() == "PUT" || obj.type.toUpperCase() == "DELETE")) {
				params["_method"] = obj.type.toUpperCase();
				obj.type = "POST";
			}
			var urlFlag = (obj.url.indexOf(".json") > -1 || obj.url.indexOf("http://") > -1 || obj.url.indexOf("https://") > -1);
			obj.url = (obj.url ? (urlFlag ? obj.url : (constant.server_path + obj.url)) : "");
			obj.form.ajaxSubmit($.extend({
				type: obj.type,
				url: obj.url,
				data: params,
				dataType: "json",
				success: function(data) {
					if(data.success || urlFlag) {
						if(obj.fn && (typeof obj.fn == "function")) {
							obj.fn(data);
						}
					} else {
						alert('服务器错误<br>' + data.errorCtx.errorCode + '：' + data.errorCtx.errorMsg);
					}
				},
				error: function(data) {
					if(obj.error && (typeof obj.error == "function")) {
						obj.error(data.responseJSON);
					} else {
						if(data.responseJSON && data.responseJSON.errorCtx) {
							alert('服务器错误<br>' + data.responseJSON.errorCtx.errorCode + '：' + data.responseJSON.errorCtx.errorMsg);
						} else {
							alert("接口报错了，请检查！！！<br>" + this.url);
						}
					}
				}
			}, (obj.noXhrFields ? {} : {
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
			})));
		} else {
			alert("请配置参数");
		}
	},

	//截取字符串
	sub: function(str, start, end) {
		return str.slice(str.indexOf(start), str.indexOf(end)) + end;
	},

	//预览图片功能
	//相册外层class为lgm-img-preview-wrapper
	//需要此功能的图片需要加上imgflag属性
	previewImg: function() {
		$("*[imgflag]").unbind("click");
		$("body").on("click", "img[imgflag]", function(e) {
			var that = this;
			e.stopPropagation();
			$(window).resize(function() {
				that.resetPreImg();
			});
			var imgWrapperRoot = $(this).parents(".lgm-img-preview-wrapper");
			var imgs = null,
				single = true, //判断图片是否只有一张,默认一张
				imgLength = 0,
				imgIndex = 0;
			if(imgWrapperRoot.length) {
				imgs = imgWrapperRoot.find("img[imgflag]");
				imgIndex = imgs.index($(this));
				imgLength = imgs.length;
				if(imgLength > 1) {
					single = false;
				}
			}
			var root = $('<div class="preview-img-wrapper-123-ekoo-lgm">' +
				'<img imgpre src="' + replaceImgSuffix($(this).attr("src")) + '">' +
				(single ? '' : ('<span class="arrow-left"><</span><span class="arrow-right">></span><h3 class="imgPage">' + (imgIndex + 1) + '/' + imgLength + '</h3>')) +
				'<div class="lgm-preview-img-mask" style="text-align:center;"><span style="color:white;font-size:18px;" class="loading-span">正在加载中，请稍后。。。<span></div>' +
				'</div>');
			var winWidth = $(window).width();
			var winHeight = $(window).height();
			root.find(".lgm-preview-img-mask").css({
				"height": winHeight + "px"
			}).find(".loading-span").css({
				"line-height": winHeight + "px"
			});
			root.find("img[imgpre]").on("load", function() { //图片加载完成之后,显示图片及计算定位
				setTimeout(function() {
					root.find(".lgm-preview-img-mask .loading-span").hide();
					that.resetPreImg();
				}, 10);
			});
			root.find(".lgm-preview-img-mask").unbind("click").click(function() {
				$(this).parent().remove();
				$(document).unbind("keydown");
				$("body").css("overflow-y", "auto");
			});
			if($(".preview-img-wrapper-123-ekoo-lgm").length) {
				$(".preview-img-wrapper-123-ekoo-lgm").remove();
			}
			$("body").append(root);
			root.find(".arrow-left,.arrow-right").unbind("click").click(function() { //左右翻图点击
				if($(this).is(".arrow-left")) {
					(imgIndex > 0) && imgIndex--;
				} else {
					(imgIndex < (imgLength - 1)) && imgIndex++;
				}
				root.find("img[imgpre]").attr("src", replaceImgSuffix(imgs.eq(imgIndex).attr("src")));
				root.find("img[imgpre]").css({
					"visibility": "hidden"
				});
				root.find("h3.imgPage").html((imgIndex + 1) + "/" + imgLength);
			});
			$(document).unbind("keydown").keydown(function(e) { //键盘左右键翻图
				if(e.keyCode == "37" || e.keyCode == "38") { //左或上
					root.find(".arrow-left").click();
				} else if(e.keyCode == "39" || e.keyCode == "40") { //右或下
					root.find(".arrow-right").click();
				}
			});
			$("body").css("overflow-y", "hidden");
			that.resetPreImg = function() {
				var winWidth = $(window).width();
				var winHeight = $(window).height();
				root.find(".lgm-preview-img-mask").css({
					"height": winHeight + "px"
				}).find(".loading-sapn").css({
					"line-height": winHeight + "px"
				});
				root.find(".arrow-left, .arrow-right").css({
					"top": (winHeight - 80) / 2 + "px"
				});
				root.find("h3.imgPage").css({
					"left": (winWidth - 40) / 2 + "px"
				});
				root.find("img[imgpre]").css({
					"max-height": winHeight * 0.8 + "px"
				});
				var imgWidth = root.find("img[imgpre]").width();
				var imgHeight = root.find("img[imgpre]").height();
				root.find("img[imgpre]").css({
					"left": (winWidth - imgWidth) / 2 + "px",
					"top": (winHeight - imgHeight) / 2 + "px",
					"visibility": "visible"
				});
			}
		});

		function replaceImgSuffix(src) {
			return src.replace(".thumbnail", "");
		}
	},

	//表单验证
	//var obj = {form: form, fn: callback} 
	formValidate: function(obj) {
		var form = obj.form;
		var flag = form.valid();
		flag && (obj.fn());
	},

	//图片异步提交实现
	//var obj = {inputName: "",multiple: true, type: "", url: "",  fn: ,local: false}
	asyncImg: function(obj) {
		var inputName = ((obj && obj.inputName) ? obj.inputName : "file");
		var multiple = ((obj && obj.multiple) ? 'multiple="multiple"' : '');
		var html = '<form id="lgm_async_demo_form" style="display: none !important;">' +
			'<input type="file" accept="image/*" name="' + inputName + '" ' + multiple + '/>' +
			'</form>';
		var form = $("#lgm_async_demo_form");
		if(form && form.length > 0) {
			form.remove();
		}
		$("body").append(html);
		$("#lgm_async_demo_form input[type=file]").unbind("change").change(function(e) {
			Utils.getSimpleJson({
				url: "#",
				fn: function(data) {
					var qiniuUploadUrl = "";
					if(window.location.protocol === 'https:') {
						qiniuUploadUrl = 'https://up.qbox.me';
					} else {
						qiniuUploadUrl = 'http://upload.qiniu.com';
					}
					Utils.ajaxSubmit({
						noXhrFields: true,
						form: $("#lgm_async_demo_form"),
						params: {
							token: data
						},
						url: qiniuUploadUrl,
						fn: function(result) {
							if(obj.fn && (typeof obj.fn == "function") && result) {
								obj.fn(result.key, result);
							}
							console.log("图片上传成功");
						}
					});
				}
			});
		}).click();
	},

	//上传base64图片至七牛云
	//var obj = {dataUrl: ""}
	upBase64Img: function(obj) {
		if(obj) {
			Utils.getSimpleJson({
				url: "#",
				fn: function(data) {
					var qiniuUploadUrl = "";
					if(window.location.protocol === 'https:') {
						qiniuUploadUrl = 'https://up.qbox.me/putb64/-1';
					} else {
						qiniuUploadUrl = 'http://upload.qiniu.com/putb64/-1';
					}
					$.ajax({
						type: "POST",
						url: qiniuUploadUrl,
						data: obj.dataUrl.replace("data:image/jpeg;base64,", ""), //这里是重点，特殊的传参形式
						headers: {
							Authorization: "UpToken " + data.token
						},
						success: function(s) {
							obj.fn && (typeof obj.fn == "function") && obj.fn(s);
						}
					});
				}
			});
		} else {
			alert("请为Utils.upBase64Img配置参数");
		}
	},

	//文件异步提交实现
	//var obj = {inputName: "",multiple: true, type: "", url: "", fn: }
	asyncFile: function(obj) {
		var inputName = ((obj && obj.inputName) ? obj.inputName : "file");
		var multiple = ((obj && obj.multiple) ? 'multiple="multiple"' : '');
		var html = '<form id="lgm_async_demo_form" style="display: none !important;">' +
			'<input type="file" name="' + inputName + '" ' + multiple + '/>' +
			'</form>';
		var form = $("#lgm_async_demo_form");
		if(form && form.length > 0) {
			form.remove();
		}
		$("body").append(html);
		$("#lgm_async_demo_form input[type=file]").unbind("change").change(function(e) {
			var fileName = $(this).val();
			Utils.getSimpleJson({
				url: "#",
				fn: function(data) {
					var qiniuUploadUrl = "";
					if(window.location.protocol === 'https:') {
						qiniuUploadUrl = 'https://up.qbox.me';
					} else {
						qiniuUploadUrl = 'http://upload.qiniu.com';
					}
					Utils.ajaxSubmit({
						noXhrFields: true,
						form: $("#lgm_async_demo_form"),
						params: {
							token: data
						},
						url: qiniuUploadUrl,
						fn: function(result) {
							$.get(constant.filePre + result.key + "?avinfo", function(rs) {
								result.fileInfo = rs;
								if(obj.fn && result) {
									result.fileName = fileName;
									obj.fn(result);
								}
								console.log("文件上传成功\n", result);
							});
						}
					});
				}
			});
		}).click();
	},

	//获取url路径中的参数
	getUrlParams: function(url) {
		url = url ? url : window.location.href;
		var obj = {};
		if(url.indexOf("?") > -1) {
			url = url.split("?");
			url = url[url.length - 1].split("&");
			for(var i = 0; i < url.length; i++) {
				var item = url[i];
				var param = item.split("=");
				if(obj[param[0]]) {
					if(obj[param[0]] instanceof Array) {
						obj[param[0]].push(param[1]);
					} else {
						var arr = [];
						arr.push(obj[param[0]]);
						arr.push(param[1]);
						obj[param[0]] = arr;
					}
				} else {
					obj[param[0]] = param[1];
				}
			}
		} else {
			console.log("此url:" + url + "无参数");
		}
		return obj;
	},

	//把一个对象格式化为url路径中能用的参数格式
	formatParams: function(obj) {
		obj = $.extend(obj, constant.commonParams);
		var arr = [];
		for(var key in obj) {
			if(obj[key] instanceof Array) {
				for(var i = 0; i < obj[key].length; i++) {
					arr.push(key + "=" + obj[key][i]);
				}
			} else {
				arr.push(key + "=" + obj[key]);
			}
		}
		return arr.join("&");
	},

	//截取数组固定长度
	shortenArr: function(arr, length) {
		var newArr = arr.filter(function(item, index, oldArr) {
			if(index >= length) {
				return false;
			} else {
				return true;
			}
		});
		return newArr;
	},

	//生成指定范围随机数
	//min ≤ r ≤ max
	randomNum: function(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	},

	//form表单添加自定义正则验证方法
	validateCustomMethod: function() {
		if($.validator && $.validator.addMethod) {
			//此方法为直接在html标签中写正则，为通用正则验证方法
			$.validator.addMethod("valid-regex", function(value, element, params) {
				var validRule = $(element).attr('valid-rule');
				var exp = new RegExp(validRule);
				return this.optional(element) || exp.test(value);
			}, "正则验证不通过！");
			//以下为常用正则验证
			$.validator.addMethod("valid-mobile", function(value, element, params) {
				var regExp = /^1[3,5,7,8]\d{9}$/;
				return this.optional(element) || (regExp.test(value));
			}, "请输入正确的手机号码！");
			$.validator.addMethod("valid-idcard", function(value, element, params) {
				var regExp = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
				return this.optional(element) || (regExp.test(value));
			}, "请输入正确的身份证号！");
		}
		if($.validator && $("form").length) { //初始化验证
			$("form").validate();
		}
	},

	//form表单数据格式化为对象
	//var obj = {form: ,delArr: []}
	formToObj: function(obj) {
		if(obj && obj.form && obj.form.length) {
			var rs = {};
			obj.form.serializeArray().forEach(function(item, index) {
				rs[item.name] = item.value;
			});
			if(obj.delArr) {
				obj.delArr.forEach(function(item, index) {
					delete rs[item];
				});
			}
			return rs;
		} else {
			alert("请为Utils.formToObj提供参数");
		}
	},

	//所有页面的统一返回处理
	commonBackPrePage: function() {
		$("body").on("click", ".back-pre-page", function(e) {
			e.stopPropagation();
			window.history.go(-1);
		});
	},

	//判断是不是微信浏览器(是用来处理微信浏览器不能下载文件做的判断)
	isWxBrowser: function() {
		var flag = false;
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == "micromessenger") {
			flag = true;
		}
		return flag;
	},

	//判断是苹果还是安卓
	isApple: function() {
		var flag = false;
		var ua = navigator.userAgent.toLowerCase();
		if(/iphone|ipad|ipod/.test(ua)) {
			flag = true;
		} else if(/android/.test(ua)) {

		}
		return flag;
	},

	//config接口注入权限验证配置
	wxConfigInit: function() {
		Utils.getSimpleJson({
			url: "#",
			params: {
				url: window.location.href,
			},
			fn: function(data) {
				wx.config({
					debug: false,
					appId: data.appId,
					timestamp: data.timestamp,
					nonceStr: data.nonceStr,
					signature: data.signature,
					jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
				});
			}
		});
	},

	//可控日期组件
	//var obj = {selector: "", visibleArr:[], selectFn: }
	datePicker: function(obj) {
		if(obj) {
			$((obj.selector ? obj.selector : ".lgm-datePicker")).datepicker({
				showOtherMonths: true,
				selectOtherMonths: true,
				//dateFormat: "yy-mm-dd",
				onChangeMonthYear: function(year, month, widget) {},
				beforeShowDay: function(d) {
					var time = moment(d).format("YYYY-MM-DD");
					for(var i = 0; i < obj.visibleArr.length; i++) {
						if(obj.visibleArr[i] == time) {
							return [true, 'highlight', ""];
						}
					}
					return [false, '', ''];
				},
				onSelect: function(selectDate) {
					obj.selectFn && (typeof obj.selectFn == "function") && obj.selectFn(selectDate);
				}
			});
		} else {
			alert("请为Utils.datePicker配置参数");
		}
	},

	//统一对密码进行加密
	md5Pwd: function(pwd) {
		for(var i = 0; i < 1024; i++) {
			pwd = $.md5(pwd);
		}
		return pwd;
	},

	//对象的克隆，切记对象的复制与克隆的区别
	clone: function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},

	//数组元素互换
	//var obj = {arr: ,index1: ,index2: }
	arrSwitchEle: function(obj) {
		obj.arr[obj.index2] = obj.arr.splice(obj.index1, 1, obj.arr[obj.index2])[0];
		return obj.arr;
	},

	//密码式弹出框
	pwdBox: {
		//初始化
		//var obj = {html: "",clickFn: ,delFn: ,className: "", maskClose: false}
		init: function(obj) {
			var $this = this;
			if(obj) {
				if($("#ekoo_pwd_box_2017_hello").length) {
					$("#ekoo_pwd_box_2017_hello").remove();
				}
				var tmp = $('<div class="' + (obj.className ? obj.className : "") + ' ekoo-pwd-box password-box" id="ekoo_pwd_box_2017_hello"><div class="ekoo-pwd-box-inner-box"><div class="ekoo-pwd-box-content-wrapper">' +
					(obj.html ? obj.html : "") +
					'</div><div class="ekoo-pwd-box-input-box"><div class="ekoo-pwd-box-flexable"><div class="ekoo-pwd-box-input-key"data-label="1"></div><div class="ekoo-pwd-box-input-key"data-label="2"></div>' +
					'<div class="ekoo-pwd-box-input-key"data-label="3"></div></div><div class="ekoo-pwd-box-flexable"><div class="ekoo-pwd-box-input-key"data-label="4"></div><div class="ekoo-pwd-box-input-key"data-label="5"></div>' +
					'<div class="ekoo-pwd-box-input-key"data-label="6"></div></div><div class="ekoo-pwd-box-flexable"><div class="ekoo-pwd-box-input-key"data-label="7"></div><div class="ekoo-pwd-box-input-key"data-label="8"></div>' +
					'<div class="ekoo-pwd-box-input-key"data-label="9"></div></div><div class="ekoo-pwd-box-flexable"><div></div><div class="ekoo-pwd-box-input-key"data-label="0"></div><div class="ekoo-pwd-box-input-key"data-label="del">' +
					'</div></div></div></div></div>');
				$("body").append(tmp);
				if(obj.maskClose) {
					tmp.unbind("click").click(function(e) {
						//e.stopPropagation();
						var target = $(e.target);
						if(!target.parents(".ekoo-pwd-box-inner-box").length) {
							$("#ekoo_pwd_box_2017_hello").removeClass("go-it");
							setTimeout(function() {
								$this.destroy();
							}, 300);
						}
					});
				}
				tmp.find(".ekoo-pwd-box-input-box .ekoo-pwd-box-input-key").unbind("click").click(function(e) {
					e.stopPropagation();
					var val = $(this).attr("data-label");
					if(val == "del") {
						obj.delFn && (typeof obj.delFn == "function") && obj.delFn();
					} else {
						obj.clickFn && (typeof obj.clickFn == "function") && obj.clickFn(val);
					}
				});
				setTimeout(function() {
					$("#ekoo_pwd_box_2017_hello").addClass("go-it")
				}, 10);
			} else {
				alert("请为Utils.pwdBox.init配置参数");
			}
		},
		//销毁
		destroy: function() {
			$("#ekoo_pwd_box_2017_hello").remove();
		}
	},

	//手机摇一摇
	//var obj = {fn: ,}
	shake: function(obj) {
		if(window.DeviceMotionEvent) {
			var audio_shake = document.createElement("audio");
			audio_shake.src = 'resource/shakes.mp3';
			var last_update = new Date().getTime();
			var x = y = z = last_x = last_y = last_z = 0;
			window.addEventListener('devicemotion', function(e) {
				var acceleration = e.accelerationIncludingGravity;
				var curTime = new Date().getTime();
				if((curTime - last_update) > 100) {
					var diffTime = curTime - last_update;
					last_update = curTime;
					x = acceleration.x;
					y = acceleration.y;
					z = acceleration.z;
					var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
					if(speed > 4000) {
						audio_shake.play();
						obj.fn && (typeof obj.fn == "function") && obj.fn();
					}
					last_x = x;
					last_y = y;
					last_z = z;
				}
			}, false);
		} else {
			alert('抱歉，您的设备不支持摇一摇功能');
		}
	},

	muiInit: function() {
		mui.init({
			swipeBack: true, //启用右滑关闭功能
			gestureConfig: {
				tap: true, //默认为true
				doubletap: true, //默认为false
				longtap: true, //默认为false
				swipe: true, //默认为true
				drag: true, //默认为true
				hold: false, //默认为false，不监听
				release: false //默认为false，不监听
			}
		});
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005
		});
	},

	//上拉加载,下拉刷新
	//var obj = {container: , scrollBar: ,downEnable: fasle, downFn: ,upFn: }
	pullLoad: function(obj) {
		new PullLoad({
			container: $(obj.container)[0],
			scrollBar: $(obj.scrollBar ? obj.scrollBar : "body")[0],
			down: {
				distance: 50,
				enable: (obj.downEnable ? true : false),
				callback: function(end) {
					obj.downFn(end);
				}
			},
			up: {
				distance: 50,
				isScrollLoad: false,
				isInitLoad: true,
				enable: true,
				callback: function(end) {
					obj.upFn(end);
				}
			}
		});
	},

	commonInit: function() {
		Utils.cflagClick();
		Utils.surlClick();
		Utils.commonBackPrePage();
		Utils.validateCustomMethod();
	}
};

window.Utils = Utils;
Utils.commonInit();