/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-06-30 09:57:34
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */
var form, $;
layui.use(['form', 'jquery'], function() {
    form = layui.form;
    $ = layui.jquery;

    let storagedata = SysConfig.SubSystemData.SYYHGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH2019101613433807104720",
        XDLMA: SysConfig.UserInfo.GetUserOnlynum(),
        XDLMB: "tsxt"
    });
    if (storagedata.success && storagedata.rows && storagedata.rows.length > 0) {
        getStorageTemplate(storagedata.rows)
    }

    // postData("GetDataInterface", {
    // 	XDLMCID: "1001",
    // 	XDLMSID: "DYBH2019101613433807104720",
    // 	XDLMA: getCookieName("mUserOnlyNum"),
    // 	XDLMB: "tsxt"
    // }, function(returnData) {
    // 	getStorageTemplate(returnData.rows)
    // }, "/xdData/xdDataManage.ashx", "", "XKLX=SYYHGL");

    $(document).on("click", "#storagesList li", function() {
        console.log($(this).text())
        var mCurrentStorage = $(this).text()
        SysConfig.UserInfo.SetCookie("mCurrentStorage", mCurrentStorage, "d1");
        layer.msg('正在加载' + mCurrentStorage + "数据...", {
            icon: 1,
            time: 500 //2秒关闭（如果不配置，默认是3秒）
        }, function() {

            parent.location.href = "./index.html"
            QXALL()
        });
    })
})

function getStorageTemplate(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += "<li>" + data[i].itemname + "</li>"
    }
    $("#storagesList").append(html)
}