/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-07-04 10:38:45
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */

var $, table, layer, form, tableins, laypage, laydate, where, qx, laytpl, getTpl, layerLoad, bookReturnData, borrowBookData, checkedDataId, where, layer01, system;
layui.use(["jquery", "form", "layer", "table", 'laydate', 'laypage', "laytpl"], function() {
    $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        table = layui.table;
    laypage = layui.laypage;
    laydate = layui.laydate;
    laytpl = layui.laytpl;
    getTpl = bookHtml.innerHTML;
    bookReturnData = [],
        borrowBookData = [], //选中的要借阅的数据
        checkedDataId = []; //选中的id数组，分页的时候需要回显
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("图书查找");
    system = window.location.href.getQuery("system");

    if (system == "sybg") {
        $("#departmentdiv").addClass("layui-hide")
        $("#peoplediv").addClass("layui-hide")
    }
    //日期
    laydate.render({
        elem: '#endTime',
        type: 'date',
        done: function(value, date, endDate) {
            var currentTimer = new Date(SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime());
            var returnTimer = new Date(value);
            if (returnTimer < currentTimer) {
                layer.msg("归还日期不能小于今天")
                $("#endTime").val("")
            }
        }
    });
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH2019082312461146116721",
        page: 1,
        rows: 6
    }
    getQueryList(); // 查询下拉

    bookdatapage(where)

    let Department = SysConfig.GetTableData.DepartmentData()
    if (Department.success && Department.rows && Department.rows.length > 0) {
        $("#department").empty()
        for (let i in Department.rows) {
            $("#department").append(`<option value="${Department.rows[i].DepartName}">${Department.rows[i].DepartName}</option>`)
            form.render("select")
        }
        getUser(Department.rows[0]['DepartName'])
    }

    //获取人员
    form.on("select(department)", function(data) {
        getUser(data.value)
    })
    $("#searchData").click(function() {
        delete where.page
        delete where.rows
        where.QueryType = $("#cxlb").val();
        where.QueryKey = $("#keyWords").val();
        bookdatapage(where)
    });

    form.on('switch(isCompanyUser)', function(data) {
        if (data.elem.checked) { //内部人员
            $(".ourCompany").removeClass("layui-hide")
            $(".otherCompany").addClass("layui-hide")

        } else {
            $(".otherCompany").removeClass("layui-hide")
            $(".ourCompany").addClass("layui-hide")
        }
    });

    $(document).on("click", ".right-bottom", function() { //选择图书
            var number = $("#bookNumber").html();
            var dataIndex = $(this).attr("data-index");
            if ($(this).hasClass("right-bottom-check")) {
                $(this).html("移除")
                $(this).removeClass("right-bottom-check").addClass("right-bottom-checked") //是否选中
                $("#bookNumber").html(Number(number) + 1) //购物车的数字更改
                bookReturnData[dataIndex].borrowNumber = $(this).parents(".lendNumber").find(".borrowNumber").val()
                borrowBookData.push(bookReturnData[dataIndex]) //借阅数组中添加数据

            } else {
                $(this).html("添加")
                $(this).addClass("right-bottom-check").removeClass("right-bottom-checked")
                $("#bookNumber").html(Number(number) - 1)
                borrowBookData.filter(function(value, index) {
                    if (value.id == bookReturnData[dataIndex].id) {
                        borrowBookData.splice(index, 1) //借阅数组中移除数据						
                    }
                })
            }
        })
        //table栏的操作
    table.on("tool(demo)", function(obj) {
        var data = obj.data;
        switch (obj.event) {
            case "del":
                obj.del();
                for (var i = 0; i < borrowBookData.length; i++) {
                    if (data.id == borrowBookData[i].id) {
                        borrowBookData.splice(i, 1) //借阅数组中移除数据		
                        break;
                    }
                }
                $("#bookNumber").html(Number(borrowBookData.length))
                $("#check" + data.id).removeClass("right-bottom-checked").addClass("right-bottom-check")
                $("#check" + data.id).html("添加")
                break;
        }
    })

    //购物车点击弹出清单
    $("#car").click(function() {
            if (borrowBookData.length > 0) {
                layer001 = SysConfig.ToolBox.openWindowByDIV($("#carList"), "借阅图书清单", $(window).width() - 50, $(window).height() - 50)
                getTable_x("demo", borrowBookData)
            } else {
                layer.msg("请选择要借阅的图书")
            }
        })
        //借阅
    $("#borrowBook").click(function() {
        //			borrow()
        if (borrowBookData.length > 0) {
            layer001 = SysConfig.ToolBox.openWindowByDIV($("#carList"), "借阅图书清单", $(window).width() - 50, $(window).height() - 50)
            getTable_x("demo", borrowBookData)
        } else {
            layer.msg("请选择要借阅的图书")
        }

    })
    $(document).on("keyup", ".borrowNumber", function(event) { //借阅数量超出图书总数
        if (Number($(this).val()) > Number($(this).attr("max-number"))) {
            layer.msg("借阅数量不能大于可借阅数量")
            $(this).val(1)
        }
        var dataIndex = $(this).attr("data-index");
        bookReturnData[dataIndex].borrowNumber = $(this).val()

    })
    $(document).on("mouseout", ".borrowNumber", function(event) { //借阅数量超出图书总数

        if (Number($(this).val()) > Number($(this).attr("max-number"))) {
            layer.msg("借阅数量不能大于可借阅数量")
            $(this).val(1)
        }
        var dataIndex = $(this).attr("data-index");
        bookReturnData[dataIndex].borrowNumber = $(this).val()

    })
    $(document).on("click", ".book-name", function(event) { //借阅数量超出图书总数

        var knbh = $(this).attr("knbh");
        var rowid = $(this).attr("id")
        SysConfig.ToolBox.openWindow('/SYTSGL/page/tsgl/ts_tsgl_details.html?knbh=' + knbh + "&rowid=" + rowid, "详细信息", $(window).width(), $(window).height())
    })
    $(document).on("click", ".bookPicture", function(event) { //借阅数量超出图书总数

        var src = $(this).attr("src");
        lookPic(src)

    })

});

function getUser(data) {
    let userdata = SysConfig.GetTableData.UserData(data)
    if (userdata.success && userdata.rows && userdata.rows.length > 0) {
        $("#people").empty()
        for (let i in userdata.rows) {
            $("#people").append(`<option value="${userdata.rows[i].mUserID}">${userdata.rows[i].mUserName}</option>`)
            form.render("select")
        }
    }
}

function bookdatapage(where) {
    var bookData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", where);
    if (bookData.success && bookData.rows && bookData.rows.length > 0) {
        laypage.render({
            elem: 'test1',
            count: bookData.total, //数据总数，从服务端得到		
            layout: ['count', 'prev', 'page', 'next', 'refresh', 'skip'],
            limit: 6,
            hash: true,
            jump: function(obj, first) {
                //首次不执行
                if (first) {
                    getBookListHtml(bookData)
                } else {
                    where.page = obj.curr
                    where.rows = obj.limit
                    let storeDatas = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", where);
                    if (storeDatas.success && storeDatas.rows && storeDatas.rows.length > 0) {
                        getBookListHtml(storeDatas)
                    } else {
                        $("#bookListDiv").empty()
                    }
                }
                if (borrowBookData.length > 0) { //翻页回显选中的数据
                    checkedDataId = []
                    borrowBookData.filter(function(val) {
                        checkedDataId.push(val.id)
                    })
                }
            }
        });
    } else if (bookData.success && bookData.rows.length == "") {
        layer.msg("您查找的图书不存在", { icon: 2 })
    }
}

function getBookListHtml(data) {
    bookReturnData = data.rows
    layerLoad = layer.load(2); //又换了种风格，并且设定最长等待10秒 
    laytpl(getTpl).render(data, function(html) {
        //view.innerHTML = html;
        if (!data.rows.length > 0) {
            layer.msg("啊哦，没有查询到数据")
        }
        $("#bookListDiv").empty()
        $("#bookListDiv").append(html)
        layer.close(layerLoad)
    });
}

// 回车键事件  
$(document).keypress(function(e) {
    if (e.which == 13) {
        $("#searchData").click();
    }
});

function isChecked(d) {
    var flag = false;
    if (checkedDataId.length > 0) {
        if (checkedDataId.indexOf(d) != -1) {
            flag = true;
        }
    }
    return flag;
}

//查询下拉
function getQueryList() {
    $("#cxlb").empty();
    var returnData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH202005111629300883584",
    });
    if (returnData.success) {
        for (var i in returnData.rows) {
            $("#cxlb").append(`<option value="${returnData.rows[i].查询属性}">${returnData.rows[i].查询显示名}</option>`);
        }
        $("#cxlb").find("option[value='模糊查询']").attr("selected", true);
    }
    form.render("select");
}

//刷新
function updateData() {
    window.location.reload()
}

function borrow() {
    let knbh = SysConfig.ToolBox.getTimeAndRandom();
    if (borrowBookData.length > 0) {
        layer01 = layer.open({
            type: 1 //此处以iframe举例
                ,
            title: '图书借阅',
            area: ['450px', '400px'],
            shade: 0.6,
            maxmin: true,
            content: $("#chooseDate"),
            btn: ['确定', '取消'],
            yes: function() {
                if (!$("#endTime").val()) {
                    layer.msg("请选择归还时间")
                    return false
                }
                let people = "";
                let peopleid = "";
                // if ($("#isCompanyUser").prop("checked")) {
                console.log(system)
                if (system == "sybg") {
                    people = SysConfig.UserInfo.GetUserName()
                    peopleid = SysConfig.UserInfo.GetUserID()
                } else {
                    people = $("#people option:selected").text()
                    peopleid = $("#people option:selected").val()

                }

                // } else {
                //     people = $("#borrowPeople").val()
                // }

                if (!people) {
                    layer.msg("借阅人不能为空")
                    return false
                }
                var dataArray = []
                for (var i = 0; i < borrowBookData.length; i++) {
                    dataArray.push({ //整理选中的数据变成后台需要的格式
                        库内编号: SysConfig.ToolBox.getTimeAndRandom(),
                        图书编号: borrowBookData[i]['文物库内编号'],
                        关联编号: knbh,
                        图书: borrowBookData[i]['登记名称'],
                        数量: borrowBookData[i]['borrowNumber'],

                    })
                }
                var bookjy = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                    XDLMCID: "5000",
                    XDLMSID: "DYBH20190823124611461114243",
                    XDLMonlynum: knbh,
                    XDLMtitle: people + "发起的图书借阅申请",
                    XDLMcreator: people,
                    XDLMcreator_id: peopleid,
                    XDLM申请时间: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
                    XDLM到期时间: $("#endTime").val() + ' 23:59:59',
                    XDLMshzt: "待提交",
                    XDLM状态: "已提交"

                });
                if (bookjy.success) {
                    var bookjypl = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                        XDLMCID: "5001",
                        XDLMSID: "DYBH202005121137460605597",
                        datalist: JSON.stringify({
                            "key": dataArray
                        })

                    });
                    if (bookjypl.success) {
                        var bookkc = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                            XDLMCID: "9000",
                            XDLMTID: "9208",
                            XDLMSID: "9208032",
                            "关联编号": knbh,
                            "类型": "发起"
                        });
                        if (bookkc.success) {
                            var shlc = SysConfig.WorkflowManage.create(knbh, '图书借阅申请');
                            if (shlc.success) {
                                layer.msg(shlc.message, {
                                    icon: 1,
                                    time: 1500
                                }, function() {
                                    // layer.close(index001);
                                    AddCallback()
                                });
                            } else {
                                layer.msg("提交失败", {
                                    icon: 2,
                                    time: 1500
                                }, function() {
                                    // layer.close(index001);
                                    AddCallback()
                                });
                            }

                        } else {
                            layer.msg(bookkc.message);
                        }
                    } else {
                        layer.msg(bookjypl.message);
                    }
                } else {
                    layer.msg(bookjy.message);
                }
            },
            btn2: function() {
                layer.closeAll();
            }
        });

    } else {
        layer.msg("请选择要借阅的图书")
    }
}

function getTable_x(id, data) {
    var height_ = 580;
    layui.use(["table"], function() {
        var table = layui.table;
        var cols = [
            [{
                    checkbox: true,
                    LAY_CHECKED: true
                }, {
                    title: '序号',
                    type: 'numbers',
                },
                {
                    field: 'zt',
                    title: '记录图',
                    width: '10%',
                    align: 'center',
                    templet: "#smallPicture"
                },

                {
                    field: '登记名称',
                    title: '登记名称',
                    width: '9%',
                    align: 'center'
                },
                {
                    field: '编号',
                    title: '编号',
                    width: '10%',
                    align: 'center'
                },
                {
                    field: '标题',
                    title: '图书名称',
                    width: '7%',
                    align: 'center'
                }, {
                    field: '副标题',
                    title: '副标题',
                    width: '10%',
                    align: 'center'
                },

                {
                    field: '作者',
                    title: '作者',
                    width: '6%',
                    align: 'center'
                },
                {
                    field: '译者',
                    title: '译者',
                    width: '6%',
                    align: 'center'
                },
                {
                    field: '出版社',
                    title: '出版社',
                    width: '7%',
                    align: 'center'
                },
                {
                    field: '价格',
                    title: '价格',
                    width: '7%',
                    align: 'center'
                }, {
                    field: 'borrowNumber',
                    title: '借阅数量',
                    width: '7%',
                    align: 'center',
                }, {
                    title: '操作',
                    width: '15.5%',
                    align: 'center',
                    templet: '#opeTpl'
                }

            ]
        ];
        tableins = table.render({
            elem: '#' + id,
            data: data,
            cols: cols,
            skin: 'row', //表格风格
            even: true,
            size: 'sm',
            toolbar: false,
            height: height_,
            loading: true,
            cellMinWidth: 30,
            page: true, //是否显示分页
            limits: [6, 20, 50, 100, 200, 500],
            limit: 6, //每页默认显示的数量
            id: "tableLayui",
            done: function(res, curr, count) {},
            error: function() {

            }
        });

    })

}

function lookPic(src) {
    // console.log(src)
    // let imgarr = src.split("|")
    // let imgstr = ""
    // for (let i = 0; i < imgarr.length; i++) {
    //     if (i == imgarr.length - 1) {
    //         imgstr += imgarr[i].split(",")[1]
    //     } else {
    //         imgstr += imgarr[i].split(",")[1] + ","
    //     }
    // }
    // console.log(imgstr)
    SysConfig.ToolBox.ShowVideo("查看文件", src)
}


function getPictureUrl(d) {

    var url = d ? d.split(',')[1] : ' '

    return url
}

function AddCallback() {
    layer.close(layer01)
    window.location.reload()
}