/*
 * @陕西唐远
 * @文件名: 
 * @作者: 张黎博
 * @Git: zlb
 * @Date: 2020-07-01 11:02:08
 * @描述: 
 * @版本: 1.00
 * @修改历史纪录: （版本 修改时间 修改人 修改内容）
 * @记录:  
 */
var $, form, qx, laypage, loading, layerPage01;
layui.use(["form", "laypage"], function() {
    form = layui.form;
    laypage = layui.laypage;
    loading = layer.load(); //换了种风格
    qx = SysConfig.SubSystemData.SYTSGL.GetUserAuthority("库房设置");


    var storeData = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH201908231246114611207161",
        page: 1,
        rows: 20
    });
    if (storeData.success && storeData.rows && storeData.rows.length > 0) {
        laypage.render({
            elem: 'demo0',
            count: storeData.total, //数据总数
            limit: 20,
            layout: ['count', 'prev', 'page', 'next'],
            jump: function(obj, first) {
                //首次不执行
                if (!first) {
                    loading = layer.load();
                    let storeDatas = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
                        XDLMCID: "1001",
                        XDLMSID: "DYBH201908231246114611207161",
                        page: obj.curr,
                        rows: obj.limit
                    });

                    if (storeDatas.success && storeDatas.rows && storeDatas.rows.length > 0) {
                        getTemplate(storeDatas.data, "storeContent")
                    } else {
                        $("#storeContent").empty()
                        layer.close(loading)
                    }
                } else {
                    getTemplate(storeData.rows, "storeContent")
                }

            }
        });
    }

    if (qx[0].Limit.isBJ) {
        $("#addStore").removeClass("layui-hide")
        $(".kfedit").removeClass("layui-hide")
    }
    if (qx[0].Limit.isSC) {
        $(".kfdel").removeClass("layui-hide")
    }
    //添加库房
    $("#addStore").click(function() {
        $("#库房名").prop("readonly", false)
        $('#addsubmit').html("添加库房")
            // $("#XDLMID").prop("disabled", true)
        document.getElementById("XMForm").reset();
        let storexh = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
            XDLMCID: "1001",
            XDLMSID: "DYBH201908231246114611207161",
            page: 1,
            rows: 1
        });
        if (storexh.success) {
            $("#序号").val(Number(storexh.total) + 1)
        } else {
            $("#序号").val(Number(storeData.total) + 1)
        }

        layerPage01 = layer.open({
            type: 1,
            area: ['600px', '310px'],
            fix: false, //不固定
            maxmin: true,
            title: "添加库房",
            scrollbar: true,
            content: $("#XMForm"),
            resize: true,
            closeBtn: 1
        });
    })
    $("#库房名").change(function() {
        let storec = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
            XDLMCID: "1001",
            XDLMSID: "DYBH201908231246114611207161",
            XDLMB: $("#库房名").val()
        });
        if (storec.success && storec.rows && storec.rows.length > 0) {
            layer.msg("库房名已存在，请重新输入！")
            $("#库房名").val("")
        }
    })

    $("#addsubmit").click(function() {
        if ($("#库房名").val() == "") {
            layer.msg("请输入库房名！")
            return
        }
        if ($("#过道位置").val() == "") {
            layer.msg("请输入过道位置！")
            return
        }
        if ($("#每行柜架数").val() == "") {
            layer.msg("请输入每行柜架数！")
            return
        }

        if ($('#addsubmit').html() == "添加库房") {
            SysConfig.SubSystemData.SYTSGL.AddNewData('#XMForm', 'GetDataInterface', "&XDLMCID=5000&XDLMSID=DYBH201908231246114611188163", function(msg) {
                let kfqxadd = SysConfig.SubSystemData.SYYHGL.PostData("GetDataInterface", {
                    XDLMCID: '5000',
                    XDLMitemNum: SysConfig.ToolBox.getTimeAndRandom(),
                    XDLMSID: 'DYBH20190823102601261157143',
                    XDLMxmbh: "tsxt",
                    XDLMitemlm: "库房",
                    XDLMitemname: $("#库房名").val()
                });
                if (kfqxadd.success) {
                    AddCallback(msg)
                }
            })
        } else {
            SysConfig.SubSystemData.SYTSGL.AddNewData('#XMForm', 'GetDataInterface', "&XDLMCID=6000&XDLMSID=DYBH201908231246114611208165&XDLMID=" + $("#XDLMID").val(), AddCallback)
        }
    })
});

// 删除库房
function kfdel(name, id) {
    let kfdata = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH202005121454460903376",
        XDLMA: name
    });
    if (kfdata.success && kfdata.rows) {
        if (kfdata.rows.length > 0) {
            layer.msg("库内存在数据，请先删除库内数据")
        } else {
            SysConfig.SubSystemData.SYTSGL.PLSC([{ id: id }], '4000', 'DYBH20190823124611461185164', Callback);
        }
    }
}

// 修改库房
function kfedit(id) {
    $("#库房名").prop("readonly", true)
    $('#addsubmit').html("修改库房")
    let kfrowiddata = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", {
        XDLMCID: "1001",
        XDLMSID: "DYBH20190823124611461165162",
        XDLMA: id
    });
    if (kfrowiddata.success && kfrowiddata.rows && kfrowiddata.rows.length > 0) {
        for (let k in kfrowiddata.rows[0]) {
            $("#" + k).val(kfrowiddata.rows[0][k])
            $("#XDLMID").val(kfrowiddata.rows[0].id)
        }
        layerPage01 = layer.open({
            type: 1,
            area: ['600px', '310px'],
            fix: false, //不固定
            maxmin: true,
            title: "添加库房",
            scrollbar: true,
            content: $("#XMForm"),
            resize: true,
            closeBtn: 1
        });
    } else {
        layer.msg("未找到对应库房数据！")
    }
}

function getTemplate(data, id) {
    $("#" + id).empty()
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += `<li class="layui-col-xs3" style="position:relative;">
                    <span class="kfdel layui-hide" onclick="kfdel('${data[i]['库房名']}','${data[i]['id']}')">×</span>
                    <button class="layui-btn layui-btn-xs layui-btn-primary kfedit layui-hide"  onclick="kfedit('${data[i]['id']}')" >修改</button>
                    <a href="./ts_kfgl_kfsz_gj.html?store=${escape(data[i]['库房名'])}&px=${data[i]['序号']}&rowid=${data[i]['id']}">
                        <div class="module">
                            <i class=" store-icon"></i>
                            <div class="module-right">
                                <p class="store-name">${data[i]['库房名']}</p>
                                <p class="type-name">【${data[i]['分类']}】</p>
                            </div>
                        </div>
                    </a>
                </li>`
    }
    $("#" + id).append(html)
    layer.close(loading)
}

function AddCallback(msg) {
    if (msg) {
        layer.msg(msg);
    }
    window.location.reload()
}

function Callback() {
    window.location.reload()
}