/**
 * Created by xh on 2020/03/16
 * 文件名: addofficialBusiness1.JS
 * 作　者: 韩鑫哲
 * 日　期: 2020/03/16
 * 描　述: 出差添加页面
 * 版　本: 1.00
 * 修改历史纪录:
 * 版本     时间           姓名         内容
 2. 02   2020/03/16       韩鑫哲       出差页面修改
 */



var $, form, element, table, layer, tableins, where, rowid;

layui.use(["jquery", "form", "layer", "table", "element", "laydate"], function() {
    var $ = layui.$,
        layer = layui.layer,
        table = layui.table,
        element = layui.element,
        form = layui.form;

    rowid = window.location.href.getQuery('bh');

    getWorkflowInfoAndList(rowid)

})

function getWorkflowInfoAndList(m_Onlynum) {
    var shjlData = SysConfig.SubSystemData.SYBGGL.PostData("GetDataInterface", {
        XDLMCID: '1001',
        XDLMSID: 'DYBH2020021415275906564857',
        XDLMA: m_Onlynum, //主表唯一编号
        // XDLMB: m_LConlynum
    });
    let lc_data = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: '1001',
        XDLMSID: 'DYBH201908231246114611160251',
        XDLMA: m_Onlynum,
    });
    var shHml = '';
    if (shjlData.success && shjlData.rows && shjlData.rows.length > 0) {

        for (let i = 0; i < shjlData.total; i++) {
            shHml += '<li class="layui-timeline-item"> <i class="layui-icon layui-timeline-axis"></i>';
            shHml += '<div class="layui-timeline-content layui-text">';
            if (shjlData.rows[i].流程节点编号 > 1) {
                shHml += ' <h3 class="layui-timeline-title">' + shjlData.rows[i].流程名称 + '</h3>';
                shHml += '  <ul>';
                shHml += '   <li>审核人【' + shjlData.rows[i].签批人 + '】</li>';
                shHml += '   <li>部门【' + shjlData.rows[i].签批人部门 + '】</li>';
                shHml += ' <li>提醒时间【' + shjlData.rows[i - 1].签批时间 + '】</li>';
                shHml += ' <li>签批意见【' + shjlData.rows[i].签批意见 + '】</li>';
                shHml += ' <li>签批时间【' + shjlData.rows[i].签批时间 + '】</li>';
            } else {
                shHml += ' <h3 class="layui-timeline-title">' + shjlData.rows[i].流程名称 + '</h3>';
                shHml += '  <ul>';
                shHml += '   <li>申请人【' + shjlData.rows[i].签批人 + '】</li>';
                shHml += ' <li>申请时间【' + shjlData.rows[i].签批时间 + '】</li>';
            }
            shHml += '  </ul>';
            shHml += ' </div>';
            shHml += ' </li>';
        }
        if (lc_data.success && lc_data.rows && lc_data.rows.length > 0) {

            for (let i = 0; i < lc_data.total; i++) {
                shHml += '<li class="layui-timeline-item"> <i class="layui-icon layui-timeline-axis"></i>';
                shHml += '<div class="layui-timeline-content layui-text">';

                shHml += ' <h3 class="layui-timeline-title">' + lc_data.rows[i].类型 + '</h3>';
                shHml += '  <ul>';
                shHml += '   <li>操作人【' + lc_data.rows[i].操作人 + '】</li>';
                shHml += ' <li>记录时间【' + lc_data.rows[i].记录时间 + '】</li>';

                shHml += '  </ul>';
                shHml += ' </div>';
                shHml += ' </li>';
            }

        }
    } else {
        if (lc_data.success && lc_data.rows && lc_data.rows.length > 0) {

            for (let i = 0; i < lc_data.total; i++) {
                shHml += '<li class="layui-timeline-item"> <i class="layui-icon layui-timeline-axis"></i>';
                shHml += '<div class="layui-timeline-content layui-text">';

                shHml += ' <h3 class="layui-timeline-title">' + lc_data.rows[i].类型 + '</h3>';
                shHml += '  <ul>';
                shHml += '   <li>操作人【' + lc_data.rows[i].操作人 + '】</li>';
                shHml += ' <li>记录时间【' + lc_data.rows[i].记录时间 + '】</li>';

                shHml += '  </ul>';
                shHml += ' </div>';
                shHml += ' </li>';
            }

        } else {
            shHml += ' <h3 class="layui-timeline-title">暂无流程数据</h3>';
        }

    }

    $('#layui-timeline').append(shHml)
}