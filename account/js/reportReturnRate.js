//@ sourceURL=reportReturnRate.js
// $('#lxy_basicdata_tb').DataTable().empty();
//标题行

$(document).ready(function(){
    // resize2(190);
    resizeL();
});
$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();
    initSelect2FromRedisProfitAnalysis("reportReturnRateSearchForm","salesmanDepartmentsCopy","organization/listAllOrganizationName.do","{}","salesmanDepartmentsCopy","cnName");
    $("#reportReturnRateSearchForm select[name=salesmanDepartmentsCopy]").select2({
        closeOnSelect: false
    });
    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };


});


var reportReturnRate = (function() {

    var reportReturnRate_table;
    Init();
    function Init() {
        // tableHeight = $("#reportReturnRateTable").height();
        reportReturnRate_table = $("#reportReturnRateTable").DataTable({
            //fnRowCallback: rightClick,//利用行回调函数，来实现右键事件
            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            // 动态分页加载数据方式
            bProcessing: true,
            // bServerSide: true,
            aLengthMenu: [10, 20, 40, 60], // 动态指定分页后每页显示的记录数。
            searching: false,// 禁用搜索
            lengthChange: true, // 是否启用改变每页显示多少条数据的控件
            /*
             * sort : "position",
             * //是否开启列排序，对单独列的设置在每一列的bSor选项中指定
             */
            stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
            deferRender: true,// 延迟渲染
            // bStateSave: false, // 在第三页刷新页面，会自动到第一页
            iDisplayLength: 20, // 默认每页显示多少条记录
            iDisplayStart: 0,
            ordering: false,// 全局禁用排序
            autoWidth: true,
            scrollX: true,
            serverSide: true,
            scrollY:calcDataTableHeight(),
            colReorder: true,//列位置的拖动,
            dom:'<"top">rt<"bottom"flip><"clear">',
            // destroy:true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
            // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
//			 ajax: "../mock_data/user.txt",

            ajax: {
                "type": "POST",
                "url": getContextPath() + 'accountBusinessTotal/listByPageForReturnRate.do',
                "data": function (d) {
                    search_data = $('#reportReturnRateSearchForm').serializeObject();
                    if(search_data.salesmanDepartmentsCopy!=null&&search_data.salesmanDepartmentsCopy.length>0){
                        search_data.salesmanDepartmentsCopy= search_data.salesmanDepartmentsCopy.toString();
                    }
                    var k={};
                    for(var key in search_data){
                        if(search_data[key]==""||search_data[key]==null){
                        }
                        else{
                            k[key]=search_data[key];
                        }
                    }
                    k=JSON.stringify(k);
                    d.keys=k;
                },
                "dataSrc": function ( data ) {
                    //在该方法中可以对服务器端返回的数据进行处理。
                    for(var i=0;i<data.aaData.length;i++){
                        if(data.aaData[i].beginEnableTime != '' || data.aaData[i].beginEnableTime == undefined){
                            data.aaData[i].beginEnableTime = $.date.format(new Date(data.aaData[i].beginEnableTime),"yyyy-MM-dd");
                        }
                        if(data.aaData[i].endEnableTime != '' || data.aaData[i].endEnableTime == undefined){
                            data.aaData[i].endEnableTime = $.date.format(new Date(data.aaData[i].endEnableTime),"yyyy-MM-dd");
                        }
                    }

                    return data.aaData;
                },
                error: function (xhr, error, thrown) {
                    console.log(xhr.responseText);
                    callAlert("获取数据失败，可通过console查看原因！");
                }

            },

            language: {
                "url": "js/Chinese.json",
                select: {
                    rows: ""
                 },
                buttons: {
                    copyTitle: '复制到剪切板',
                    // copyKeys: 'Appuyez sur <i>ctrl</i> ou <i>\u2318</i> + <i>C</i> pour copier les données du tableau à votre presse-papiers. <br><br>Pour annuler, cliquez sur ce message ou appuyez sur Echap.',
                    copySuccess: {
                        _: '将%d 行复制到剪切板',
                        1: '将1行复制到剪切板'
                    }
                }
            },
            columns: [
                {
                    "sClass": "text-center",
                    "data": "container_type_id",
                    "title": "<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                    },
                    "bSortable": false

                },
                {title: "公司名称", data: "salesmanCompany"},
                {title: "销售部门", data: "salesmanDepartment"},
                {title: "周期（天）", data: "cycDate"},
                {title: "年份", data: "cycYear"},
                {title: "月份", data: "cycMonth"},
                {title: "应收金额", data: "receivableSumP"},
                {title: "实收金额", data: "receivableSumRealP"},
                {
                    title: "回报率",
                    data: "returnRate",
                    "render": function (data, type, full, meta) {
                        return Number(data).toFixed(2)+'%';
                    }
                }

            ],
            columnDefs: [
                {
                    orderable: false,
                    targets: 0
                },
                {
                    "render": function (data, type, full, meta) {
                        if ($.string.isNullOrEmpty(data))
                            return "";
                        else if  (type === 'display')
                            return type === 'display' && data.length > 30 ?
                                '<span title="' + data + '">' + data + '</span>' :
                                data;
                        else if  (type === 'copy') {
                            var api = new $.fn.dataTable.Api(meta.settings);
                            data = $(api.column(meta.col).header()).text() + ": " + data+"  ";
                        }
                        return data;
                    },
                    targets: [1, 2, 3, 4, 5, 6, 7,8]
                }
            ],
            buttons: [
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':visible',
                        modifier: {
                            selected: true
                        }
                    },
                    text:"选中行导出Excel",
                    container: '#return_rate_export-excel-selected'
                },
                {
                    extend: 'excelHtml5',
                    text:"当前页导出Excel",
                    exportOptions: {
                        columns: ':visible'
                    },
                    container: '#return_rate_export-excel-current'

                },
                {
                    extend: 'copyHtml5',
                    text: '拷贝选中行',
                    header: false,
                    exportOptions: {
                        modifier: {
                            selected: true
                        },
                        orthogonal: 'copy'
                    }
                },
                {
                    extend: 'print',
                    text: '打印全部',
                    container: '#return_rate_export-print-all'
                },
                {
                    extend: 'print',
                    text: '打印选中行',
                    exportOptions: {
                        columns: ':visible',
                        modifier: {
                            selected: true
                        }
                    },
                    container: '#return_rate_export-print-selected'
                },
                {
                    extend: 'copyHtml5',
                    text: '复制',
                    header: false,
                    exportOptions: {
                        modifier: {
                            selected: true
                        },
                        orthogonal: 'copy'
                    },
                    container: '#reportReturnRate_export-copy'
                },
                {
                    extend: 'colvis',
                    text: '自定义列表头',
                    container: '#reportReturnRate_export-columnVisibility'
                }
            ],
            select: {
                // blurable: true,
                style: 'multi',//选中多行
                selector: 'td:first-child'//选中效果仅对第一列有效
                // info: false
            }
        });
    }

// select/not select all
    $('body').on('click', '.reportReturnRate .checkall', function () {
        var check = $(this).prop("checked");
        $(".reportReturnRate .checkchild").prop("checked", check);
        $("#reportReturnRateTable tbody tr").each(function () {
            if (check){
                reportReturnRate_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                reportReturnRate_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });
        var selectedRowData = reportReturnRate_table.rows('.selected').data();
        var RSum = 0.0;
        var RSumReal = 0.0;
        var RRate=0.0;
        if (selectedRowData.length < 1) {
            $("#RSum").val('');
            $("#RSumReal").val('');
            $("#RRate").val('');
            return;
        }
        for (var i = 0; i < selectedRowData.length; i++) {
            //应收金额
            if (selectedRowData[i].receivableSumP != null && selectedRowData[i].receivableSumP != 0) {
                RSum += selectedRowData[i].receivableSumP;
            }
            //实收金额
            if (selectedRowData[i].receivableSumRealP != null && selectedRowData[i].receivableSumRealP != 0) {
                RSumReal += selectedRowData[i].receivableSumRealP;
            }
        }
        if (RSum!=0){
            RRate=(RSumReal/RSum)*100;
            RRate=Number(RRate).toFixed(2);
        }
        if(RSum==0){
            $("#RSum").val('');
        }else {
            $("#RSum").val(RSum);
        }
        if(RSumReal==0){
            $("#RSumReal").val('');
        }else {
            $("#RSumReal").val(RSumReal);
        }
        if(RRate==0){
            $("#RRate").val('');
        }else {
            $("#RRate").val(RRate+"%");
        }
    });

    //监听分页事件,去除复选
    $('#reportReturnRateTable').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);
        $("#RSum").val('');
        $("#RSumReal").val('');
        $("#RRate").val('');

    } );

    $('#reportReturnRateTable').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);
        $("#RSum").val('');
        $("#RSumReal").val('');
        $("#RRate").val('');

    } );

// 点击第一格才能选中
    $('#reportReturnRateTable tbody').on('click', 'tr td:first-child', function () {
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        $(this).closest('tr').toggleClass('selected');
        var selectedRowData = reportReturnRate_table.rows('.selected').data();
        var RSum = 0.0;
        var RSumReal = 0.0;
        var RRate=0.0;
        if (selectedRowData.length < 1) {
            $("#RSum").val('');
            $("#RSumReal").val('');
            $("#RRate").val('');
            return;
        }
        for (var i = 0; i < selectedRowData.length; i++) {
            //应收金额
            if (selectedRowData[i].receivableSumP != null && selectedRowData[i].receivableSumP != 0) {
                RSum += selectedRowData[i].receivableSumP;
            }
            //实收金额
            if (selectedRowData[i].receivableSumRealP != null && selectedRowData[i].receivableSumRealP != 0) {
                RSumReal += selectedRowData[i].receivableSumRealP;
            }
        }
        if (RSum!=0){
            RRate=(RSumReal/RSum)*100;
            RRate=Number(RRate).toFixed(2);
        }
        if(RSum==0){
            $("#RSum").val('');
        }else {
            $("#RSum").val(RSum);
        }
        if(RSumReal==0){
            $("#RSumReal").val('');
        }else {
            $("#RSumReal").val(RSumReal);
        }
        if(RRate==0){
            $("#RRate").val('');
        }else {
            $("#RRate").val(RRate+"%");
        }

    });

//重置查询条件
    $("#reportReturnRateSeachPortForm").click( function() {
        $("#reportReturnRateSearchForm")[0].reset();
        $("#reportReturnRateSearchForm .select2-selection__rendered").attr("title","").text("");
        $("#reportReturnRateSearchForm input").attr("value","");
        reportReturnRate_table.ajax.reload();
        $("#RSum").val('');
        $("#RSumReal").val('');
        $("#RRate").val('');
    });

    //搜索 datatable搜索
    function doSearch(){

        reportReturnRate_table.ajax.reload();
        $("#RSum").val('');
        $("#RSumReal").val('');
        $("#RRate").val('');

    }



    return {
        // 将供页面该方法调用
        doSearch:doSearch

    };

})();