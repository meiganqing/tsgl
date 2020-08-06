
/**
 * Created by xh on 2020/03/26
 * 文件名: SY_BG_FQSQ_CGJD_ADD.js
 * 作　者: 徐航
 * 日　期: 2020/03/26
 * 描　述: 发起参观接待申请流程提交，表单提交
 * 版　本: 1.00
 * 修改历史纪录:
 * 版本     时间           姓名         内容
 2. 02   2020/03/26       徐航       发起参观接待申请流程提交，表单提交
 */
var $, form, element, table, formSelects, layer, laydate, tableins, where;
var rowid;
var xxx = decodeURI(decodeURI(window.location.href.getQuery("xxx")));// encodeURI转码  decodeURI解码

layui.use(["jquery", "form", "layer", "table", "element", "laydate"], function () {
    ($ = layui.$),
        (layer = layui.layer),
        (table = layui.table),
        (formSelects = layui.formSelects),
        (element = layui.element),
        (laydate = layui.laydate),
        (form = layui.form);

    rowid = window.location.href.getQuery("rowid")

    // getEntourage();

    $("#统计区分").val(xxx)


    if (rowid != null) {
        $('#submitBtn').html('更改信息');
        echoData();
    } else {
        $('#submitBtn').html('申请');
    }
    $('#submitBtn').click(function () {
        if (rowid != null) {
            SysConfig.SubSystemData.SYTSGL.EditData('#XMForm', 'GetDataInterface', '&XDLMCID=6000&XDLMSID=DYBH20190823124611461131315&XDLMID=' + rowid, EditCallback);
        } else {

            SysConfig.SubSystemData.SYTSGL.AddNewData('#XMForm', 'GetDataInterface', "&XDLMCID=5000&XDLMSID=DYBH20190823124611461131315", Callback);
        }
        return false
    });



    form.render();

});



function echoData() {
    let data = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH20190823124611461182312",
        XDLMA: rowid
    })
    if (data.success) {
        for (let i in data.rows[0]) {
            $('#' + i).val(data.rows[0][i]);
        }

    }
    form.render();
}

function Callback() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
    parent.tableins.reload("mDataTable");
}

function EditCallback() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
    parent.tableins.reload("mDataTable");
}