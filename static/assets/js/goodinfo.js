var log, pageNo, pageFo;
pageNo = 1;
$(function () {
    var url = location.search;
    var str = GetQueryString("id");
    conten(str);
    god(str);
    /*购物车的消息*/
    count()
    //存储地址的id
    var addid;
    console.log(addid);

    $("input").blur(function () {
        window.scrollTo(0, 0);
    });
    //显示弹出层中的收货地址
    /*
    $.ajax({
        url: "../api/address/all",
        type: "get",
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data.errcode == 0) {
                var obj = data.list;
                var dv = $("#too");
                for (let i = 0; i < obj.length; i++) {
                    var tou = $("<div class='tan'></div>").click(function () {
                        color();
                        $(this).css({
                            "background": "#5e6b85",
                            "color": "#ffffff"
                        });
                        addid = $(this).find("input:eq(0)").val();
                        console.log(addid);
                    });
                    $(`<input type='hidden' value='${obj[i].id}'>
                        <span class='fon_name pd2'>${obj[i].contact}</span>
                        <span class='fon_phone pd2 mag_left'>${obj[i].phone}</span>
                        <br>`).appendTo(tou);
                    $(`<p class='fl mag_top'>${obj[i].province} ${obj[i].city} ${obj[i].area}</p>
                        <p class='fl mag_top' style='margin-left: 1%'>${obj[i].address}</p>
                        <br>`).appendTo(tou);
                    tou.appendTo(dv);
                }
            }
        },
        error: function (message) {
            showTip("系统繁忙,稍后重试");
        }
    });
*/
    $(".goods_div_cont").on("mouseleave", function () {
        var _this = this.value;
        let numss = document.querySelector("#nums").innerHTML;
        if (_this == "") {
            this.value = "1";
        }
        if (parseInt(_this) > parseInt(numss)) {
            this.value = numss;
        }
    })

    // 数量减
    $(".goods_div_left").on("click", function () {
        var t = $(this).parent().find('.num');
        t.val(parseInt(t.val()) - 1);
        if (t.val() <= 1) {
            t.val(1);
        }
    });

    // 数量加
    $(".goods_div_right").on("click", function () {
        var t = $(this).parent().find('.num');
        let value = parseInt(t.val());
        let nums = parseInt($("#nums").text());
        if (value < nums) {
            t.val(value + 1);
        } else {
            showTip("没有那么多商品");
        }
        if (t.val() <= 1) {
            t.val(1);
        }

    });

    $("#closeModel_to").click(function () {
        $("#tenant-model-box-to").hide();
    });

    //加入购物车
    $("#buy_bt").click(function () {
        let value = $(".num").val();
        if (!str) {
            showTip("没有ID");
        }
        $.ajax({
            url: "//localhost/api/cart/add",
            type: "post",
            dataType: "json",
            data: {
                "goodsId": str,
                "quantity": value
            },
            success: function (data) {
                if (data.errcode == "0") {
                    showTip(data.message);
                    count();
                } else {
                    showTip(data.message);
                }
            },
            error: function (message) {
                showTip("系统繁忙,请稍后重试");
            }
        });
    })

    //立即购买
    $("#buy").click(function () {
        let value = $(".num").val();
        let nums = $("#nums").text();
        if (value <= nums) {
            window.location.href = `//localhost/shopping/order?goodsId=${str}&quantity=${value}`;
        } else {
            showTip("没有那么多商品");
        }
    })


    //来回切换的点击事件
    $("#n1").click(function () {
        $("#details").hide();
        $("#detail").show();
        $(this).attr("class", "col_red");
        $("#n2").attr("class", "col_hei");
        $(this).parent().attr("class", "vont_x");
        $("#n2").parent().attr("class", "vont_p");
    })
    $("#n2").click(function () {
        $("#details").show();
        $("#detail").hide();
        $(this).attr("class", "col_red");
        $("#n1").attr("class", "col_hei");
        $(this).parent().attr("class", "vont_x");
        $("#n1").parent().attr("class", "vont_p");
    })

    //加载信息
    $("#page_one").on("click", function () {
        if (pageNo == pageFo) {
            showTip("没有新的内容啦");
            $("#page_one").text('已经到底了').css("color", "#dedede");
        } else {
            pageNo++;
            god(pageNo);
        }
        if (pageFo == 0) {
            showTip("没有信息");
        }
    })

    var mySwiper = new Swiper('.swiper-container', {
        autoplay: true, //可选选项，自动滑动
    })
})

/*购物车的消息*/
function count() {
    $.ajax({
        url: "//localhost/api/cart/count",
        type: "get",
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.code == "SUCCESS") {
                if (data.count != 0) {
                    if ($(".aui-badge").css("display") == "none") {
                        $(".aui-badge").css("display", "inline-block");
                        $(".aui-badge").text(data.count);
                    } else {
                        $(".aui-badge").text(data.count);
                    }
                }
            } else {
                showTip(data.message);
            }
        },
        error: function (message) {
            showTip("系统繁忙,请稍后重试");
        }
    });
}

//兑换记录
function god(st) {
    $.ajax({
        url: "//localhost/api/order/record/" + st,
        type: "get",
        dataType: "json",
        data: {
            "id": st,
            "pageNo": pageNo
        },
        success: function (data) {
            if (data.errcode == "0") {
                var obj = data.list;
                for (let i = 0; i < data.list.length; i++) {
                    $(`<div style='margin-bottom: 3%;font-size: 0.96rem'>
                            <img src='${obj[i].headimgUrl}' class='bor_log' alt='没有头像'>
                            <span>&nbsp;${obj[i].nickname}&nbsp;</span>
                            <span class='cor'>${obj[i].time}</span> <br>
                       </div>`).appendTo($("#process"));
                }
            } else {
                showTip(data.message);
            }
            if (obj.length == 0) {
                $("#process").html(`<span class="tiShi_span">暂无购买记录</span>`);
                $("#page_one").hide();
            } else {
                $("#page_one").show();
            }
            pageFo = data.page;
            if (pageNo >= pageFo) {
                $("#page_one").text('已经到底了').css("color", "#dedede");
            } else {
                $("#page_one").text('加载更多').css("color", "#999999");
            }
        },
        error: function (message) {
            showTip("系统繁忙,请稍后重试");
        }
    });
}

//获取商品详情也信息
function conten(st) {
    $.ajax({
        url: "//localhost/api/mall/item/" + st,
        type: "get",
        dataType: "json",
        headers: {
            "token": $.cookie('ZHCSTOKEN'),
        },
        success: function (data) {
            if (data.errcode == "0") {
                var obj = data.goods;
                $("#title").html(obj.goods_name);
                $("#goods_brief").html(obj.goods_brief);
                $(".swiper-slide").html(`<img src=${obj.image[0]} width="100%" height="100%" alt="">`);
                $("#nums").html(obj.goods_stock);
                $("#count").html(`<i>￥</i>${obj.goods_price}`);
                $("#detail").html(obj.goods_desc);
                log = obj.login;
                if (obj.login == "0") {
                    showLogin("请先登录在进行操作", "goodinfo.html?id=" + st);
                }
            } else {
                showTip(data.message);
            }
        },
        error: function (message) {
            showTip("系统繁忙,请稍后重试");
        }
    });
}


function color() {
    $(".tan").css({
        "background": "#ffffff",
        "color": "#666666"
    });

}

function showLogin(name, url) {
    layer.open({
        title: '提示',
        content: name,
        btn: ['登录'],
        yes: function (index, layero) {
            location.href = "login.html?" + url;

        },
        cancel: function () {
            return false
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
