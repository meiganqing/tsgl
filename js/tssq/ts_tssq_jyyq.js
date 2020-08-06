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

var $, table, layer, form, tableins, where, qx, colList, id, laydate, layer001;
layui.use(["jquery", "form", "layer", "table", "laydate"], function() {
    $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        table = layui.table;
    laydate = layui.laydate;
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("借阅延期");

    getQueryList(); // 查询下拉

    laydate.render({
        elem: '#endtime',
        type: 'datetime',
        value: new Date(),
        done: function(value, date, endDate) {}
    });
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611232241",
        XDLME: "审核后借出,借阅延期"
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
                    return ` <span onclick="detail('${d.onlynum}')" style="color: dodgerblue;cursor: pointer;">${SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.图书)}</span>`
                }


            }, {
                field: 'creator',
                title: '借阅人',
                width: '12%',
                align: 'center',
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.统计项目);
                // }
            },

            {
                field: '申请时间',
                title: '借阅时间',
                width: '17%',
                align: 'center',
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.统计内容);
                // }
            },
            {
                field: '到期时间',
                title: '归还时间',
                width: '17%',
                align: 'center',
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.统计内容简名);
                // }
            },

            {
                field: '状态',
                title: '状态',
                width: '12%',
                align: 'center',
                templet: function(d) {
                    return statusColor(d.状态);
                }
            },

            {
                title: '操作',
                width: '16.6%',
                align: 'center',
                templet: function(d) {
                    var html = `
                     <a class="layui-btn layui-btn-xs layui-btn-warm" onclick="progress('${d.onlynum}','${d.xmlcid}')">进度</a> 
                     `
                    if (qx[0].Limit.isBJ) {

                        html += `
                        <a class="layui-btn layui-btn-xs layui-btn-danger" onclick="delay('${d.onlynum}','${d.到期时间}')">延期</a>
                        `
                            // <a class="layui-btn layui-btn-xs layui-btn-warm"  onclick="returnBook('${d.onlynum}')">归还</a> 
                    }
                    return html;

                }
            }

        ]
    ];

    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '借阅延期', colList, where, 15);
    //查询
    $("#searchData").click(function() {
        where.QueryType = $("#queryT").val();
        where.QueryKey = $("#queryK").val();
        tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '我的申请管理列表', colList, where, 17);
    });
    // 刷新表格
    $("#updateTable").click(function() {
        CallBack()
    })
});

//延期
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
//归还
function returnBook(onlynum) {
    var index001 = layer.confirm('确定要归还吗？', {
        btn: ['确定', '再想想']
    }, function() { //提交,请等待谁审核
        var shlc;
        // 判断调用审核类型
        shlc = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
            XDLMCID: "9000",
            XDLMTID: "9208",
            XDLMSID: "9208036",
            XDLM借阅编号: onlynum,
            XDLM操作人: SysConfig.UserInfo.GetUserName()
        });
        let icon_ = 1;
        if (shlc.success) {
            SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                XDLMCID: "9000",
                XDLMTID: "9208",
                XDLMSID: "9208032",
                "关联编号": onlynum,
                "类型": "归还"
            });
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

// 进度
function progress(jybh, xmlcid) {
    SysConfig.ToolBox.openWindow("../../page/tssq/ts_tssq_jyjl_jd.html?bh=" + jybh + "&xmlcid=" + xmlcid, "流程详情", 500, $(window).height() - 100);
}
// 详情
function detail(tsbh) {
    SysConfig.ToolBox.openWindow("../../page/tssq/ts_tssq_tsdetail.html?knbh=" + tsbh, "详细信息", $(window).width(), $(window).height());
}
// 回车键事件  
$(document).keypress(function(e) {
    if (e.which == 13) {
        $("#searchData").click();
    }
});

//查询下拉
function getQueryList() {
    $("#queryT").empty();
    var returnData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH2020051214135909660252",
    });
    if (returnData.success) {
        for (var i in returnData.rows) {
            $("#queryT").append(`<option value="${returnData.rows[i].查询属性}">${returnData.rows[i].查询显示名}</option>`);
        }
        $("#queryT").find("option[value='模糊查询']").attr("selected", true);
    }
    form.render("select");
}

function CallBack() {
    tableins.reload("mDataTable");
}

function statusColor(d) {
    var textColor = ""
    switch (d) {
        case "审批拒绝":
            textColor = "red"
            break;
        case "审批通过":
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

function compareDate(date1, date2) {

    var oDate1 = new Date(date1);
    var oDate2 = new Date(date2);
    if (oDate1.getTime() > oDate2.getTime()) {
        return true;
    } else {
        return false;
    }
}