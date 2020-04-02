$(function () {
    /*购物车的消息*/
    count();
    
    $.ajax({
        url: "//localhost/api/user/info",
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data.errcode == 0) {
                $("[class='user_name']").html(data.nickname);
                $("[class='headimg']").attr("src", data.headimgurl);
                $("#integral").append(data.integral);
            } else {
                showTip(data.message);
            }
        },
        error: function (message) {
            showTip("系统繁忙,稍后重试");
        }
    })


    /*弹出层的关闭*/
    $("#x_id").click(function () {
        $("#pop").fadeOut();
    })


})


/*判断是什么阶段的 ❤ */
function jieDuan(or) {
    if (or == 0) {
        $("#back_s").attr('class', 'pop_content_head_copper');
        $("#ns").attr('src', 'assets/img/move_icon/s1.png');
    } else if (or == 1) {
        $("#back_s").attr('class', 'pop_content_head_silver');
        $("#ns").attr('src', 'assets/img/move_icon/s2.png');
    } else if (or == 2) {
        $("#back_s").attr('class', 'pop_content_head_golden');
        $("#ns").attr('src', 'assets/img/move_icon/s3.png');
    }else{
        $("#back_s").attr('class', 'pop_content_head');
        $("#ns").attr('src', 'assets/img/move_icon/s0.png');
    }
}

/*判断任务*/
var task = {
    0:'达到 <b>x</b> 元捐款额',
    1:'完成 <b>x</b> 次捐款',
    2:'达到 <b>x</b> 个捐款项目',
    3:'一起捐达到 <b>x</b> 元捐款额',
    4:'一起捐达到 <b>x</b> 个队伍',
    5:'<b>x</b> 个人与我一起捐',
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
                        $(".aui-badge").css("display","inline-block");
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
