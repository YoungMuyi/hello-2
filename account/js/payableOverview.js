//@ sourceURL=payableOverview.js
$(document).ready(function(){
    resizeL();
});
$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();

    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

});


var payableOverview = (function() {


    var payableOverview_table;
    // var paral = {
    //     // "ReceivableOverviewId": "箱型ID",
    //     "status": "状态",
    //     "businessType": "业务类型",
    //     "businessCode": "业务编号",
    //     "freightShippingRankName": "客户代码",
    //     "contactCompany": "往来单位",
    //     "expenseName": "费用名称",
    //     "currencyExpense": "应收币种",
    //     "amountExpense": "应收金额",
    //     "accountReceivableInvoice.invoiceNumber": "发票号",
    //     "accountReceivableInvoice.billingDate": "开票日期",
    //     "accountReceivableWriteOff.financialNumber": "财务编号",
    //     "accountReceivableWriteOff.payMethod": "实收方式",
    //     "accountReceivableWriteOff.writeOffMethod": "核销方式",
    //     "writeOffCurrency": "核销币种",
    //     "writeOffRate": "核销汇率",
    //     "writeOffAmount": "核销金额",
    //     "accountReceivableWriteOff.writeOffDate": "核销日期"
    // };
    Init();
    function Init() {
        // tableHeight = $("#receivableOverviewTable").height();
        payableOverview_table = $("#payableOverViewTable").DataTable({
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
                "url": getContextPath() + 'accountExpense/listForPayableOverview.do',
                "data": function (d) {
                    search_data = $('#searchPayableOverviewForm').serializeObject();
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
                    for(var i=0;i<data.aaData.length;i++){
                        if(data.aaData[i].beginEnableTime != '' || data.aaData[i].beginEnableTime == undefined){
                            data.aaData[i].beginEnableTime = $.date.format(new Date(data.aaData[i].beginEnableTime),"yyyy-MM-dd");
                        }
                        if(data.aaData[i].endEnableTime != '' || data.aaData[i].endEnableTime == undefined){
                            data.aaData[i].endEnableTime = $.date.format(new Date(data.aaData[i].endEnableTime),"yyyy-MM-dd");
                        }
                        if (data.aaData[i].status == "发票已登记") {
                            data.aaData[i].xx = "*";
                        } else {
                            data.aaData[i].xx = "--";
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
                /*{
                    "sClass": "text-center",
                    "data": "container_type_id",
                    "title": "<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                    },
                    "bSortable": false

                },*/
                // {title: "箱型ID", data: "receivableOverviewId"},
                {title: "状态", data: "status"},
                {title: "业务类型", data: "accountBusinessTotal.businessType"},
                {title: "业务编号", data: "accountBusinessTotal.businessCode"},
                {title: "客户代码",data: "customerCode"},
                {title: "往来单位", data: "customerName"},
                {title: "费用名称", data: "expenseName"},
                {title: "应付币种", data: "currencyExpense"},
                {title: "应付金额", data: "amountExpense"},
                {title: "对账编号", data: "accountPayableReconcile.reconcileCode"},
                {title: "实付币种", data: "writeOffCurrency"},
                {title: "实付金额", data: "writeOffAmount"},
                {title: "发票", data: "invoiceNumbers"},
                {title: "财务编号", data: "financialNumbers"},
                {title: "付款日期", data: "accountPayable.payDate"}

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
                    targets: [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
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
                    text: '打印全部'
                },
                {
                    extend: 'print',
                    text: '打印选中行',
                    exportOptions: {
                        modifier: {
                            selected: true
                        }
                    }
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

    //重置查询条件
    $("#resetSearchPayableOverviewForm").click( function() {
        $("#searchPayableOverviewForm")[0].reset();
        $("#searchPayableOverviewForm .select2-selection__rendered").attr("title","").text("");
        payableOverview_table.ajax.reload();
    });

    //搜索 datatable搜索
    function doSearch(){
        payableOverview_table.ajax.reload();
    }

    return {
        // 将供页面该方法调用
        doSearch:doSearch

    };

})();