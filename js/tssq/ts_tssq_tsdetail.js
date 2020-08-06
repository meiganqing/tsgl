/**
 * Created by xh on 2020/03/23
 * 文件名: addofficialBusiness1.JS
 * 作　者: 韩鑫哲
 * 日　期: 2020/03/16
 * 描　述: 出差添加页面
 * 版　本: 1.00
 * 修改历史纪录:
 * 版本     时间           姓名         内容
 2. 02   2020/03/16       韩鑫哲       出差页面修改
 */



var $, form, element, table, layer, tableins, where, rowid, xmlcid, laydate;
var knbh = window.location.href.getQuery("knbh");
layui.use(["jquery", "form", "layer", "table", "element", "laydate"], function() {
    var $ = layui.$,
        layer = layui.layer,
        table = layui.table,
        element = layui.element,
        form = layui.form;
    laydate = layui.laydate;
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH20200512113740374014111",
        XDLMA: knbh
    };


    var colList = [
        [
            { type: "checkbox" },
            { field: "id", title: "id", width: "1%", hide: true, align: "center" },
            {
                field: "图书",
                title: "登记名称",
                sort: true,
                width: '50%',
                align: "center",
                templet: function(d) {
                    return ` <span onclick="openDetail('${d.图书编号}')" style="color: dodgerblue;cursor: pointer;"> ${d.图书}</span>`
                }
            },

            {
                field: "图书编号",
                title: "图书编号",
                width: "25%",
                sort: true,
                align: "center",
            },
            {
                field: "数量",
                title: "数量",
                width: "22%",
                sort: true,
                align: "center",
            },

        ]
    ];
    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '日志操作记录表', colList, where, 7);

})





// 详情
function openDetail(bookNum) {
    SysConfig.ToolBox.openWindow("/SYTSGL/page/tsgl/ts_tsgl_details.html?bookNum=" + bookNum + "&type=1", '图书详情', $(window).width() - 200, $(window).height() - 100);
}