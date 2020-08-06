/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-07-03 10:10:20
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */
var form, element, table, layer, qx, layerPage01, storeCurrent, where, colList, tableins, gjh, ch;
layui.use(['element', 'table', 'layer', 'form'], function() {
    form = layui.form;
    table = layui.table;
    element = layui.element,
        layer = layui.layer;
    storeCurrent = unescape(window.location.href.getQuery("kf"));
    gjh = window.location.href.getQuery("gjh");
    ch = window.location.href.getQuery("ch");
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("库房设置");
    if (qx[0].Limit.isBJ) {
        $("#addFenqu").removeClass("layui-hide")
    }
    if (qx[0].Limit.isSC) {
        $("#delAllArea").removeClass("layui-hide")
    }
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611194181",
        XDLMA: storeCurrent,
        XDLMB: gjh,
        XDLMC: ch
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
                field: '分区号',
                title: '分区号',

                align: 'center',

            },
            {
                field: '最大容量',
                title: '最大容量',

                align: 'center',
            },
            {
                field: '现容量',
                title: '现容量',
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
                        tt += '<a class="layui-btn layui-btn-xs layui-btn-green1" onclick=edit("' + d.id + '")>编辑</a>';

                    }
                    if (qx[0].Limit.isSC) {
                        tt += ' <a class="layui-btn layui-btn-danger layui-btn-xs" onclick=del("' + d.id + '")>删除</a>';
                    }
                    return tt;
                }
            }

        ]
    ];
    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '分区列表', colList, where, 15);
    //增加分区
    $("#addFenqu").click(function() {
        $('#addsubmit').html("添加分区")
        $('#库房名').val(storeCurrent);
        $('#柜架号').val(gjh);
        $('#层号').val(ch);
        $('#分区号').val("");
        $('#最大容量').val("");
        layerPage01 = SysConfig.ToolBox.openWindowByDIV($("#addfqdiv"), "添加分区", 600, 380)
    });
    $("#addfq").click(function() {
            if ($("#库房名").val() == "") {
                layer.msg("请输入库房名！")
                return
            }
            if ($("#柜架号").val() == "") {
                layer.msg("请输入柜架号！")
                return
            }
            if ($("#层号").val() == "") {
                layer.msg("请输入层号！")
                return
            }
            if ($("#分区号").val() == "") {
                layer.msg("请输入分区号！")
                return
            }
            if ($("#最大容量").val() == "") {
                layer.msg("请输入最大容量！")
                return
            }
            if ($('#addsubmit').html() == "添加分区") {
                SysConfig.SubSystemData.SYTSGL.AddNewData('#addfqdiv', 'GetDataInterface', "&XDLMCID=5000&XDLMSID=DYBH20190823124611461187183&XDLM现容量=0", AddCallback)
            } else {
                SysConfig.SubSystemData.SYTSGL.EditData('#addfqdiv', 'GetDataInterface', "&XDLMCID=6000&XDLMSID=DYBH20190823124611461168185&XDLMID=" + $("#XDLMID").val(), AddCallback)
            }
        })
        //删除所有
    $("#delAllArea").click(function() { //删除所有
        delty({
            XDLMCID: "9000",
            XDLMTID: "9208",
            XDLMSID: "9208030",
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

//修改
function edit(id) {
    $('#addsubmit').html() == "修改分区"
    let rowiddata = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611180182",
        XDLMA: id
    })
    if (rowiddata.success && rowiddata.rows && rowiddata.rows.length > 0) {
        for (let k in rowiddata.rows[0]) {
            $("#" + k).val(rowiddata.rows[0][k])
            $("#XDLMID").val(rowiddata.rows[0].id)
        }
        layerPage01 = SysConfig.ToolBox.openWindowByDIV($("#addfqdiv"), "修改分区", 600, 380)
    } else {
        layer.msg("未找到对应数据！")
    }


}

//删除
function del(rowid) {
    SysConfig.SubSystemData.SYTSGL.PLSC([{ id: rowid }], '4000', 'DYBH20190823124611461177184', Callback);
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