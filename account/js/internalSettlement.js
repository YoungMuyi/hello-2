//@ sourceURL=internalSettlement.js

/**
 * Created by LyuZheng on 2017/10/24.
 */

$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();
    resizeL();

    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    //Date picker
    $('.beginDate,.endDate,.feeDate').datepicker({
        autoclose: true,
        language:"zh-CN",//语言设置
        format: "yyyy-mm-dd"
    });

});


var internalSettlement = (function () {


    var internalSettlement_table;

    Init();
    function Init() {
        // tableHeight = $("#receivableOverviewTable").height();
        internalSettlement_table = $("#internalSettlementTable").DataTable({
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
                "url": getContextPath() + 'accountInternalSettlement/listByPageForInternalSettlement.do',
                "data": function (d) {
                    search_data = $('#internalSettlementForm').serializeObject();
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
                    "title": "<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                    },
                    "bSortable": false

                },
                {title: "业务类型", data: "businessType"},//business total
                {title: "业务编号", data: "businessCode"},//business total
                {title: "费用科目", data: "expenseName"},
                {title: "应收单位",data: "receiveCompany"},//account receivable write-off
                {title: "应付单位", data: "contactCompany"},//account receivable write-off
                {title: "应收币种", data: "currencyExpense"},
                {title: "应收金额", data: "amountExpense"},
                {title: "应收日期", data: "createTime"},
                {title: "实收币种", data: "writeOffCurrency"},
                {title: "实收金额", data: "writeOffAmount"},
                {title: "实收日期", data: "actualDate"},
                {title: "利息", data: "interestResult"}
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
                    targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                }
            ],
            buttons: [
                {
                    extend: 'excelHtml5'
                    // text:"导出Excel"
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
                    container: '#internal_settlement_export-print-all'
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
                    container: '#internal_settlement_export-print-selected'
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
                    container: ''
                },
                {
                    extend: 'colvis',
                    text: '自定义列表头',
                    container: ''
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

    // 日期查询
    $('#beginDate').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var startTime = e.date;
        $('#endDate').datepicker('setStartDate',startTime);
    });
    //日期查询
    $('#endDate').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var endTime = e.date;
        $('#beginDate').datepicker('setEndDate',endTime);
    });

    $('body').on('click', '.internalSettlement .checkall', function () {
        var check = $(this).prop("checked");
        $(".internalSettlement .checkchild").prop("checked", check);
        $("#internalSettlementTable tbody tr").each(function () {
            if (check){
                internalSettlement_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                internalSettlement_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });
    });

    //监听分页事件,去除复选
    $('#internalSettlement_table').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#internalSettlement_table').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    //重置查询条件
    $("#internalSettlementResetButton").click( function() {
        $("#internalSettlementForm")[0].reset();
        $("#internalSettlementForm .select2-selection__rendered").attr("title","").text("");
        internalSettlement_table.ajax.reload();
    });

    //搜索 datatable搜索
    function doSearch(){
        internalSettlement_table.ajax.reload();
    }

    return {
        doSearch:doSearch,
    }


})();

