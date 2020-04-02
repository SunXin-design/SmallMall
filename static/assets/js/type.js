var unid, uname, keyword, pageNo, pageFo;
pageNo = 1;
(function (win) {
    var fid = GetQueryString("Fid");
    var sid = GetQueryString("Sid");
    var QiShang = {
        init: function () {
            this.initClassify();
            this.initScrollLeft();
            this.initPage();
            this.init_search();
            this.initScroll();
        },
        initClassify: function () {
            //获取分类信息
            $.ajax({
                url: "//localhost/api/mall/classify?id=" + fid,
                type: "get",
                async: false,
                dataType: "json",
                success: function (data) {
                    if (data.errcode == "0") {
                        var uls = $("#fen");
                        var obj = data.list;
                        unid = obj[0].id;
                        uname = obj[0].name;
                        for (let i = 0; i < data.list.length; i++) {
                            $(`<li class='classify_link' value='${obj[i].id}'>${obj[i].name}</li>`).click(function () {
                                unid = $(this).val();
                                uname = $(this).html();
                                $(".classify_link").css({
                                    "color": '#7e8387',
                                    "border": '0px'
                                })
                                $(this).css({
                                    "color": '#5d5d5d',
                                    'border-bottom': '2px solid #f4c556'
                                })
                                $("#hid").show();
                                $("#rec").empty();
                                pageNo = 1;
                                QiShang.initFene(unid, uname);
                            }).appendTo(uls);


                        }
                        $(`li[value=${sid}]`).click();
                    } else {
                        showTip(data.message);
                    }
                },
                error: function (message) {
                    showTip("系统繁忙,请稍后重试");
                }

            });

        },
        initScrollLeft: function () {
            $("#fen").animate({
                scrollLeft: $(`li[value=${sid}]`)
                    .offset().left
            }, 1000);
        },
        initPage: function () {
            $("#page_one").on("click", function () {
                if (pageNo == pageFo) {
                    $("#page_one").text('已经到底了').css("color", "#dedede");
                } else {
                    pageNo++;
                    QiShang.initFene(unid, uname);
                }
                if (pageFo == 0) {
                    //            showTip("没有信息");
                }
            })
        },
        init_search: function () {
            //点击搜索的功能
            $("#index_btn").click(function () {
                keyword = $("input[name='keyword']").val();
                pageNo = 1;
                $("#rec").empty();
                QiShang.initFene(unid, uname);
            })
            /*加一个动态的加载全部商品*/
            $("input[name='keyword']").on("input", function () {
                keyword = $(this).val();
                pageNo = 1;
                $("#rec").empty();
                QiShang.initFene(unid, uname);
            })
        },
        initScroll: function () {
            /*监听滚动条事件*/
            $(win).scroll(function () {
                /*滚动的高度*/
                var toal = $(document).scrollTop();
                /*整个页面的高度*/
                var all_hei = $(document).height();
                /*看到的高度*/
                var add_hei = $(win).height();
                if (!(all_hei - add_hei - toal)) {
                    $("#page_one").trigger('click');
                }
            })
        },
        initFene: function (unid, uname) {
            $("#hid").show();
            $.ajax({
                url: "//localhost/api/mall/classify/" + unid,
                type: "get",
                dataType: "json",
                data: {
                    "id": unid,
                    "keyword": keyword,
                    "pageNo": pageNo
                },
                success: function (data) {
                    if (data.errcode == "0") {
                        var res = $("#rec");
                        var obj = data.list;
                        for (let i = 0; i < data.list.length; i++) {
                            $(`<div class=' mg_bt3 box_show'>
                                <a href='//localhost/item?id=${obj[i].goodsId}'>
                                    <img src='${obj[i].goodImage[0]}'>
                                    <p class='hot_tittle'>${obj[i].goodsName}</p>
                                    <p class='hot_price'>
                                        <span><b>￥${obj[i].goodPrice}</b></span>
                                    </p>
                                </a>
                               </div>`).appendTo(res);
                        }
                        if (obj.length == 0) {
                            res.html(`<span class="tiShi_span">暂未找到相关商品</span>`);
                            $("#page_one").hide();
                        }else{
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
    }

    QiShang.init();

    /*
    $(".classify_link:eq(0)").css({
        "color": '#5d5d5d',
        'border-bottom': '2px solid #f4c556'
    })
    */
})(window)
