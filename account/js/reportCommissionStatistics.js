//@ sourceURL=reportCommissionStatistics.js
// $('#lxy_basicdata_tb').DataTable().empty();
//标题行


$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();
    resizeL();
    initSelect2FromRedisProfitAnalysis("searchCommissionStatisticsForm","salesmanDepartmentsCopy","organization/listAllOrganizationName.do","{}","salesmanDepartmentsCopy","cnName");
    initSelect2FromRedisProfitAnalysis("searchCommissionStatisticsForm","salesmanNamesCopy","employee/listAllEmployeeName.do","{}","salesmanNamesCopy","cnName");

    $("#searchCommissionStatisticsForm select[name=salesmanDepartmentsCopy]").select2({
        closeOnSelect: false
    });
    $("#searchCommissionStatisticsForm select[name=salesmanNamesCopy]").select2({
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

var reportCommissionStatistics = (function () {


    var commissionStatistics_table;
    var type = ""; //费用类型
    var date = ""; //开航日
    var writeOffAmountSum = 0; //销账金额
    var positiveAmount = 0; //正利息合计
    var negativeAmount = 0; //负利息合计
    Init();
    function Init() {
        // tableHeight = $("#receivableOverviewTable").height();
        commissionStatistics_table = $("#commissionStatisticsTable").DataTable({
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
                    search_data = $('#searchCommissionStatisticsForm').serializeObject();
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
                        if(data.aaData[i].saillingDate != '' || data.aaData[i].saillingDate == undefined){
                            data.aaData[i].saillingDate = $.date.format(new Date(data.aaData[i].saillingDate),"yyyy-MM-dd");
                        }
                        if (data.aaData[i].commissionStatus == null || data.aaData[i].commissionStatus == "") {
                            data.aaData[i].commissionStatus = "未结算";
                        }
                        if (data.aaData[i].commissionStatus == "未结算") {
                            data.aaData[i].positiveInterest = null;
                            data.aaData[i].negativeInterest = null;
                            data.aaData[i].businessCommission = null;
                            data.aaData[i].payableSumReal = null;
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
                {title: "结算单号", data: "commissionId"},
                {title: "状态", data: "commissionStatus"},
                {title: "业务类型", data: "businessType"},
                {title: "业务编号", data: "businessCode"},
                {title: "客户代码",data: "customerCode"},
                {title: "往来单位", data: "contactCompany"},
                {title: "提单号", data: "billLadingNo"},
                {title: "开航日期", data: "sailingDate"},
                {title: "应收金额", data: "receivableSumP"},
                {title: "应付金额", data: "payableSumP"},
                {title: "制单毛利", data: "profitSumP"},
                {title: "销账总额", data: "payableSumReal"},
                {title: "正利息", data: "positiveInterest"},
                {title: "负利息", data: "negativeInterest"},
                {title: "业务提成", data: "businessCommission"},
                {title: "公司", data: "salesmanCompany"},
                {title: "业务部门", data: "salesmanDepartment"},
                {title: "业务员", data: "salesmanName"}

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
                    targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
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
                    container: '#commission_statistics_export-print-all'
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
                    container: '#commission_statistics_export-print-selected'
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

    $('body').on('click', '.reportCommissionStatistics .checkall', function () {
        var check = $(this).prop("checked");
        $(".reportCommissionStatistics .checkchild").prop("checked", check);
        $("#commissionStatisticsTable tbody tr").each(function () {
            if (check){
                commissionStatistics_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                commissionStatistics_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

        var selectedRowData = commissionStatistics_table.rows('.selected').data();
        var positive = 0.0;
        var negative = 0.0;
        var profit = 0.0;
        if (selectedRowData.length < 1) {
            $("#calculate input[name = 'positiveTotal']").val('');
            $("#calculate input[name = 'negativeTotal']").val('');
            $("#calculate input[name = 'profitTotal']").val('');
            return;
        }
        //计算合计项
        for (var i = 0; i < selectedRowData.length; i++) {
            if (selectedRowData[i].positiveInterest != null && selectedRowData[i].positiveInterest != 0) {
                positive += selectedRowData[i].positiveInterest;
            }
            if (selectedRowData[i].negativeInterest != null && selectedRowData[i].negativeInterest != 0) {
                negative += selectedRowData[i].negativeInterest;
            }
            if (selectedRowData[i].businessCommission != null && selectedRowData[i].businessCommission != 0) {
                profit += selectedRowData[i].businessCommission;
            }
        }
        if(positive==0){
            $("#calculate input[name = 'positiveTotal']").val('');
        }else {
            $("#calculate input[name = 'positiveTotal']").val(positive);
        }
        if(negative==0){
            $("#calculate input[name = 'negativeTotal']").val('');
        }else {
            $("#calculate input[name = 'negativeTotal']").val(negative);
        }
        if(profit==0){
            $("#calculate input[name = 'profitTotal']").val('');
        }else {
            $("#calculate input[name = 'profitTotal']").val(profit);
        }
    });

    //监听分页事件,去除复选
    $('#commissionStatisticsTable').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);
        $("#calculate input[name = 'positiveTotal']").val('');
        $("#calculate input[name = 'negativeTotal']").val('');
        $("#calculate input[name = 'profitTotal']").val('');

    } );

    $('#commissionStatisticsTable').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);
        $("#calculate input[name = 'positiveTotal']").val('');
        $("#calculate input[name = 'negativeTotal']").val('');
        $("#calculate input[name = 'profitTotal']").val('');

    } );

    //重置查询条件
    $("#resetSearchCommissionStatisticsForm").click( function() {
        $("#searchCommissionStatisticsForm")[0].reset();
        $("#searchCommissionStatisticsForm .select2-selection__rendered").attr("title","").text("");
        commissionStatistics_table.ajax.reload();
        $("#calculate input[name = 'positiveTotal']").val('');
        $("#calculate input[name = 'negativeTotal']").val('');
        $("#calculate input[name = 'profitTotal']").val('');
    });

    //搜索 datatable搜索
    function doSearch(){
        commissionStatistics_table.ajax.reload();
        $("#calculate input[name = 'positiveTotal']").val('');
        $("#calculate input[name = 'negativeTotal']").val('');
        $("#calculate input[name = 'profitTotal']").val('');
    }

    // 清空弹框
    function emptyAddForm() {
        // $("#detailsOfStatementModalForm")[0].reset();
        $("#commissionSettlementDetailsTable tbody").empty();
        $("#commissionWriteOffTable tbody").empty();
        $('#commissionSettlementModalForm1')[0].reset();
        $('#commissionSettlementModalForm2')[0].reset();
        // $("#paymentRequestModalForm2 table tbody").empty();
        $("#commissionSendModalForm")[0].reset();
    }

    /**
     * 计算合计项
     */
    $("#commissionStatisticsTable tbody").on('click', 'tr td:nth-child(1)', function () {
        $(this).toggleClass('selected');
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);
        $(this).closest('tr').toggleClass('selected');
        var selectedRowData = commissionStatistics_table.rows('.selected').data();
        var positive = 0.0;
        var negative = 0.0;
        var profit = 0.0;
        if (selectedRowData.length < 1) {
            $("#calculate input[name = 'positiveTotal']").val(0);
            $("#calculate input[name = 'negativeTotal']").val(0);
            $("#calculate input[name = 'profitTotal']").val(0);
            return;
        }
        //计算合计项
        for (var i = 0; i < selectedRowData.length; i++) {
            if (selectedRowData[i].positiveInterest != null && selectedRowData[i].positiveInterest != 0) {
                positive += selectedRowData[i].positiveInterest;
            }
            if (selectedRowData[i].negativeInterest != null && selectedRowData[i].negativeInterest != 0) {
                negative += selectedRowData[i].negativeInterest;
            }
            if (selectedRowData[i].businessCommission != null && selectedRowData[i].businessCommission != 0) {
                profit += selectedRowData[i].businessCommission;
            }
        }
        if(positive==0){
            $("#calculate input[name = 'positiveTotal']").val('');
        }else {
            $("#calculate input[name = 'positiveTotal']").val(positive);
        }
        if(negative==0){
            $("#calculate input[name = 'negativeTotal']").val('');
        }else {
            $("#calculate input[name = 'negativeTotal']").val(negative);
        }
        if(profit==0){
            $("#calculate input[name = 'profitTotal']").val('');
        }else {
            $("#calculate input[name = 'profitTotal']").val(profit);
        }
    });

    /**
     * 提成结算按钮
     */
    function commissionSettlememt() {
        // 提成结算要等 销账总额=应收总额才能提成结算
        emptyAddForm();
        var selectedRows = commissionStatistics_table.rows('.selected').data();
        if (selectedRows.length != 1) {
            callAlert("请选择一条记录进行提成结算！");
            return;
        }
        var data = selectedRows[0];
        if (data.commissionStatus != "未结算") {
            callAlert("请选择未结算的来记录进行操作！");
            return;
        }
        //循环赋值
        $.each($("#commissionSettlementModalForm1").find("input"), function (k, input) {
            $(this).val(data[$(this).attr("name")]);
        });
        $("#commissionSettlementModalForm1 input[name = 'commissionId']").val("自动计算");
        type = data['businessType'];
        date = data['sailingDate'];
        positiveAmount = 0;
        negativeAmount = 0;
        writeOffAmountSum = 0;
        /**
         * 根据业务id去查找已核销的费用
         * @type {string}
         */
        var id = data.businessTotalId;
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountBusinessTotal/getByBusinessTotalId.do',
            data: {
                businessTotalId:id
            },
            // data: data,
            cache: false,
            dataType: "json",
            async: false,
            beforeSend: function () {
                showMask();//显示遮罩层
            },
            success: function (res) {
                hideMask();
                console.log(res);
                var actualDate = '';  //核销日期
                var diffDate = 0;   //时间差
                var interest = 0;   //计息器利息
                $('commissionWriteOffTable tbody').empty();
                for (var i = 0; i < res["aaData"].length; i++) {
                    var positiveInterest = "--";
                    var negativeInterest = "--";
                    var index = i + 1;
                    actualDate = res['aaData'][i]['actualDate'];
                    diffDate = dateDiff(date, actualDate);
                    /**
                     * 根据业务的类型和费用的账期去查询利息计算正负利息
                     * @type {string}
                     */

                    $.ajax({
                        type: 'POST',
                        url: getContextPath() + 'accountInterestPeriod/getByType.do',
                        data: {
                            type: type,
                            date: diffDate
                        },
                        // data: data,
                        cache: false,
                        dataType: "json",
                        async: false,
                        beforeSend: function () {
                            // showMask();//显示遮罩层
                        },
                        success: function (res) {
                            // hideMask();
                            interest = res;
                            console.log("interest:", interest)
                        },
                        error: function () {
                            callAlert("查询利息失败")
                        }
                    });
                    //计算每条的正负利息及总的
                    if (interest > 0) {
                        positiveInterest = interest * res['aaData'][i]['writeOffAmount'] * res['aaData'][i]['writeOffRate'];
                        positiveAmount += positiveInterest;
                    } else {
                        negativeInterest = interest * res['aaData'][i]['writeOffAmount'] * res['aaData'][i]['writeOffRate'];
                        negativeAmount += negativeInterest;
                    }
                    if (isNaN(diffDate) || diffDate == " ") {
                        diffDate = "数据错误"
                    }
                    writeOffAmountSum += res['aaData'][i]['writeOffAmount'] * res['aaData'][i]['writeOffRate'];
                    var html = '<tr class="surcharge">'
                        + '<td style = "width: auto">'
                        + index
                        + '</td>'
                        + '<td style = "width: auto">'
                        + actualDate
                        + '</td>'
                        + '<td style = "width: auto">'
                        + res['aaData'][i]['writeOffCurrency']
                        + '</td>'
                        + '<td style = "width: auto">'
                        + res['aaData'][i]['writeOffAmount']
                        + '</td>'
                        + '<td style = "width: auto">'
                        + res['aaData'][i]['writeOffRate']
                        + '</td>'
                        + '<td style = "width: auto">'
                        + res['aaData'][i]['writeOffAmount'] * res['aaData'][i]['writeOffRate']
                        + '</td>'
                        + '<td style = "width: auto">'
                        + diffDate
                        + '</td>'
                        + '<td style = "width: auto">'
                        + positiveInterest
                        + '</td>'
                        + '<td style = "width: auto">'
                        + negativeInterest
                        + '</td>'
                        + '<td style="display: none">'
                        + '<div class="form-group" hidden="true" style="display:none">'
                        + '<input type="text" name="expenseId" value="'
                        + res['aaData'][i]['businessTotalId'] + '">'
                        + '</div>' + '</td>'
                        + '</tr>';
                    $("#commissionWriteOffTable tbody").append(html);

                }

            },
            error: function () {
                callAlert("查询利息失败")
            }
        });
        $("#commissionSettlementModalForm2 input[name = 'positiveInterest']").val(positiveAmount.toFixed(2));
        $("#commissionSettlementModalForm2 input[name = 'negativeInterest']").val(negativeAmount.toFixed(2));
        $("#commissionSettlementModalForm2 input[name = 'payableSumReal']").val(writeOffAmountSum.toFixed(2));
        var profit = 0;
        profit = parseFloat($("#commissionSettlementModalForm1 input[name = 'profitSumP']").val()) + positiveAmount + negativeAmount;
        $("#commissionSettlementModalForm1 input[name = 'businessCommission']").val(profit.toFixed(2));
        $('.modal').css("overflow","scroll");
        $("#commissionSettlementModal").modal("show");

    }

    /**
     * 提成结算模态框保存按钮
     */
    function commissionSubmit() {
        // $("#commissionSettlementModalForm1 input[name = 'commissionStatus']").val("已结算");
        var sendDate = $("#commissionSettlementModalForm1, #commissionSettlementModalForm2").serializeObject();
        sendDate['commissionStatus'] = "已结算";
        console.log(sendDate)
        //传输要更新的数据
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountStatistics/commissionSubmit.do',
            data: {
                commissionStatistic: JSON.stringify(sendDate)
            },
            // data: data,
            cache: false,
            dataType: "json",
            beforeSend: function () {
                showMask();//显示遮罩层
            },
            success: function (res) {
                hideMask();

                if(res.code ==0){
                    callSuccess(res.message);
                    commissionStatistics_table.ajax.reload();
                }
                else
                    callAlert(res.message);


            },
            error: function () {
                callAlert("保存失败!");
            }
        });
        $("#commissionSettlementModal").modal("hide");
    }

    /**
     * 计算日期差
     */
    function dateDiff(date1, date2) {
        var aDate, oDate1, oDate2, idays;
        aDate = date1.split('-');
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        aDate = date2.split('-');
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        idays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
        return idays + 1
    }


    /**
     * 发送按钮
     */
    function send() {
        emptyAddForm();
        var selectedRows = commissionStatistics_table.rows('.selected').data();
        if (selectedRows.length < 1) {
            callAlert("请选择至少一条记录进行发送！");
            return;
        }
        var salesMan = selectedRows[0]['salesmanName']; //业务员
        var customerCode = selectedRows[0]['customerCode']; //客户代码
        var contactCompany = selectedRows[0]['contactCompany'];
        var totalProfit = 0.0;  //提成合计
        for (var i = 0; i < selectedRows.length; i++) {
            if (selectedRows[i]['commissionStatus'] != "已结算") {
                callAlert("请选择已结算的记录进行发送！");
                return;
            }
            if (selectedRows[i]['salesmanName'] != salesMan) {
                callAlert("请选择同一个业务员的记录进行发送！");
                return;
            }
            if (selectedRows[i]['customerCode'] != customerCode) {
                callAlert("请选择同一个客户代码的记录进行发送!");
                return;
            }
            if (selectedRows[i]['contactCompany'] != contactCompany) {
                callAlert("请选择同一个往来单位的记录进行发送!");
                return;
            }
            totalProfit += selectedRows[i]['businessCommission'];
            /**
             * 提成结算详情
             */
            var index = i + 1;
            var html = '<tr>'
                + '<td style = "width: auto">'
                + index
                + '</td>'
                + '<td style = "width: auto">'
                + selectedRows[i]['businessType']
                + '</td>'
                + '<td style = "width: auto">'
                + selectedRows[i]['businessCode']
                + '</td>'
                + '<td style = "width: auto">'
                + selectedRows[i]['customerCode']
                + '</td>'
                + '<td style = "width: auto">'
                + selectedRows[i]['contactCompany']
                + '</td>'
                + '<td style = "width: auto">'
                //提单号
                + selectedRows[i]['billLadingNo']
                + '</td>'
                + '<td style = "width: auto">'
                //开航日
                + selectedRows[i]['sailingDate']
                + '</td>'
                + '<td style = "width: auto">'
                //应收金额
                + selectedRows[i]['receivableSumP']
                + '</td>'
                + '<td style = "width: auto">'
                //应付金额
                + selectedRows[i]['payableSumP']
                + '</td>'
                + '<td style = "width: auto">'
                //销账金额
                + selectedRows[i]['payableSumReal']
                + '</td>'
                + '<td style = "width: auto">'
                //正利息
                + selectedRows[i]['positiveInterest']
                + '</td>'
                + '<td style = "width: auto">'
                //负利息
                + selectedRows[i]['negativeInterest']
                + '</td>'
                + '<td style = "width: auto">'
                //业务提成
                + selectedRows[i]['businessCommission']
                + '</td>'
                + '<td style="display: none">' +
                '<div class="form-group" hidden="true" style="display:none">'
                + '<input type="text" name="businessTotalId" value="'
                + selectedRows[i]['businessTotalId'] + '">'
                +'</div>' + '</td>'
                + '</tr>';
            $("#commissionSettlementDetailsTable tbody").append(html);
        }
        //循环赋值
        $.each($("#commissionSendModalForm input"), function (i, input) {
            $(this).val(selectedRows[0][$(this).attr("name")]);
        });
        //提成合计
        $("#commissionSendModalForm input[name = 'businessCommissionSum']").val(totalProfit);
        $("#commissionSendModal").modal("show");
    }

    /**
     * 发送模态框发送按钮
     */
    function sendSubmit() {
        $("#commissionSendModal").modal("hide");
        commissionStatistics_table.ajax.reload();
    }


    return {
        doSearch:doSearch,
        commissionSettlement:commissionSettlememt,
        send:send,
        commissionSubmit:commissionSubmit,
        sendSubmit:sendSubmit
    }


})();


