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

var $, layer, qx, id, laydate, table, form, where, colList, tableins;
var typeId = window.location.href.getQuery("type")
layui.use(["jquery", "form", "layer", "laydate", "table"], function() {
    $ = layui.$,
        layer = layui.layer,
        laydate = layui.laydate
    form = layui.form
    table = layui.table;
    // qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("图书借阅状态统计");
    getQueryList(); // 查询下拉
    where = {
        XDLMCID: "9000",
        XDLMTID: "9208",
        XDLMSID: "9208034",
        action: typeId == 01 ? "图书" : "借阅人",
        start_at: getPreMonth(SysConfig.ToolBox.CurrentDate()) + " 00:00:00",
        end_at: SysConfig.ToolBox.CurrentDate() + " 23:59:59",
        // storage: SysConfig.UserInfo.GetCookieName("mCurrentStorage"),
    }
    if (typeId == 01) {
        colList = [
            [{
                    checkbox: true,
                    LAY_CHECKED: false
                }, {
                    title: '序号',
                    type: 'numbers',
                },
                {
                    field: '图书',
                    title: '图书名称',
                    // width: '20%',
                    align: 'center'

                },
                {
                    field: '已提交',
                    title: '新申请',
                    // width: '20%',
                    align: 'center',

                },
                {
                    field: '审批拒绝',
                    title: '拒绝借出',
                    // width: '20%',
                    align: 'center',

                },
                {
                    field: '审核后借出',
                    title: '借出',
                    // width: '20%',
                    align: 'center',

                },
                {
                    field: '借阅延期',
                    title: '借阅延期',
                    // width: '20%',
                    align: 'center',

                },
                {
                    field: '借阅归还',
                    title: '借阅归还',
                    // width: '20%',
                    align: 'center',

                }
            ]
        ]
    } else {
        colList = [
            [{
                    checkbox: true,
                    LAY_CHECKED: false
                }, {
                    title: '序号',
                    type: 'numbers',
                },
                {
                    field: 'creator',
                    title: '借阅人',
                    // width: '20%',
                    align: 'center'

                },
                {
                    field: '已提交',
                    title: '新申请',
                    // width: '20%',
                    align: 'center',

                },
                {
                    field: '审批拒绝',
                    title: '拒绝借出',
                    // width: '20%',
                    align: 'center',

                },
                {
                    field: '审核后借出',
                    title: '借出',
                    // width: '20%',
                    align: 'center',

                },
                {
                    field: '借阅延期',
                    title: '借阅延期',
                    // width: '20%',
                    align: 'center',

                },
                {
                    field: '借阅归还',
                    title: '借阅归还',
                    // width: '20%',
                    align: 'center',

                }
            ]
        ]
    }


    gettable(where, '图书借阅状态统计', colList)

    form.on('select(queryT)', function(data) {
        if (data.value) {
            where.publisher = data.value

        } else {
            delete publisher
        }
        gettable(where, '图书借阅状态统计', colList)
    })
    form.on('select(queryK)', function(data) {
            if (data.value) {
                where.type = data.value
            } else {
                delete type
            }
            gettable(where, '图书借阅状态统计', colList)
        })
        // 刷新表格
    $("#updateTable").click(function() {
        CallBack()
    })
    laydate.render({
        elem: '#calendarLib',
        range: true,
        type: 'date',
        value: getPreMonth(SysConfig.ToolBox.CurrentDate()) + " - " + SysConfig.ToolBox.CurrentDate(),
        done: function(value, date, endDate) {
            var dateArray = value.split(" - ")
            where.start_at = dateArray[0] + " 00:00:00";
            where.end_at = dateArray[1] + " 23:59:59";
            gettable(where, '图书借阅状态统计', colList)
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
        XDLMSID: "DYBH201908231246114611191311",
        XDLMB: "图书登记表"
    });
    if (returnData.success) {
        $("#queryT").append(`<option value="">全部</option>`)
        for (var i in returnData.rows) {
            $("#queryT").append(`<option value="${returnData.rows[i].统计内容简名}">${returnData.rows[i].统计内容}</option>`);
        }
    }

    $("#queryK").empty();
    var returnDatas = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611191311",
        XDLMA: "类型"
    });
    if (returnDatas.success) {
        $("#queryK").append(`<option value="">全部</option>`)
        for (var i in returnDatas.rows) {
            $("#queryK").append(`<option value="${returnDatas.rows[i].统计内容简名}">${returnDatas.rows[i].统计内容}</option>`);
        }
    }




    form.render()

}

function CallBack() {
    tableins.reload("mDataTable");
}

function getPreMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}

function gettable(mWhere, mTitle, mCols) {
    layui.use(["table"], function() {
        var table = layui.table;
        tableins = table.render({
            elem: '#grid_table',
            url: "/xdData/xdDataManage.ashx?XAction=GetDataInterface&XKLX=SYTSGL",
            where: mWhere
                //, toolbar: '#mTableToolbar'
                ,
            headers: {
                Authorization: SysConfig.UserInfo.GetSysToken(),
            },
            title: mTitle,
            cols: mCols,
            skin: 'row' //表格风格
                ,
            even: true,
            size: 'sm' //lg
                ,
            id: 'mDataTable',
            limit: 15,
            page: {
                limits: [15, 50, 100, 300, 500],
                groups: 20
            },
            request: {
                pageName: 'page' //页码的参数名称，默认：page
                    ,
                limitName: 'rows' //每页数据量的参数名，默认：limit
            },
            response: {
                //    statusName: 'code' //规定数据状态的字段名称，默认：code
                //, statusCode: 0 //规定成功的状态码，默认：0
                //,msgName: 'message' //规定状态信息的字段名称，默认：msg
                // countName: 'total' //规定数据总数的字段名称，默认：count
                // ,
                // dataName: 'rows' //规定数据列表的字段名称，默认：data
            },
            done: function(res, curr, count) {


            }
        });
    })
}