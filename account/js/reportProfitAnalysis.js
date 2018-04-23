//@ sourceURL=reportProfitAnalysis.js
// $('#lxy_basicdata_tb').DataTable().empty();
//标题行

$(document).ready(function(){
    // resize2(190);
    resizeL();
});
$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();

    initSelect2FromRedisProfitAnalysis("reportProfitAnalysisSearchForm","salesmanDepartmentsCopy","organization/listAllOrganizationName.do","{}","salesmanDepartmentsCopy","cnName");
    initSelect2FromRedisProfitAnalysis("reportProfitAnalysisSearchForm","salesmanNamesCopy","employee/listAllEmployeeName.do","{}","salesmanNamesCopy","cnName");

    $("#reportProfitAnalysisSearchForm select[name=salesmanDepartmentsCopy]").select2({
        closeOnSelect: false
    });
    $("#reportProfitAnalysisSearchForm select[name=salesmanNamesCopy]").select2({
        closeOnSelect: false
    });
    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };


});

var reportProfitAnalysis = (function() {
    /*$.validator.setDefaults({
        submitHandler: submitLadingBillRegister
    });*/
    /*$().ready(
        function validateReportProfitAnalysisForm() {
            $("#ladingBillRegisterModalForm").validate({
                rules: {
                    billLadingNo: {
                        required: true
                    },
                    receiveBillManName: {
                        required: true
                    },
                    receiveBillDate: {
                        required: true
                    }
                },
                errorPlacement: function(){
                    return false;
                }


            });
            // return ReportProfitAnalysis_Validator.form();
        }
    );*/

    var reportProfitAnalysis_table;
    // var paral = {
    //     // "ReportProfitAnalysisId": "箱型ID",
    //     "status": "状态",
    //     "businessType": "业务类型",
    //     "businessCode": "业务编号",
    //     "freightShippingRankName": "往来单位代码",
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
        // tableHeight = $("#reportProfitAnalysisTable").height();
        reportProfitAnalysis_table = $("#reportProfitAnalysisTable").DataTable({
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
                "url": getContextPath() + 'accountBusinessTotal/listByPageForProfitAnalysis.do',
                "data": function (d) {
                    search_data = $('#reportProfitAnalysisSearchForm').serializeObject();
                    if(search_data.salesmanDepartmentsCopy!=null&&search_data.salesmanDepartmentsCopy.length>0){
                        search_data.salesmanDepartmentsCopy= search_data.salesmanDepartmentsCopy.toString();
                    }
                    if(search_data.salesmanNamesCopy!=null&&search_data.salesmanNamesCopy.length>0){
                        search_data.salesmanNamesCopy= search_data.salesmanNamesCopy.toString();
                    }
                    var k={};
                    for(var key in search_data){
                        if(search_data[key]==""||search_data[key]==null){
                        }
                        else{
                            k[key]=search_data[key];
                        }
                    }
                    k.profitSumRealP=0;
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
                {title: "业务类型", data: "businessType"},
                {title: "业务编号", data: "businessCode"},
                {title: "往来单位", data: "contactCompany"},
                {title: "客户代码",data: "customerCode"},
                {title: "应收金额", data: "receivableSumP"},
                {title: "实收金额", data: "receivableSumRealP"},
                {title: "应付金额", data: "payableSumP"},
                {title: "实付金额", data: "payableSumRealP"},
                /*{title: "费用报销", data: "reimburseSum"},*/
                {title: "预计盈利", data: "profitSumP"},
                {title: "实际盈利", data: "profitSumRealP"},
                {title: "业务员", data: "salesmanName"},
                {title: "业务部门", data: "salesmanDepartment"},
                {title: "公司", data: "salesmanCompany"}

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
                    targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14]
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
                    container: '#profit_analysis_export-excel-selected'
                },
                {
                    extend: 'excelHtml5',
                    text:"当前页导出Excel",
                    exportOptions: {
                        columns: ':visible'
                    },
                    container: '#profit_analysis_export-excel-current'

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
                    container: '#profit_analysis_export-print-all'
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
                    container: '#profit_analysis_export-print-selected'
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
                    container: '#reportProfitAnalysis_export-copy'
                },
                {
                    extend: 'colvis',
                    text: '自定义列表头',
                    container: '#reportProfitAnalysis_export-columnVisibility'
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
    $('body').on('click', '.reportProfitAnalysis .checkall', function () {
        var check = $(this).prop("checked");
        $(".reportProfitAnalysis .checkchild").prop("checked", check);
        $("#reportProfitAnalysisTable tbody tr").each(function () {
            if (check){
                reportProfitAnalysis_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                reportProfitAnalysis_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

        var selectedRowData = reportProfitAnalysis_table.rows('.selected').data();
        var PSum = 0.0;
        var PSumReal = 0.0;
        if (selectedRowData.length < 1) {
            $("#PSum").val('');
            $("#PSumReal").val('');
            return;
        }
        for (var i = 0; i < selectedRowData.length; i++) {
            //应收金额
            if (selectedRowData[i].profitSumP != null && selectedRowData[i].profitSumP != 0) {
                PSum += selectedRowData[i].profitSumP;
            }
            //实收金额
            if (selectedRowData[i].profitSumRealP != null && selectedRowData[i].profitSumRealP != 0) {
                PSumReal += selectedRowData[i].profitSumRealP;
            }
        }
        if(PSum==0){
            $("#PSum").val('');
        }else {
            $("#PSum").val(PSum);
        }
        if(PSumReal==0){
            $("#PSumReal").val('');
        }else {
            $("#PSumReal").val(PSumReal);
        }
    });

    //监听分页事件,去除复选
    $('#reportProfitAnalysisTable').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);
        $("#PSum").val('');
        $("#PSumReal").val('');

    } );

    $('#reportProfitAnalysisTable').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);
        $("#PSum").val('');
        $("#PSumReal").val('');

    } );

// 点击第一格才能选中
    $('#reportProfitAnalysisTable tbody').on('click', 'tr td:first-child', function () {
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        $(this).closest('tr').toggleClass('selected');
        var selectedRowData = reportProfitAnalysis_table.rows('.selected').data();
        var PSum = 0.0;
        var PSumReal = 0.0;
        if (selectedRowData.length < 1) {
            $("#PSum").val('');
            $("#PSumReal").val('');
            return;
        }
        for (var i = 0; i < selectedRowData.length; i++) {
            //应收金额
            if (selectedRowData[i].profitSumP != null && selectedRowData[i].profitSumP != 0) {
                PSum += selectedRowData[i].profitSumP;
            }
            //实收金额
            if (selectedRowData[i].profitSumRealP != null && selectedRowData[i].profitSumRealP != 0) {
                PSumReal += selectedRowData[i].profitSumRealP;
            }
        }
        if(PSum==0){
            $("#PSum").val('');
        }else {
            $("#PSum").val(PSum);
        }
        if(PSumReal==0){
            $("#PSumReal").val('');
        }else {
            $("#PSumReal").val(PSumReal);
        }
    });

//重置查询条件
    $("#reportProfitAnalysisSeachPortForm").click( function() {
        $("#reportProfitAnalysisSearchForm")[0].reset();
        $("#reportProfitAnalysisSearchForm .select2-selection__rendered").attr("title","").text("");
        $("#reportProfitAnalysisSearchForm input").attr("value","");
        reportProfitAnalysis_table.ajax.reload();
        $("#PSum").val('');
        $("#PSumReal").val('');
    });

    //搜索 datatable搜索
    function doSearch(){

        reportProfitAnalysis_table.ajax.reload();
        $("#PSum").val('');
        $("#PSumReal").val('');

    }


    function reportProfitAnalysisDetail() {
        var selectRowData=reportProfitAnalysis_table.rows('.selected').data();
        if(selectRowData.length!=1){
            callAlert("请选择一条记录进行编辑！");
            return;
        }
        $("#reportProfitAnalysisModalForm input").each(function () {
            $(this).val("");
        });
        $("#profitAnalysisDetailTableR tbody tr[name='surcharge']").remove();
        $("#profitAnalysisDetailTableP tbody tr[name='surcharge']").remove();
        $("#profitAnalysisDetailTableF tbody tr[name='surcharge']").remove();

        var data=selectRowData[0];
        $("#reportProfitAnalysisModalForm input").each(function () {
            $(this).val(data[$(this).attr("name")]);
        });
        seeProfitAnalysisDetailTableR(data["businessTotalId"]);
        seeProfitAnalysisDetailTableP(data["businessTotalId"]);
        seeProfitAnalysisDetailTableF(data["businessCode"]);
        $("#reportProfitAnalysisModal").modal("show");
    }

    //应收详情
    function seeProfitAnalysisDetailTableR(businessTotalId) {
        var key={};
        key["businessTotalId"]=businessTotalId.toString();
        key["writeOffStatus"]="已核销";

        $.ajax({
            type : 'POST',
            url : getContextPath() + 'accountExpense/listForReceivableOverview.do',
            data : {
                keys:JSON.stringify(key),
                start:0,
                length:1000
            },
            dataType : 'json',
            beforeSend : function() {
                // showMask();//显示遮罩层
            },
            success : function(rsp) {
                var usdR=0;
                var rmbR=0;
                $.each(rsp.aaData, function(i, item) {
                    var html= '<tr class="surcharge" name="surcharge">'
                        + '<td style="width: 20%;">'
                        + '<input type="text" name="expenseCode" class="form-control" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 20%;">'
                        + '<input type="text" name="expenseName" class="form-control" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 20%;">'
                        + '<input type="text" class="form-control" name="currencyExpense" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 20%;">'
                        + '<input type="text" class="form-control" name="amountExpense" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 20%;">'
                        + '<input type="text" class="form-control" name="payCompany" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '</tr>';
                    $("#profitAnalysisDetailTableR tbody").prepend(html);
                    // 循环赋值
                    $.each($("#profitAnalysisDetailTableR tbody .surcharge").eq(0).find("input"), function (k, input) {
                        $(this).val(item[$(this).attr("name")]);
                        if($(this).attr("name")=="payCompany"){
                            $(this).val(item.accountReceivableWriteOff.payCompany);
                        }
                    });
                    if(item.currencyExpense=="RMB"){
                        rmbR+=item.amountExpense;
                    }else if(item.currencyExpense=="USD"){
                        usdR+=item.amountExpense;
                    }

                });

                $("#profitAnalysisDetailTableR input[name='usdR']").val(usdR);
                $("#profitAnalysisDetailTableR input[name='rmbR']").val(rmbR);
            },
            error : function() {
                // hideMask();
                callAlert("查看详情失败")
            }
        });
    }

    //应付详情
    function seeProfitAnalysisDetailTableP(businessTotalId) {
        var key={};
        key["businessTotalId"]=businessTotalId.toString();
        key["writeOffStatus"]="已核销";

        $.ajax({
            type : 'POST',
            url : getContextPath() + 'accountExpense/listForPayableOverview.do',
            data : {
                keys:JSON.stringify(key),
                start:0,
                length:1000
            },
            dataType : 'json',
            beforeSend : function() {
                // showMask();//显示遮罩层
            },
            success : function(rsp) {
                var usdP=0;
                var rmbP=0;
                var usdPR=0;
                var rmbPR=0;

                $.each(rsp.aaData, function(i, item) {
                    var html= '<tr class="surcharge" name="surcharge">'
                        + '<td style="width: 16%;">'
                        + '<input type="text" name="expenseCode" class="form-control" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 14%;">'
                        + '<input type="text" name="expenseName" class="form-control" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 14%;">'
                        + '<input type="text" class="form-control" name="currencyExpense" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 14%;">'
                        + '<input type="text" class="form-control" name="amountExpense" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 14%;">'
                        + '<input type="text" class="form-control" name="receiveCompany" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 14%;">'
                        + '<input type="text" class="form-control" name="writeOffCurrency" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 14%;">'
                        + '<input type="text" class="form-control" name="writeOffAmount" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '</tr>';
                    $("#profitAnalysisDetailTableP tbody").prepend(html);
                    // 循环赋值
                    $.each($("#profitAnalysisDetailTableP tbody .surcharge").eq(0).find("input"), function (k, input) {
                        $(this).val(item[$(this).attr("name")]);
                        if($(this).attr("name")=="receiveCompany"){
                            $(this).val(item.accountPayable.receiveCompany);
                        }
                    });
                    if(item.currencyExpense=="RMB"){
                        rmbP+=item.amountExpense;
                    }else if(item.currencyExpense=="USD"){
                        usdP+=item.amountExpense;
                    }
                    if(item.writeOffCurrency=="RMB"){
                        rmbPR+=item.writeOffAmount;
                    }else if(item.writeOffCurrency=="USD"){
                        usdPR+=item.writeOffAmount;
                    }

                });

                $("#profitAnalysisDetailTableP input[name='rmbP']").val(rmbP);
                $("#profitAnalysisDetailTableP input[name='usdP']").val(usdP);
                $("#profitAnalysisDetailTableP input[name='rmbPR']").val(rmbPR);
                $("#profitAnalysisDetailTableP input[name='usdPR']").val(usdPR);
            },
            error : function() {
                // hideMask();
                callAlert("查看详情失败")
            }
        });
    }

    //费用报销
    function seeProfitAnalysisDetailTableF(businessCode) {

        $.ajax({
            type : 'POST',
            url : getContextPath() + 'accountFinancialReimburse/listDetailOfReimburse.do',
            data : {
                businessCode:businessCode
            },
            dataType : 'json',
            beforeSend : function() {
                // showMask();//显示遮罩层
            },
            success : function(rsp) {

                $.each(rsp.aaData, function(i, item) {
                    var html= '<tr class="surcharge" name="surcharge">'
                        + '<td style="width: 34%;">'
                        + '<input type="text" name="feeCode" class="form-control" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 33%;">'
                        + '<input type="text" name="feeName" class="form-control" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '<td style="width: 33%;">'
                        + '<input type="text" class="form-control" name="feeAmount" style="width:100%;height:30px;background: white;" readonly/>'
                        + '</td>'
                        + '</tr>';
                    $("#profitAnalysisDetailTableF tbody").prepend(html);
                    // 循环赋值
                    $.each($("#profitAnalysisDetailTableF tbody .surcharge").eq(0).find("input"), function (k, input) {
                        $(this).val(item[$(this).attr("name")]);
                    });

                });
            },
            error : function() {
                // hideMask();
                callAlert("查看详情失败")
            }
        });
    }
    return {
        // 将供页面该方法调用
        doSearch:doSearch,
        reportProfitAnalysisDetail:reportProfitAnalysisDetail

    };

})();