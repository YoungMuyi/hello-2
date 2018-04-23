/**
 * Created by huwf on 2017/8/29.
 */
//@ sourceURL=receivableOverview.js
$(document).ready(function(){
    // resize2(190);
    resizeL();
});
$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();

    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

});


var receivableOverview = (function() {
    // $.validator.setDefaults({
    //     submitHandler: submitEditReceivableOverviewModal
    // });
    /*$().ready(
        function validateReceivableOverviewForm() {
            $("#editReceivableOverviewForm").validate({
                rules: {

                },
                errorPlacement: function(){
                    return false;
                }


            });
            // return ReceivableOverview_Validator.form();
        }
    );
*/

    var receivableOverview_table;
    var paral = {
        // "ReceivableOverviewId": "箱型ID",
        "status": "状态",
        "businessType": "业务类型",
        "businessCode": "业务编号",
        "freightShippingRankName": "往来单位代码",
        "contactCompany": "往来单位",
        "expenseName": "费用名称",
        "currencyExpense": "应收币种",
        "amountExpense": "应收金额",
        "accountReceivableInvoice.invoiceNumber": "发票号",
        "accountReceivableInvoice.billingDate": "开票日期",
        "accountReceivableWriteOff.financialNumber": "财务编号",
        "accountReceivableWriteOff.payMethod": "实收方式",
        "accountReceivableWriteOff.writeOffMethod": "核销方式",
        "writeOffCurrency": "核销币种",
        "writeOffRate": "核销汇率",
        "writeOffAmount": "核销金额",
        "accountReceivableWriteOff.writeOffDate": "核销日期"
    };
    Init();
    function Init() {
        // tableHeight = $("#receivableOverviewTable").height();
        receivableOverview_table = $("#receivableOverviewTable").DataTable({
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
                "url": getContextPath() + 'accountExpense/listForReceivableOverview.do',
                "data": function (d) {
                    search_data = $('#receivableOverviewSearchForm').serializeObject();
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
                    data.aaData.forEach(function(item){
                        console.log(item["currencyExpense"])
                        if(item["currencyExpense"]==item["writeOffCurrency"]){
                            item["writeOffRate"] = 1;
                        }
                        if(item["writeOffCurrency"]==""){
                            item["writeOffRate"] = "";
                            item["writeOffAmount"] = "";
                        }
                    })
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
                {
                    title: "状态",
                    data: "status",
                    "render": function (data, type, full, meta) {
                        if (data != "") {
                            return data;
                        } else {
                            return "未核销";
                        }
                    }},
                {title: "业务类型", data: "accountBusinessTotal.businessType"},
                {title: "业务编号", data: "accountBusinessTotal.businessCode"},
                {title: "往来单位代码",data: "customerCode"},
                {title: "往来单位", data: "customerName"},
                {title: "费用名称", data: "expenseName"},
                {title: "应收币种", data: "currencyExpense"},
                {title: "应收金额", data: "amountExpense"},
                {title: "发票号", data: "accountReceivableInvoice.invoiceNumber"},
                {title: "开票日期", data: "accountReceivableInvoice.billingDate"},
                {title: "财务编号", data: "accountReceivableWriteOff.financialNumber"},
                {title: "实收方式", data: "accountReceivableWriteOff.payMethod"},
                {title: "核销方式", data: "accountReceivableWriteOff.writeOffMethod"},
                {title: "核销币种", data: "writeOffCurrency"},
                {title: "核销汇率", data: "writeOffRate"},
                {title: "核销金额", data: "writeOffAmount"},
                {title: "核销日期", data: "accountReceivableWriteOff.writeOffDate"}

            ],
            columnDefs: [
                /*{
                    orderable: false,
                    targets: 0
                },*/
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
                    targets: [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
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

/*// select/not select all
    $('body').on('click', '.receivableOverview .checkall', function () {
        var check = $(this).prop("checked");
        $(".receivableOverview .checkchild").prop("checked", check);
        $("#receivableOverviewTable tbody tr").each(function () {
            if (check){
                receivableOverview_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                receivableOverview_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });
    });*/


/*


// 点击第一格才能选中
    $('#receivableOverviewTable tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
    });
*/

//重置查询条件
    $("#receivableOverviewSearchPortForm").click( function() {
        $("#receivableOverviewSearchForm")[0].reset();
        $("#receivableOverviewSearchForm .select2-selection__rendered").attr("title","").text("");
        receivableOverview_table.ajax.reload();
    });

    //搜索 datatable搜索
    function doSearch(){

        receivableOverview_table.ajax.reload();

    }

    // 收放搜索栏
    function telescopic(but) {
        var text=$(but).text();
        if(text=="更多搜索"){
            $("#receivableOverviewSearchForm").animate({height:'100px'});
            // $(but).text("收起搜索").find("i").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
            $(but).html("收起搜索<i class='fa fa-fw fa-angle-double-up'></i>")
            resize2(106);
        }else{
            $("#receivableOverviewSearchForm").animate({height:'66px'});
            // $(but).text("更多搜索").find("i").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
            $(but).html("更多搜索<i class='fa fa-fw fa-angle-double-down'></i>")
            // resize2(100);
        }

    }

    return {
        // 将供页面该方法调用
        doSearch:doSearch,
        telescopic:telescopic

    };

})();