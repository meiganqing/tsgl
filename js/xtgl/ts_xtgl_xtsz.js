/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-07-07 14:31:04
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */
var $, layer, form, qx;
layui.use(["jquery", "form", "layer"], function() {
    $ = layui.$,
        layer = layui.layer,
        form = layui.form;
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("系统配置");

    if (qx[0].Limit.isBJ) {
        $("#clearSysAllData").removeClass("layui-hide")
    }
    let rowid = sysdata()

    $("#clearSysAllData").click(function() {
        SysConfig.SubSystemData.SYTSGL.EditData('#XMForm', 'GetDataInterface', '&XDLMCID=6000&XDLMSID=DYBH20190823124611461149355&XDLMID=' + rowid, EditCallback);

    })


});

function sysdata() {
    let SysConfigdata = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH20190823124611461152351",
    });
    if (SysConfigdata.success && SysConfigdata.rows && SysConfigdata.rows.length > 0) {
        for (let k in SysConfigdata.rows[0]) {
            $("#" + k).val(SysConfigdata.rows[0][k])
        }
        return SysConfigdata.rows[0]['id']
    }
    form.render();

}

function EditCallback() {
    sysdata()
}