/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-06-29 17:10:55
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */
var $, element;
layui.config({
    base: '/SXSY/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index'], function() {
    $('#xitong').append(SysConfig.SubSystemData.SYTSGL.GetSysList());
    $("#userName").html(SysConfig.UserInfo.GetUserName());
    //系统配置

    var aa = SysConfig.GetTableData.SystemInfo();
    for (var i in aa.rows) {
        switch (aa.rows[i].配置名称) {
            case "版权所有":
                $('#copyright_name_value').html(aa.rows[i].配置值);
                break;
            case "技术支持":
                $('#support_name_value').html(aa.rows[i].配置值);
                break;
            case "用户图标":
                // $("#logo").attr("src", aa.rows[i].配置值);用黄色图标时
                break;
            case "用户图标2":
                $("#logo").attr("src", aa.rows[i].配置值);
                break;
        }
    }

    //判断首页左侧导航栏访问权限
    let qxname = ""
    $(".item-nav").each(function(key, val) {
        $(val).find("dd").each(function(k, v) {
            qxname += $(v).attr('id') + ","
        })
    }) 
    var qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority(qxname);
    for (let i in qx) {
        if (qx[i].Limit.isFW) {
            $("#" + qx[i].mDataName).removeClass("layui-hide")
        } else {
            $("#" + qx[i].mDataName).addClass("layui-hide")
        }
    }
    $(".item-nav").each(function(key, val) {
        $(val).find("dd").each(function(k, v) {
            if ($(v).css('display') == "block") {
                $(val).removeClass("layui-hide")
                return false
            }
        })
    }) 
    var warehouse= SysConfig.UserInfo.GetCookieName("mCurrentStorage");
    $("#currentStore").empty();
    $("#currentStore").text(warehouse);
    $("#currentStore").click(function () {
        SysConfig.ToolBox.openWindow("./chooseStorage.html", "", 600, 600);
        // openWindow(2, './chooseStorage.html', "", 600, 600);
    })

})