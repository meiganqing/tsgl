var $, layer, where, qx, id, laydate, form, where;
var colorList = ['#3fb1e3', '#999999', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8', '#d87c7c'];
layui.use(["jquery", "form", "layer", "laydate"], function() {
    $ = layui.$,
        layer = layui.layer,
        laydate = layui.laydate
    form = layui.form,
        type = window.location.href.getQuery("type");
    // console.log(type, 1111111111111111)
    // qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("借书人员统计");
    where = {
            XDLMCID: "8000",
            XDLMTID: "8001",
            XDLMSID: "DYBH2020051316232206079989",
            XDTJLX: "count",
            XDTJMC: "creator",
            XDLMA: getPreMonth(SysConfig.ToolBox.CurrentDate()) + " 00:00:00" + "," + SysConfig.ToolBox.CurrentDate() + " 23:59:59",
            // XDLMF: SysConfig.UserInfo.GetCookieName("mCurrentStorage"),
            XDLME: "已提交"
        },

        getQueryList(); // 查询下拉
    // getYearDate(where)
    peopleData(where)


    form.on('select(queryT)', function(data) {
        if (data.value) {
            where.XDLMB = data.value
        } else {
            delete where.XDLMB
        }
        peopleData(where)
    })
    form.on('select(queryK)', function(data) {
            if (data.value) {
                where.XDLMC = data.value
            } else {
                delete where.XDLMC
            }
            peopleData(where)
        })
        //状态切换
    form.on("radio(statusRadio)", function(data) {
            var radioData = data.value
            where.XDLME = radioData
            peopleData(where)
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
            where.XDLMA = dateArray[0] + " 00:00:00" + "," + dateArray[1] + " 23:59:59",
                // console.log(where, 3334444)
                peopleData(where);

        }
    });
});


function peopleData(where) {
    if (type != '01') {
        where.XDLMSID = 'DYBH2020051316471808710265'
    }
    let postData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", where);
    if (postData.success == true) {
        console.log(postData, 111)
        allData = postData;
        var status = $('input:radio[name="status"]:checked').val();

        recombineData(status, allData)
    }
}


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
        XDLMA: "出版社"
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


// function getYearDate(where, id) { //获取日期下的统计图
// SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", where);
// allData = data;
// var status = $('input:radio[name="status"]:checked').val();
// recombineData(status, data)

// }


function recombineData(key, data) { //重新组合数据，传给echart
    var datax = [];
    var datay = [];
    var dataKey = "";
    var title
    if (type == "01") {
        dataKey = "dt_borrower";
        title = "借阅人员统计";
        datax = data.category
        datay = data.series[0].data
            // dataKey = "dt_borrower";
            // title = "借阅人员统计"
            // console.log( data[dataKey])
            // for(var i = 0; i < data[dataKey].length; i++) {
            // 	datax.push(data[dataKey][i]['申请人'])
            // 	datay.push(data[dataKey][i][key])
            // }
    } else if (type == "02") {
        dataKey = "dt_book";
        title = "借书次数统计";
        datax = data.category
        datay = data.series[0].data
            // for(var i = 0; i < data[dataKey].length; i++) {
            // 	datax.push(data[dataKey][i]['图书'])
            // 	datay.push(data[dataKey][i][key])
            // }
    }
    // if(datax.length * 60 > 500) {
    // 	$("#chart1").css({
    // 		"height": datax.length * 60 + "px"
    // 	})
    // }
    getChartOther(chart1, datax, datay, title)

    // if(datax.length > 0) {
    // 	$("#chart1").removeClass("layui-hide")
    // 	$(".nothing").addClass("layui-hide")
    // 	getChartOther(chart1, datax, datay, title)
    // } else {
    // 	$("#chart1").addClass("layui-hide")
    // 	$(".nothing").removeClass("layui-hide")
    // }
}

function getChartBar(id, data, xtype, ytype) {
    console.log('getChartBar')
    var myChart = echarts.init(document.getElementById(id));

    var seriesData = []
    var legendData = []
    for (var i = 0; i < data.length; i++) {
        seriesData.push({
            "value": data[i][ytype],
            "name": data[i][xtype]
        })
        legendData.push(data[i][xtype])
    }
    var option = {
        title: {
            text: id,

            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: legendData
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: seriesData,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]

    }
    myChart.setOption(option);
}

function getChartOther(myChart, datax, datay, titlex) {

    var chart1 = echarts.init(document.getElementById("chart1"))
    var option = {
        title: {
            text: titlex,
            subtext: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    type: ['line', 'bar']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        legend: {
            data: []
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: datax
        },
        series: [{
            name: '数量',
            type: 'bar',
            data: datay,
            itemStyle: {
                normal: {
                    barBorderRadius: 5,
                    color: function(params) {

                        var chartColor
                        var index = params.dataIndex
                        if (index <= colorList.length) {
                            chartColor = colorList[index]

                        } else {
                            var index_ = index % colorList.length
                            chartColor = colorList[index_]

                        }

                        return chartColor
                    }
                }
            },
        }]
    };
    chart1.setOption(option);
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