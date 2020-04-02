(function (win) {
    var fid = GetQueryString("Fid");
    var SunMing = {
        init: function (count) {
            count();
            this.initScreen();
            this.initResize();
            this.initClassify();
            this.initClassClick();
            this.initFid();
        },
        initScreen: function () {
            var heit = $(win).height();
            $(".class_feee").css({
                "height": `${heit-94}px`
            })
        },
        initResize: function () {
            window.onresize = function () {
                SunMing.initScreen();
            }
        },
        initClassify: function () {
            $.ajax({
                url: "//localhost/api/mall/classify",
                type: "get",
                async: false,
                dataType: "json",
                success: function (data) {
                    if (data.errcode == "0") {
                        var obj = data.list;
                        for (let i = 0; i < data.list.length; i++) {
                            $(`<a href="javascript:void(0);" class="class_fen" id=${obj[i].id}>${obj[i].name}</a>`).appendTo($(".class_now"));
                        }
                    }
                },
                error: function (message) {
                    showTip("系统繁忙,请稍后重试");
                }
            })
        },
        initClassClick: function () {
            $(".class_now").on("click", ".class_fen", function () {
                SunMing.init_fen();
                $(this).css({
                    "color": "white",
                    "background-color": "#fdb508"
                })
                var cid = $(this).attr("id");
                $("#goods_list").empty();
                SunMing.initClaAjax(cid);
            })
        },
        init_fen: function () {
            $(".class_fen").css({
                "color": "#c5c6c6",
                "background-color": "transparent"
            })
        },
        initClaAjax: function (id) {
            $.ajax({
                url: "//localhost/api/mall/classify?id=" + id,
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.errcode == "0") {
                        var obj = data.list;
                        for (let i = 0; i < data.list.length; i++) {
                            $(`<a href="//localhost/classify/list?Fid=${id}&Sid=${obj[i].id}" class="details_a">
                                <i class="aui-icon-large aui-icon-sign">
                                    <img src="${obj[i].icon}" alt="">
                                </i>
                                <p class="aui-grid-row-label">${obj[i].name}</p>
                              </a>`).appendTo($("#goods_list"));
                        }
                    }
                },
                error: function (message) {
                    showTip("系统繁忙,请稍后重试");
                }
            })
        },
        initFid: function () {
            if (fid) {
                $(`#${fid}`).trigger("click");
            } else {
                $(".class_fen").eq(0).trigger("click");
            }
        }
    }
    SunMing.init(function () {
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
    });
})(window);
