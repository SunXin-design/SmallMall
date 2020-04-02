var buttonHtml;
$(function () {
    var order_number = param("order");
    initDetail(order_number);

    $("#button_model").on("click", ".cancel_order", function () {
        var cancel_number = $(this).attr("data-order");
        showLogin("是否取消订单!", () => {
            $.ajax({
                url: "//localhost/api/order/cancel/" + cancel_number,
                type: "post",
                dataType: "json",
                success: function (data) {
                    if (data.code == "SUCCESS") {
                        showTip("订单已取消！");
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    } else {
                        showTip(data.message);
                    }
                }

            })
        })
    })

    $("#button_model").on("click", ".order_pay", function () {
        var cancel_number = $(this).attr("data-order");
        showLoad();
        $.ajax({
            url: "//localhost/api/order/pay/" + cancel_number,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.code == "SUCCESS") {
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady(data.appId, data.timeStamp, data.nonceStr, data.package, data.signType, data.paySign, data.orderNumber);
                    }
                } else {
                    hideYar();
                    showTip(data.message);
                }
            },
            error: function (message) {
                hideYar();
                showTip("系统繁忙,请稍后重试");
            }

        })

    })
    $("#button_model").on("click", ".order_reminder", function () {
        var cancel_number = $(this).attr("data-order");
        $.ajax({
            url: "//localhost/api/order/reminder/" + cancel_number,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.code == "SUCCESS") {
                    showTip("已提醒发货！");
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                } else {
                    showTip(data.message);
                }
            }
        })
    })
    $("#button_model").on("click", ".order_confirm", function () {
        var cancel_number = $(this).attr("data-order");
        showLogin("是否确认收货!", () => {
            $.ajax({
                url: "//localhost/api/order/confirm/" + cancel_number,
                type: "post",
                dataType: "json",
                success: function (data) {
                    if (data.code == "SUCCESS") {
                        showTip("已确认收货！");
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    } else {
                        showTip(data.message);
                    }
                }
            })
        });
    })
    $("#button_model").on("click", ".order_delete", function () {
        var cancel_number = $(this).attr("data-order");
        showLogin("是否删除订单!", () => {
            $.ajax({
                url: "//localhost/api/order/delete/" + cancel_number,
                type: "post",
                dataType: "json",
                success: function (data) {
                    if (data.code == "SUCCESS") {
                        showTip("订单已删除！");
                        setTimeout(function () {
                            window.history.go(-1);
                        }, 2000);
                    } else {
                        showTip(data.message);
                    }
                }

            })
        })
    })
})

function initDetail(order_number) {
    $.ajax({
        url: "//localhost/api/user/order/" + order_number,
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data.code == "SUCCESS") {
                $(".user_name").text(data.address.name);
                $(".user_phone").text(data.address.phone);
                $(".order_number").text(data.orderNumber);
                $(".order_status").text(data.status);
                $(".order_creatTime").text(data.creatTime);
                if (data.payTime) {
                    $(".order_pay_item").append(`<div class="aui-dri"></div>
						            <a href="javascript:;" class="aui-address-cell aui-fl-arrow aui-fl-arrow-clear">
						                <div class="aui-address-cell-bd">付款时间: </div>
						                <div class="aui-address-cell-ft order_pay">${data.payTime}</div>
						            </a>`);
                }
                if (data.useIntegral) {
                    $(".order_score_item").append(`<div class="aui-dri"></div>
						            <a href="javascript:;" class="aui-address-cell aui-fl-arrow aui-fl-arrow-clear">
						                <div class="aui-address-cell-bd">所用积分: </div>
						                <div class="aui-address-cell-ft order_pay">${data.useIntegral}</div>
						            </a>`);
                }
                if (data.shipTime) {
                    $(".order_ship_item").append(`<div class="aui-dri"></div>
						            <a href="javascript:;" class="aui-address-cell aui-fl-arrow aui-fl-arrow-clear">
						                <div class="aui-address-cell-bd">发货时间: </div>
						                <div class="aui-address-cell-ft order_pay">${data.shipTime}</div>
						            </a>`);
                }
                if (data.confirmTime) {
                    $(".order_confirm_item").append(`<div class="aui-dri"></div>
						            <a href="javascript:;" class="aui-address-cell aui-fl-arrow aui-fl-arrow-clear">
						                <div class="aui-address-cell-bd">完成时间: </div>
						                <div class="aui-address-cell-ft order_pay">${data.confirmTime}</div>
						            </a>`);
                }
                if (data.cancelTime) {
                    $(".order_cancel_item").append(`<div class="aui-dri"></div>
						            <a href="javascript:;" class="aui-address-cell aui-fl-arrow aui-fl-arrow-clear">
						                <div class="aui-address-cell-bd">取消时间: </div>
						                <div class="aui-address-cell-ft order_pay">${data.cancelTime}</div>
						            </a>`);
                }
                if (data.mailno) {
                    $(".order_mailno_item").append(`<div class="aui-dri"></div>
						            <a href="javascript:;" class="aui-address-cell aui-fl-arrow aui-fl-arrow-clear">
						                <div class="aui-address-cell-bd">快递单号: </div>
						                <div class="aui-address-cell-ft order_pay" style="padding-right: 10px;">${data.mailno}</div>
                                        <button class="di_btn" onclick="copyText(${data.mailno})">复制</button>
						            </a>`);
                }
                if (data.ttl) {
                    $(".un_pay_warn").show();
                    var maxtime = data.ttl;
                    $("#timer").text("距离结束还有" + Math.floor(maxtime / 60) + "分" + Math.floor(maxtime % 60) + "秒");
                    var timer = setInterval(function () {
                        if (maxtime >= 0) {
                            minutes = Math.floor(maxtime / 60);
                            seconds = Math.floor(maxtime % 60);
                            msg = "距离结束还有" + minutes + "分" + seconds + "秒";
                            $("#timer").text(msg);
                            --maxtime;
                        } else {
                            clearInterval(timer);
                            window.location.reload();
                        }
                    }, 1000);
                    $(".aui-address-content").css("padding-top", "0");
                } else {
                    $(".un_pay_warn").remove();
                }
                $(".user_address").text(data.address.province + data.address.city + data.address.district + data.address.address);
                product_model(data.goods);
                buttonBlock(data.statusCode, data.orderNumber, data.payTotal);
                $("#button_model").html(buttonHtml);
            }
        }

    })
}

function param(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURI(r[2]);
    return null;
}

function buttonBlock(statusCode, orderNumber, total) {
    if (statusCode == 0) {
        buttonHtml = `<a class="cancel_order" data-order="${orderNumber}">取消订单</a><a data-order="${orderNumber}" class="red-color order_pay">立即付款</a>`;
        $(".shop-total").append(`<span class="aui-red aui-size" style="padding: 12px 0">实付款: ￥<em>${total}</em></span>`);
    } else if (statusCode == 1) {
        buttonHtml = `<a data-order="${orderNumber}" class="red-color order_reminder">提醒发货</a>`;
        $(".shop-total").append(`<span class="aui-red aui-size" style="padding: 12px 0">实付款: ￥<em>${total}</em></span>`);
    } else if (statusCode == 2) {
        buttonHtml = `<a data-order="${orderNumber}" class="red-color order_confirm">确认收货</a>`;
        $(".shop-total").append(`<span class="aui-red aui-size" style="padding: 12px 0">实付款: ￥<em>${total}</em></span>`);
    } else if (statusCode == 3) {
        buttonHtml = `<a data-order="${orderNumber}" class="red-color order_delete">删除订单</a>`;
        $(".shop-total").append(`<span class="aui-red aui-size" style="padding: 12px 0">实付款: ￥<em>${total}</em></span>`);
    } else if (statusCode == 5) {
        buttonHtml = `<a data-order="${orderNumber}" class="red-color order_delete">删除订单</a>`;
        $(".shop-total").empty();
    }
}

function product_model(data) {
    $.each(data, function (x, y) {
        $("#aui-list-product-float-item-block").append(`<div class="aui-list-product-float-item">
				    <a href="javascript:;" class="aui-list-product-fl-item">
				        <div class="aui-list-product-fl-img">
				            <img src="${y.image}" alt="">
				        </div>
				        <div class="aui-list-product-fl-text">
				            <h3 class="aui-list-product-fl-title">${y.goodsName}</h3>
				            <div class="aui-list-product-fl-mes">
				                <div>
				                    <span class="aui-list-product-item-price">
				                        <em>¥</em>
				                        ${y.goodPrice}
				                    </span>
				                </div>
				                <div class="aui-btn-purchase">
				                    <span>x${y.quantity}</span>
				                </div>
				            </div>
				        </div>
				    </a>
			</div>`)
    });
}

function onBridgeReady(appId, timeStamp, nonceStr, _package, signType, paySign, orderNumber) {
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
                            window.location.replace("//localhost/order/success?id=" + orderNumber);
                        } else {
                            showTip("支付失败");
                        }
                    },
                    error: function (message) {
                        showTip("系统繁忙,请稍后重试");
                    }
                })
            } else {
                hideYar();
                showTip("支付失败");
            }
        });
}

//弹窗
function showTip(name) {
    layer.open({
        content: name,
        time: 2,
        shade: false
    });
}

//复制功能
function copyText(sunt) {
    var clipboard2 = new ClipboardJS('.di_btn', {
        text: function () {
            return sunt;
        }
    });
    clipboard2.on('success', function (e) {
        showTip("复制成功");
    });
    clipboard2.on('error', function (e) {
        showTip("复制失败");
    });
}

//加载
function showLoad() {
    layer.open({
        type: 2,
        shadeClose: false
    });
}
//是否提示层、
function showLogin(name, ajax) {
    layer.open({
        title: '提示',
        content: name,
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            ajax();
        },
        cancel: function () {
            return false
        }
    });
}

function hideYar() {
    layer.closeAll('loading'); //关闭加载层
}
