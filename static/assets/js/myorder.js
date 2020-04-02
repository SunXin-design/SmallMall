var pageNo = 1,
    page;
$(function () {
    $.ajax({
        url: "//localhost/api/user/order",
        type: "get",
        dataType: "json",
        cache: false,
        data: {
            "status": "",
            "pageNo": 1
        },
        success: function (data) {
            if (data.code == "SUCCESS") {
                page = data.page;
                basicOrder(data.list);
                unOrder(page);
                if (page > 1) {
                    $(".look_more").show();
                } else {
                    $(".look_more").hide();
                }
            }
        }

    })
    initOrder(pageNo);
    $(".more").click(function () {
        pageNo++;
        if (pageNo <= page) {
            moreOrder($(this).attr("data-id"), pageNo);
        } else {
            console.log(pageNo);
            if (pageNo == (page + 1)) {
                $(".look_more").after('<div class="un_more_order" style="text-align: center;"><span style="padding: 5px 30px;display: inline-block;color:#999">没有更多订单了</span></div>')
                $(".look_more").hide();
            }
            //			showTip("没有更多订单了！");
        }
    })
    /*监听滚动条事件*/
    $(window).scroll(function () {
        /*滚动的高度*/
        var toal = $(document).scrollTop();
        /*整个页面的高度*/
        var all_hei = $(document).height();
        /*看到的高度*/
        var add_hei = $(window).height();

        if (!(all_hei - add_hei - toal)) {
            $(".more").trigger('click');
        }
    })
    $("#order_whole").on("click", ".J_order", function () {
        window.location.href = "orderinfo?order=" + $(this).attr("data-order");
    })
    $("#order_whole").on("click", ".cancel_order", function () {
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
                            $("#" + cancel_number).remove();
                        }, 2000);
                    } else {
                        showTip(data.message);
                    }
                }
            })
        })
    })
    $("#order_whole").on("click", ".order_reminder", function () {
        var cancel_number = $(this).attr("data-order");
        $.ajax({
            url: "//localhost/api/order/reminder/" + cancel_number,
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.code == "SUCCESS") {
                    showTip("已提醒发货！");
                } else {
                    showTip(data.message);
                }
            }

        })
    })
    $("#order_whole").on("click", ".order_confirm", function () {
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
                            $("#" + cancel_number).remove();
                        }, 2000);
                    } else {
                        showTip(data.message);
                    }
                }

            })
        })
    })
    $("#order_whole").on("click", ".order_delete", function () {
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
                            $("#" + cancel_number).remove();
                        }, 2000);
                    } else {
                        showTip(data.message);
                    }
                }
            })
        })
    })
    /*立即付款*/
    $("#order_whole").on("click", ".order_pay", function () {
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
})

function initOrder(cur_page) {
    $(".tab-nav-item").click(function () {
        $("#order_whole").empty();
        $(".un_more_order").remove();
        pageNo = 1;
        $(".tab-nav-item").removeClass("tab-active");
        $(this).addClass("tab-active");
        var fn = $(this).attr("data-role");
        var status = $(this).attr("data-id");
        $(".more").attr("data-id", status);
        $.ajax({
            url: "//localhost/api/user/order",
            type: "get",
            dataType: "json",
            cache: false,
            data: {
                "status": status,
                "pageNo": cur_page
            },
            success: function (data) {
                if (data.code == "SUCCESS") {
                    page = data.page;
                    basicOrder(data.list);
                    unOrder(page);
                    if (page > 1) {
                        $(".look_more").show();
                    } else {
                        $(".look_more").hide();
                    }
                }
            }

        })
    })
}

function moreOrder(status, pageNo) {
    $.ajax({
        url: "//localhost/api/user/order",
        type: "get",
        dataType: "json",
        cache: false,
        data: {
            "status": status,
            "pageNo": pageNo
        },
        success: function (data) {
            if (data.code == "SUCCESS") {
                page = data.page;
                basicOrder(data.list);
            }
        }

    })
}

function basicOrder(order) {
    var strHtml = "";
    $.each(order, function (x, y) {
        var un_pay_html = '<div class="aui-list-title-btn">' +
            '<a class="cancel_order" href="#" data-order="' + y.orderNumber + '">取消订单</a>' +
            '<a href="#" class="red-color order_pay" data-order="' + y.orderNumber + '">立即付款</a>' +
            '</div>';
        var wait_out_html = '<div class="aui-list-title-btn">' +
            '<a class="red-color order_reminder" data-order="' + y.orderNumber + '">提醒发货</a>' +
            '</div>';
        var wait_in_html = '<div class="aui-list-title-btn">' +
            '<a class="red-color order_confirm" data-order="' + y.orderNumber + '">确认收货</a>' +
            '</div>';
        var cancel_html = '<div class="aui-list-title-btn">' +
            '<a class="red-color order_delete" data-order="' + y.orderNumber + '">删除订单</a>' +
            '</div>';
        if (y.status == "未付款") {
            strHtml = un_pay_html;
        } else if (y.status == "已付款") {
            strHtml = wait_out_html;
        } else if (y.status == "已发货") {
            strHtml = wait_in_html;
        } else if (y.status == "已取消") {
            strHtml = cancel_html;
        } else if (y.status == "已付款") {
            strHtml = "";
        }
        $("#order_whole").append('<li id="' + y.orderNumber + '">' +
            '<div class="aui-list-title-info J_order" data-order="' + y.orderNumber + '">' +
            '<a href="#" class="aui-well ">' +
            '<div class="aui-well-bd">' + y.time + '</div>' +
            '<div class="aui-well-ft">' + y.status + '</div>' +
            '</a>' +
            '<div class="' + y.orderNumber + '"></div>' +

            '<a href="#" class="aui-well ">' +
            '<div class="aui-well-bd"></div>' +
            '<div class="aui-well-ft">订单总价：' + y.total + '元</div>' +
            '</a>' +
            '</div>' +
            strHtml +
            '<div class="aui-dri"></div>' +
            '</li>')
        var classname = "." + y.orderNumber + "";
        $.each(y.goods, function (a, b) {
            $(classname).append('<a href="javascript:;" class="aui-list-product-fl-item">' +
                '<div class="aui-list-product-fl-img">' +
                '<img src="' + b.image + '" alt="">' +
                '</div>' +
                '<div class="aui-list-product-fl-text">' +
                '<h3 class="aui-list-product-fl-title">' + b.goodsName + '</h3>' +
                '<div class="aui-list-product-fl-mes">' +
                '<div>' +
                '<span class="aui-list-product-item-price">' +
                '<em>¥</em>' +
                b.goodPrice +
                '</span>' +
                '</div>' +
                '<div class="aui-btn-purchase">x' +
                b.quantity +
                '</div>' +
                '</div>' +
                '</div>' +
                '</a>')
        })
    })
}

function unOrder(page) {
    if (page == "0") {
        $("#order_whole").append('<li style="text-align: center;color:#999">暂无订单</li>');
    }
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

//加载
function showLoad() {
    layer.open({
        type: 2,
        shadeClose: false
    });
}

function hideYar() {
    layer.closeAll('loading'); //关闭加载层
}
