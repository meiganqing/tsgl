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



var $, form, element, table, layer, tableins, where, upload, rowid, xmlcid, laydate;

layui.use(["jquery", "form", "layer", "table", "element", "upload", "laydate"], function() {
    var $ = layui.$,
        layer = layui.layer,
        table = layui.table,
        element = layui.element,
        form = layui.form;
    laydate = layui.laydate;
    upload = layui.upload;
    getQueryList(); // 查询下拉
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH2019082312461146116721",

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
                templet: function(d) {
                    var html = ""
                        // <img style="width: 65px;height:65px;cursor: pointer;" src="{{getPictureUrl(d['图片地址'])}}" alt="" lay-event="scanPic" />
                    return html += '<img style="width: 65px;height:65px;cursor: pointer; " src="' + getPictureUrl(d.图片地址) + '" onclick=SysConfig.ToolBox.ShowVideo("查看文件","' + getPictureUrl(d.图片地址) + '","1200",560) />'
                }
            }, {
                field: "登记名称",
                title: "登记名称",
                width: "12%",
                sort: true,
                align: "center",
                templet: function(d) {
                    let html;
                    html = '<a href="javascript:;" style="text-decoration:none;"><p style="color: #1E9FFF;cursor: pointer;margin:0;" onclick="editopen(' + "'" + d.id + "'" + ')">' + SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.登记名称) + '</p></a>';
                    return html;
                }
            },
            {
                field: "标题",
                title: "图书名称",
                sort: true,
                width: '12%',
                align: "center",
                // templet: function(d) {

                //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.工作日.split(" ")[0]) ;
                // }
            },

            {
                field: "编号",
                title: "编号",
                width: "8%",
                sort: true,
                align: "center",
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.补卡时间);
                // }
            },
            {
                field: "作者",
                title: "作者",
                width: "6%",
                sort: true,
                align: "center",
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.补卡时间);
                // }
            },
            {
                field: "出版社",
                title: "出版社",
                width: "6%",
                sort: true,
                align: "center",
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.补卡时间);
                // }
            },
            {
                field: "价格",
                title: "价格",
                width: "6%",
                sort: true,
                align: "center",
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.补卡时间);
                // }
            },
            {
                field: "库存数量",
                title: "库存数量",
                width: "6%",
                sort: true,
                align: "center",
                // templet: function(d) {
                //     return SysConfig.ToolBox.QueryKeyColor($("#queryK").val(), d.补卡时间);
                // }
            }, {
                // field: "借出数量",
                title: "可借数量",
                width: "6%",
                sort: true,
                align: "center",
                templet: function(d) {
                    return Number(d.库存数量) - Number(d.借出数量)
                }
            },
            {
                field: "出版时间",
                title: "出版时间",
                width: "10%",
                sort: true,
                align: "center",
                templet: function(d) {
                    return d.出版时间.slice(0, 9);
                }
            },
            {
                field: "操作",
                title: "操作",
                width: "14%",
                sort: true,
                align: "center",
                templet: function(d) {
                    var html = '';

                    html += `
                        <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="update">更新库存</a> 
                        <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">修改</a> 
                        <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>`
                    return html;
                }
            },

        ]
    ];



    tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '日志操作记录表', colList, where, 7);

    //添加图书
    $('#addBook').click(function() {
        SysConfig.ToolBox.openWindow("/SYTSGL/page/tsgl/ts_tsgl_add.html", '添加图书', $(window).width() - 30, $(window).height() - 30);
    })



    //table操作事件
    table.on("tool(grid_table)", function(obj) {
        var data = obj.data;
        if (obj.event == "edit") {
            SysConfig.ToolBox.openWindow("/SYTSGL/page/tsgl/ts_tsgl_add.html?rowid=" + data.id, '修改图书信息', $(window).width() - 30, $(window).height() - 30);
        } else if (obj.event == "del") {
            SysConfig.SubSystemData.SYTSGL.PLSC([{ id: data.id }], '4000', 'DYBH2019082312461146111224', CallBack);
        } else if (obj.event == "update") {
            $("#addNumber").val("0")
            var layer01 = layer.open({
                type: 1, //此处以iframe举例		
                title: "更新库存",
                area: ['350px', '220px'],
                shade: 0,
                maxmin: true,
                content: $("#addBookNumber"),
                btn: ['确定', '取消'],
                yes: function() {
                    var msgTip = $('input:radio[name="operate"]:checked').val();
                    var tsnum = $("#addNumber").val()

                    var nindex = layer.confirm("确定要" + msgTip + "吗？", {
                        btn: ['确定', '再想想'] //按钮
                    }, function() {
                        updataKC(msgTip, data.文物库内编号, tsnum)
                    }, function() {
                        layer.close(nindex);
                    })

                },
                btn2: function() {
                    layer.closeAll();
                }

            });


        }
    });
    //查询
    $("#searchData").click(function() {
        where.QueryType = $("#queryT").val();
        where.QueryKey = $("#queryK").val();

        tableins = SysConfig.SubSystemData.SYTSGL.SetDataTable(table, '日志操作记录表', colList, where, 7);
    });


    // 刷新表格
    $("#updateTable").click(function() {
            CallBack()
        })
        //批量导入
    $("#pladdBook").click(function() {
            $("#uploadfile").text("")
            zclistindex = layer.open({
                type: 1,
                area: ["600px", "300px"],
                fix: false, //不固定
                maxmin: true,
                title: "导入图书",
                scrollbar: true,
                content: $("#zcdrdom"),
                resize: true,
                closeBtn: 1,
                end: function() {}
            })
        })
        //下载模板
    $("#uploadmb").click(function() {
            SysConfig.SaveFile.DownLoadFile("", "图书导入模版")
        })
        //上传
    uploadExcel(upload)
        //批量导入添加
    $("#pladd").click(function() {
        if ($("#uploadfile").text()) {
            let pldrdata = SysConfig.SubSystemData.SYGDZC.PostData("GetDataInterface", {
                XDLMCID: "9000",
                XDLMTID: "9211",
                XDLMSID: "9211001",
                userId: SysConfig.UserInfo.GetUserID(),
                userName: SysConfig.UserInfo.GetUserName(),
                importFilePath: $("#uploadfile").attr("filepatch")
            });
            if (pldrdata.success) {
                layer.close(zclistindex);
                Callback()
            } else {
                layer.msg(pldrdata + "请规范填写模板！")
                layer.close(zclistindex);
            }
        } else {
            layer.msg('请先上传要添加的图书信息文件')
        }
    })
    form.render();

});

//Excel上传
function uploadExcel(upload) {
    upload.render({
        elem: '#uploadpl' //绑定元素
            ,
        url: "/xddata/xdFileAllSysUpload.ashx?XKLX=SYTSGL" //上传接口
            ,
        accept: 'file',
        acceptMime: "file|xls,file|xlsx",
        exts: "xls|xlsx",
        auto: true,
        size: 60000000, //限制文件大小，单位 KB
        done: function(res) {
            $("#uploadfile").text(res.filename);
            $("#uploadfile").attr("filepatch", res.filepath);
        },
        error: function() {
            layer.msg('上传失败');
        }
    });
}


//查询下拉
function getQueryList() {
    $("#queryT").empty();
    var returnData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH202005111629300883584"
    });
    if (returnData.success) {
        for (var i in returnData.rows) {
            $("#queryT").append(`<option value="${returnData.rows[i].查询属性}">${returnData.rows[i].查询显示名}</option>`);
        }
        $("#queryT").find("option[value='模糊查询']").attr("selected", true);
    }
}



// 回调
function CallBack() {
    tableins.reload("mDataTable");
}

// 图片路径处理
function getPictureUrl(d) {
    var url = d ? d.split(',')[1] : ' '
    return url
}

// 详情
function editopen(rowid) {
    SysConfig.ToolBox.openWindow("/SYTSGL/page/tsgl/ts_tsgl_details.html?rowid=" + rowid, '列表详情', $(window).width() - 200, $(window).height() - 100);
}


// 更新库存
function updataKC(lx, wwknbh, nums) {
    var gengxin = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "9000",
        XDLMSID: "9208033",
        XDLMTID: "9208",
        类型: lx,
        文物库内编号: wwknbh,
        数量: nums
    });
    if (gengxin.success) {
        layer.msg("操作成功", {
            icon: 1,
            time: 500,
        }, function() {
            updateDataTable()
            layer.closeAll()
        });
    } else {
        layer.msg("操作失败", {
            icon: 2,
            time: 500,
        }, function() {
            updateDataTable()
            layer.closeAll()
        });
    }
}

function updateDataTable() {
    tableins.reload("mDataTable");
}