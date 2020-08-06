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



var $, form, element, table, layer, tableins, where, rowid, xmlcid,laydate;

layui.use(["jquery", "form", "layer", "table", "element", "laydate"], function () {
    var $ = layui.$,
        layer = layui.layer,
        table = layui.table,
        element = layui.element,
        form = layui.form;
        laydate = layui.laydate;

      getQueryList(); // 查询下拉
        where = {
            XDLMCID:"1001",
            XDLMSID: "DYBH20190823124611461111731",
           
          };
    

    var colList = [
      [
        { type: "checkbox" },
        { field: "id", title: "id", width: "1%", hide: true, align: "center" },
        {
            field: "mUserName",
            title: "用户名",
            sort: true,
            width: '10%',
            align: "center",
            // templet: function(d) {
            //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.项目名称);
            // }
        },
        {
            field: "mDataTime",
            title: "操作时间",
            sort: true,
            width: '10%',
            align: "center",
            // templet: function(d) {
               
            //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.工作日.split(" ")[0]) ;
            // }
        },
         {
            field: "mUserIP",
            title: "IP地址",
            width: "10%",
            sort: true,
            align: "center",
            // templet: function(d) {
            //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.creator);
            // }
        },
        {
            field: "mUserBehavior",
            title: "操作内容",
            width: "14%",
            sort: true,
            align: "center",
            // templet: function(d) {
            //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.补卡时间);
            // }
        },
        {
            field: "mUserContent",
            title: "统计内容",
            width: "52%",
            sort: true,
            align: "center",
            // templet: function(d) {
            //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.补卡时间);
            // }
        },
      ]
    ]; 

    

   tableins =SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '日志操作记录表', colList, where, 17);


    //查询
    $("#searchData").click(function() {
            where.QueryType = $("#queryT").val();
            where.QueryKey = $("#queryK").val();

        tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '日志操作记录表', colList, where, 17);
    });

    form.render();

});


//查询下拉
function getQueryList() {
    $("#queryT").empty();
    var returnData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH2020051216480406958310"
    });
    if (returnData.success) {
        for (var i in returnData.rows) {
            $("#queryT").append(`<option value="${returnData.rows[i].查询属性}">${returnData.rows[i].查询显示名}</option>`);
        }
        $("#queryT").find("option[value='模糊查询']").attr("selected", true);
    }
}



function CallBack() {
    tableins.reload("mDataTable");
}


