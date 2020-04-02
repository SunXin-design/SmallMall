(function (win) {
    var str = GetQueryString("id");
    var gooid = GetQueryString("goodsId");
    var qnum = GetQueryString("quantity");
    var wery, integral, user, webSocket;
    var sxOrder = {
        init: function () {
            this.initAdderss();
            this.initCont(gooid,qnum);
            this.initIntegral();
            this.initAccClick();
        },
        initAdderss: function () {
            if (!str) {
                $.ajax({
                    url: "//localhost/api/address/default",
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        if (data.code == "SUCCESS") {
                            var html = template("test", data);
                            document.querySelector("#serrss").innerHTML = html;
                        } else {
                            if(data.errcode =="1103"){
                                $("#serrss").html(`${data.message}`);
                            }
                            showTip(data.message);
                        }

                    },
                    error: function (message) {
                        showTip("系统繁忙,稍后重试");
                    }
                })
            } else {
                $.ajax({
                    url: "//localhost/api/address/find/" + str,
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        if (data.code == "SUCCESS") {
                            var html = template("test", data);
                            document.querySelector("#serrss").innerHTML = html;
                        } else {
                            showTip(data.message);
                        }
                    },
                    error: function (message) {
                        showTip("系统繁忙,稍后重试");
                    }
                })
            }
        },
        initCont: function (gid,num) {
            if(gid && num){
                $(".aui-address-box-default").attr("href",`//localhost/shopping/address?goodsId=${gooid}&quantity=${qnum}`);
            }
            $.ajax({
                url: "//localhost/api/order/confirm",
                type: "get",
                dataType: "json",
                data: {
                    "goodsId": gid,
                    "quantity": num
                },
                success: function (data) {
                    if (data.code == "SUCCESS") {
                        var html = template("scont", data);
                        document.querySelector(".aui-list-product-float-item").innerHTML = html;
                        $("#integral").html(`积分：${data.integral}`);
                        $("#total").html(`￥${data.total}`);
                        $("#ders").attr("placeholder", `最多可输入${Math.ceil(data.total)*100}积分`);
                        wery = data.total;
                        integral = data.integral;
                        user = data.user;
                    } else {
                        showTip(data.message);
                    }
                },
                error: function (message) {
                    showTip("系统繁忙,稍后重试");
                }
            })
        },
        initIntegral: function () {
    	   $("input").blur(function () {
    	    	window.scrollTo(0, 0);
    	    	 var value = this.value;
    	         if ((value * 100) > integral) {
    	             showTip("您没有这么多积分，请重新填写");
    	             return;
    	         }
    	         if (value > Math.ceil(wery)) {
    	             showTip("积分超出，请重新填写");
    	             return;
    	         }
    	         var res = math.number(math.subtract(math.bignumber(wery),math.bignumber(value==""?0:value)))
    	         $("#total").text(`￥${res>=0? res:"0.00"}`);
    	    });
        },
        initAccClick: function () {
            $(".settlement").on("click", function () {
                var id = $("#add_id").val();
                var intr = $("#ders").val() * 100;
                sxOrder.initAccounts(id, intr);
            })
        },
        initAccounts: function (addid, inter) {
            showLoad();
            sxOrder.initSocket(addid, inter);
        },
        initSocket: function(addid, inter){
        	let baseUrl = "ws://localhost/websocket/" + user;
        	webSocket = new WebSocket(baseUrl);
        	webSocket.onopen = function(e) {
        		$.ajax({
                    url: "//localhost/api/order/buy",
                    type: "post",
                    data: {
                        addressId: addid,
                        integral: inter,
                        goodsId:gooid,
                        quantity:qnum
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.code == "SUCCESS") {
                            
                        } else {
                        	webSocket.close();
                            hideYar();
                            showTip(data.message);
                        }

                    },
                    error: function (message) {
                        hideYar();
                        showTip("系统繁忙,稍后重试");
                    }
                })
        	}
        	webSocket.onmessage = function(e) {
        		var data = JSON.parse(e.data);
        		if (data.code == "SUCCESS") {
        			webSocket.close();
                    if (data.isPay == 1) {
                        if (typeof WeixinJSBridge == "undefined") {
                            if (document.addEventListener) {
                                document.addEventListener('WeixinJSBridgeReady', sxOrder.initVX, false);
                            } else if (document.attachEvent) {
                                document.attachEvent('WeixinJSBridgeReady', sxOrder.initVX);
                                document.attachEvent('onWeixinJSBridgeReady', sxOrder.initVX);
                            }
                        } else {
                            sxOrder.initVX(data.appId, data.timeStamp, data.nonceStr, data.package, data.signType, data.paySign, data.orderNumber);
                        }
                    }else{
                        sxOrder.initMonitorOrder(data.orderNumber);
                    }
                } else {
                	webSocket.close();
                    hideYar();
                    showTip(data.message);
                }
        	}
        	webSocket.onclose = function(e) {
        		console.log("close");
        	}
        },
        initVX: function (appId, timeStamp, nonceStr, _package, signType, paySign, orderNumber) {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": appId,
                    "timeStamp": timeStamp,
                    "nonceStr": nonceStr,
                    "package": _package,
                    "signType": signType,
                    "paySign": paySign
                },
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        sxOrder.initMonitorOrder(orderNumber)
                    } else {
                        hideYar();
                        showTip("支付失败");
                    }
                });
        },
        initMonitorOrder: function (orderNumber) {
            $.ajax({
                url: "//localhost/api/monitorOrder",
                type: "post",
                dataType: "json",
                data: {
                    "orderNumber": orderNumber
                },
                complete: function () {
                    hideYar();
                },
                success: function (data) {
                    if (data.status) {
                        showTip("支付成功");
                        window.location.replace("//localhost/order/success?id="+orderNumber);
                    } else {
                        showTip("支付失败");
                    }
                },
                error: function (message) {
                    showTip("系统繁忙,请稍后重试");
                }
            })
        }

    }

    sxOrder.init();

})(window)
