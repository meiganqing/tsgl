/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-07-02 18:00:01
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */
var form, element, table, layer, qx, layerPage01, storeCurrent, where, colList, tableins, gjh;
layui.use(['element', 'table', 'layer', 'form'], function() {
    form = layui.form;
    table = layui.table;
    element = layui.element,
        layer = layui.layer;
    storeCurrent = unescape(window.location.href.getQuery("kf"));
    gjh = window.location.href.getQuery("gjh");
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("库房设置");

    if (qx[0].Limit.isBJ) {
        $("#addCeng").removeClass("layui-hide")
    }
    if (qx[0].Limit.isSC) {
        $("#delCeng").removeClass("layui-hide")
        $("#delAllLevel").removeClass("layui-hide")
    }

    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH20190823124611461181171",
        XDLMA: storeCurrent,
        XDLMB: gjh
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
                field: '层号',
                title: '层号',
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
                        tt += '<a class="layui-btn layui-btn-xs layui-btn-green1" onclick=edit("' + d.层号 + '")>查看分区</a>';

                    }
                    return tt;
                }


            }

        ]
    ];
    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '柜层列表', colList, where, 15);


    //增加层数
    $("#addCeng").click(function() {
        $('#库房名').val(storeCurrent);
        $('#柜架号').val(gjh);
        $('#层号').val("");
        layerPage01 = SysConfig.ToolBox.openWindowByDIV($("#addLayerHtml"), "添加柜层", 600, 380)
    });
    $("#addsubmit").click(function() {
        SysConfig.SubSystemData.SYTSGL.AddNewData('#addLayerHtml', 'GetDataInterface', "&XDLMCID=5000&XDLMSID=DYBH20190823124611461155173", AddCallback)
    })


    //删除当前层
    $("#delCeng").click(function() {
            $('#del_gjh').val(gjh);
            // 柜架下拉赋值
            let data = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                XDLMCID: "1001",
                XDLMSID: "DYBH20190823124611461181171",
                XDLMA: storeCurrent,
                XDLMB: gjh
            })
            if (data.success && data.rows && data.rows.length > 0) {
                $('#del_gch').empty();
                for (let i in data.rows) {
                    $('#del_gch').append(`<option value="${data.rows[i].层号}">${data.rows[i].层号}</option>`);
                }
            }
            form.render();
            SysConfig.ToolBox.openWindowByDIV($('#delgcdiv'), "删除当前层", 600, 300)

        })
        // 删除当前柜架确认
    $('#delthissubmit').click(function() {
            delty({
                XDLMCID: "9000",
                XDLMTID: "9208",
                XDLMSID: "9208031",
                XDLMKFMC: storeCurrent,
                XDLMGJMC: gjh,
                XDLMCMC: $('#del_gch option:selected').val()
            }, Callback)
        })
        //删除所有柜层
    $("#delAllLevel").click(function() { //删除所有柜架
        delty({
            XDLMCID: "9000",
            XDLMTID: "9208",
            XDLMSID: "9208029",
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

//查看柜层
function edit(ch) {
    layerPage01 = SysConfig.ToolBox.openWindow("./ts_kfgl_kfsz_q.html?kf=" + escape(storeCurrent) + "&gjh=" + escape(gjh) + "&ch=" + escape(ch), "查看柜层", $(window).width(), $(window).height())
}

function AddCallback(msg) {
    if (msg) {
        layer.msg(msg);
    }
    layer.close(layerPage01)
    tableins.reload("mDataTable");
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
    tableins.reload("mDataTable");
}