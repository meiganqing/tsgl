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
layui.use(["jquery", "form", "layer", "table"], function () {
    $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        table = layui.table;
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("图书属性管理");
    var gjNum = decodeURI(decodeURI(window.location.href.getQuery("gjNum"))),
        fcNum = decodeURI(decodeURI(window.location.href.getQuery("fcNum"))),
        fqNum = decodeURI(decodeURI(window.location.href.getQuery("fqNum")));
    console.log(gjNum, fcNum, fqNum, 2222)
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH2019082312461146116721",
        XDLMD: SysConfig.UserInfo.GetCookieName("mCurrentStorage"),
        XDLMF: gjNum,
        XDLMG: fcNum,
        XDLMH: fqNum
    };
    var colList = [
        [
            { type: "checkbox" },
            { field: "id", title: "id", width: "1%", hide: true, align: "center" },
            {
                field: "图片地址",
                title: "记录图",
                sort: true,
                width: '10%',
                align: "center",
                templet: function (d) {
                    var html = ""
                    return html += '<img style="width: 65px !important;height:65px !important;cursor: pointer;" src="' + getPictureUrl(d.图片地址) + '" onclick=SysConfig.ToolBox.ShowVideo("查看文件","' + getPictureUrl(d.图片地址) + '","1200",560) />'
                }
            }, 
            {
                field: "登记名称",
                title: "登记名称",
                width: "12%",
                sort: true,
                align: "center",
            },
            {
                field: "标题",
                title: "图书名称",
                sort: true,
                width: '12%',
                align: "center",
            },
            {
                field: "编号",
                title: "编号",
                width: "8%",
                sort: true,
                align: "center",
            },
            {
                field: "作者",
                title: "作者",
                width: "6%",
                sort: true,
                align: "center",

            },
            {
                field: "出版社",
                title: "出版社",
                width: "6%",
                sort: true,
                align: "center",

            },
            {
                field: "价格",
                title: "价格",
                width: "6%",
                sort: true,
                align: "center",

            },
            {
                field: "库存数量",
                title: "库存数量",
                width: "6%",
                sort: true,
                align: "center",

            }, 
            {
                field: "借出数量",
                title: "借出数量",
                width: "6%",
                sort: true,
                align: "center",

            },
            {
                field: "出版时间",
                title: "出版时间",
                width: "10%",
                sort: true,
                align: "center",
                templet: function (d) {
                    return d.出版时间.slice(0, 9);
                }
            },
            {
                field: "操作",
                title: "操作",
                width: "14%",
                sort: true,
                align: "center",
                templet: function (d) {
                    var html = '';
                    html += `
                        <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="update" onclick=editopen(${d.id})>详情</a> `
                    return html;
                }
            },
        ]
    ];

    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '日志操作记录表', colList, where, 15);
    form.render();
});
// 详情
function editopen(rowid) {
    SysConfig.ToolBox.openWindow("/SYTSGL/page/tsgl/ts_tsgl_details.html?rowid=" + rowid, '列表详情', $(window).width() - 200, $(window).height() - 100);
}
// 回车键事件  
$(document).keypress(function (e) {
    if (e.which == 13) {
        $("#searchData").click();
    }
});
// 图片路径处理
function getPictureUrl(d) {
    var url = d ? d.split(',')[1] : ' '
    return url
}


function CallBack() {
    tableins.reload("mDataTable");
}