//@ sourceURL=reportAccountReceivable.js
// $('#lxy_basicdata_tb').DataTable().empty();
//标题行


$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();
    resizeL();
    initSelect2FromRedisProfitAnalysis("searchAccountReceivableForm","salesmanDepartmentsCopy","organization/listAllOrganizationName.do","{}","salesmanDepartmentsCopy","cnName");
    initSelect2FromRedisProfitAnalysis("searchAccountReceivableForm","salesmanNamesCopy","employee/listAllEmployeeName.do","{}","salesmanNamesCopy","cnName");

    $("#searchAccountReceivableForm select[name=salesmanDepartmentsCopy]").select2({
        closeOnSelect: false
    });
    $("#searchAccountReceivableForm select[name=salesmanNamesCopy]").select2({
        closeOnSelect: false
    });
    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    //Date picker
    $('.beginDate,.endDate,.feeDate').datepicker({
        autoclose: true,
        language:"zh-CN",//语言设置
        format: "yyyy-mm-dd"
    });


});

var reportAccountReceivable = (function() {


    var accountReceivable_table;

    Init();
    function Init() {
        accountReceivable_table = $("#accountReceivableTable").DataTable({
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
                "url": getContextPath() + 'accountStatistics/listForPayableStatistics.do',
                "data": function (d) {
                    search_data = $('#searchAccountReceivableForm').serializeObject();
                    if(search_data.salesmanDepartmentsCopy!=null&&search_data.salesmanDepartmentsCopy.length>0){
                        search_data.salesmanDepartmentsCopy= search_data.salesmanDepartmentsCopy.toString();
                    }
                    if(search_data.salesmanNamesCopy!=null&&search_data.salesmanNamesCopy.length>0){
                        search_data.salesmanNamesCopy= search_data.salesmanNamesCopy.toString();
                    }
                    var k={};
                    for(var key in search_data){
                        if(search_data[key]==""||search_data[key]==null){
                        } else{
                            k[key]=search_data[key];
                        }
                    }
                    k=JSON.stringify(k);
                    d.keys=k;
                },
                "dataSrc": function ( data ) {
                    //在该方法中可以对服务器端返回的数据进行处理。
                    for(var i=0; i<data.aaData.length; i++){
                        if(data.aaData[i].actualDate != '' || data.aaData[i].actualDate == undefined){
                            data.aaData[i].actualDate = $.date.format(new Date(data.aaData[i].actualDate),"yyyy-MM-dd");
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
                // {title: "箱型ID", data: "receivableOverviewId"},
                {title: "业务类型", data: "accountBusinessTotal.businessType"},
                {title: "业务编号", data: "accountBusinessTotal.businessCode"},
                {title: "客户代码",data: "customerCode"},
                {title: "往来单位", data: "customerName"},
                {title: "接单日期", data: "accountBusinessTotal.receiveBillTime"},
                {title: "开航日期", data: "accountBusinessTotal.sailingDate"},
                {title: "起运港", data: "accountBusinessTotal.startingPlace"},
                {title: "目的港", data: "accountBusinessTotal.endingPlace"},
                {title: "费用项目", data: "expenseName"},
                {title: "应收币种", data: "currencyExpense"},
                {title: "应收金额", data: "amountExpense"},
                {title: "实收币种", data: "writeOffCurrency"},
                {title: "汇率", data: "writeOffRate"},
                {title: "实收金额", data: "writeOffAmount"},
                {title: "实收日期", data: "actualDate"},
                {title: "业务部门", data: "accountBusinessTotal.salesmanDepartment"},
                {title: "业务员", data: "accountBusinessTotal.salesmanName"}

            ],
            columnDefs: [
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
                    targets: [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
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
                    container: '#receivable_overview_export-excel-selected'
                },
                {
                    extend: 'excelHtml5',
                    text:"当前页导出Excel",
                    exportOptions: {
                        columns: ':visible'
                    },
                    container: '#receivable_overview_export-excel-current'

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
                    container: '#receivable_overview_export-print-all'
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
                    container: '#receivable_overview_export-print-selected'
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
                    container: '#receivableOverview_export-copy'
                },
                {
                    extend: 'colvis',
                    text: '自定义列表头',
                    container: '#receivableOverview_export-columnVisibility'
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

    $('body').on('click', '.accountReceivable .checkall', function () {
        var check = $(this).prop("checked");
        $(".accountReceivable .checkchild").prop("checked", check);
        $("#accountReceivableTable tbody tr").each(function () {
            if (check){
                accountReceivable_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                accountReceivable_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });
        var selectedRowData = accountReceivable_table.rows('.selected').data();
        var needAmount = 0.0;
        var actualAmount = 0.0;
        if (selectedRowData.length < 1) {
            $("#needTotalReceivable").val('');
            $("#actualTotalReceivable").val('');
            return;
        }
        for (var i = 0; i < selectedRowData.length; i++) {
            if (selectedRowData[i].amountExpense != null && selectedRowData[i].amountExpense != 0) {
                needAmount += selectedRowData[i].amountExpense;
            }
            //实付金额
            if (selectedRowData[i].writeOffAmount != null && selectedRowData[i].writeOffAmount != 0) {
                actualAmount += selectedRowData[i].writeOffAmount;
            }
        }
        if(needAmount==0){
            $("#needTotalReceivable").val('');
        }else {
            $("#needTotalReceivable").val(needAmount);
        }
        if(actualAmount==0){
            $("#actualTotalReceivable").val('');
        }else {
            $("#actualTotalReceivable").val(actualAmount);
        }
    });

    //监听分页事件,去除复选
    $('#accountReceivableTable').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);
        $("#needTotalReceivable").val('');
        $("#actualTotalReceivable").val('');

    } );

    $('#accountReceivableTable').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);
        $("#needTotalReceivable").val('');
        $("#actualTotalReceivable").val('');

    } );

    //重置查询条件
    $("#resetSearchAccountReceivableForm").click( function() {
        $("#searchAccountReceivableForm")[0].reset();
        $("#searchAccountReceivableForm .select2-selection__rendered").attr("title","").text("");
        accountReceivable_table.ajax.reload();
        $("#needTotalReceivable").val('');
        $("#actualTotalReceivable").val('');
    });

    //搜索 datatable搜索
    function doSearch(){
        accountReceivable_table.ajax.reload();
        $("#needTotalReceivable").val('');
        $("#actualTotalReceivable").val('');
    }

    $("#accountReceivableTable tbody").on('click', 'tr td:nth-child(1)', function () {
        $(this).toggleClass('selected');
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);
        $(this).closest('tr').toggleClass('selected');

        var selectedRowData = accountReceivable_table.rows('.selected').data();
        var needAmount = 0.0;
        var actualAmount = 0.0;
        if (selectedRowData.length < 1) {
            $("#needTotalReceivable").val('');
            $("#actualTotalReceivable").val('');
            return;
        }
        for (var i = 0; i < selectedRowData.length; i++) {
            if (selectedRowData[i].amountExpense != null && selectedRowData[i].amountExpense != 0) {
                needAmount += selectedRowData[i].amountExpense;
            }
            //实付金额
            if (selectedRowData[i].writeOffAmount != null && selectedRowData[i].writeOffAmount != 0) {
                actualAmount += selectedRowData[i].writeOffAmount;
            }
        }
        if(needAmount==0){
            $("#needTotalReceivable").val('');
        }else {
            $("#needTotalReceivable").val(needAmount);
        }
        if(actualAmount==0){
            $("#actualTotalReceivable").val('');
        }else {
            $("#actualTotalReceivable").val(actualAmount);
        }
    });



    // 收放搜索栏
    function telescopic(but) {
        var text=$(but).text();
        if(text=="更多搜索"){
            $("#reportAccountReceivableSearchForm").animate({height:'100px'});
            // $(but).text("收起搜索").find("i").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
            $(but).html("收起搜索<i class='fa fa-fw fa-angle-double-up'></i>")
            resize2(106);
        }else{
            $("#reportAccountReceivableSearchForm").animate({height:'66px'});
            // $(but).text("更多搜索").find("i").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
            $(but).html("更多搜索<i class='fa fa-fw fa-angle-double-down'></i>")
            // resize2(100);
        }

    }

    return {
        // 将供页面该方法调用
        doSearch:doSearch

    };


})();

