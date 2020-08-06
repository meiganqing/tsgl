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
var $, table, layer, form, tableins, where, qx, colList, id;
var IndexPagecolorList = [
    '#52B1F3', '#AFD548', '#FFB55C', '#46BFBD', '#8BA3E9',
    '#BDD98B', '#FF935C', '#58C1DF', '#FFD578', '#A1B395',
];
tiaoxingtucolorList = ["#d7c39b", "#c1d79b", "#9acce5"];
layui.use(["jquery", "form", "layer", "table"], function() {
    $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        table = layui.table;

    var returnndjf = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: '9000',
        XDLMSID: '9208012',
        XDLMTID: "9208",

    });

    getNR("已提交", "waitApprove");
    getNR("借阅延期", "delayBook")

    getIndexTop()

    var returnndjf = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: '1001',
        XDLMSID: 'DYBH2020051211141501728545',
        XDLMA: "图书登记表",
        XDLMC: "类型"
    });
    if (returnndjf.success) {

        let legenddata = [];
        let seriesdata = [];
        for (let i = 0; i < returnndjf.rows.length; i++) {

            legenddata.push(returnndjf.rows[i]['统计内容'])
            seriesdata.push(returnndjf.rows[i]['统计值'])
            getChart("chart2", legenddata, seriesdata, 0)
        }

    }

    var returnndjf = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: '1001',
        XDLMSID: 'DYBH2020051211141501728545',
        XDLMA: "图书登记表",
        XDLMC: "出版社"
    });
    if (returnndjf.success) {
        let legenddata = [];
        let seriesdata = [];
        if (returnndjf.rows.length > 0) {
            for (let i = 0; i < returnndjf.rows.length; i++) {
                legenddata.push(returnndjf.rows[i]['统计内容'])
                seriesdata.push(returnndjf.rows[i]['统计值'])
                getChart("chart1", legenddata, seriesdata, 0)
            }
        } else {
            $('#' + id).append('<div class="nothing " style="line-height: 334px;text-align: center;"><img src="./images/nothing.png" alt="" /></div>')
        }

    }


})

function getNR(name, id) {

    var reurnData1 = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611232241",
        XDLME: name
    });
    if (reurnData1.success) {
        var html = '<ul class="xul">';
        if (reurnData1.rows && reurnData1.rows.length > 6) {

            for (var j = 0; j < 6; j++) {
                html += `<li class="layui-elip" onclick=detailApprove("${ reurnData1.rows[j].onlynum}")><i style="background-color:${IndexPagecolorList[j] }">${ (j * 1 + 1) }</i>
                        <span style="font-size:14px;">${reurnData1.rows[j].图书 }</span>
                        <span style="font-size:12px;">${reurnData1.rows[j].creator}</span>
                        <span>${reurnData1.rows[j].申请时间}</span></li>`
            }
            html += '</ul>'
            $('#' + id).append(html);

        } else if (reurnData1.rows && reurnData1.rows.length <= 6) {

            for (var j = 0; j < reurnData1.rows.length; j++) {
                html += `<li class="layui-elip" onclick=detailApprove("${ reurnData1.rows[j].onlynum}")><i style="background-color:${IndexPagecolorList[j] }">${ (j * 1 + 1) }</i>
                        <span style="font-size:14px;">${reurnData1.rows[j].图书 }</span>
                        <span style="font-size:12px;">${reurnData1.rows[j].creator}</span>
                        <span>${reurnData1.rows[j].申请时间}</span></li>`
            }
            html += '</ul>'
            $('#' + id).append(html);

        } else {
            $('#' + id).append('<div class="nothing " style="line-height: 334px;text-align: center;"><img src="./images/nothing.png" alt="" /></div>')
        }
    }
}

function detailApprove(bh) {
    SysConfig.ToolBox.openWindow('/SYTSGL/page/tssq/ts_tssq_jyjl_jd.html?bh=' + bh, "流程详情", 500, $(window).height() - 100);
}

//页面头部模块
function getIndexTop() {

    var reurnData2 = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "8000",
        XDLMSID: "DYBH2020051315022709802207",
        XDLMTID: "8001",
        XDTJLX: 'sum',
        XDTJMC: "数量",
    });
    if (reurnData2.success) {
        $("#sumNumlib").html(Number(reurnData2.series[0].data[3]) + Number(reurnData2.series[0].data[2]))
            // case "借阅延期":
        $("#inStorkeNumlib").html(reurnData2.series[0].data[2])
            // case "审批拒绝":
        $("#outsideNumlib").html(reurnData2.series[0].data[4])
            // case "已提交":
        $("#insideNumlib").html(reurnData2.series[0].data[6])
    }
}


// 条形图
function getChart(id, datas, sss, ColorIndex, nameid, xtype, ytype) {

    var myChart = echarts.init(document.getElementById(id)); //, "macarons"
    var optionBar = {

        title: {
            text: nameid,
            textStyle: {
                fontWeight: 'normal',
                fontSize: '16',
                Color: '#333333',
                fontFamily: 'Microsoft YaHei'
            },
            padding: [3, 0, 0, 0]
        },
        grid: {
            left: '0%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {},
        legend: {
            data: ['']
        },
        // 是否显示工具栏
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
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#877766',
                    width: '1'
                }

            },
            axisTick: {
                show: false //x轴坐标点消失
            },
            data: datas,
            axisLabel: {
                textStyle: { //改变刻度字体样式
                    fontSize: '12',
                    color: '#666666'
                }
            },


        },
        yAxis: {
            axisLine: {
                show: false //y轴线消失
            },
            axisTick: {
                show: false //y轴坐标点消失
            },
            axisLabel: {
                textStyle: { //改变刻度字体样式
                    fontSize: '12',
                    color: '#666666'
                }
            },
            splitLine: { //网格线
                lineStyle: {
                    type: 'dotted', //设置网格线类型 dotted：虚线   solid:实线
                    color: '#dcdcdc',
                    width: '1'
                }

            }
        },
        series: [{
            name: '',
            type: 'bar',
            data: sss,
            barWidth: '66%',
            itemStyle: {
                normal: {
                    label: {
                        show: true, //开启显示
                        position: 'top', //在上方显示
                        textStyle: { //数值样式
                            color: 'black',
                            fontSize: '12'
                        }
                    },
                    barBorderRadius: 0,
                    // color: function(params) {

                    //     var chartColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

                    //     return chartColor
                    // }
                    color: function(params) {
                        let chartColor = tiaoxingtucolorList[ColorIndex]
                            // console.log(tiaoxingtucolorList[ColorIndex])
                        return chartColor
                    }
                }
            },
            label: {
                symbol: 'pin',
                normal: {
                    // formatter: '{b} {c}',
                    show: true,
                    position: 'top'
                }
            }
        }]

    }

    myChart.setOption(optionBar);
    $(window).resize(function() {
        myChart.resize();
    });
    let mysubOptionxAxis_Data = myChart.getOption().xAxis['0'].data;
    // console.log(mysubOptionxAxis_Data)
    if (mysubOptionxAxis_Data.length >= 9) {
        myChart.setOption({
            xAxis: {
                type: 'category',
                data: datas,
                // axisLabel: {
                //     interval: 0,
                //     rotate: "30",
                // },
                axisLabel: {
                    clickable: true, //并给图表添加单击事件  根据返回值判断点击的是哪里
                    interval: 0,
                    formatter: function(params, index) {
                        if (datas.length > 7) {
                            if (index % 2 != 0) {
                                return '\n\n' + params;
                            } else {
                                return params;
                            }
                        } else {
                            return params;
                        }
                    }
                }
            }
        });

    }
}