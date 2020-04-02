/**判断是否是手机号**/
function isPhoneNumber(tel) {
    var reg = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
    return reg.test(tel);
}
/*判断身份证号*/
var validateSecIdCard = function (n) {
    var d = 0;
    var l = n;
    var i = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙",
        21: "辽宁",
        22: "吉林",
        23: "黑龙",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };
    if (!/^\d{17}(\d|x)$/i.test(l)) {
        return false
    }
    l = l.replace(/x$/i, "a");
    if (i[parseInt(l.substr(0, 2))] == null) {
        return false
    }
    var j = l.substr(6, 4) + "-" + Number(l.substr(10, 2)) + "-" + Number(l.substr(12, 2));
    var m = new Date(j.replace(/-/g, "/"));
    if (j != (m.getFullYear() + "-" + (m.getMonth() + 1) + "-" + m.getDate())) {
        return false
    }
    for (var k = 17; k >= 0; k--) {
        d += (Math.pow(2, k) % 11) * parseInt(l.charAt(17 - k), 11)
    }
    if (d % 11 != 1) {
        return false
    }
    return true
}
/*判断真实的姓名*/
function isName(name) {
    var regName = /^[\u4e00-\u9fa5]{2,4}$/;
    return regName.test(name);

}
//弹窗 注意得先加载layer插件
function showTip(name) {
    layer.open({
        content: name,
        time: 2,
        shade: false
    });
}
//加载
function showLoad() {
    layer.open({
        type: 2,
        shadeClose: false
    });
}

function hideYar() {
    layer.closeAll('loading'); //关闭加载层
}


/**页面验证码倒计时**/
function time(wait) {
    if (wait == 0) {
        $("#send_code").text("发送验证码");
        wait = 60;
        $("#send_code").attr('disabled', false);
    } else {
        $("#send_code").attr('disabled', true);
        $("#send_code").text(wait + "s");
        wait--;
        setTimeout(function () {
            time(wait);
        }, 1000)
    }
}
//判断邮箱email
function emails(em) {
    var reg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
    return reg.test(em);
}

/*大于0的正整数*/
//验证正整数+正小数
function checkIsPositiveEx0(value) {
    var result;
    var reg = /^(\d|[1-9]\d+)(\.\d{1,2})?$/
    if (reg.test(value)) {
        if (value == '0') {
            result = false;
        } else {
            result = true;
        }
    } else {
        result = false;
    }
    return result;
};
//表单验证 只能输入正整数切大于0
function keyUp(ob) {
    if (ob.value.length == 1) {
        ob.value = ob.value.replace(/[^1-9]/g, '')
    } else {
        ob.value = ob.value.replace(/\D/g, '')
    }
}
/*截取地址栏参数*/
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//统一社会信用代码
function Tyshyxdm() {
    this.firstarray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.firstkeys = [3, 7, 9, 10, 5, 8, 4, 2];
    this.secondarray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X', 'Y'];
    this.secondkeys = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
    this.verify = function (str) {
        var code = str.toUpperCase();

        /*
        统一代码由十八位的阿拉伯数字或大写英文字母（不使用I、O、Z、S、V）组成。
         第1位：登记管理部门代码（共一位字符）
         第2位：机构类别代码（共一位字符）
         第3位~第8位：登记管理机关行政区划码（共六位阿拉伯数字）
         第9位~第17位：主体标识码（组织机构代码）（共九位字符）
         第18位：校验码​（共一位字符）
        */
        if (code.length != 18) {
            return false;
        }
        var reg = /^\w\w\d{6}\w{9}\w$/;
        if (!reg.test(code)) {
            return false;
        }
        /*
         登记管理部门代码：使用阿拉伯数字或大写英文字母表示。​
         机构编制：1​
         民政：5​
         工商：9​
         其他：Y
         */
        reg = /^[1,5,9,Y]\w\d{6}\w{9}\w$/;
        if (!reg.test(code)) {
            return false;
        }
        /*
         机构类别代码：使用阿拉伯数字或大写英文字母表示。​
         机构编制机关：11打头​​
         机构编制事业单位：12打头​
         机构编制中央编办直接管理机构编制的群众团体：13打头​​
         机构编制其他：19打头​
         民政社会团体：51打头​
         民政民办非企业单位：52打头​
         民政基金会：53打头​
         民政其他：59打头​
         工商企业：91打头​
         工商个体工商户：92打头​
         工商农民专业合作社：93打头​
         其他：Y1打头​
         */
        reg = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/;
        if (!reg.test(code)) {
            return false;
        }
        /*
         登记管理机关行政区划码：只能使用阿拉伯数字表示。按照GB/T 2260编码。​
         例如：四川省成都市本级就是510100；四川省自贡市自流井区就是510302。​
        */
        reg = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/;
        if (!reg.test(code)) {
            return false;
        }
        /*
             主体标识码（组织机构代码）：使用阿拉伯数字或英文大写字母表示。按照GB 11714编码。
             在实行统一社会信用代码之前，以前的组织机构代码证上的组织机构代码由九位字符组成。格式为XXXXXXXX-Y。前面八位被称为“本体代码”；最后一位被称为“校验码”。校验码和本体代码由一个连字号（-）连接起来。以便让人很容易的看出校验码。但是三证合一后，组织机构的九位字符全部被纳入统一社会信用代码的第9位至第17位，其原有组织机构代码上的连字号不带入统一社会信用代码。
             原有组织机构代码上的“校验码”的计算规则是：​
             例如：某公司的组织机构代码是：59467239-9。那其最后一位的组织机构代码校验码9是如何计算出来的呢？
             第一步：取组织机构代码的前八位本体代码为基数。5 9 4 6 7 2 3 9
             提示：如果本体代码中含有英文大写字母。则A的基数是10，B的基数是11，C的基数是12，依此类推，直到Z的基数是35。
             第二步：​​取加权因子数值。因为组织机构代码的本体代码一共是八位字符。则这八位的加权因子数值从左到右分别是：3、7、9、10、5、8、4、2。​
             第三步：本体代码基数与对应位数的因子数值相乘。​
             5×3＝15，9×7＝63，4×9＝36，6×10＝60，
             7×5＝35，2×8＝16，3×4=12，9×2＝18​​
             第四步：将乘积求和相加。​
             15+63+36+60+35+16+12+18=255
             第五步：​将和数除以11，求余数。​​
             255÷11=33，余数是2。​​
          */
        var firstkey = this.calc(code.substr(8), this.firstarray, this.firstkeys, 11);
        /*
         第六步：用阿拉伯数字11减去余数，得求校验码的数值。当校验码的数值为10时，校验码用英文大写字母X来表示；当校验码的数值为11时，校验码用0来表示；其余求出的校验码数值就用其本身的阿拉伯数字来表示。​
         11-2＝9，因此此公司完整的组织机构代码为 59467239-9。​​
        */
        var firstword;
        if (firstkey < 10) {
            firstword = firstkey;
        }
        if (firstkey == 10) {
            firstword = 'X';
        } else if (firstkey == 11) {
            firstword = '0';
        }
        if (firstword != code.substr(16, 1)) {
            return false;
        }

        /*
             校验码：使用阿拉伯数字或大写英文字母来表示。校验码的计算方法参照 GB/T 17710。
             例如：某公司的统一社会信用代码为91512081MA62K0260E，那其最后一位的校验码E是如何计算出来的呢？
             第一步：取统一社会信用代码的前十七位为基数。9 1 5 1 2 0 8 1 21 10 6 2 19 0 2 6 0提示：如果前十七位统一社会信用代码含有英文大写字母（不使用I、O、Z、S、V这五个英文字母）。则英文字母对应的基数分别为：A=10、B=11、C=12、D=13、E=14、F=15、G=16、H=17、J=18、K=19、L=20、M=21、N=22、P=23、Q=24、R=25、T=26、U=27、W=28、X=29、Y=30​
             第二步：​​取加权因子数值。因为统一社会信用代码前面前面有十七位字符。则这十七位的加权因子数值从左到右分别是：1、3、9、27、19、26、16、17、20、29、25、13、8、24、10、30、2​8
             第三步：基数与对应位数的因子数值相乘。​
             9×1=9，1×3=3，5×9=45，1×27=27，2×19=38，0×26=0，8×16=128​
             1×17=17，21×20=420，10×29=290，6×25=150，2×13=26，19×8=152​
             0×23=0，2×10=20，6×30=180，0×28=0
             第四步：将乘积求和相加。​9+3+45+27+38+0+128+17+420+290+150+26+152+0+20+180+0=1495
             第五步：​将和数除以31，求余数。​​
             1495÷31=48，余数是17。​​
        */

        var secondkey = this.calc(code, this.secondarray, this.secondkeys, 31);
        /*
         第六步：用阿拉伯数字31减去余数，得求校验码的数值。当校验码的数值为0~9时，就直接用该校验码的数值作为最终的统一社会信用代码的校验码；如果校验码的数值是10~30，则校验码转换为对应的大写英文字母。对应关系为：A=10、B=11、C=12、D=13、E=14、F=15、G=16、H=17、J=18、K=19、L=20、M=21、N=22、P=23、Q=24、R=25、T=26、U=27、W=28、X=29、Y=30
         因为，31-17＝14，所以该公司完整的统一社会信用代码为 91512081MA62K0260E。​​
        */
        var secondword = this.secondarray[secondkey];
        if (!secondword || secondword != code.substr(17, 1)) {
            return false;
        }
        var word = code.substr(0, 16) + firstword + secondword;
        if (code != word) {
            return false;
        }
        return true;
    }
    this.calc = function (code, array1, array2, b) {
        var count = 0;
        for (var i = 0; i < array2.length; i++) {
            var a = code[i];
            count += array2[i] * array1.indexOf(a);
        }
        return b - count % b;
    }
}
