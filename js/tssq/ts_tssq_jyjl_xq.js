/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-06-30 13:55:59
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */

var knbh = window.location.href.getQuery("knbh");
var loading
layui.use(['layer'], function() {
    if (knbh) {
        echoData(knbh);

    }


    $("#modifyWWLB").click(function() {
        self.window.location.href = "../../crkgl/xrkww.html?type=modify&knbh=" + editId
    })
    $("#printBtn").click(function() {
        $(".no-print").addClass("layui-hide");
        var tata = document.execCommand("print");
        if (tata) {
            $(".no-print").removeClass("layui-hide");

        }
    })
    $("#printBtnA5").click(function() {
        self.window.location.href = "./printA5.html?knbh=" + editId
    })
    $("#printWord").click(function() {
        postData("SaveWord", {
            XDLMID: $("#XDLM文物库内编号").html()

        }, function(returnData) {
            if (returnData.success || returnData.msg) {
                layer.msg('导出完成', {
                    time: 500,
                    icon: 1
                }, function() {
                    layer.closeAll();
                    window.location = returnData.FilePath;

                });

            } else {
                layer.msg(returnData, {
                    icon: 0,
                    time: 2000
                });

            }
        });

    })
})

function echoData(knbh) { //回显数据	
    postData("wwGetDataList", {
        TblNum: 392,
        T3052: "EQ" + getCookieName("mCurrentStorage"),
        T3922: "EQ" + knbh
    }, function(data) {
        if (data.data.length > 0) {
            for (var k in data.data[0]) {
                $("#" + k).html(data.data[0][k])
            }
            showPicture(data.data[0]['图片地址'], "picBody", 96, "none") //获取图片
        }
    })


}

function showTpl(data) {
    layui.use("laytpl", function() {
        var laytpl = layui.laytpl;
        var getTpl = tpldemo.innerHTML
        laytpl(getTpl).render(data, function(html) {
            $("#scanPosition").append(html)
        });
    })
}

function setKrColor(d, gj, ch, fq) {
    var color_ = false
    if (d.currentgj == gj && d.currentch == ch && d.currentfq == fq) {

        color_ = true
    }
    return color_
}