(function (win) {
    var sx = {
        init: function () {
            this.initTemplate();
            this.initDelClick();
            this.initModClick();
            this.initSelClick();
            this.initAddClick();
            this.initSettle();
        },
        initState: function () {
            var goods = $(".goodsCheck"); //获取本店铺的所有商品
            var goodsC = $(".goodsCheck:checked"); //获取本店铺所有被选中的商品
            if (goods.length == goodsC.length && goods.length != 0) { //如果选中的商品等于所有商品
                $("#AllCheck").prop('checked', true); //全选按钮被选中
            } else { //如果选中的商品不等于所有商品
                $("#AllCheck").prop('checked', false); //全选按钮也不被选中
            }
        },
        initAddClick: function () {
            // 点击全选按钮
            $("#AllCheck").on("click", function () {
                if ($(this).prop("checked") == true) { //如果全选按钮被选中
                    $(".goods-check").prop('checked', true); //所有按钮都被选中
                    sx.initAdds(1);
                } else {
                    $(".goods-check").prop('checked', false); //else所有按钮不全选
                    sx.initAdds(0);
                }
            });
        },
        initAdds: function (add) {
            $.ajax({
                url: "//localhost/api/cart/select/all",
                type: "post",
                data: {
                    select: add
                },
                dataType: "json",
                success: function (data) {
                    if (data.errcode == 0) {
                        var html = template("test", data);
                        document.querySelector("#goods_my").innerHTML = html;
                        $("#AllTotal").text(data.total);
                        sx.initHuadong();
                    } else {
                        showTip(data.message);
                    }
                },
                error: function (message) {
                    showTip("系统繁忙,稍后重试");
                }
            });
        },
        initSelClick: function () {
            $("#goods_my").on("click", ".goodsCheck", function () {
                let ser = $(this).attr("data-id");
                if (!($(this).prop("checked") == true)) { //如果全选按钮被选中
                    $(this).prop('checked', false); //所有按钮都被选中
                    sx.initSelest(ser, 0);
                } else {
                    $(this).prop('checked', true); //else所有按钮不全选
                    sx.initSelest(ser, 1);
                }
            })
        },
        initSelest: function (gid, sel) {
            $.ajax({
                url: "//localhost/api/cart/select",
                type: "post",
                data: {
                    goodsId: gid,
                    select: sel
                },
                dataType: "json",
                success: function (data) {
                    if (data.errcode == 0) {
                        var html = template("test", data);
                        document.querySelector("#goods_my").innerHTML = html;
                        $("#AllTotal").text(data.total);
                        sx.initState();
                        sx.initHuadong();
                    } else {
                        showTip(data.message);
                    }

                },
                error: function (message) {
                    showTip("系统繁忙,稍后重试");
                }
            });
        },
        initModClick: function () {
            // 数量减
            $("#goods_my").on("click", ".minus", function () {
                var t = $(this).parent().find('.num');
                if (t.text() == 1) {
                    t.text(1);
                } else {
                    var goodid = t.attr('data-id');
                    sx.initModify(goodid, parseInt(t.text()) - 1);
                }
            });
            // 数量加
            $("#goods_my").on("click", ".plus", function () {
                var t = $(this).parent().find('.num');
                var goodid = t.attr('data-id');
                sx.initModify(goodid, parseInt(t.text()) + 1);
            });
        },
        initModify: function (goodsid, num) {
            $.ajax({
                url: "//localhost/api/cart/modify",
                type: "post",
                data: {
                    goodsId: goodsid,
                    quantity: num
                },
                dataType: "json",
                success: function (data) {
                    if (data.errcode == 0) {
                        var html = template("test", data);
                        document.querySelector("#goods_my").innerHTML = html;
                        $("#AllTotal").text(data.total);
                        sx.initState();
                        sx.initHuadong();
                    } else {
                        showTip(data.message);
                    }

                },
                error: function (message) {
                    showTip("系统繁忙,稍后重试");
                }
            });
        },
        initDelClick: function () {
            //移动端的点击事件 触碰 基本和jQuery差不多 直接用就好了
            $("#goods_my").on("click", ".btn_span", function () {
                showLogin("是否删除", $(this).attr("data-id"));
            });
        },
        initDelete: function (goodsid) {
            $.ajax({
                url: "//localhost/api/cart/delete",
                type: "post",
                data: {
                    goodsId: goodsid
                },
                dataType: "json",
                success: function (data) {
                    if (data.errcode == 0) {
                        showTip("删除成功");
                        var html = template("test", data);
                        document.querySelector("#goods_my").innerHTML = html;
                        $("#AllTotal").text(data.total);
                        sx.initState();
                        sx.initHuadong();
                    } else {
                        showTip(data.message);
                    }
                },
                error: function (message) {
                    showTip("系统繁忙,稍后重试");
                }
            });
        },
        initTemplate: function (data) {
            $.ajax({
                url: "//localhost/api/cart",
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.errcode == 0) {
                        var html = template("test", data);
                        document.querySelector("#goods_my").innerHTML = html;
                        $("#AllTotal").text(data.total);
                        sx.initState();
                        sx.initHuadong();
                    } else {
                        showTip(data.message);
                    }

                },
                error: function (message) {
                    showTip("系统繁忙,稍后重试");
                }
            });

        },
        initSettle: function () {
            $(".settlement").on("tap", function () {
                var goodsC = $(".goodsCheck:checked");
                if (goodsC.length != 0) {
                    win.location.href = "shopping/order";
                } else {
                    showTip("没有商品哦~");
                }
            })

        },
        initHuadong: function () {
            //侧滑显示删除按钮
            var expansion = null; //是否存在展开的list
            var container = document.querySelectorAll('.list-li');
            for (var i = 0; i < container.length; i++) {
                var x, y, X, Y, swipeX, swipeY;
                container[i].addEventListener('touchstart', function (event) {
                    x = event.changedTouches[0].pageX;
                    y = event.changedTouches[0].pageY;
                    swipeX = true;
                    swipeY = true;
                    if (expansion) { //判断是否展开，如果展开则收起
//                        expansion.className = "swi";
                    }
                });
                container[i].addEventListener('touchmove', function (event) {
                    X = event.changedTouches[0].pageX;
                    Y = event.changedTouches[0].pageY;
                    // 左右滑动
                    if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
                        // 阻止事件冒泡
                        event.stopPropagation();
                        if (X - x > 10) { //右滑
                            event.preventDefault();
                            this.className = "swi"; //右滑收起
                        }
                        if (x - X > 10) { //左滑
                            event.preventDefault();
                            this.className = "swipeleft"; //左滑展开
                            expansion = this;
                        }
                        swipeY = false;
                    }
                    // 上下滑动
                    if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                        swipeX = false;
                    }
                });
            }
        }
    }
    sx.init();


    //弹窗
    function showTip(name) {
        layer.open({
            content: name,
            time: 2,
            shade: false
        });
    }
    //是否删除
    function showLogin(name, id) {
        layer.open({
            title: '提示',
            content: name,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                sx.initDelete(id);
            },
            cancel: function () {
                return false
            }
        });
    }
})(window);
