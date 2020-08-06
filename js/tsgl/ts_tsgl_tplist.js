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

var $, form, element, table, layer, tableins, where, rowid, xmlcid, laydate, laypage, container, loading;

layui.use(["jquery", "form", "layer", "table", "element", "laypage", "laydate"], function() {
    var $ = layui.$,
        layer = layui.layer,
        table = layui.table,
        element = layui.element,
        laypage = layui.laypage;
    form = layui.form;
    laydate = layui.laydate;
    getQueryList(); // 查询下拉
    container = $('.waterfull ul');
    loading = $('#imloading');
    loading.data("on", true); // 初始化loading状态
    initPBL()
    where = {
        XDLMCID: "1001",
        XDLMSID: "DYBH2019082312461146116721",
        // XDLMD:SysConfig.UserInfo.GetCookieName("mCurrentStorage"),
        // XDLMC:SysConfig.UserInfo.GetCookieName("mUserName"),
        page: 1,
        rows: 10
    }
    getTspic(where, laypage)
    $(window).resize(function() {
        tores();
    });

    $(window).scroll(function() {
        updateImgStyle()
    });
    /*item hover效果*/
    var rbgB = ['#71D3F5', '#F0C179', '#F28386', '#8BD38B'];
    $('#waterfull').on('mouseover', '.item', function() {
        var random = Math.floor(Math.random() * 4);
        $(this).stop(true).animate({
            'backgroundColor': rbgB[random]
        }, 1000);
    });
    $('#waterfull').on('mouseout', '.item', function() {
        $(this).stop(true).animate({
            'backgroundColor': '#fff'
        }, 1000);
    });
    //查询
    $("#searchData").click(function() {
        where.QueryType = $("#queryT").val();
        where.QueryKey = $("#queryK").val();
        getTspic(where, laypage)
    });

    // 刷新表格
    $("#updateTable").click(function() {
        getTspic({
            XDLMCID: "1001",
            XDLMSID: "DYBH2019082312461146116721",
            // XDLMD:SysConfig.UserInfo.GetCookieName("mCurrentStorage"),
            // XDLMC:SysConfig.UserInfo.GetCookieName("mUserName"),
            page: 1,
            rows: 10
        }, laypage)
    })
});

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
    form.render("select")
}
// 回调
function CallBack() {
    tableins.reload("mDataTable");
}

function getTspic(where, laypage) {
    let postPic = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", where);
    if (postPic.success && postPic.rows && postPic.rows.length > 0) {
        laypage.render({
            elem: 'test1',
            count: postPic.total, //数据总数，从服务端得到		
            layout: ['count', 'prev', 'page', 'next', 'refresh', 'skip'],
            limit: 10,
            hash: true,
            jump: function(obj, first) {
                //首次不执行
                if (first) {
                    getBookListHtml(postPic.rows)
                } else {
                    where.page = obj.curr
                    where.rows = obj.limit
                    let storeDatas = SysConfig.SubSystemData.SYTSGL.PostData("GetDataInterface", where);
                    if (storeDatas.success && storeDatas.rows && storeDatas.rows.length > 0) {
                        getBookListHtml(storeDatas.rows)
                    } else {
                        layer.msg("啊哦，没有数据")
                        $("#masonry").empty()
                    }
                }
            }
        });
    }
}


function getBookListHtml(returnValue) {
    $("#masonry").empty()
    var html = ""
    for (var i in returnValue) {
        html += `<li class="item">
            <div  class="a-img"  onclick="lookPic('${getPictureUrl(returnValue[i]["图片地址"])}')">
            <img style="" src="${getPictureUrl(returnValue[i]['图片地址'])}"></div>
            <div class="formation">
                <h5  class="li-title" >${returnValue[i]['标题'].split('.')[0]}</h5>
                 <button  class="detail-btn layui-btn layui-btn-primary layui-btn-sm" onclick="clickInformation('${returnValue[i]["id"]}')">
                    <span >详情</span>
                 </button>
            </div>
        </li>`
    }
    $("#masonry").append(html)
        /*模拟ajax请求数据时延时800毫秒*/
    var time = setTimeout(function() {
        $(html).find('img').each(function(index) {
            loadImage($(this).attr('src'));
        })
        var $newElems = $(html).css({
            opacity: 0
        })
        container.html($newElems);
        initPBL()
        $newElems.imagesLoaded(function() {
            $newElems.animate({
                opacity: 1
            }, 200);
            container.masonry('appended', $newElems, true);
            loading.data("on", true).fadeOut();
            clearTimeout(time);
        });
    }, 200)
    loadImage('images/one.jpg');
}
//调用文物详情信息页面
function clickInformation(obj) {
    //调用文物详情弹窗页
    SysConfig.ToolBox.openWindow("../../page/tsgl/ts_tsgl_details.html?rowid=" + obj, "详细信息", $(window).width(), $(window).height());
}

// 图片路径处理
function getPictureUrl(d) {
    var url = d ? d.split(',')[1] : ' '
    return url
}
// 图片路径处理
function lookPic(d) {
    SysConfig.ToolBox.ShowVideo("查看文件", d, 1200, 560)
}

function initPBL() {
    console.log(container.imagesLoaded)
    container.imagesLoaded(function() {
        container.masonry({
            columnWidth: 320,
            itemSelector: '.item',
            isFitWidth: true, //是否根据浏览器窗口大小自动适应默认false
            isAnimated: true, //是否采用jquery动画进行重拍版
            isRTL: false, //设置布局的排列方式，即：定位砖块时，是从左向右排列还是从右向左排列。默认值为false，即从左向右
            isResizable: true, //是否自动布局默认true
            animationOptions: {
                duration: 1800,
                easing: 'easeInOutBack', //如果你引用了jQeasing这里就可以添加对应的动态动画效果，如果没引用删除这行，默认是匀速变化
                queue: false //是否队列，从一点填充瀑布流
            }
        });
    });
    tores(); /*判断瀑布流最大布局宽度，最大为1280*/
}


function tores() {
    var tmpWid = $(window).width() - 10;
    if (tmpWid > 1280) {
        tmpWid = tmpWid - 10;
    } else {
        var column = Math.floor(tmpWid / 150);
        tmpWid = column * 150;
    }
    $('.waterfull').width(tmpWid);
}

function updateImgStyle() {
    if (!loading.data("on")) return;
    // 计算所有瀑布流块中距离顶部最大，进而在滚动条滚动时，来进行ajax请求，方法很多这里只列举最简单一种，最易理解一种
    var itemNum = $('#waterfull').find('.item').length;
    var itemArr = [];
    itemArr[0] = $('#waterfull').find('.item').eq(itemNum - 1).offset().top + $('#waterfull').find('.item').eq(itemNum - 1)[0].offsetHeight;
    itemArr[1] = $('#waterfull').find('.item').eq(itemNum - 2).offset().top + $('#waterfull').find('.item').eq(itemNum - 1)[0].offsetHeight;
    itemArr[2] = $('#waterfull').find('.item').eq(itemNum - 3).offset().top + $('#waterfull').find('.item').eq(itemNum - 1)[0].offsetHeight;
    var maxTop = Math.max.apply(null, itemArr);
    if (maxTop < $(window).height() + $(document).scrollTop()) {
        //加载更多数据
        loading.data("on", false).fadeIn(800);
        (function(sqlJson) {
            /*这里会根据后台返回的数据来判断是否你进行分页或者数据加载完毕这里假设大于30就不在加载数据*/
            if (itemNum > 100) {
                loading.text('就有这么多了！');
            } else {
                pageNum++;
                LoadImageList(pageNum, 20);
            }
        })(sqlJson);
    }
}

function loadImage(url) {
    var img = new Image();
    //创建一个Image对象，实现图片的预下载
    img.src = url;
    if (img.complete) {
        return img.src;
    }
    img.onload = function() {
        return img.src;
    };
};