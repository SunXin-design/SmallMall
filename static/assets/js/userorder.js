var pageNo, pageFo;
pageNo = 1;
$(function () {
    def(pageNo);
    //加载信息
    $("#page_one").on("click", function () {
        if (pageNo == pageFo) {
            showTip("没有新的内容啦");
            $("#page_one").text('已经到底了').css("color", "#dedede");
        } else {
            pageNo++;
            def(pageNo);
        }
        if (pageFo == 0) {
            showTip("没有信息");
        }
    })

});

function def(pageNo) {
    $.ajax({
        url: "//localhost/api/user/order",
        type: "get",
        dataType: "json",
        data: {
            "pageNo": pageNo
        },
        headers: {
            "token": $.cookie('ZHCSTOKEN'),
        },
        success: function (data) {
            if (data.errcode == "0") {
                var obj = data.list;
                for (var i = 0; i < data.list.length; i++) {
                    var tr = $("<tr></tr>");
                    $("<td><a href='goodinfo.html?id=" + obj[i].itemId + "' class='ao'>" + obj[i].name + "</a></td>").appendTo(tr);
                    $("<td>" + obj[i].money + "</td>").appendTo(tr);
                    $("<td>" + obj[i].number + "</td>").appendTo(tr);
                    $("<td>" + obj[i].time + "</td>").appendTo(tr);
                    $("<td><a href='donationOrder.html?" + obj[i].id + "' class='ao'>详情</a></td>").appendTo(tr);
                    tr.appendTo($("#tbody_one"));
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
//弹窗
function showTip(name) {
    layer.open({
        content: name,
        time: 2,
        shade: false 
    });
}
