var $, form, element, table, layer, tableins, UploadTable, Uploadcols, UploadTableData, where, qx, laydate, upload;
var cols;
layui.use(["jquery", "form", "layer", "table", "laydate", "upload"], function() {
    ($ = layui.$),
    (layer = layui.layer),
    (table = layui.table),
    (form = layui.form);
    laydate = layui.laydate;
    upload = layui.upload;
    UploadTable = layui.table;

    rowid = window.location.href.getQuery("rowid");
    bookNum = window.location.href.getQuery("bookNum");
    onlynum = window.location.href.getQuery("onlynum");
    type = window.location.href.getQuery("type");

    if (type == 1) {
        where = {
            XDLMCID: '1001',
            XDLMSID: 'DYBH2019082312461146116721',
            XDLME: bookNum
        }
    } else {
        where = {
            XDLMCID: '1001',
            XDLMSID: 'DYBH20190823124611461124322',
            XDLMA: rowid
        }
    }

    // 修改页面数据回显

    var data = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", where);
    if (data.rows) {
        if (data.rows.length > 0) {
            for (var i in data.rows[0]) {
                $('#' + i).html(data.rows[0][i]);
            }
            $("#库房数量").html(Number(data.rows[0].库存数量 ? data.rows[0].库存数量 : 0) - Number(data.rows[0].借出数量 ? data.rows[0].借出数量 : 0))
            if (data.rows[0].出版时间) {
                $("#出版时间").html(data.rows[0].出版时间.slice(0, 9).replace(/\//g, "-"))
            }
            if (data.rows[0].印刷时间) {
                $("#印刷时间").html(data.rows[0].印刷时间.slice(0, 9).replace(/\//g, "-"))
            }
            if (data.rows[0].图片地址 != "") {
                let files = data.rows[0].图片地址.split('|');
                if (files[files.length - 1].split(",")[3] == "图书电子书") {
                    $("#dzsxz").removeClass("layui-hide")
                    $("#dzsxz").click(function() {
                        SysConfig.SaveFile.DownLoadFile(files[files.length - 1].split(",")[1], files[files.length - 1].split(",")[2])
                    })
                }
            }

            var html = ""
            html += '<img style="width:56%;height:60%;cursor: pointer; " src="' + getPictureUrl(data.rows[0].图片地址) + '" onclick=SysConfig.ToolBox.ShowVideo("查看文件","' + getPictureUrl(data.rows[0].图片地址) + '","1200",560) />'
            $("#picBody").html(html)
        } else {
            layer.msg("未找到对应图书")
        }
    }


})

function getPictureUrl(d) {
    var url = d ? d.split(',')[1] : ' '
    return url
}