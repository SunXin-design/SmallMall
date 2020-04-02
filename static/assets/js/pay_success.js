(function (win) {
    var str = GetQueryString("id");
    var sxOrder = {
        init: function () {
            this.initButtom();
        },
        initButtom:function(){
            $(`<a href="//localhost/user/orderinfo?order=${str}" class="Fan_left">查看订单</a>            
               <a href="//localhost/" class="Fan_right">返回首页</a>`).appendTo($(".Fan_hui"));
        }
    }
    
    sxOrder.init();

})(window)
