/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-07-01 16:37:18
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */
var form, element, table, layer, qx, layerPage01, storeCurrent, where, colList, tableins, px, kfid;
layui.use(['element', 'table', 'layer', 'form'], function() {
    form = layui.form;
    table = layui.table;
    element = layui.element,
        layer = layui.layer;
    storeCurrent = unescape(window.location.href.getQuery("store"));
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("库房设置");
    px = window.location.href.getQuery("px"),
        kfid = window.location.href.getQuery("rowid")
    if (qx[0].Limit.isBJ) {
        $("#addGuijia").removeClass("layui-hide")
        $("#quicklyAdd").removeClass("layui-hide")
        $("#editkfsort").removeClass("layui-hide")
    }
    if (qx[0].Limit.isSC) {
        $("#delGuijia").removeClass("layui-hide")
        $("#delAllFrame").removeClass("layui-hide")
    }
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611204191",
        XDLMA: storeCurrent
    }
    colList = [
        [{
                checkbox: true,
                LAY_CHECKED: false,

            }, {
                title: '序号',
                type: 'numbers',


            },

            {
                field: '库房名',
                title: '库房名',
                align: 'center',

            },
            {
                field: '柜架号',
                title: '柜架号',

                align: 'center',

            },

            {
                title: '操作',
                width: '16%',
                fixed: "right",
                align: 'center',
                templet: function(d) {
                    let tt = ""
                    if (qx[0].Limit.isBJ) {
                        tt += '<a class="layui-btn layui-btn-xs layui-btn-green1" onclick=edit("' + d.柜架号 + '")>查看柜层</a>';

                    }
                    return tt;
                }
            }
        ]
    ];
    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '柜架列表', colList, where, 15);
    //添加柜架
    $("#addGuijia").click(function() {
        $('#库房名').val(storeCurrent);
        layerPage01 = SysConfig.ToolBox.openWindowByDIV($("#addLayerHtml"), "添加柜架", 600, 290)
    });
    $("#addsubmit").click(function() {
        SysConfig.SubSystemData.SYTSGL.AddNewData('#addLayerHtml', 'GetDataInterface', "&XDLMCID=5000&XDLMSID=DYBH20190823124611461113193", AddCallback)
    })

    //一键添加弹框
    $("#quicklyAdd").click(function() {
        $("#quicklyStoreName").html(storeCurrent)
        layerPage01 = SysConfig.ToolBox.openWindowByDIV($("#quicklyLayerHtml"), "一键添加", 1000, 530)
    })

    //一键添加提交
    form.on("submit(quckliyBtn)", function(data) {
        data.field.XDLMStorage = $("#quicklyStoreName").html();
        data.field.XDLMCID = "9000",
            data.field.XDLMTID = "9208",
            data.field.XDLMSID = "9208026";
        let reData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", data.field);
        if (reData.success == true) {
            layer.msg(reData.message, {
                icon: 1,
                time: 2000
            }, function() {
                layer.close(layerPage01)
                Callback()
            });
        }
    })

    //修改库房排序弹框
    $("#editkfsort").click(function() {
        $("#pxkfname").val(unescape(storeCurrent))
        $("#pxkfpx").val(px)
        $("#序号").val("")
        layerPage01 = SysConfig.ToolBox.openWindowByDIV($("#editkfsortHtml"), "修改库房自定义排序", 600, 290)
    })

    //修改库房排序——确认
    $("#xgpx").click(function() {
            SysConfig.SubSystemData.SYTSGL.EditData('#editkfsortHtml', 'GetDataInterface', "&XDLMCID=6000&XDLMSID=DYBH201908231246114611208165&XDLMID=" + kfid, function(redata) {
                let This_kf = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                    XDLMCID: "1001",
                    XDLMSID: "DYBH201908231246114611207161",
                    XDLMB: storeCurrent,
                });
                if (This_kf.success && This_kf.rows && This_kf.rows.length > 0) {
                    px = This_kf.rows[0].序号
                }
                pxCallback(redata)
            })
        })
        //删除当前柜
    $("#delGuijia").click(function() {
            // 柜架下拉赋值
            let data = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                XDLMCID: "1001",
                XDLMSID: "DYBH201908231246114611204191",
                XDLMA: storeCurrent
            })
            if (data.success && data.rows && data.rows.length > 0) {
                $('#selgj').empty();
                for (let i in data.rows) {
                    $('#selgj').append(`<option value="${data.rows[i].柜架号}">${data.rows[i].柜架号}</option>`);
                }
            }
            form.render();
            SysConfig.ToolBox.openWindowByDIV($('#delthisgj'), "删除当前柜架", 600, 275)
        })
        // 删除当前柜架确认
    $('#delthissubmit').click(function() {
            delty({
                XDLMCID: "9000",
                XDLMTID: "9208",
                XDLMSID: "9208028",
                XDLMKFMC: storeCurrent,
                XDLMGJMC: $('#selgj option:selected').val()
            }, Callback)
        })
        //删除所有柜架
    $("#delAllFrame").click(function() { //删除所有柜架
        delty({
            XDLMCID: "9000",
            XDLMTID: "9208",
            XDLMSID: "9208027",
            XDLMKFMC: storeCurrent,
        }, Callback)

    })

    //刷新
    $("#updateTable").click(function() {
            Callback()
        })
        //返回
    $("#returnPrePage").click(function() {
        window.history.go(-1)
    })

});

//查看柜架
function edit(gjh) {
    layerPage01 = SysConfig.ToolBox.openWindow("./ts_kfgl_kfsz_c.html?kf=" + escape(storeCurrent) + "&gjh=" + escape(gjh), "查看柜层", $(window).width(), $(window).height())
}

function AddCallback(msg) {
    if (msg) {
        layer.msg(msg);
    }
    layer.close(layerPage01)
    tableins.reload("mDataTable");
}

function pxCallback(msg) {
    if (msg) {
        layer.msg(msg);
    }
    layer.close(layerPage01)
}


function delty(where, callback) {
    var layerid = layer.open({
        title: '系统关键操作，必须输入验证码!',
        area: ['350px', '200px'],
        type: 1,
        content: '<div id="yzDiv"><div id="yzmDIV" style="margin-top: 10px;"></div><div style="float: right;margin-right: 5%;"><button type="button" id="check-btn" class="verify-btn">确定</button><button type="button" id="quxiao-btn" class="verify-btn1" onclick="layer.close(layer.index);">取消</button></div></div>',
        // content: $('#yzDiv'),
        maxmin: true,
        end: function() {
            $('#yzDiv').empty();
        },
        success: function(layero, index) {
            $('#yzmDIV').empty();
            $('#' + "yzmDIV").codeVerify({
                type: 1,
                width: '200px',
                height: '50px',
                fontSize: '30px',
                codeLength: 4,
                btnId: 'check-btn',
                // btnId: buttonId,
                ready: function(data) {},
                success: function() {
                    var returnData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", where);
                    if ((typeof returnData) == "string") {
                        layer.msg(returnData, {
                            time: 500,
                            icon: 1
                        });
                    } else {
                        if (returnData.success) {
                            layer.msg('删除完成', {
                                time: 500,
                                icon: 1
                            }, function() {
                                //table.reload();
                                ////	 window.location.reload();
                                ////获取窗口索引
                                // layer.close(layerid);
                            });
                        }
                    }
                    $('#yzDiv').css('display', 'none');
                    callback(layerid);
                    layer.close(layerid);
                },
                error: function() {
                    layer.msg('验证码不匹配！');
                    layer.close(layerid);
                }
            });
        }
    })
}


function Callback() {
    window.location.reload()
}