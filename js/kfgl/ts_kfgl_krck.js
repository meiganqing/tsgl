/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-07-03 15:10:40
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */

var element, layer, colorpicker, loading, colorList, kfid, colorid, laytpl, qx, type;
var moseData = "";
layui.use(['element', 'layer', "colorpicker", "laytpl"], function() {
    element = layui.element;
    layer = layui.layer;
    colorpicker = layui.colorpicker;
    laytpl = layui.laytpl;
    colorList = {
        color0: "rgb(9, 208, 62)",
        color1: "rgb(255,184,0)",
        color2: "rgb(72,144,64)",
        color3: "rgb(239,201,200)",
    }
    type = window.location.href.getQuery("type");
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("库容查看");

    if (qx[0].Limit.isBJ) {
        $("#sure").removeClass("layui-hide")
        $("#sureColor").removeClass("layui-hide")
    }
    loading = layer.load();

    // //获取库房颜色   
    var kfcolor_data = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH20190823124611461152351"
    });
    if (kfcolor_data.success && kfcolor_data.rows && kfcolor_data.rows.length > 0) {
        colorList = {
            color0: kfcolor_data.rows[0]["库容颜色配置"].split("|")[0],
            color1: kfcolor_data.rows[0]["库容颜色配置"].split("|")[1],
            color2: kfcolor_data.rows[0]["库容颜色配置"].split("|")[2],
            color3: kfcolor_data.rows[0]["库容颜色配置"].split("|")[3]
        }
        colorid = kfcolor_data.rows[0].id
            //获取颜色
        for (let i = 0; i < 5; i++) {
            colorpicker.render({
                elem: '#color' + i,
                color: colorList["color" + i],
                format: 'rgb', //默认为 hex
                done: function(color) {
                    var key = this.elem.replace(/\#/, "");
                    console.log(key)
                    console.log(color)
                    colorList[key] = color;
                    showTpl(laytpl, dataList)
                }
            });
        }
    } else {
        layer.msg("获取默认颜色失败，即将使用系统默认颜色！")
            //获取颜色
        for (let i = 0; i < 5; i++) {
            colorpicker.render({
                elem: '#color' + i,
                color: colorList["color" + i],
                format: 'rgb', //默认为 hex
                done: function(color) {
                    var key = this.elem.replace(/\#/, "");
                    console.log(key)
                    console.log(color)
                    colorList[key] = color;
                    showTpl(laytpl, dataList)
                }
            });
        }
    }

    //获取当前库房信息
    var kf_data = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611207161",
        XDLMB: SysConfig.UserInfo.GetCookieName("mCurrentStorage"),
    });
    if (kf_data.success && kf_data.rows && kf_data.rows.length > 0) {
        kfid = kf_data.rows[0].id
        $("#aisle").val(kf_data.rows[0]["过道位置"])
        $("#columnNum").val(kf_data.rows[0]["每行柜架数"])
        initData(laytpl)
    } else {
        layer.close(loading)
    }
    //过道行架修改
    $("#sure").click(function() {
        var kfedit = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
            XDLMCID: "6000",
            XDLMSID: "DYBH201908231246114611208165",
            XDLMID: kfid,
            XDLM过道位置: $("#aisle").val(),
            XDLM每行柜架数: $("#columnNum").val()
        });
        if (kfedit.success) {
            layer.msg("设置成功", {
                icon: 1,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function() {
                initData(laytpl)
            });
        } else {
            layer.close(loading)
        }
    })
    $("#inspect").click(function() {
            var index = layer.load(0, {
                time: 10 * 1000,
                title: "正在检查库容"
            }); //又换了种风格，并且设定最长等待10秒 
            initData(laytpl)
        })
        //默认颜色
    $("#sureColor").click(function() {
        let colorstr = "";
        for (let i = 0; i < 4; i++) {
            if (i == 3) {
                colorstr += colorList["color" + i]
            } else {
                colorstr += colorList["color" + i] + "|"
            }
        }
        var kfedit = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
            XDLMCID: "6000",
            XDLMSID: "DYBH20190823124611461149355",
            XDLMID: colorid,
            XDLM库容颜色配置: colorstr
        });
        if (kfedit.success) {
            layer.msg("设置成功", {
                icon: 1,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function() {

            });
        }
    })



});








function initData(laytpl) {

    var index3 = layer.msg('正在计算,请稍等...', {
        time: 0,
        shade: 0.3,
        //content: '测试回调',
        success: function(index, layero) {
            setTimeout(function() {
                var rerurnData_weizhi = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                    XDLMCID: "9000",
                    XDLMTID: "9208",
                    XDLMSID: "9208005",
                    mCurrentStorage: SysConfig.UserInfo.GetCookieName("mCurrentStorage")
                });
                if (rerurnData_weizhi.success == true) {
                    // 将数据颠倒
                    for (var i = 0; i < rerurnData_weizhi.data.length; i++) {
                        rerurnData_weizhi.data[i]['分层集合']
                    }
                    dataList = rerurnData_weizhi; //数据赋值，点击颜色需要
                    dataList.aisle = $("#aisle").val();
                    dataList.columnNum = $("#columnNum").val();
                    showTpl(laytpl, dataList)


                } else {
                    layer.close(loading)

                }
                layer.close(index3);
            }, 2000);
        }
    });
}

function showTpl(laytpl, data) {
    $("#view").empty()
    gdArry = []
    var getTpl = tpldemo.innerHTML
    laytpl(getTpl).render(data, function(html) {
        $("#view").append(html)
        layer.close(loading);
    });

}
// 过道
function getStore(callback, data) {
    var rerurnData_weizhi = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611207161",
        XDLMB: SysConfig.UserInfo.GetCookieName("mCurrentStorage"),
    });
    if (rerurnData_weizhi.success == true) {
        if (callback) {
            callback(rerurnData_weizhi)
        }
    }
}

function goodListDetail(data) { //查看物品详情
    layerPage01 = openWindow(2, '../../knww/page/wwjcxx.html?knbh=' + data, "详细信息", $(window).width(), $(window).height());

}

function setWidth(d) { //添加过道
    //	1)获取过道的位置
    var width;
    var padding_;
    if (d.columnNum) {
        width = (90 / d.columnNum) + "%";
        //宽度越大，padding越大

        if ((90 / d.columnNum) / 10 < 3) {

            padding_ = (90 / d.columnNum) / 10
        } else {
            padding_ = (90 / d.columnNum) / 10 * 2

        }

    } else {
        width = "400px";
        padding_ = "3"
    }
    return "width:" + width + ";padding-left:" + padding_ + "%;padding-right:" + padding_ + "%"
}

function setGuoDao(d, index) {
    //1)确定过道的位置，位置+一行的柜架数*第几行	
    var flag = false;
    var rows = Math.ceil(d.data.length / d.columnNum);
    var gdPosition = d.aisle * 1 + index * d.columnNum - 1;

    if (gdPosition < d.data.length + 1) {
        gdArry.push(gdPosition)
    }
    if (gdArry.indexOf(index) != -1) {
        flag = true
    } else {
        flag = false
    }

    return flag;
}



function setKrColor(d) {
    var color = ""
    if (d['现容量'] == "0") {
        color = colorList.color0
    } else if ((d['现容量'] / d['最大容量']) < 0.5) {
        color = colorList.color1
    } else if ((d['现容量'] / d['最大容量']) >= 0.5 && (d['现容量'] / d['最大容量']) <= 0.7) {
        color = colorList.color3
    } else if ((d['现容量'] / d['最大容量']) > 0.7 && (d['现容量'] / d['最大容量']) < 1) {
        color = colorList.color2
    } else if ((d['现容量'] / d['最大容量']) == 1) {
        color = colorList.color4
    } else if ((d['现容量'] / d['最大容量']) > 1) {
        color = colorList.color4
    }
    return color
}

function getGridWidth(data) {

    var width_ = 100 / (data).toFixed(2) + "%"
    return width_
}

$(document).on("click", ".store-fix-div", function() {
    if ($(this).attr("CNTR_no")) {
        moseData = $(this).attr("CNTR_no");
        //获取点击到的对象
        var dataListObj = dataList.data;
        var CNTR_no_ = $(this).attr("CNTR_no"),
            Level_no_ = $(this).attr("Level_no"),
            area_no_ = $(this).attr("area_no");
        if (type == "operate") {
            parent.$("select[name='XDLM柜架号']").val(dataListObj[CNTR_no_]['柜架号'])
            parent.$("select[name='XDLM层号']").val(dataListObj[CNTR_no_]['分层集合'][Level_no_]['层号'])
            parent.$("select[name='XDLM分区号']").val(dataListObj[CNTR_no_]['分层集合'][Level_no_]['分区集合'][area_no_]['分区号'])
            parent.form.render('select')
            QXALL()
        } else {
            var a = dataListObj[CNTR_no_]['柜架号'],
                b = dataListObj[CNTR_no_]['分层集合'][Level_no_]['层号']
            c = dataListObj[CNTR_no_]['分层集合'][Level_no_]['分区集合'][area_no_]['分区号']
            numVal = $(this).attr("values");
            if (numVal > 0) {
                SysConfig.ToolBox.openWindow("../../page/kfgl/ts_kfgl_krck_xq.html?gjNum=" + encodeURI(encodeURI(a)) + "&fcNum=" + encodeURI(encodeURI(b)) + "&fqNum=" + encodeURI(encodeURI(c)), "详情", $(window).width(), $(window).height());
            } else {
                layer.msg("当前层为空")
            }
        }
    }
})


function QXALL() {
    var index852 = parent.layer.getFrameIndex(window.name); //获取窗口索引

    if (parent.tableins) {
        parent.tableins.reload();
    }

    parent.layer.close(index852);
}