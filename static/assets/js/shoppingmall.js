var keyword, pageNo, pageFo;
pageNo = 1;
$(function () {
    wordAll(keyword);
    /*购物车的消息*/
    count();

    /*图标的分类/以及轮播图片*/
    home();

    //积分推荐商品
    $.ajax({
        url: "//localhost/api/mall/rec",
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data.errcode == "0") {
                var res = $("#rec");
                var obj = data.list;
                for (let i = 0; i < data.list.length; i++) {
                    $(`<div class='mg_bt3 box_show'>
                        <a href='item?id=${obj[i].goodsId}'>
                            <img src='${obj[i].goodImage['0']}'>
                            <p class='hot_tittle'>${obj[i].goodsName}</p>
                            <p class='hot_price'>
                                <span>
                                    <b>￥${obj[i].goodPrice}</b>
                                </span>
                            </p>
                        </a>
                       </div>`).appendTo(res);
                }
            } else {
                showTip(data.message);
            }
        },
        error: function (message) {
            showTip("系统繁忙,请稍后重试");
        }
    });
    //点击搜索的功能
    $("#index_btn").click(function () {
        keyword = $("input[name='keyword']").val();
        pageNo = 1;
        $("#recs").empty();
        if (keyword) {
            $("#ho1").hide();
            wordAll(keyword);
        } else {
            $("#ho1").show();
            wordAll(keyword);
        }
    })
    /*加一个动态的加载全部商品*/
    $("input[name='keyword']").on("input", function () {
        keyword = $(this).val();
        pageNo = 1;
        $("#recs").empty();
        if (keyword) {
            $("#ho1").hide();
            wordAll(keyword);
        } else {
            $("#ho1").show();
            wordAll(keyword);
        }
    })

    //加载信息
    $("#page_one").on("click", function () {
        if (pageNo == pageFo) {
            $("#page_one").text('已经到底了').css("color", "#dedede");
        } else {
            pageNo++;
            wordAll(keyword);
        }
        if (pageFo == 0) {
            //            showTip("没有信息");
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
            $("#page_one").trigger('click');
        }

    })


})
//所有的商品
function wordAll(keyword) {
    $.ajax({
        url: "//localhost/api/mall/all",
        type: "get",
        dataType: "json",
        data: {
            "keyword": keyword,
            "pageNo": pageNo
        },
        success: function (data) {
            if (data.errcode == "0") {
                var recs = $("#recs");
                var obj = data.list;
                for (let i = 0; i < data.list.length; i++) {
                    $(`<div class='mg_bt3 box_show'>
                        <a href='item?id=${obj[i].goodsId}'>
                            <img src='${obj[i].goodImage['0']}'>
                            <p class='hot_tittle'>${obj[i].goodsName}</p>
                            <p class='hot_price'>
                                <span>
                                    <b>￥${obj[i].goodPrice}</b>
                                </span>
                            </p>
                        </a>
                       </div>`).appendTo(recs);
                }
                if (obj.length == 0) {
                    recs.html(`<span class="tiShi_span">暂未找到相关商品</span>`);
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
            } else {
                showTip(data.message);
            }
        },
        error: function (message) {
            showTip("系统繁忙,请稍后重试");
        }
    });
}

//swiper
function swiper() {
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: true, //可选选项，自动滑动
        effect: 'flip',
    })
}

/*图标的分类*/
function home() {
    $.ajax({
        url: "//localhost/api/home",
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data.code == "SUCCESS") {
                var obj = data.banner;
                var html = template("test", data);
                document.querySelector(".app-wai").innerHTML = html;
                for (let i = 0; i < data.banner.length; i++) {
                    $(`<div class="swiper-slide">
                           <img src="${obj[i].image}" width="100%" height="100%"    alt="">
                       </div>`).appendTo($(".swiper-wrapper"));
                }
                swiper();
            } else {
                showTip(data.message);
            }
        },
        error: function (message) {
            showTip("系统繁忙,请稍后重试");
        }
    });
}

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

//弹窗
function showTip(name) {
    layer.open({
        content: name,
        time: 2,
        shade: false
    });

}
