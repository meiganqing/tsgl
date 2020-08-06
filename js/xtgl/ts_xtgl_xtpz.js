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
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("系统配置");

    getQueryList(); // 查询下拉
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611178341"
    };
    colList = [
        [{
                checkbox: true,
                LAY_CHECKED: false
            },
            {
                field: '系统图片根目录',
                title: '名称',
                width: '32%',
                align: 'center',
                // templet: function (d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.统计区分);
                // }

            }, {
                field: '统计项目',
                title: '数值',
                width: '32%',
                align: 'center',
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#keyWords").val(), d.统计项目);
                // }
            },

            {
                field: '统计内容',
                title: '操作',
                width: '32%',
                align: 'center',
                templet: function(d) {
                    var html = '';
                    html += `
                     <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">修改</a> 
                     <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>`
                    return html;

                }
            },
        ]
    ];

    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '系统配置', colList, where, 15);
    //查询
    $("#searchData").click(function() {
        where.QueryType = $("#queryT").val();
        where.QueryKey = $("#queryK").val();
        tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '系统配置', colList, where, 15);
    });


    $("#add").click(function() {
            SysConfig.ToolBox.openWindow("../../page/xtgl/ts_xtgl_addtssx.html", "详细信息", $(window).width(), $(window).height());
        })
        //table操作事件
    table.on("tool(grid_table)", function(obj) {
        var data = obj.data;
        if (obj.event == "edit") {
            SysConfig.ToolBox.openWindow("../../page/xtgl/ts_xtgl_addtssx.html?id=" + data.id, "详细信息", $(window).width(), $(window).height());
        } else if (obj.event == "del") {
            SysConfig.SubSystemData.SYTSGL.PLSC([data], "4000", "DYBH201908231246114611160344", CallBack);

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
        XDLMSID: "DYBH2020051210552305824437",
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