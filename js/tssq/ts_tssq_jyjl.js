/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-06-30 11:38:47
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */
var $, table, layer, form, tableins, where, qx, colList, wheres, laydate, layer001;
layui.use(["jquery", "form", "layer", "table", "laydate"], function() {
    $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        table = layui.table;
    laydate = layui.laydate;
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("借阅记录");

    getQueryList(); // 查询下拉

    laydate.render({
        elem: '#endtime',
        type: 'datetime',
        // isInitValue: false,
        value: new Date(),
        done: function(value, date, endDate) {

        }
    });
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611232241"
    };
    colList = [
        [{
                checkbox: true,
                LAY_CHECKED: false
            }, {
                title: '序号',
                type: 'numbers',
            },
            {
                field: '图书',
                title: '登记名称',
                width: '20%',
                align: 'center',
                templet: function(d) {
                    return ` <span onclick="detail('${d.onlynum}')" style="color: dodgerblue;cursor: pointer;">${SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.图书)}</span>`
                }

            }, {
                field: '申请人',
                title: '借阅人',
                width: '8%',
                align: 'center',
                templet: function(d) {
                    return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.creator);
                }
            },

            {
                field: '申请时间',
                title: '借阅时间',
                width: '12%',
                align: 'center',
                templet: function(d) {
                    return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.申请时间);
                }
            },
            {
                field: '到期时间',
                title: '归还时间',
                width: '12%',
                align: 'center',
                templet: function(d) {
                    return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.到期时间);
                }
            },
            {
                field: 'title',
                title: '主题',
                width: '15%',
                align: 'center',
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.主题);
                // }
            },
            {
                field: '状态',
                title: '状态',
                width: '9%',
                align: 'center',
                templet: function(d) {
                    return statusColor(d.状态);
                }

            },
            {
                field: 'shzt',
                title: '审核状态',
                width: '9%',
                align: 'center',
                templet: function(d) {

                    return ` <span onclick="btn_shzt('${d.id}','${d.shzt}','${d.onlynum}')" style="cursor: pointer;"> ${shztColor(d.shzt)}</span>`


                }

            },
            {
                title: '操作',
                width: '10%',
                align: 'center',
                templet: function(d) {
                    let html = `<a class="layui-btn layui-btn-xs own-btn-orange" onclick="progress('${d.onlynum}','${d.xmlcid}')">进度</a>`;
                    if (d.shzt == "已完成" && d.状态 == "已提交" && qx[0].Limit.isBJ) {
                        html += `<a class="layui-btn layui-btn-xs" onclick="lend('${d.onlynum}','${d.id}')">借出</a>`
                    }
                    if (d.shzt == "已完成") {
                        if (d.状态 == "审核后借出" || d.状态 == "借阅延期") {
                            html += `<a class="layui-btn layui-btn-xs layui-btn-danger" onclick="delay('${d.onlynum}','${d.到期时间}')">延期</a>`
                        }
                    }
                    return html
                }
            }

        ]
    ];

    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '借阅记录', colList, where, 15);
    $("#searchData").click(function() {
        where.QueryType = $("#cxlb").val();
        where.QueryKey = $("#keyWords").val();
        tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '借阅记录', colList, where, 15);
    });

});

function lend(onlynum, rowid) {
    var index001 = layer.confirm('确定要借出吗？', {
        btn: ['确定', '再想想']
    }, function() { //提交,请等待谁审核
        var shlc;
        // 判断调用审核类型
        shlc = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
            XDLMCID: '9000',
            XDLMTID: '9208',
            XDLMSID: '9208035',
            XDLM借阅编号: onlynum,
            XDLM操作人: SysConfig.UserInfo.GetUserName(),
        });
        let icon_ = 1;
        if (shlc.success) {
            SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                XDLMCID: "9000",
                XDLMTID: "9208",
                XDLMSID: "9208032",
                "关联编号": onlynum,
                "类型": "确认"
            });
            // SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
            //     XDLMCID: '9000',
            //     XDLMTID: '9208',
            //     XDLMSID: '9208035',
            //     XDLM借阅编号: onlynum,
            //     XDLM操作人: SysConfig.UserInfo.GetUserName(),
            //     // XDLM到期时间: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime()
            // });
            icon_ = 1;
        } else {
            icon_ = 2;
        }
        layer.msg(shlc.message, {
            icon: icon_,
            time: 1500
        }, function() {
            layer.closeAll();
            tableins.reload("mDataTable");
        });

    }, function() { //不提交，关闭窗口，关闭添加页面
        layer.close(index001);
    })
}

function delay(onlynum, time) {
    layer001 = SysConfig.ToolBox.openWindowByDIV($("#yqdiv"), "延期时间", 400, 300)

    $("#delayid").click(function() {
        if (!$("#endtime").val()) {
            layer.msg("请选择延期时间！")
            return
        }
        if (!compareDate($("#endtime").val(), time)) {
            layer.msg("所选时间不能小于目前归还时间！");
            return
        }
        var index001 = layer.confirm('确定要延期吗？', {
            btn: ['确定', '再想想']
        }, function() { //提交,请等待谁审核
            var shlc;
            // 判断调用审核类型
            shlc = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                XDLMCID: '9000',
                XDLMTID: '9208',
                XDLMSID: '9208037',
                XDLM借阅编号: onlynum,
                XDLM操作人: SysConfig.UserInfo.GetUserName(),
                XDLM到期时间: $("#endtime").val()
            });
            let icon_ = 1;
            if (shlc.success) {
                // SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                //     XDLMCID: '9000',
                //     XDLMTID: '9208',
                //     XDLMSID: '9208037',
                //     XDLM借阅编号: onlynum,
                //     XDLM操作人: SysConfig.UserInfo.GetUserName(),
                //     XDLM到期时间: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime()
                // });
                icon_ = 1;
            } else {
                icon_ = 2;
            }
            layer.msg(shlc.message, {
                icon: icon_,
                time: 1500
            }, function() {
                layer.closeAll();
                tableins.reload("mDataTable");
            });

        }, function() { //不提交，关闭窗口，关闭添加页面
            layer.close(index001);
        })

    })
}

// 详情
function detail(tsbh) {
    SysConfig.ToolBox.openWindow("../../page/tssq/ts_tssq_tsdetail.html?knbh=" + tsbh, "详细信息", $(window).width(), $(window).height());
}
//审核状态
function btn_shzt(id, shzt, onlynum) {
    if (shzt == "待提交") {
        var index001 = layer.confirm('确定要提交吗？', {
            btn: ['确定', '再想想']
        }, function() { //提交,请等待谁审核
            var shlc;
            // 判断调用审核类型
            shlc = SysConfig.WorkflowManage.create(onlynum, '图书借阅申请');
            let icon_ = 1;
            if (shlc.success) {
                SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                    XDLMCID: "9000",
                    XDLMTID: "9208",
                    XDLMSID: "9208032",
                    "关联编号": onlynum,
                    "类型": "发起"
                });
                // SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                //     XDLMCID: '6000',
                //     XDLMSID: 'DYBH20190823124611461150245',
                //     XDLMID: id,
                //     XDLM状态: '已提交'
                // });
                icon_ = 1;
            } else {
                icon_ = 2;
            }
            layer.msg(shlc.message, {
                icon: icon_,
                time: 1500
            }, function() {
                layer.closeAll();
                tableins.reload("mDataTable");
            });

        }, function() { //不提交，关闭窗口，关闭添加页面
            layer.close(index001);
        })
    } else {
        SysConfig.ToolBox.openWindow("../../page/tssp/ts_tssp_splc.html?id=" + id + "&type=" + 'spjl', "详细信息", $(window).width(), $(window).height());
    }
}
// 进度
function progress(jybh, xmlcid) {
    SysConfig.ToolBox.openWindow("../../page/tssq/ts_tssq_jyjl_jd.html?bh=" + jybh + "&xmlcid=" + xmlcid, "流程详情", 500, $(window).height() - 100);
}
// 回车键事件  
$(document).keypress(function(e) {
    if (e.which == 13) {
        $("#searchData").click();
    }
});

//查询下拉
function getQueryList() {
    $("#cxlb").empty();
    var returnData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH2020051214135909660252",
    });
    if (returnData.success) {
        for (var i in returnData.rows) {
            $("#cxlb").append(`<option value="${returnData.rows[i].查询属性}">${returnData.rows[i].查询显示名}</option>`);
        }
        $("#cxlb").find("option[value='模糊查询']").attr("selected", true);
    }
    form.render("select");
}

function updateDataTable() {
    tableins.reload("mDataTable");
}

function statusColor(d) {
    var textColor = ""
    switch (d) {
        case "审批-拒绝":
            textColor = "red"
            break;
        case "审批-通过":
            textColor = "green"
            break;
        case "借阅归还":
            textColor = "blue"
            break;
        case "借阅延期":
            textColor = "red"
            break;
    }
    return '<span style="color:' + textColor + '">' + d + '</span>'
}

function shztColor(d) {
    var textColor = ""
    switch (d) {
        case "待提交":
            textColor = "green"
            break;
        case "待完成":
            textColor = "red"
            break;
        case "已完成":
            textColor = "blue"
            break;
    }
    return '<span style="color:' + textColor + '">' + d + '</span>'
}

function compareDate(date1, date2) {

    var oDate1 = new Date(date1);
    var oDate2 = new Date(date2);
    if (oDate1.getTime() > oDate2.getTime()) {
        return true;
    } else {
        return false;
    }
}