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
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("图书属性管理");

    if (qx[0].Limit.isBJ) {
        $("#add").removeClass("layui-hide")

    }

    getQueryList(); // 查询下拉
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611191311"
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
                field: '统计区分',
                title: '类型',
                width: '20%',
                align: 'center',
                // templet: function (d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.统计区分);
                // }

            }, {
                field: '统计项目',
                title: '图书属性名称',
                width: '20%',
                align: 'center',
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.统计项目);
                // }
            },

            {
                field: '统计内容',
                title: '图书属性内容',
                width: '20%',
                align: 'center',
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.统计内容);
                // }
            },
            {
                field: '统计内容简名',
                title: '图书属性内容简名',
                width: '20%',
                align: 'center',
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.统计内容简名);
                // }
            },

            {
                title: '操作',
                width: '14%',
                align: 'center',
                templet: function(d) {
                    var html = '';
                    if (qx[0].Limit.isBJ) {
                        html += `<a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">修改</a>`
                    }
                    if (qx[0].Limit.isSC) {
                        html += `<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>`
                    }
                    return html;

                }
            }

        ]
    ];

    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '图书属性管理', colList, where, 15);
    //查询
    $("#searchData").click(function() {
        where.QueryType = $("#queryT").val();
        where.QueryKey = $("#queryK").val();

        tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '我的申请管理列表', colList, where, 17);
    });


    $("#add").click(function() {
            SysConfig.ToolBox.openWindow("../../page/xtgl/ts_xtgl_addtssx.html?xxx=" + encodeURI(encodeURI($("#queryT option:selected").val())), "添加",600, 540);
        })
        //table操作事件
    table.on("tool(grid_table)", function(obj) {
        var data = obj.data;
        if (obj.event == "edit") {
            SysConfig.ToolBox.openWindow("../../page/xtgl/ts_xtgl_addtssx.html?rowid=" + data.id + "&xxx=" + encodeURI(encodeURI($("#queryT option:selected").val())), "修改",600, 550);
        } else if (obj.event == "del") {
            SysConfig.SubSystemData.SYTSGL.PLSC([data], "4000", "DYBH20190823124611461144314", CallBack);

        }
    });
});


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
        XDLMSID: "DYBH2020051211073101301512",
    });
    if (returnData.success) {
        for (var i in returnData.rows) {
            $("#queryT").append(`<option value="${returnData.rows[i].统计区分}">${returnData.rows[i].统计区分}</option>`);
        }
        $("#queryT").find("option[value='图书登记表']").attr("selected", true);
    }
    form.render("select");
}

function CallBack() {
    tableins.reload("mDataTable");
}