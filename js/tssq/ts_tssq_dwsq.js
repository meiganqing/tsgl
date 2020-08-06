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

var $, table, layer, form, tableins, where, qx, colList, id;
layui.use(["jquery", "form", "layer", "table"], function() {
    $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        table = layui.table;
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("待我审批");

    // getQueryList(); // 查询下拉
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231020302030130321",
        XDLME: "no",
        XDLMF: "no",
        // XDLML:SysConfig.UserInfo.GetUserID(),
        XDLMD: "图书借阅表"
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
                field: 'isRead',
                title: '读取状态',
                width: '10%',
                align: 'center',
                templet: function(d) {
                    if (d.isRead) {
                        if (d.isRead == "read") {
                            return "已读"
                        } else {
                            return "未读"
                        }
                    } else {
                        return "未读"
                    }

                }

            }, {
                field: 'sendPerson',
                title: '发送人',
                width: '15%',
                align: 'center',
                templet: function(d) {
                    return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.sendPerson);
                }
            },

            {
                field: 'recPerson',
                title: '接收人',
                width: '14%',
                align: 'center',
                templet: function(d) {
                    return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.recPerson);
                }
            },
            {
                field: 'theme',
                title: '主题',
                width: '40%',
                align: 'center',
                templet: function(d) {
                    return ` <span onclick="detail('${d.url}','${d.id}','${d.isRead}','${d.msgonlynum}','${d.module}','${d.onlynum}')" style="color: dodgerblue;cursor: pointer;">${d.theme}</span>`
                }
            },
            {
                field: 'recTime',
                title: '时间',
                width: '15%',
                align: 'center',
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.统计内容简名);
                // }
            },
        ]
    ];

    tableins = SysConfig.SubSystemData.SYBGGL.SetDataTable(table, '待我审批', colList, where, 15);
    //查询
    $("#searchData").click(function() {
        where.QueryType = $("#queryT").val();
        where.QueryKey = $("#queryK").val();

        tableins = SysConfig.SubSystemData.SYBGGL.SetDataTable(table, '我的申请管理列表', colList, where, 17);
    });

});

function detail(url, msgid, isRead, msgonlynum, module, onlynum) {

    // console.log(url, 1111)
    SysConfig.ToolBox.openWindow(url + "&msgid=" + msgid + "&readStatus=" + isRead + "&msgonlynum=" + msgonlynum + "&type=dwsp", "审批流程", $(window).width(), $(window).height());
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