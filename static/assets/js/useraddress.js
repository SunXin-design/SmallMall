$(function () {

    new MultiPicker({
        input: 'multiPickerInput', //点击触发插件的input框的id
        container: 'hjhylyContainer', //插件插入的容器id
        jsonData: $city,
        address: '北京 北京市 东城区',
        success: function (arr) {
            var str = "";
            for (var i in arr) {
                str += arr[i].value + " ";
            }
            document.getElementById('multiPickerInput').value = (str.trim());
        } //回调
    });

    new MultiPicker({
        input: 'multiPickerInput_to', //点击触发插件的input框的id
        container: 'hjhylyContainer_to', //插件插入的容器id
        jsonData: $city,
        address: '北京 北京市 东城区',
        success: function (arr) {
            var str = "";
            for (var i in arr) {
                str += arr[i].value + " ";
            }
            document.getElementById('multiPickerInput_to').value = (str.trim());
        } //回调
    });

    $("input").blur(function () {
        window.scrollTo(0, 0);
    });
    //查询所有的地址信息
    $.ajax({
        url: "//localhost/api/address/all",
        type: "get",
        cache: false,
        dataType: "json",
        headers: {
            "token": $.cookie('ZHCSTOKEN'),
        },
        success: function (data) {
            if (data.errcode == 0) {
                var obj = data.list;
                var dv = $("#too");
                for (let i = 0; i < obj.length; i++) {
                    var tou = $("<div class=' bor_bot pd2 pods'></div>");

                    $(`<input type='hidden' value='${obj[i].id}'>
                       <span class='fon_name pd2'>${obj[i].contact}</span>
                       <span class='fon_phone pd2'>${obj[i].phone}</span><br>`).appendTo(tou);

                    $(`<p class='fl'>${obj[i].province} ${obj[i].city} ${obj[i].area}</p>
                       <p class='fl' style='margin-left: 1%'>${obj[i].address}</p><br>`).appendTo(tou);

                    $("<i class='fa fa-pencil fa-lg fr '></i><br>").click(function () {
                        $("#tenant-model-box").show();
                        var id = $(this).parent().find("input:eq(0)").val();
                        var cont = $(this).parent().find("span:eq(0)").html();
                        var phon = $(this).parent().find("span:eq(1)").html();
                        var addr = $(this).parent().find("p:eq(0)").html();
                        var adds = $(this).parent().find("p:eq(1)").html();
                        $("#userid").val(id);
                        $("#cont").val(cont);
                        $("#phon").val(phon);
                        $("#multiPickerInput").val(addr);
                        $("#add").val(adds);
                    }).appendTo(tou);

                    $(`<div class='ris'>
                       <input type='radio'value='${obj[i].default}' name='axx' id='paixu${i}'>
                       <label for='paixu${i}' >设为默认地址</label>
                       </div>`).click(function () {
                        var id = $(this).parent().find("input:eq(0)").val();
                        var check = $(this).parent().find("input:eq(1)");
                        var val = $(this).parent().find("input:eq(1)").val();
                        $.ajax({
                            url: "//localhost/api/address/default/" + id,
                            type: "post",
                            dataType: "json",
                            headers: {
                                "token": $.cookie('ZHCSTOKEN'),
                            },
                            success: function (data) {
                                if (data.errcode == 0) {
                                    showTip(data.message);
                                    check.attr('checked', 'true');
                                    location.reload();
                                }
                            },
                            error: function (message) {
                                showTip("系统繁忙,稍后重试");
                            }
                        })
                    }).appendTo(tou);

                    $("<i id='closeModel' class='x'>×</i>").click(function () {
                        var id = $(this).parent().find("input:eq(0)").val();
                        layer.open({
                            title: '提示',
                            content: "是否删除地址",
                            btn: ['确定', '取消'],
                            yes: function (index, layero) {
                                $.ajax({
                                    url: "//localhost/api/address/del/" + id,
                                    type: "post",
                                    dataType: "json",
                                    headers: {
                                        "token": $.cookie('ZHCSTOKEN'),
                                    },
                                    success: function (data) {
                                        if (data.errcode == 0) {
                                            showTip(data.message);
                                            $(this).parent().remove();
                                            setTimeout(function () {
                                                location.reload()
                                            }, 500);
                                        } else {
                                            showTip(data.message);
                                        }
                                    },
                                    error: function (message) {
                                        showTip("系统繁忙,稍后重试");
                                    }
                                })
                            },
                            cancel: function () {
                                return false
                            }
                        });
                    }).prependTo(tou);
                    tou.appendTo(dv);
                    shio();
                }
            } else {
                showTip(data.message);
            }

        },
        error: function (message) {
            showTip("系统繁忙,稍后重试");
        }
    });
    //新增的地址
    $("#ses").on("click", function () {
        //        $("#tenant-model-box").show();
        //        var userids = $("#userids").val();
        var conts = $("#conts").val();
        var phons = $("#phons").val();
        var Area = $("#multiPickerInput_to").val();
        var adds = $("#adds").val();
        var arro = Area.split(" ");
        var province1x = arro[0];
        var city2x = arro[1];
        var area3x = arro[2];
        if ($.trim(conts) == "") {
            showTip("收货人不能为空");
            return;
        }
        if ($.trim(phons) == "") {
            showTip("电话号不能为空");
            return;
        }
        if (!isPhoneNumber(phons)) {
            showTip("手机号格式不对");
            return;
        }
        if ($.trim(Area) == "") {
            showTip("地址不能为空");
            return;
        }
        if ($.trim(adds) == "") {
            showTip("详细地址不能为空");
            return;
        }
        //新增
        $.ajax({
            url: "//localhost/api/address/add",
            type: "post",
            data: {
                "contact": conts,
                "phone": phons,
                "province": province1x,
                "city": city2x,
                "area": area3x,
                "address": adds
            },
            headers: {
                "token": $.cookie('ZHCSTOKEN'),
            },
            dataType: "json",
            success: function (data) {
                if (data.errcode == "FAIL") {
                    showTip(data.message);
                } else {
                    showTip(data.message);
                    setTimeout(function () {
                        location.reload()
                    }, 500);
                }
            },
            error: function (message) {
                showTip("系统繁忙,请稍后重试");
            }
        })

    })


    //修改地址
    $("#upd").click(function () {
        var userid = $("#userid").val();
        var cont = $("#cont").val();
        var phon = $("#phon").val();
        var Area = $("#multiPickerInput").val();
        var add = $("#add").val();
        var arro = Area.split(" ");
        var province1x = arro[0];
        var city2x = arro[1];
        var area3x = arro[2];
        if ($.trim(cont) == "") {
            showTip("收货人不能为空");
            return;
        }
        if ($.trim(phon) == "") {
            showTip("电话号不能为空");
            return;
        }
        if (!isPhoneNumber(phon)) {
            showTip("手机号格式不对");
            return;
        }
        if ($.trim(Area) == "") {
            showTip("地址不能为空");
            return;
        }
        if ($.trim(add) == "") {
            showTip("详细地址不能为空");
            return;
        }
        //修改
        $.ajax({
            url: "//localhost/api/address/modify/" + userid,
            type: "post",
            data: {
                "id": userid,
                "contact": cont,
                "phone": phon,
                "province": province1x,
                "city": city2x,
                "area": area3x,
                "address": add
            },
            headers: {
                "token": $.cookie('ZHCSTOKEN'),
            },
            dataType: "json",
            success: function (data) {
                if (data.errcode == "FAIL") {
                    showTip(data.message);
                } else {
                    showTip(data.message);
                    setTimeout(function () {
                        location.reload()
                    }, 500);
                }
            },
            error: function (message) {
                showTip("系统繁忙,请稍后重试");
            }
        })
    });


    //修改弹出层的控制
    $("#closeModel").click(function () {
        $("#tenant-model-box").hide();

    });
    //新增弹出层1的控制
    $("#closeModel_to").click(function () {
        $("#tenant-model-box-to").hide();

    });
    //新增的用户名
    $("#sel").click(function () {
        $("#tenant-model-box-to").show();
    })

    var winHeight = $(window).height();
    $(window).resize(function () {
        var thisHeight = $(this).height();
        if (winHeight - thisHeight > 140) {
            $(".tenant-model-content").css("margin", "1% auto");
        } else {
            $(".tenant-model-content").css("margin", "20% auto");
        }
    })

})


function shio() {
    $("input[value='1']").attr('checked', 'true');
    $("input[value='1']").parent().css("color", "red");
}
//是否删除
function showLogin(name, id) {
    layer.open({
        title: '提示',
        content: name,
        btn: ['确定', '取消'],
        yes: function (index, layero) {

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
