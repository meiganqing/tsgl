/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-06-30 09:47:08
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */

//TODO：登陆那里调整成用户密码手机验证码，用户密码，手机验证码，三种模式可后台控制切换
//1.用户登录请求获得当前登录配置的方式
//2.根据配置的方式组合input 
//3.后台添加页面配置当前登录方式
//
//所用的数据库表：陕院用户系统库  表 xdUserLogin 对应TableNum 7017
//所用的接口：wwGetDataList ，wwModifyDataById   登录接口无改变
var $, form, element, table, layer, loginType;
layui.use(['jquery', 'form', 'table', 'layer'], function() {
    $ = layui.$,
        form = layui.form,
        layer = layui.layer;

    //登陆页面配置
    getSystemBaseData()
        //1）获取登录方式
    var loginTypeData = SysConfig.UserLogin.GetLoginType();
    //	3联合登录,使用手机，验证码，密码登录
    //	2手机登录,使用手机，验证码登录
    //	1普通登录,使用账户名，密码登录
    if (loginTypeData.success) {
        loginType = loginTypeData.rows[0].value;
        //2)控制标签的显示
        if (loginType == "3") {
            $("#nameDiv").removeClass("layui-hide")
            $("#sjdiv").removeClass("layui-hide")
            $("#yzmdiv").removeClass("layui-hide")
            $("#psddiv").removeClass("layui-hide")
        } else if (loginType == "2") {
            $("#sjdiv").removeClass("layui-hide")
            $("#yzmdiv").removeClass("layui-hide")
        } else {
            $("#nameDiv").removeClass("layui-hide")
            $("#psddiv").removeClass("layui-hide")
        }
    }

    $('.dltab a').click(function() {
        $(this).addClass('cur').siblings('.cur').removeClass('cur');
    });
    //登录
    $('#login_btn_yhm').on("click", function() {
            login();
        })
        //登录获取验证码
    $('#getyzm').click(function() {
        var time = 60;
        var countdown = 60;

        function settime(obj) {
            if (countdown == 0) {
                obj.removeAttribute("disabled");
                obj.value = "获取验证码";
                countdown = 60;
                return;
            } else {
                obj.setAttribute("disabled", true);
                obj.value = "重新发送(" + countdown + ")";
                countdown--;
            }
            setTimeout(function() {
                settime($(this))
            }, 1000)
        }
        verifyPhone($("#phone"), $(this))
    });
    //忘记密码
    $("#forget-btn").click(function() {
            $("#login_qrcode").addClass('layui-hide') //隐藏扫码登录
            $("#login_div").removeClass('layui-hide') //显示直接登录
            if ($("#forget-btn").html().indexOf("忘记") !== -1) {
                $("#forget_div").removeClass("layui-hide")
                $("#login_div").addClass("layui-hide")
                $("#forget-btn").html("直接登录")
            } else {
                $("#login_div").removeClass("layui-hide")
                $("#forget_div").addClass("layui-hide")
                $("#forget-btn").html("忘记密码？")
            }
        })
        //忘记密码获取验证码
    $('#getyzm_forget').click(function() {
        verifyPhone($("#phone_forget"), $(this))

    });

    //扫码登录
    $("#qrcode").click(function() {
        $("#login_div").addClass('layui-hide') //隐藏直接登录
        $("#forget_div").addClass('layui-hide') //隐藏忘记登录
        $("#login_qrcode").removeClass('layui-hide') //展示二维码
        $("#forget-btn").html("直接登录")
            //获取扫码所得的二维码
        $("#login_qrcode").html("")
            // 01，获取我二维码
        let smdata = mSubSystemData.SYBGGL.PostDataPublic("GetDataInterface", {

            mUserId: "",
            page: "",
            XDLMCID: '9000',
            XDLMTID: '9203',
            XDLMSID: '9203050',

        });
        console.log(smdata)
        if (smdata.success == true) {

            let imghtml = '<img  src="' + smdata.FilePath + '">'
            $("#login_qrcode").append(imghtml)
                //查询是否授权登录成功
                // /xdData/xdDataManage.ashx?XAction=
                // GetDataInterface&XDLMCID=9000&XDLMTID=9203&XDLMSID=9203052&XKLX=SYBGGL

        } else {
            layer.msg(data.message)
        }


    })

    $("#login_btn_isyz").click(function() { //验证验证码	
        var isyzFlag = true;
        isyzFlag = isyzFlag && vertify($('#phone_forget'), "请先输入手机号码！")
        isyzFlag = isyzFlag && vertify($('#yzm_forget'), "请先获取验证码")
        if (isyzFlag) {
            login();
        }

    })

    $("#btn_surePsd").click(function() { //修改密码
        var verifyflag = true;
        verifyflag = verifyflag && vertify($("#newPsd"), "请输入新密码");
        verifyflag = verifyflag && vertify($("#againPsd"), "请再次输入密码");
        if (verifyflag) {
            if ($("#newPsd").val() != $("#againPsd").val()) {
                layer.alert("两次密码不一致，请重新输入", {
                    title: '提示框',
                    icon: 0
                }, function(index) {
                    $("#againPsd").val("")
                    $("#againPsd").focus();
                    layer.close(index);
                });
            } else {
                var changeSuccess = verifyEnd("ResetPassword", {
                        "wPhoneNum": $("#phone_forget").val(),
                        "wCaptcha": $("#yzm_forget").val(),
                        "wPassword": $("#againPsd").val(),
                        "XKLX": "SYYHGL"
                    },
                    "修改成功", "修改失败"
                )
                if (changeSuccess) {
                    $("#login_div").removeClass("layui-hide")
                    $("#forget_div").addClass("layui-hide")
                    $("#psd_div").addClass("layui-hide")
                    $("#verify_div").removeClass("layui-hide")
                    $("#forget-btn").html("忘记密码？")
                    $("#forget_div").find("input").val("")
                    $("#psd_div").find("input").val("")
                }
            }
        }
    })
    $(".eyeicon").click(function() {
        if ($(this).siblings("input").attr("type") == "password") {
            $(this).siblings("input").attr("type", "text")
            $(this).removeClass("fa-eye-slash").addClass("fa-eye")
        } else {
            $(this).siblings("input").attr("type", "password")
            $(this).removeClass("fa-eye").addClass("fa-eye-slash")
        }
    })


});

// 登陆页面配置
function getSystemBaseData() {
    var aa = SysConfig.UserLogin.SystemInfo();
    console.log(aa)
    for (var i in aa.rows) {
        switch (aa.rows[i].配置名称) {
            case "版权所有":
                $('#copyright_name_value').html(aa.rows[i].配置值);
                break;
            case "技术支持":
                $('#support_name_value').html(aa.rows[i].配置值);
                break;
            case "用户图标":
                break;
            case "用户图标2":
                $("#logo").attr("src", aa.rows[i].配置值);
                break;
        }
    }
}

function countDown(that) {
    var countdown = 60;
    var that = that
    var timer = setInterval(function() {

        if (countdown == 0) {
            $(that).attr("disabled", false);
            $(that).val("获取验证码")
            countdown = 60;
            clearInterval(timer)
            return;
        } else {
            $(that).attr("disabled", true);
            $(that).val("重新发送(" + countdown + ")");
            countdown--;
        }
    }, 1000)
}

function verifyEnd(action, where, tip1, tip2) {
    var returnValue = PostDataPublic("/xdData/UserHandler.ashx", action, where);
    if (returnValue.msg || returnValue.success) {
        layer.msg(tip1, {
            title: '提示框',
            icon: 1,
            time: 800
        }, function(alertindex) {
            if ($('.dltab a.cur').html() == '辅助决策') {

            } else {}
            layer.close(alertindex);
        });

    } else {
        layer.msg(tip2 + returnValue + '', {
            icon: 2,
            time: 1000
        }, function(alertindex) {
            layer.close(alertindex);
        });
    }
    return returnValue.msg
}

function verifyPhone(phone, that) {
    if ($(phone).val() == "") {

        layer.alert("请先输入手机号码！", {
            title: '提示框',
            icon: 0,

        }, function(index) {

            $(phone).focus();
            layer.close(index);

        });
    } else {
        //验证手机号码是否正确
        var sMobile = $(phone).val();
        if (!(/^1[2|3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(sMobile))) {
            layer.alert("不是完整的11位手机号或者正确的手机号前七位！", {
                title: '提示框',
                icon: 0,

            }, function(index) {

                $(phone).focus();
                layer.close(index);

            });
        } else {
            countDown(that)
                //获取验证码
            getYZM($(phone).val());
        }
    }
}
//获取验证码
function getYZM(pnum) {
    SysConfig.UserLogin.GetUserYZM(pnum);
}

function login() {
    var flag = true
    if (loginType == "3") {
        flag = flag && vertify($('#phone_forget'), "请先输入手机号码！")
        flag = flag && vertify($('#upsd'), "密码不能为空！")
        flag = flag && vertify($('#yzm_forget'), "请先获取验证码！")
    } else if (loginType == "2") {
        flag = flag && vertify($('#phone_forget'), "请先输入手机号码！")
        flag = flag && vertify($('#yzm_forget'), "请先获取验证码！")
    } else {
        flag = flag && vertify($('#uname'), "用户名不能为空！")
        flag = flag && vertify($('#upsd'), "密码不能为空！")
    }

    if (flag) {
        SysConfig.UserLogin.UserLogin($("#uname").val(), $("#upsd").val(), $('#phone_forget').val(), $('#yzm_forget').val(), loginType, UserLoginCallback);
    }
}



function UserLoginCallback(returnValue) {

    if (returnValue.success) {
        layer.msg('登陆成功，正在打开首页！', {
            title: '提示框',
            icon: 1,
            time: 800,
            end: function(alertindex) {


                window.location.href = SysConfig.UserLogin.GetLoginUrl("图书管理");
            }
        });
    } else {
        layer.msg('登陆失败,' + returnValue.message + '', {
            icon: 2,
            time: 1000
        }, function(alertindex) {
            layer.close(alertindex);
        });
    }

}
//登录的ajax，需要存值
$(document).keypress(function(e) {
    // 回车键事件  
    if (e.which == 13) {

        login();
    }
});

function vertify(value, tip) {
    if ($(value).val() == "") {
        layer.alert(tip, {
            title: '提示框',
            icon: 0
        }, function(index) {

            $(value).focus();
            layer.close(index);

        });
        return false
    } else {

        return true;
    }
}