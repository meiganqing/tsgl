/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-04-23 15:40:04
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */

var $, form, table, layer, rowid, tableins, where, colList, zccode, zcknbh, zcsyr, zcsyrid, cfddid;
layui.use(['jquery', 'form', 'table', 'layer'], function() {
    $ = layui.$,
        form = layui.form,
        table = layui.table,
        layer = layui.layer;
    rowid = window.location.href.getQuery("id")
    var msgid = window.location.href.getQuery('msgid'); //msg_id是信息表id，用于打开审核页面后修改信息读取状态
    var readStatus = window.location.href.getQuery('readStatus');
    var type = window.location.href.getQuery('type');
    // console.log(rowid, 333333)
    console.log(window.location.href.getQuery("id"))
    if (type == "spjl") {
        $("#addfjdiv").addClass("layui-hide")
        $("#shpart").addClass("layui-hide")
    }
    if (msgid != null && readStatus == 'unread') { //修改读取状态
        editReadStatus(msgid);
    }
    if (rowid != null) {
        var returnData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
            XDLMCID: '1001',
            XDLMSID: 'DYBH201908231246114611141242',
            XDLMA: rowid,
        });
        if (returnData.success && returnData.rows && returnData.rows.length > 0) {
            where = {
                XDLMCID: "1001",
                XDLMSID: "DYBH20200512113740374014111",
                XDLMA: returnData.rows[0].onlynum
            }
            if (returnData.rows[0].shzt == '已完成') {
                $("#shpart").addClass("layui-hide")
                $("#addfjdiv").addClass("layui-hide")
            }
            SysConfig.WorkflowManage.getXMInfo(returnData);
            for (var k in returnData.rows[0]) {
                $("#" + k).html(returnData.rows[0][k])
            }
            // zccode = returnData.rows[0].资产编号集合
            zcknbh = returnData.rows[0].onlynum
            zcsyr = returnData.rows[0].creator
            zcsyrid = returnData.rows[0].creator_id
                // cfddid = returnData.rows[0].存放地点编号
                //流程说明
            let lcdata = SysConfig.WorkflowManage.getWorkflowNodesState('#xmlc');
            //流转意见
            $('#layui-timeline').append(SysConfig.WorkflowManage.getWorkflowInfoAndList());
        } else {
            layer.msg('无相关信息！')
        }
    }

    var colList = [
        [
            { type: "checkbox" },
            { field: "id", title: "id", width: "1%", hide: true, align: "center" },
            {
                field: "图书",
                title: "书名",
                sort: true,
                width: '40%',
                align: "center",
                templet: function(d) {
                    return ` <span onclick="openDetail('${d.图书编号}')" style="color: dodgerblue;cursor: pointer;"> ${d.图书}</span>`
                }
            },
            {
                field: "图书编号",
                title: "图书编号",
                width: "33.5%",
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

    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '借阅列表', colList, where, 5); //附件表
    form.on('radio(constat)', function(data) {
        console.log(data);
        if (data.value == '不同意') { //不同意
            $('#submitBtn').html('退回');
            //获取可退回的节点列表
            SysConfig.WorkflowManage.getRollbackNodeList();
            form.render();
        } else {
            $('#submitBtn').html('审核通过');
            $('#returnBackJD').addClass('layui-hide').removeClass('layui-show');
        }
    });

    //提交
    form.on('submit(XMFormlist)', function(data) {
        console.log(data.field);
        if (data.field.constat == '不同意') { //不同意
            let gotoNodemsg;
            // console.log(zcknbh)
            if ($('[name="returnBackJD"]:checked').attr('data_targetJD') == "1") {
                SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                    XDLMCID: "9000",
                    XDLMTID: "9208",
                    XDLMSID: "9208032",
                    "关联编号": zcknbh,
                    "类型": "拒绝"
                });
            }
            if ($("#zryj").val()) {
                gotoNodemsg = SysConfig.WorkflowManage.gotoNode($("#zryj").val(), $('[name="returnBackJD"]:checked').attr('data_targetJD'))
            } else {
                gotoNodemsg = SysConfig.WorkflowManage.gotoNode('不同意', $('[name="returnBackJD"]:checked').attr('data_targetJD'))
            }
            if (gotoNodemsg.msg) {
                SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                    XDLMCID: '6000',
                    XDLMSID: 'DYBH20190823124611461150245',
                    XDLMID: rowid,
                    XDLM状态: '审批拒绝'
                })
                parent.layer.msg(gotoNodemsg.message, {
                    icon: 1,
                    time: 1500
                }, function() {
                    QXALL();
                });
            } else {
                parent.layer.msg("流程失败", {
                    icon: 2,
                    time: 1500
                }, function() {
                    QXALL();
                });
            }
        } else { //同意
            let completemsg;
            if ($("#zryj").val()) {
                completemsg = SysConfig.WorkflowManage.complete($("#zryj").val())
                    // console.log(completemsg,33333333333)
            } else {
                completemsg = SysConfig.WorkflowManage.complete('同意')
            }
            if (completemsg.msg) {
                // if (completemsg.message == "流程已完成！") {
                //     // let addlyzcdataknbh = table.cache["mDataTable"];
                //     // let editxxarr = [];
                //     console.log(addlyzcdataknbh)


                //     //修改主表状态
                //     let zbtype = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                //         XDLMCID: '6000',
                //         XDLMSID: 'DYBH20190823124611461150245',
                //         XDLMID: rowid,
                //         XDLM状态:'审批后借出'
                //     });
                //     if (zbtype.success) {
                //         parent.layer.msg(completemsg.message, {
                //             icon: 1,
                //             time: 1500
                //         }, function() {
                //             QXALL();
                //         });
                //     } else {
                //         parent.layer.msg("主表数据修改失败", {
                //             icon: 2,
                //             time: 1500
                //         }, function() {
                //             QXALL();
                //         });
                //     }

                // } else {
                //     parent.layer.msg(completemsg.message, {
                //         icon: 1,
                //         time: 1500
                //     }, function() {
                //         QXALL();
                //     });
                // }
                parent.layer.msg(completemsg.message, {
                    icon: 1,
                    time: 1500
                }, function() {
                    QXALL();
                });
            } else {
                parent.layer.msg("流程失败", {
                    icon: 2,
                    time: 1500
                }, function() {
                    QXALL();
                });
            }
        }
        return false
    });
    form.render();
})


// 进入页面讲读取状态改为已读
function editReadStatus(id) {
    var editread = SysConfig.SubSystemData.SYBGGL.PostData("GetDataInterface", {
        XDLMCID: '6000',
        XDLMSID: 'DYBH201908231020302030171325',
        XDLMID: id,
        XDLMisRead: 'read'
    });
    if (!editread.success) {
        console.log(editread);
    }
}


function AddCallback(msg) {
    if (msg) {
        layer.msg(msg);
    }
    var index543 = parent.layer.getFrameIndex(window.name); //获取窗口索引
    parent.layer.close(index543);
    // parent.Callback();
}

function QXALL() {
    var index543 = parent.layer.getFrameIndex(window.name); //获取窗口索引
    parent.layer.close(index543);
    if (parent.tableins) {
        parent.tableins.reload("mDataTable");
        // parent.tableins.reload("mDataTable", {
        //     page: {
        //         curr: 1
        //     }
        // });
    }
    // parent.Callback();
}

// 详情
function openDetail(bookNum) {
    SysConfig.ToolBox.openWindow("/SYTSGL/page/tsgl/ts_tsgl_details.html?bookNum=" + bookNum + "&type=1", '图书详情', $(window).width() - 200, $(window).height() - 100);
}