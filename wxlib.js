/**
 * wxlib.js
 */
(function(root , undefined) {
    window.__jsnop__ = {};
    var handlers = { 'ready': {}, 'trigger': {}, 'success' : {}},
        wx_url = 'http://res.wx.qq.com/open/js/jweixin-1.1.0.js',
        wx_instance,
        spa = 'http://api.logomap.com/wx/wx/getTicket',
        ua = window.navigator.userAgent.toLowerCase(),
        stamp = 0,
        plugins = {},
        ready = false;

    // 辅助函数
    var utils = {
        'fire':function(event , data){
            for(var i in handlers[event]){
                handlers[event][i](wx_share_cfg , data);
            }
        },
        'extend': function(obj , source){
            for(var prop in source)
                obj[prop] = source[prop];
            return obj;
        },

        'jsonp':function (url, callback) {
            var callbackName = 'jsonp_callback_' + new Date().getTime();
            __jsnop__[callbackName] = function (data) {
                delete __jsnop__[callbackName];
                document.body.removeChild(script);
                callback(data);
            };
            var script = document.createElement('script');
            script.src = url.replace("=?", "=" + "__jsnop__." + callbackName);
            document.body.appendChild(script);
        },

        'loadjs':function(src, fn){
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            if(typeof fn === "function"){
                script.onload = function() {
                    script.onload = null;
                    fn();
                };
            }
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        'path':function(path){
            // see https://github.com/seajs/seajs/blob/master/src/util-path.js
            var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//,
                basepath = (location.href.match(/[^?#]*\//) || [''])[0],
                first = path.charCodeAt(0);

            if (path.indexOf("//") === 0) {
                path = location.protocol + path;
            }else if(/^\/\/.|:\//.test(path)){

            }else if(first === 47 /* '/' */){
                path = location.protocol +"//" +location.host + path;
            }else{
                path = basepath + path;
            }

            path = path
                .replace(/\/\.\//g, "/") // /./ => /
                .replace(/([^:/])\/+\//g,"$1/"); //  a//b/c ==> a/b/c
            // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
            while (path.match(DOUBLE_DOT_RE)) {
                path = path.replace(DOUBLE_DOT_RE, "/");
            }
            return path;
        }
    };

    //wx分享配置
    var wx_share_cfg = {
        imgUrl: jsApiConfig.img,
        link: location.href,
        desc: jsApiConfig.desc,
        title: document.title || ' ',

        trigger : function () { utils.fire('trigger');},
        success : function () { utils.fire('success');},
        complete: function () { utils.fire('complete');},
        cancel  : function (res) {utils.fire('cancel' , res);},
        fail    : function (res) {utils.fire('fail' , res);}
    };

    function init(wx){
        if(wx === undefined){
            ready = true;
            utils.fire('ready');
        }else{
            if(typeof(jsApiConfig) == 'undefined'){
                utils.jsonp(spa+'?url='+encodeURIComponent(location.href) + "&callback=?", function(resp){
                    if(resp && resp.data){
                        //alert("spa:"+JSON.stringify(resp.data));
                        bind(wx , resp.data);
                    }
                })
            }else{
                bind(wx , jsApiConfig);
            }
        }

    }

    /**
     * 官方 jssdk 初始�?
     * @param wx: wx实例
     * @param jsApiConfig: 权限验证配置
     * @returns {*}
     */
    function bind(wx , jsApiConfig)
    {
        var support = typeof(jsApiConfig) != 'undefined' && wx && wx.config;
        if (support) {
            wx_instance = wx;
            wx.config({
                debug: false,
                appId: jsApiConfig.appId,
                timestamp: jsApiConfig.timestamp,
                nonceStr: jsApiConfig.nonceStr,
                signature: jsApiConfig.signature,
                jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
            });

            wx.ready(function () {
                ready = true;

                for(var i in plugins){
                    plugins[i](wx);
                }

                wx.onMenuShareAppMessage(wx_share_cfg);
                wx.onMenuShareTimeline(wx_share_cfg);
                wx.onMenuShareQQ(wx_share_cfg);
                wx.onMenuShareWeibo(wx_share_cfg);
                //alert(JSON.stringify(wx_share_cfg));
                //if(preReady) {preReady.call(wx,wx);}

                utils.fire('ready');
            });

            wx.error(function(){
                alert("wx config error");
            })
        }
    }


    var wechat = function(fn){
        if(ready){
            if(wx_instance){
                fn(wx_instance)
            }
            // fn(wx_share_cfg);
        }else{
            handlers['ready'][++stamp] = fn;
        }
    }

    utils.extend(wechat , {
        "add" : function(ns , factory){
            plugins[ns] = factory;
        },
        "setShare" : function(opts){
            utils.extend(wx_share_cfg , opts || {});
            if(wx_share_cfg.imgUrl)
                wx_share_cfg.imgUrl = utils.path(wx_share_cfg.imgUrl);
            //console.log('set share',opts,wx_share_cfg);
            return this;
        },
        "on":function(evt , fn){
            if(!handlers[evt]) handlers[evt] = {};
            handlers[evt][++stamp] = fn;
            return stamp;
        },
        "off":function(evt,id){
            if(handlers[evt])
                delete handlers[evt][id];
            return this;
        }
    })

    if(/micromessenger/i.test(ua))
    {
        if ( typeof define === "function" ) {
            define(function(require){
                var wx = require('http://res.wx.qq.com/open/js/jweixin-1.1.0.js');
                init(wx);
                return wechat;
            });
        } else if(root.wx && root.wx.config){
            init(root.wx);
        }else{
            utils.loadjs(wx_url , function(){
                init(root.wx);
            });
        }
    }

    root.wechat = wechat;
}(window,undefined));

/**
 *  meta 插件
 *      <meta name="weixin-title" content="分享标题">
 * */
(function( root , factory ) {
    if(root.wechat){
        factory(root.wechat);
    }
}( this , function(wechat) {
    var meta = (function(){
        var paras = document.getElementsByTagName("meta");
        var metas = {};
        for(var i=0;i<paras.length;i++){
            var name = paras[i].getAttribute("name");
            if(name) metas[name] = paras[i].getAttribute("content");
        }
        return function (v){
            return metas[v];
        }
    }());

    wechat.add('wechat.meta' , function(){
        var opts = {};
        if(meta("weixin-title")) opts['title'] = meta("weixin-title");
        if(meta("weixin-desc")) opts['desc'] = meta("weixin-desc");
        if(meta("weixin-link")) opts['link'] = meta("weixin-link");
        if(meta("weixin-icon")) opts['imgUrl'] = meta("weixin-icon");
        wechat.setShare(opts);
    });
}));


/**
 * 推广插件
 * */
(function( root , factory ) {
    if(root.wechat && root.jQuery){
        factory(root.wechat , root.jQuery);
    }
}( this , function(wechat , $) {
    if(!$){
        console.log('require jQuery!');
        return;
    }
    var meta = (function(){
        var paras = document.getElementsByTagName("meta");
        var metas = {};
        for(var i=0;i<paras.length;i++){
            var name = paras[i].getAttribute("name");
            if(name) metas[name] = paras[i].getAttribute("content");
        }
        return function (v){
            return metas[v];
        }
    }());

    function $$(s){ return document.querySelector(s); }

    function _getTitle(){
        var title =
            ($$('.m-header h2') && $$('.m-header h2').innerHTML)
            || ($$("article header h2") && $$("article header h2").innerHTML)
            || ($$("article header h2") && $$("article header h2").innerHTML)
            || document.title;
        // 使用f7�?
        if(window.Framework7){
            if($$('.page-on-center .m-header h2'))
                title = $$('.page-on-center .m-header h2').innerHTML;
            else
                title = document.title;
        }
        return title;
    }

    wechat.add('wechat.promotion' , function(){
        if(meta('promotion_type')){
            //修改分享地址为推广链接的地址
            wechat.on('trigger' , function(){
                var url = location.origin + location.pathname + location.hash,
                    title = _getTitle(),
                    type = meta('promotion_type') || "user";
                var guest = meta('promotion');
                if(window.__guest__ && window.__guest__.id){
                    guest = __guest__.id;
                }

                var wx_link = location.origin + location.pathname + '?promotion_user=' + guest + '&promotion_type='+type+'&promotion_name=' + encodeURIComponent(title) + '&promotion_url=' + encodeURIComponent(url) + location.hash;

                wechat.setShare({link:wx_link});
            });

            wechat.on('success' , function(){
                var url = location.origin + location.pathname + location.hash,
                    title = _getTitle(),
                    type = meta('promotion_type') || "user";

                var req = '/hapi/promotion/forwarding?promotion_act=send&promotion_type='+type+'&promotion_name='+encodeURIComponent(title)+'&promotion_url='+encodeURIComponent(url);
                $.getJSON(req , function(r){
                    console.log(r.status);
                });
            });
        }
    });
}));