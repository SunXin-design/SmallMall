$(function () {
    
    /******------------分割线-----------------******/
    // 点击商品按钮
    $(".goodsCheck").on("click",function () {
        var goods = $(".goodsCheck"); //获取本店铺的所有商品
        var goodsC = $(".goodsCheck:checked"); //获取本店铺所有被选中的商品
        if (goods.length == goodsC.length) { //如果选中的商品等于所有商品
            if ($(".goodsCheck").length == $(".goodsCheck:checked").length) { //如果店铺被选中的数量等于所有店铺的数量
                $("#AllCheck").prop('checked', true); //全选按钮被选中
                TotalPrice();
            } else {
                $("#AllCheck").prop('checked', false); //else全选按钮不被选中
                TotalPrice();
            }
        } else { //如果选中的商品不等于所有商品
            $("#AllCheck").prop('checked', false); //全选按钮也不被选中
            // 计算
            TotalPrice();
            // 计算
        }
    });
    // 点击店铺按钮
    $(".shopCheck").on("click",function () {
        if ($(this).prop("checked") == true) { //如果店铺按钮被选中
            $(this).parents(".aui-car-box").find(".goods-check").prop('checked', true); //店铺内的所有商品按钮也被选中
            if ($(".shopCheck").length == $(".shopCheck:checked").length) { //如果店铺被选中的数量等于所有店铺的数量
                $("#AllCheck").prop('checked', true); //全选按钮被选中
                TotalPrice();
            } else {
                $("#AllCheck").prop('checked', true); //else全选按钮不被选中
                TotalPrice();
            }
        } else { //如果店铺按钮不被选中
            $(this).parents(".aui-car-box").find(".goods-check").prop('checked', false); //店铺内的所有商品也不被全选
            $("#AllCheck").prop('checked', false); //全选按钮也不被选中
            TotalPrice();
        }
    });
    
    
    //计算
    function TotalPrice() {
        var oprice = 0; //店铺总价
        var gChek=$(".goodsCheck");
        gChek.each(function () { //循环店铺里面的商品
            if ($(this).is(":checked")) { //如果该商品被选中
                var num = parseInt($(this).next().next().find(".num").text()); 
                //得到商品的数量
                console.log(num);
                
                var price = parseFloat($(this).next().next().find(".price").text()); //得到商品的单价
                console.log(price);
                
                var total = price * num; //计算单个商品的总价
                oprice += total; //计算该店铺的总价
            }
            
            $(this).closest(".aui-car-box").find(".ShopTotal").text(oprice.toFixed(2));
            //显示被选中商品的店铺总价
        });

        $("#AllTotal").text(oprice.toFixed(2)); //输出全部总价
        
    }
});
