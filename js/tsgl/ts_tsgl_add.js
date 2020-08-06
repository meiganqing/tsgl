var $, form, element, table, layer, tableins, UploadTable, Uploadcols, UploadTableData, where, qx, laydate, upload, element;
var cols;
layui.use(["jquery", "form", "layer", "table", "laydate", "upload", "element"], function() {
    ($ = layui.$),
    (layer = layui.layer),
    (table = layui.table),
    (form = layui.form);
    laydate = layui.laydate;
    upload = layui.upload;
    element = layui.element;
    UploadTable = layui.table;
    rowid = window.location.href.getQuery("rowid");
    UploadTableData = [];
    //执行一个laydate实例
    laydate.render({
        elem: '#出版时间' //指定元素
            ,
        value: new Date()
    });

    laydate.render({
        elem: '#印刷时间' //指定元素
            ,
        value: new Date()
    });

    $("#库房名").val(SysConfig.UserInfo.GetCookieName('mCurrentStorage'))
    $("#录入人").val(SysConfig.UserInfo.GetUserName())
    getCBSList() //出版社

    getBook() //图书类型

    getKFList() //柜架号
        //下拉选择层号
    form.on('select(柜架号)', function(data) {
            getCHList(data.value)
            form.render()
        })
        //下拉选择分区
    form.on('select(层号)', function(data) {
        getFQList($("#层号 option:selected").attr("dads"), data.value)
        form.render()
    })

    //附件表头
    cols = [
        [{
                title: '序号',
                type: "numbers"
            },
            {
                field: 'id',
                title: 'id',
                hide: true
            } //必须
            , {
                title: '缩略图',
                templet: function(d) {
                    var html = ""
                    return html += '<img style="width: 65px;height:65px;cursor: pointer; " src="' + d.文件路径 + '" onclick=SysConfig.ToolBox.ShowVideo("查看文件","' + getPictureUrl(d.文件路径) + '","1200","560") />'
                }
            }, {
                field: '文件名称',
                title: '文件名'
            } //必须  可以根据不同表更改字段名，对应下方的json 也要改
            , {
                field: '',
                title: '操作',
                // width: "15%",
                align: 'center',
                templet: function(d) {
                    let tt = "";
                    tt += '<a class="layui-btn layui-btn-xs layui-btn-green1" onclick=show("' + d.文件路径 + '")>查看</a>';
                    tt += ' <a class="layui-btn layui-btn-danger layui-btn-xs" onclick=del("' + d.onlynum + '")>删除</a>';
                    return tt;
                }
            },
        ]
    ]

    if (rowid != null) {
        $('#saveHZ').html('图书修改');
        UploadTableData = echoData(UploadTable, cols);
    } else {
        $('#saveHZ').html('图书添加');

        let knbh = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
            XDLMCID: "9000",
            XDLMTID: "9208",
            XDLMSID: "9208010"
        });
        if (knbh.success) {
            $('#文物库内编号').val(knbh.data);
        }
        upload_table(UploadTable, cols, UploadTableData)
    }

    // 添加修改
    $('#saveHZ').click(function(e) {
        let imglist = "";
        if (UploadTableData.length > 0) {
            for (let i = 0; i < UploadTableData.length; i++) {
                if (i == UploadTableData.length - 1) {
                    imglist += UploadTableData[i].onlynum + "," + UploadTableData[i].文件路径 + "," + UploadTableData[i].文件名称 + ",图书"
                } else {
                    imglist += UploadTableData[i].onlynum + "," + UploadTableData[i].文件路径 + "," + UploadTableData[i].文件名称 + ",图书|"
                }
            }
        }
        if ($("#uploadfile").text()) {
            if (rowid) {
                imglist += `|${$("#uploadfile").attr("onlynum")},${$("#uploadfile").attr("filepatch")},${$("#uploadfile").text()},图书电子书`
            } else {
                imglist += `|${SysConfig.ToolBox.getTimeAndRandom()},${$("#uploadfile").attr("filepatch")},${$("#uploadfile").text()},图书电子书`
            }

        }

        console.log(imglist)
            // e.preventDefault();
        if ($('#name').val() == '') {
            layer.msg("请输入单位名称");
        } else {
            if (rowid != null) { //修改
                SysConfig.SubSystemData.SYTSGL.EditData('#XMForm', 'GetDataInterface', '&XDLMCID=6000&XDLMSID=DYBH2019082312461146118925&XDLMID=' + rowid + '&XDLM图片地址=' + imglist, XMedit);
            } else { //添加
                SysConfig.SubSystemData.SYTSGL.AddNewData('#XMForm', 'GetDataInterface', '&XDLMCID=9000&XDLMTID=9208&XDLMSID=9208009&XDLMKFLX=图书&XDLM图片地址=' + imglist, XMedit);
            }
        }
        return false
    });

    $('#qxHZ').click(function() {
        var index543 = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index543);
    });


    $('#checkPosition').click(function() {
        SysConfig.ToolBox.openWindow('/SYTSGL/Page/kfgl/ts_kfgl_krck.html?type=operate', "库房查看", $(window).width() - 50, $(window).height() - 50);
    });

    $("#库存数量").change(function() {
            $("#图书总数").val($("#库存数量").val())
        })
        // 附件上传
    SysConfig.SubSystemData.SYTSGL.UploadFile("#mulbtn", upload, element, chooseCallback, doneCallback, allDoneCallback, errCallback);

    uploadExcel(upload)
    $("#uploadfile").click(function() {
        if ($("#uploadfile").attr("filepatch")) {
            show($("#uploadfile").attr("filepatch"))
        }
    })

})

//电子书上传
function uploadExcel(upload) {
    upload.render({
        elem: '#uploadpl' //绑定元素
            ,
        url: "/xddata/xdFileAllSysUpload.ashx?XKLX=SYTSGL" //上传接口
            ,
        accept: 'file',
        // acceptMime: "file|xls,file|xlsx",
        // exts: "xls|xlsx",
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

//查看
function show(rowid) {
    //使用上传表格方式时需配置
    SysConfig.ToolBox.ShowVideo("查看文件", getPictureUrl(rowid), "1200", "560")
}

function del(faths) {
    for (var i in UploadTableData) {
        if (UploadTableData[i].onlynum == faths) {

            layer.confirm('确定要删除吗？', {
                btn: ['确定', '再想想'] //按钮
            }, function() {
                layer.msg('正在删除,请稍等...', {
                    time: 0,
                    shade: 0.3,

                    //content: '测试回调',
                    success: function(index, layero) {

                        UploadTableData.splice(i, 1);

                        layer.msg('删除完成', {
                            icon: 1,
                            time: 1000
                        });
                        upload_Callback()
                    }
                })
            }, function(index) {
                layer.close(index);
            });
            break;
        }
    }
}

// //上传预加载，可自定义
function chooseCallback(obj) {
    //使用上传表格方式时需配置
    obj.preview(function(index, file, result) {
        UploadTableData.push({ id: index, 文件名称: file.name, 状态: "等待上传", onlynum: SysConfig.ToolBox.getTimeAndRandom() });
        upload_Callback();
    });;
}

//所有上传完成，多文件上传返回
function allDoneCallback(obj) {
    upload_table(UploadTable, cols, UploadTableData)
}


//单个文件上传放回
function doneCallback(res, index, upload) {
    // if ($('#saveHZ').html() == "入库文物保存") {
    console.log(index)
        //【重要】使用table显示调用这个
    for (var i in UploadTableData) {
        if (UploadTableData[i].id == index) {
            UploadTableData[i].文件路径 = res.filepath;
            UploadTableData[i].文件名称 = res.filename;

        }
        // }
        console.log(UploadTableData)
    }
}


function errCallback(index, upload) {
    //获取上传错误列表使用table显示调用这个
    for (var i in UploadTableData) {
        if (UploadTableData[i].id == index) {
            UploadTableData[i].状态 = "上传失败";
        }
    }
}


// 单个显示上传时删除回调
function fileDelCallback(returnFileid) {
    //如果是调用数据库显示，这里处理删除表数据行
    layer.msg(returnFileid);
}

function upload_table(UploadTable, cols, UploadTableDatas) {
    // let datas;
    // if ($('#saveHZ').html() == "入库文物保存") {
    // datas = UploadTableDatas
    // } else {
    //     let UploadData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
    //         XDLMCID: '1001',
    //         XDLMSID: 'DYBH2020010814574704382701',
    //         XDLMpid: $("#库内编号").val(),
    //     });
    //     if (UploadData.success && UploadData.rows && UploadData.rows.length > 0) {
    //         datas = UploadData.rows
    //     } else {
    //         datas = []
    //     }
    // }
    UploadTable.render({
        elem: "#grid_table",
        cols: cols,
        data: UploadTableDatas,
        skin: 'row', //表格风格
        even: true,
        size: 'sm',
        defaultToolbar: [],
        loading: true,
        cellMinWidth: 30,
        id: "mDataTable",
        limit: 20
    });
    // return UploadTableData = datas
}

function upload_Callback() {
    UploadTable.reload("mDataTable", {
        data: UploadTableData
    });
}

function XMedit() {
    var index543 = parent.layer.getFrameIndex(window.name); //获取窗口索引
    parent.layer.close(index543);
    parent.updateDataTable();
}


// 修改页面数据回显
function echoData(UploadTable, cols) {
    let UploadTableechoData = []
    var data = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: '1001',
        XDLMSID: 'DYBH20190823124611461124322',
        XDLMA: rowid
    });
    if (data.success) {
        for (var i in data.rows[0]) {
            $('#' + i).val(data.rows[0][i]);
        }
        $("#出版时间").val(data.rows[0].出版时间.slice(0, 9).replace(/\//g, "-"))
        $("#印刷时间").val(data.rows[0].印刷时间.slice(0, 9).replace(/\//g, "-"))
    }
    if (data.rows[0].图片地址 != "") {
        let files = data.rows[0].图片地址.split('|');
        if (files[files.length - 1].split(",")[3] == "图书电子书") {
            for (let i = 0; i < files.length - 1; i++) {
                UploadTableechoData.push({
                    onlynum: files[i].split(",")[0],
                    文件路径: files[i].split(",")[1],
                    文件名称: files[i].split(",")[2]
                })
            }
            $("#uploadfile").text(files[files.length - 1].split(",")[2])
            $("#uploadfile").attr("filepatch", files[files.length - 1].split(",")[1])
            $("#uploadfile").attr("onlynum", files[files.length - 1].split(",")[0])
        } else {
            for (let i = 0; i < files.length; i++) {
                UploadTableechoData.push({
                    onlynum: files[i].split(",")[0],
                    文件路径: files[i].split(",")[1],
                    文件名称: files[i].split(",")[2]
                })
            }
        }

        upload_table(UploadTable, cols, UploadTableechoData)
    }
    form.render();
    return UploadTableechoData
}





// 出版社获取
function getCBSList() {
    $("#出版社").empty();
    var returnCbs = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611191311",
        XDLMA: "出版社"
    });
    if (returnCbs.success) {
        for (var i in returnCbs.rows) {
            $("#出版社").append(`<option value="${returnCbs.rows[i].统计内容}">${returnCbs.rows[i].统计内容}</option>`);
        }
    }
    form.render()
}

// 图书类型获取
function getBook() {
    $("#类型").empty();
    var returnCbs = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611191311",
        XDLMA: "类型"
    });
    if (returnCbs.success) {
        for (var i in returnCbs.rows) {
            $("#类型").append(`<option value="${returnCbs.rows[i].统计内容}">${returnCbs.rows[i].统计内容}</option>`);
        }
    }
    form.render()
}

// 柜架获取
function getKFList() {
    $("#柜架号").empty();
    var returnCbs = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611204191",
        XDLMA: SysConfig.UserInfo.GetCookieName('mCurrentStorage')
    });
    if (returnCbs.success) {
        for (var i in returnCbs.rows) {
            $("#柜架号").append(`<option value="${returnCbs.rows[i].柜架号}">${returnCbs.rows[i].柜架号}</option>`);
        }
        getCHList(returnCbs.rows[0].柜架号)
    }
    form.render()
}
// 层号获取
function getCHList(guijia) {
    $("#层号").empty();
    var returnCbs = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH20190823124611461181171",
        XDLMA: SysConfig.UserInfo.GetCookieName('mCurrentStorage'),
        XDLMB: guijia
    });
    if (returnCbs.success) {
        for (var i in returnCbs.rows) {
            $("#层号").append(`<option value="${returnCbs.rows[i].层号}" dads="${returnCbs.rows[i].柜架号}">${returnCbs.rows[i].层号}</option>`);
        }
        getFQList(returnCbs.rows[0].柜架号, returnCbs.rows[0].层号)
    }
    form.render()
}
// 分区获取
function getFQList(guijia, cenghao) {
    $("#分区号").empty();
    var returnCbs = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611194181",
        XDLMA: SysConfig.UserInfo.GetCookieName('mCurrentStorage'),
        XDLMB: guijia,
        XDLMC: cenghao
    });
    if (returnCbs.success) {
        for (var i in returnCbs.rows) {
            $("#分区号").append(`<option value="${returnCbs.rows[i].分区号}">${returnCbs.rows[i].分区号}</option>`);
        }
    }
    form.render()
}





function getPictureUrl(d) {
    var url = d ? d.split(',')[0] : ' '
    return url
}


//     function   uploadFiles_single(elemID, inputID, ulID, ){
//       return upload.render({
//         elem: elemID, //绑定元素
//         accept: 'file',
//         auto: true,
//         multiple: false,   //false 单张，true 多张
//         number: 10,
//         size: 60000000,  //限制文件大小，单位 KB
//         url: '/xdData/xdFileAllSysUpload.ashx?XKLX=SYTSGL', //上传接口
//         before: function (obj) {
//             loading = layer.open({
//                 type: 1,
//                 title: '正在上传，请稍后....',
//                 closeBtn: 0,
//                 area: ['500px', '100px'],
//                 content: '<p><span id="aa"><span></p ><div class= "layui-progress" lay-showPercent="yes" lay-filter="demo" style="margin-top: 5%;"> <div class="layui-progress-bar layui-bg-red" lay-percent="10%"></div></div >'
//                 //< div class= "layui-progress layui-progress-big" lay- showPercent="yes" lay - filter="demo" > <div class="layui-progress-bar layui-bg-green" lay-percent="1%" ></div> </div > ' //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
//             });
//         },
//         progress: function (n, elem) {
//             var percent = n + '%';//获取进度百分比
//             element.progress('demo', percent); //可配合 layui 进度条元素使用
//         },
//         done: function (res) {
//           layer.close(loading);
//           if(inputID == "#照片"){
//             $('#照片名称').val(res.filename);
//           }
//           $(inputID).val(res.filepath + "," + res.filename);  //文件地址存地址和文件名，存名字用于回显
//             EchoImg(ulID, res.filepath, res.filename, inputID);
//         },
//         error: function () {
//             //请求异常回调
//             layer.close(loading)
//         }
//     });
//     }

//     function  DeletePhoto(ulID, inputID){
//       layer.msg('删除成功！', {
//         title: '提示框',
//         icon: 1,
//         time: 800
//       }, function (alertindex) {
//         setTimeout(function () {
//           $(ulID).empty();
//           $(inputID).val("");
//         }, 200);
//       });

//     }

//     function DownLoad(fileName, cnfileName) {
//       if (fileName == '') {
//         layer.msg('该文件不存在！', {
//           time: 500,
//           icon: 1
//         });
//       } else {
//         window.location = "/xdData/DownLoadFile2.ashx?FileName=" + fileName + "&FilePath=" + fileName + "&cnFileName=" + cnfileName; //执行下载操作
//       }
//     }






//    function EchoImg(ulID, mpath, mname, inputID){
//     $(ulID).empty();
//     let html = `<li class="picture-moudle1 layui-col-xs12 layui-col-sm12 layui-col-md3 layui-col-lg3">
//                   <i class="delete" onclick="DeletePhoto('${ulID}', '${inputID}')"></i>
//                   <div>
//                     <div class="picture-moudle-img">`;

//     let wjname = mname;
//     if(wjname.indexOf('.jpg') != -1 || wjname.indexOf('.JPG') != -1 || wjname.indexOf('.jpeg') != -1 || wjname.indexOf('.JPEG') != -1 || wjname.indexOf('.png') != -1 || wjname.indexOf('.PNG') != -1){
//       html += '<img onclick=ShowImg("' + mpath + '") src="' + mpath.replace('_sss', '_s') + '" alt="" />';
//     }else if(wjname.indexOf('.pdf') != -1 || wjname.indexOf('.PDF') != -1){
//       html += '<img onclick=ShowImg("' + mpath + '") src="../../images/pdf.jpg" alt="" />';
//     }else if(wjname.indexOf('.xls') != -1 || wjname.indexOf('.xlsx') != -1 || wjname.indexOf('.XLS') != -1 || wjname.indexOf('.XLSX') != -1){
//       html += '<img onclick=ShowImg("' + mpath + '") src="../../images/xls.jpg" alt="" />';
//     }else if(wjname.indexOf('.doc') != -1 || wjname.indexOf('.docx') != -1 || wjname.indexOf('.DOC') != -1 || wjname.indexOf('.DOCX') != -1){
//       html += '<img onclick=ShowImg("' + mpath + '") src="../../images/word.jpg" alt="" />';
//     }else if(wjname.indexOf('.ppt') != -1 || wjname.indexOf('.pptx') != -1 || wjname.indexOf('.PPT') != -1 || wjname.indexOf('.PPTX') != -1){
//       html += '<img onclick=ShowImg("' + mpath + '") src="../../images/pdf.jpg" alt="" />';
//     }else if(wjname.indexOf('.zip') != -1 || wjname.indexOf('.ZIP') != -1 || wjname.indexOf('.rar') != -1 || wjname.indexOf('.RAR') != -1){
//       html += '<img onclick=this.ShowImg("' + mpath + '") src="../../images/ysb.jpg" alt="" />';
//     }else{
//       html += '<img onclick=ShowImg("' + mpath + '") src="../../image/add_picture.png" alt="" />';
//     }               

//     html += `</div>
//                 <div class="picture-moudle1-text">
//                     <p class="imgName" title="点击下载文件">
//                         <a href="javascript:;" onclick="DownLoad('${mpath}', '${mname}')">
//                             <span style="color:red;"></span>${mname}
//                         </a>
//                     </p>
//                 </div>
//               </div>
//             </li>`

//     $(ulID).append(html);
//   }