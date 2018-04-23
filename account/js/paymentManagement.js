//@ sourceURL=paymentManagement.js
// $('#lxy_basicdata_tb').DataTable().empty();
//标题行
$(document).ready(function(){
    // resize2(190);
    resizeL();
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();
});
var paymentManagement = (function(){

    $().ready(
        function validatePaymentRequestModalForm() {
            $("#paymentRequestModalForm").validate({
                rules: {
                    remittanceUnit: {
                        required:true,
                        maxlength:40
                    },
                    bank: {
                        required:true,
                        maxlength:40
                    },
                    remittanceAccount: {
                        required:true,
                        maxlength:40
                    },
                    requestCurrency: {
                        required:true,
                        maxlength:11
                    },
                    requestAmount: {
                        required:true,
                        min:0.01,
                        max:999999
                    },
                    exchangeRate: {
                        required:true,
                        min:0.01,
                        max:50
                    }
                },
                errorPlacement: function(){
                    return false;
                }

            });
        }
    );
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
    var rate = 1.0;  //汇率
    var rmbAccount = "";    //人民币账号
    var foreignAccount = "";    //外汇账号

    var paymentManagementObject;  //付款管理工作流object
    var paymentManagementId;


    $().ready(
        function validateAccountInterestMaintenanceForm() {
            $("#editAccountInterestMaintenanceForm").validate({
                rules: {
                }
            });
        }
    );
    //主datatable
    var paymentMangement_tb;

    //付款申请modal中预付款详情datatable
    // var prepaymentsDetail_tb;

    //对账单编号详情中预付款详情datatable
    var detailsOfStatement_tb;
    var prepaymentsDetail_tb1;

    var processName;
    Init();
    function Init() {

        //主datatable
        paymentMangement_tb = $("#paymentManagementTable").DataTable({
            // fnRowCallback: rightClick,//利用行回调函数，来实现右键事件
            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            // 动态分页加载数据方式
            bProcessing: true,
            bServerSide: true,
            aLengthMenu: [10, 20, 40, 60], // 动态指定分页后每页显示的记录数。
            searching: false,// 禁用搜索
            lengthChange: true, // 是否启用改变每页显示多少条数据的控件
            /*
             * sort : "position",
             * //是否开启列排序，对单独列的设置在每一列的bSortable选项中指定
             */
            deferRender: true,// 延迟渲染
            stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
            iDisplayLength: 20, // 默认每页显示多少条记录
            iDisplayStart: 0,
            ordering: false,// 全局禁用排序
            serverSide: true,
            autoWidth: true,
            destroy: true,
            scrollX: true,
            scrollY: calcDataTableHeight(),
            colReorder: true,//列位置的拖动
            dom: '<"top">Brt<"bottom"flip><"clear">',
            // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
            ajax: {
                "type": "POST",
                "url": getContextPath() + 'accountPayableReconcile/selectPayableReconcileAndPayable.do',
                "data": function (d) {
                    // alert(JSON.stringify($('#searchForm').serializeObject()));
                    search_data = $(
                        '#searchPaymentManagementForm')
                        .serializeObject();
                    var k = {};
                    for (var key in search_data) {
                        if (search_data[key] == ""
                            || search_data[key] == null) {
                        } else {
                            k[key] = search_data[key];
                        }
                    }
                    k = JSON.stringify(k);
                    d.keys = k;
                    // d.keys =  JSON.stringify($('#searchFinancialReimburseForm').serializeObject());
                }

            },
            "dataSrc": function (data) {
                //在该方法中可以对服务器端返回的数据进行处理。
                ids1 = '(';
                for (var i = 0; i < data.aaData.length; i++) {
                    if (data.aaData[i].beginEnableTime != ''
                        || data.aaData[i].beginEnableTime == undefined) {
                        data.aaData[i].beginEnableTime = $.date
                            .format(
                                new Date(
                                    data.aaData[i].beginEnableTime),
                                "yyyy-MM-dd");
                    }
                    if (data.aaData[i].endEnableTime != ''
                        || data.aaData[i].endEnableTime == undefined) {
                        data.aaData[i].endEnableTime = $.date
                            .format(
                                new Date(
                                    data.aaData[i].endEnableTime),
                                "yyyy-MM-dd");
                    }

                    // ids1 += data.aaData[i].payableReconcileId;
                    // ids1 += ',';
                }
                ids1 = ids1.substring(0, ids1.length - 1);
                ids1 += ')';

                return data.aaData;
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
                    "Class": "text-center",
                    "data": "paymentMangementId",
                    "title": "<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';

                    },
                    "Sortable": false

                },
                {title: "状态", data: "status"},
                {
                    title: "对账编号",
                    data: "reconcileCode",
                    "render": function (data, type, full, meta) {
                        if (data != "") {
                            return '<a class="customerDetail" style="cursor: pointer" onclick="paymentManagement.statementDetail(this)">' + data + '</a>';
                        } else {
                            return data;
                        }
                    }

                },
                {title: "客户代码", data: "customerCode"},
                {title: "往来单位", data: "contactCompany"},

                {title: "应付USD", data: "payableUsd"},
                {title: "应付RMB", data: "payableRmb"},
                {title: "对账币种", data: "reconcileCurrency"},
                {title: "对账金额", data: "reconcileAmount"},
                {
                    title: "发票号",
                    data: "invoiceNumbers",
                    "render": function (data, type, full, meta) {
                        if (data != "" || data != null) {
                            return '<a class="customerDetail" style="cursor: pointer" onclick="paymentManagement.invoiceDetail(this)">' + data + '</a>';
                        } else {
                            return "";
                        }
                    }

                },
                {title: "请款单号", data: "accountPayable.payableCode"},
                {title: "预付款总币种", data: "accountPayable.advanceChargeCurrency"},
                {title: "预付款总金额", data: "accountPayable.advanceChargeAmount"},
                {title: "请款币种", data: "accountPayable.requestCurrency"},
                {title: "汇率", data: "accountPayable.exchangeRate"},
                {title: "请款金额", data: "accountPayable.requestAmount"},
                {title: "请款人", data: "applicantName"},
                {title: "请款日期", data: "accountPayable.applyDate"}
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
                        else if (type === 'display')
                            return type === 'display' && data.length > 30 ?
                                '<span title="' + data + '">' + data + '</span>' : data;
                        else if (type === 'copy') {
                            var api = new $.fn.dataTable.Api(meta.settings);
                            data = $(api.column(meta.col).header()).text() + ": " + data + "  ";
                        }
                        return data;
                    },
                    targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
                }
            ],
            buttons: [],
            select: {
                style: 'multi',   //选中多行
                selector: 'td:first-child'//选中效果仅对第一列有效
            },
            initComplete:function(){
                if (window.localStorage.jsonData_paymentManagement){
                    // var billId = parseInt(JSON.parse(window.localStorage.jsonData_billing).billId);
                    // billID=parseInt(JSON.parse(window.localStorage.jsonData_billing).billId);
                    // taskId=parseInt(JSON.parse(window.localStorage.jsonData_billing).taskId);
                    // presentNode=JSON.parse(window.localStorage.jsonData_billing).presentNode;
                    // bussinessCode=JSON.parse(window.localStorage.jsonData_billing).bussinessCode;

                    paymentManagementObject = JSON.parse(window.localStorage.jsonData_paymentManagement);

                    paymentManagementId = parseInt(paymentManagementObject.paymentManagementId);
                    processName=JSON.parse(window.localStorage.jsonData_paymentManagement).processName;
                    $.ajax({
                        type: 'POST',
                        url:getContextPath() + 'accountPayable/getById.do',
                        data: {
                            id: paymentManagementId,
                            type:"VIEW",
                            viewType:'付款核销'
                        },
                        cache: false,
                        dataType: "json",
                        success:function (res) {
                            console.log(res);
                            $.each($("#paymentWorkModalForm input"), function (i, input) {
                                $(this).val(res[$(this).attr("name")]);
                            });
                            var type=paymentManagementObject.type;
                            if(type){
                               $("#paymentWorkModal .modalTwoBtn").css("display","block")
                            }else{
                                $("#paymentWorkModal .modalTwoBtn").css("display","none")
                            }
                            workbenchModal();
                            window.localStorage.removeItem("jsonData_paymentManagement");
                        },
                        error: function () {
                            callAlert("获取账款失败")
                        }
                    })

                    //console.log(JSON.parse(window.localStorage.jsonData_paymentManagement));


                    // var payableManagementId = parse(JSON.parse(window.localStorage.jsonData_paymentManagement).billId)



                    // billing.applyIssueInvoice(1,data);
                    // window.localStorage.removeItem("jsonData_billing");



                }
                //无缓存
                else{

                }
            }

        });


        // prepaymentsDetail_tb = $("#prepaymentsDetailTable").DataTable({
        //     paging:false,
        //     bInfo:false,
        //     bProcessing: true,
        //     bServerSide: true,
        //     aLengthMenu: [5, 10, 20, 30], // 动态指定分页后每页显示的记录数。
        //     searching: false,// 禁用搜索
        //     lengthChange: true, // 是否启用改变每页显示多少条数据的控件
        //     /*
        //      * sort : "position",
        //      * //是否开启列排序，对单独列的设置在每一列的bSortable选项中指定
        //      */
        //     deferRender: true,// 延迟渲染
        //     stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
        //     iDisplayLength: 5, // 默认每页显示多少条记录
        //     iDisplayStart: 0,
        //     ordering: false,// 全局禁用排序
        //     serverSide: true,
        //     autoWidth: true,
        //     destroy: true,
        //     scrollX: true,
        //     // scrollY: '200px',
        //     colReorder: true,//列位置的拖动
        //     dom: '<"top">Brt<"bottom"flip><"clear">',
        //     // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
        //     ajax: {
        //         "type": "POST",
        //         "url": getContextPath() + 'accountPayable/listByPage.do',
        //         // "data": data
        //         "data": function (d) {
        //             // alert(JSON.stringify($('#searchForm').serializeObject()));
        //             search_data = $('#queryConditions').serializeObject();
        //             var k = {};
        //             for (var key in search_data) {
        //                 if (key == "customerCode") {
        //                     if (search_data[key] == ""
        //                         || search_data[key] == null) {
        //                     } else {
        //                         k[key] = search_data[key];
        //                     }
        //                 }
        //             }
        //             k = JSON.stringify(k);
        //             d.keys = k;
        //             d.type = "预付款";
        //         }
        //
        //     },
        //     language: {
        //         "url": "js/Chinese.json",
        //         select: {
        //             rows: ""
        //         },
        //         buttons: {
        //             copyTitle: '复制到剪切板',
        //             // copyKeys: 'Appuyez sur <i>ctrl</i> ou <i>\u2318</i> + <i>C</i> pour copier les données du tableau à votre presse-papiers. <br><br>Pour annuler, cliquez sur ce message ou appuyez sur Echap.',
        //             copySuccess: {
        //                 _: '将%d 行复制到剪切板',
        //                 1: '将1行复制到剪切板'
        //             }
        //         }
        //     },
        //     columns: [
        //         {
        //             "Class": "text-center",
        //             "data": "payableReconcileId",
        //             "title": "<input type='checkbox' class='checkall2' />",
        //             "render": function (data, type, full, meta) {
        //                 return '<input type="checkbox"  class="checkchild2"  value="' + data + '" />';
        //
        //             },
        //             "Sortable": false
        //
        //         },
        //         {title: "往来单位", data: "contactCompany"},
        //
        //         {title: "收款单位", data: "receiveCompany"},
        //         {title: "预付款编号", data: "payableCode"},
        //         {title: "付款币种", data: "payCurrency"},
        //         {title: "核销余额", data: "writeOffBalance"},
        //         {title: "核销金额", data: "amender",
        //             "render": function (data, type, full, meta) {
        //                 '<input type="text" value="' + data + '"  style="width:30px;"/>';
        //             }
        //         },
        //         {title: "付款时间", data: "payDate"}
        //
        //
        //
        //     ],
        //     columnDefs: [
        //         {
        //             orderable: false,
        //             targets: 0
        //         },
        //         {
        //             "render": function (data, type, full, meta) {
        //                 if ($.string.isNullOrEmpty(data))
        //                     return "";
        //                 else if (type === 'display')
        //                     return type === 'display' && data.length > 30 ?
        //                         '<span title="' + data + '">' + data + '</span>' : data;
        //                 else if (type === 'copy') {
        //                     var api = new $.fn.dataTable.Api(meta.settings);
        //                     data = $(api.column(meta.col).header()).text() + ": " + data + "  ";
        //                 }
        //                 return data;
        //             },
        //             targets: [1, 2, 3, 4, 5, 6]
        //         }
        //     ],
        //     buttons: [],
        //     select: {
        //         style: 'multi',   //选中多行
        //         selector: 'td:first-child'//选中效果仅对第一列有效
        //     }
        //
        // });



    }


    // 工作流模态框
    function workbenchModal(){
        $('#paymentWorkModal').modal('show');
    }
    // workbenchModal();



    //重置查询条件
    $('#resetSearchFinancialReimburseForm').click(function () {
        $("#searchPaymentManagementForm")[0].reset();
        $("#searchPaymentManagementForm .select2-selection_rendered").attr("title", "").text("");
        emptySelect2Value('searchPaymentManagementForm', 'status');
        paymentMangement_tb.ajax.reload();
    });

    //查询按钮
    function doSearch() {
        paymentMangement_tb.ajax.reload();
    }

    // select/not select all
    $('body').on('click' , '.paymentManagement .checkall' , function(){
        var check = $(this).prop("checked");
        $(".paymentManagement .checkchild").prop("checked", check);
        //通过调用datatables的select事件来触发选中
        $("#paymentManagementTable tbody tr").each(function () {
            if (check){
                paymentMangement_tb.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                paymentMangement_tb.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

    });

    //监听分页事件,去除复选
    $('#paymentMangement_tb').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#paymentMangement_tb').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#paymentManagementTable tbody').on('click', 'tr td:first-child', function () {
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
    });

    /**
     * 预付款详情select all
     */
    // select/not select all
    $('body').on('click' , '.paymentManagement .checkall2' , function(){
        var check = $(this).prop("checked");
        $(".paymentManagement .checkchild2").prop("checked", check);
        //通过调用datatables的select事件来触发选中
        $("#prepaymentsDetailTable tbody tr").each(function () {
            if (check){
                prepaymentsDetail_tb.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                prepaymentsDetail_tb.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

    });



    // 清空弹框
    function emptyAddForm() {
        $("#detailsOfReimburseDetailTable tbody").empty();
        $("#detailsOfReimburseTable tbody").empty();
        $('#paymentRequestModalForm')[0].reset();
        $('#paymentDetailModalForm')[0].reset();
        $("#prepaymentsDetailTable tbody").empty();
        $("label.error").remove();//清除提示语句
    }

    /**
     * 用于请款单明细
     * @param x
     */
    function changeToInput() {
        $("#paymentRequestModalForm input[name = 'advanceChargeCurrency']").show();
        $("#hide1").hide();
        $("#paymentRequestModalForm input[name = 'requestCurrency']").show();
        $("#hide2").hide();

    }

    /**
     * 用于付款申请
     * @param x
     */
    function changeToSelect() {
        $("#paymentRequestModalForm input[name = 'advanceChargeCurrency']").hide();
        $("#hide1").show();
        $("#paymentRequestModalForm input[name = 'requestCurrency']").hide();
        $("#hide2").show();
    }

    /**
     * 付款申请按钮
     * @param x
     */
    function paymentRequest(x) {
        emptyAddForm();
        var selectRowData = paymentMangement_tb.rows('.selected').data();
        if (selectRowData.length != 1) {
            callAlert("请选择一条记录进行编辑！");
            return;
        }
        var data = selectRowData[0];
        console.log(data);

        $('#paymentRequestModal input[name=customerCode]').val(data["customerCode"])
        $('#paymentRequestModal input[name=receiveCompany]').val(data["receiveCompany"])
        $('#paymentRequestModal input[name=contactCompany]').val(data["contactCompany"])
        if (x == 2) {
            $("#paymentRequestModalTitle").html("请款明细");
            changeToInput();

        } else {
            if (data["status"] != "未申请"&&data["status"] != "审核失败") {
                callAlert("请选择一条未申请或审核失败的记录进行付款申请！");
                return;
            }
            changeToSelect();
        }
        //循环赋值查询条件
        $.each($("#queryConditions").find("input"), function (k, input) {
            if (data[$(this).attr("name")] == null) {
                $(this).val(data["accountPayable"][$(this).attr("name")]);
            } else {
                $(this).val(data[$(this).attr("name")]);
            }

        });
        console.log($("#queryConditions").find("input[name=customerCode]"));
        $("#queryConditions input[name=customerCode]").val(data['customerCode']);
        console.log($("#queryConditions input[name=customerCode]").val());
        //对账单详情加载
        var id = $("#queryConditions input[name = 'payableReconcileId']").val();
        $.ajax({
            type : 'POST',
            url : getContextPath() + 'accountPayableReconcile/getById.do',
            data : {
                id: id,
                type: "VIEW",
                type1: ""
            },
            dataType : 'json',
            beforeSend : function() {
                // showMask();//显示遮罩层
            },
            success : function(rsp) {
                $("#detailsOfReimburseTable tbody tr").remove();
                var rmb = rsp['payableRmb'];
                var usd = rsp['payableUsd'];
                if (rmb == null || rmb == "") {
                    rmb = 0;
                }
                if (usd == null || usd == "") {
                    usd = 0;
                }
                var html = '<tr class="surcharge">'
                    + '<td style="width: 16%;">'
                    + rsp['reconcileCode']
                    + '</td>'
                    + '<td style="width: 16%;">'
                    + usd
                    + '</td>'
                    + '<td style="width: 17%;">'
                    + rmb
                    + '</td>'
                    + '<td style="width: 17%;">'
                    + rsp["reconcileCurrency"]
                    + '</td>'
                    + '<td style="width: 17%;">'
                    + rsp["exchangeRate"]
                    + '</td>'
                    + '<td style="width:17%;">'
                    + rsp["reconcileAmount"]
                    + '</td>'
                    + '</tr>';
                $("#detailsOfReimburseTable tbody").append(html);
            },
            error : function() {
                // hideMask();
                callAlert("查看详情失败")
            }
        });
        //计算汇率
        var date = $.date.format(new Date(),"yyyy-MM-dd");
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountExchangeRate/getRateByDate.do',
            data: {
                exchangeRate:date
            },
            cache: false,
            dataType: "json",
            async: false,
            success: function (res) {
                rate = res;
            },
            error: function () {
                callAlert("获取汇率失败");
            }
        });
        //预付款详情加载
        var search_data = $('#queryConditions').serializeObject();
        $.ajax({
            type : 'POST',
            url : getContextPath() + 'accountPayable/listByPage.do',
            data : {
                start:0,
                length:-1,
                type:"预付款",
                keys:JSON.stringify({customerCode:search_data.customerCode})
                            // alert(JSON.stringify($('#searchForm').serializeObject()));
            },
            dataType : 'json',
            beforeSend : function() {
                // showMask();//显示遮罩层
            },
            success : function(rsp) {
                if(rsp.aaData.length>=1){
                    var html="";
                    for(var i=0;i<rsp.aaData.length;i++){
                        html+='<tr data-payCurrency="'+rsp.aaData[i].payCurrency+'" data-payableId="'+rsp.aaData[i].payableId+'">'+
                            '<td>'+
                            '<input type="checkbox"  class="checkchild2"/>'+
                            '</td>'+
                            '<td>'+rsp.aaData[i].contactCompany+'</td>'+
                            '<td>'+rsp.aaData[i].receiveCompany+'</td>'+
                            '<td>'+rsp.aaData[i].payableCode+'</td>'+
                            '<td>'+rsp.aaData[i].payCurrency+'</td>'+
                            '<td>'+rsp.aaData[i].writeOffBalance+'</td>'+
                            '<td>'+
                            '<input type="text" name="writeOffAmount" style="width:50px;" data-wb="'+rsp.aaData[i].writeOffBalance+'"  value="'+rsp.aaData[i].writeOffBalance+'"/>'+
                            '</td>'+
                            '<td>'+rsp.aaData[i].payDate+'</td>'+
                            '</tr>';
                    }
                    $("#prepaymentsDetailTable tbody").append(html);
                }
                // $("#detailsOfReimburseTable tbody tr").remove();
                // var rmb = rsp['payableRmb'];
                // var usd = rsp['payableUsd'];
                // if (rmb == null || rmb == "") {
                //     rmb = 0;
                // }
                // if (usd == null || usd == "") {
                //     usd = 0;
                // }
                // var html = '<tr class="surcharge">'
                //     + '<td style="width: 16%;">'
                //     + rsp['reconcileCode']
                //     + '</td>'
                //     + '<td style="width: 16%;">'
                //     + usd
                //     + '</td>'
                //     + '<td style="width: 17%;">'
                //     + rmb
                //     + '</td>'
                //     + '<td style="width: 17%;">'
                //     + rsp["reconcileCurrency"]
                //     + '</td>'
                //     + '<td style="width: 17%;">'
                //     + rsp["exchangeRate"]
                //     + '</td>'
                //     + '<td style="width:17%;">'
                //     + rsp["reconcileAmount"]
                //     + '</td>'
                //     + '</tr>';
                // $("#detailsOfReimburseTable tbody").append(html);
            },
            error : function() {
                // hideMask();
                callAlert("查看详情失败")
            }
        });
        // initPrepaymentDetailTable();
        $("#paymentRequestModalForm input[name = 'remittanceUnit']").val(data['contactCompany']);
        /**
         * 根据客户代码获取开户行
         */
        var code = data['customerCode'];
        $.ajax({
            type : 'POST',
            url : getContextPath() + 'saleSupplier/getAccountByCode.do',
            data : {
                customerCode: code
            },
            dataType : 'json',
            async: false,
            beforeSend : function() {
                // showMask();//显示遮罩层
            },
            success : function(res) {
                foreignAccount = res['foreignBankAccount'];
                rmbAccount = res['rmbBankAccount'];
                if((foreignAccount==null||foreignAccount=="")&&(rmbAccount==null||rmbAccount=="")){
                    callAlert("请至客户关系管理维护该客户的账户信息")
                }
                $("#paymentRequestModalForm select[name = 'bank']").empty();
                $("#paymentRequestModalForm select[name = 'bank']").append("<option value=''></option>");
                if(rmbAccount!=null&&rmbAccount!=""){
                    $("#paymentRequestModalForm select[name = 'bank']").append("<option value='"+res['rmbBank']+"'>" + res['rmbBank'] +"</option>");
                }
                if(foreignAccount!=null&&foreignAccount!=""){
                    $("#paymentRequestModalForm select[name = 'bank']").append("<option value='"+res['foreignBank']+"'>" + res['foreignBank'] +"</option>");
                }
            },
            error : function() {
                callAlert("查看详情失败")
            }
        });
        //自动装入申请人申请时间
        $("#applyInfo input[name = 'applicant']").val(JSON.parse($.cookie("loginingEmployee")).user.username);
        $("#applyInfo input[name = 'applyDate']").val($.date.format(new Date(),"yyyy-MM-dd"));

        $("#paymentRequestModal").modal("show");
    }

    /**
     * 根据开户银行加载银行账号信息
     *
     */
    $("#paymentRequestModalForm select[name = 'bank']").change(function () {
        var selected = $("#paymentRequestModalForm select[name = 'bank'] option:selected").val();
        if (selected == "rmb") {
            //rmb银行
            $("#paymentRequestModalForm input[name = 'remittanceAccount']").val(rmbAccount);
        } else {
            //外汇银行
            $("#paymentRequestModalForm input[name = 'remittanceAccount']").val(foreignAccount);
        }
    });


    //预付款详情datatable加载
    // function initPrepaymentDetailTable() {
    //     prepaymentsDetail_tb.ajax.reload();
    // }


    /**
     * 计算合计项
     */
    $("#prepaymentsDetailTable tbody").on('click', 'tr td:nth-child(1)', function () {
        // $(this).toggleClass('selected');
        $(this).closest('tr').toggleClass('selected');
        var check = $(this).parents("tr").hasClass("selected");
        $(this).children("input[class=checkchild2]").prop("checked", check);

        // var selectedRowData = prepaymentsDetail_tb.rows('.selected').data();
        var actualAmount = 0.0;
        var actualAmount2 = 0.0;
        if ($("#prepaymentsDetailTable tbody .selected").length < 1) {
            $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val(0);
            return;
        }

        //获取汇率
        var choice = $("#hide1 select[name = 'advanceChargeCurrency'] option:selected").html();
        $("#prepaymentsDetailTable tbody .selected").each(function(){
            var payCurrency=$(this).attr("data-payCurrency");
            var writeOffAmount=$(this).find("input[name=writeOffAmount]").val();
            //实付金额
            if (payCurrency != 'RMB') {
                actualAmount2 += parseFloat(rate * writeOffAmount);
            } else {
                actualAmount += parseFloat(writeOffAmount);
            }
        })

        if (choice == 'RMB') {
            $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val(actualAmount);
            return;
        } else {
            $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val(parseFloat(actualAmount2 / rate).toFixed(2));
            return;
        }
    });
    //核销金额改变
    $("#prepaymentsDetailTable tbody").on("change","tr input[name=writeOffAmount]",function () {
        var vl=$(this).val();
        var wb=$(this).attr("data-wb");
        if(isNaN(vl)){
            callAlert("请输入数字");
            $(this).val(wb);
        }else{
            if(Number(wb)>=Number(vl)){
                var check = $(this).parents("tr").hasClass("selected");
                if(check){
                    var total = 0.0;
                    var total2 = 0.0;
                    var rate = 1.0;
                    //币种
                    var choice = $("#hide1 select[name = 'advanceChargeCurrency'] option:selected").html();
                    var selectedRows = $("#prepaymentsDetailTable tbody .selected");
                    if (selectedRows.length < 1) {
                        $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val(0);
                        return;
                    }
                    //获取汇率
                    var date = $.date.format(new Date(),"yyyy-MM-dd");
                    $.ajax({
                        type: 'POST',
                        url: getContextPath() + 'accountExchangeRate/getRateByDate.do',
                        data: {
                            exchangeRate:date
                        },
                        // data: data,
                        cache: false,
                        dataType: "json",
                        async: false,
                        // beforeSend: function () {
                        //     showMask();//显示遮罩层
                        // },
                        success: function (res) {
                            // hideMask();
                            rate = res;
                        },
                        error: function () {
                            // hideMask();
                            callAlert("查看失败");
                        }
                    });

                    $("#prepaymentsDetailTable tbody .selected").each(function(){
                        var payCurrency=$(this).attr("data-payCurrency");
                        var writeOffAmount=$(this).find("input[name=writeOffAmount]").val();
                        //实付金额
                        if (payCurrency != 'RMB') {
                            total2 += parseFloat(rate * writeOffAmount);
                        } else {
                            total += parseFloat(writeOffAmount);
                        }
                    })
                    if (choice == 'RMB') {
                        $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val(total);
                        return;
                    } else {
                        $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val(parseFloat(total2 / rate).toFixed(2));
                        return;
                    }
                }
            }else{
                callAlert("核销金额不能大于核销余额");
                $(this).val(wb);
            }
        }


    })
    /**
     * 预付款详情计算
     * @param but
     */
    //合计
    $("#hide1 select[name = 'advanceChargeCurrency']").change(function () {
        var total = 0.0;
        var total2 = 0.0;
        var rate = 1.0;
        //币种
        var choice = $("#hide1 select[name = 'advanceChargeCurrency'] option:selected").html();
        var selectedRows = $("#prepaymentsDetailTable tbody .selected");
        if (selectedRows.length < 1) {
            $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val(0);
            return;
        }
        //获取汇率
        var date = $.date.format(new Date(),"yyyy-MM-dd");
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountExchangeRate/getRateByDate.do',
            data: {
                exchangeRate:date
            },
            // data: data,
            cache: false,
            dataType: "json",
            async: false,
            // beforeSend: function () {
            //     showMask();//显示遮罩层
            // },
            success: function (res) {
                // hideMask();
                rate = res;
            },
            error: function () {
                // hideMask();
                callAlert("查看失败");
            }
        });

        $("#prepaymentsDetailTable tbody .selected").each(function(){
            var payCurrency=$(this).attr("data-payCurrency");
            var writeOffAmount=$(this).find("input[name=writeOffAmount]").val();
            //实付金额
            if (payCurrency != 'RMB') {
                total2 += parseFloat(rate * writeOffAmount);
            } else {
                total += parseFloat(writeOffAmount);
            }
        })
        if (choice == 'RMB') {
            $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val(total);
            return;
        } else {
            $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val(parseFloat(total2 / rate).toFixed(2));
            return;
        }
    });

    /**
     * 请款金额计算
     * @param but
     */
    $("#paymentRequestModalForm select[name = 'requestCurrency']").change(function () {
        var choice = $("#paymentRequestModalForm select[name = 'requestCurrency'] option:selected").html();
        //对账单详情
        var billDetail=$("#detailsOfReimburseTable").find('tr td:nth-child(4)').html();
        console.log("billDetail"+billDetail);
        var need = 0.0;
        var have = 0.0;
        if (choice == null || choice == "") {
            return;
        }
        if (choice == 'RMB') {
            if(choice==billDetail){ $("#paymentRequestModalForm input[name = 'exchangeRate']").val('1');}
            else{$("#paymentRequestModalForm input[name = 'exchangeRate']").val(rate);}

            if ($("#hide1 select[name = 'advanceChargeCurrency'] option:selected").html() == 'RMB') {
                need = $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val();
            } else {
                need = parseFloat($("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val()) * rate;
            }
            if ($("#detailsOfReimburseTable").find('tr td:nth-child(4)').html() == 'RMB') {
                have = parseFloat($("#detailsOfReimburseTable tbody").find('tr:nth-child(1) td:nth-child(6)').html());
            } else {
                have = parseFloat($("#detailsOfReimburseTable tbody").find('tr:nth-child(1) td:nth-child(6)').html()) * rate;
            }
        } else {
            if(choice==billDetail){ $("#paymentRequestModalForm input[name = 'exchangeRate']").val('1');}
            else{$("#paymentRequestModalForm input[name = 'exchangeRate']").val(rate);}
            if ($("#hide1 select[name = 'advanceChargeCurrency'] option:selected").html() != 'RMB') {
                need = $("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val();
            } else {
                need = parseFloat($("#paymentRequestModalForm input[name = 'advanceChargeAmount']").val()) / rate;
            }
            if ($("#detailsOfReimburseTable").find('tr td:nth-child(4)').html() != 'RMB') {
                have = parseFloat($("#detailsOfReimburseTable tbody").find('tr:nth-child(1) td:nth-child(6)').html());
            } else {
                have = parseFloat($("#detailsOfReimburseTable tbody").find('tr:nth-child(1) td:nth-child(6)').html()) / rate;
            }
        }
        $("#paymentRequestModalForm input[name = 'requestAmount']").val(parseFloat(have - need).toFixed(2));
    });
    // 请款金额 清空（未选择时）
    // setInterval(function(){
    //     var zero = $('#prepaymentsDetailTable>tbody>tr').hasClass('selected');
    //     if(zero == false){
    //         $("#paymentRequestModalForm input[name = 'requestAmount']").val(' ');
    //     }
    // },500);
    

    /**
     * 付款申请保存字段
     * @param but
     */
    function submitPaymentRequest() {
        if ($("#paymentRequestModalForm input[name = 'requestAmount']").val() < 0) {
            callAlert("预付款合计金额已超过对账金额，请重新选择！");
            return;
        }
        var lists = [];
        var selectedRows = $("#prepaymentsDetailTable tbody .selected");
        $.each(selectedRows,function(){
            var payableId=$(this).attr("data-payableId");
            var writeOffAmount=$(this).find("input[name=writeOffAmount]").val();
            lists.push({"payableId":payableId,"writeOffAmount":writeOffAmount});
        });
        // for (var i = 0; i < selectedRows.length; i++) {
        //     lists.push(selectedRows[i]['payableId']);
        // }

        var reconcileId =  $("#queryConditions input[name = 'payableReconcileId']").val();
        var search_data = $.extend($("#paymentRequestModalForm").serializeObject(), $("#applyInfo").serializeObject(),$("#paymentRequestModalForm2").serializeObject());
        search_data.advanceChargeCurrency = $("#paymentRequestModalForm select[name = 'advanceChargeCurrency'] option:selected").html();
        search_data.requestCurrency = $("#paymentRequestModalForm select[name = 'requestCurrency'] option:selected").html();

        // console.log(search_data);
        var k={};
        for(var key in search_data){
            if(search_data[key]==""||search_data[key]==null){
            } else{
                k[key]=search_data[key];
            }
        }
        k = JSON.stringify(k);

        var checkBasicInfo = $('#paymentRequestModalForm').valid();
        if(checkBasicInfo==false){
            return
        }
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountPayable/requestApply.do',
            data: {
                accountPayable:k,
                accountReconcilePayables:JSON.stringify(lists),
                payableReconcileId:reconcileId
            },
            // data: data,
            cache: false,
            dataType: "json",
            async: false,
            success: function (res) {
                if (res.code == 0) {
                    console.log(res);
                    callSuccess(res.message);
                    paymentMangement_tb.ajax.reload();
                } else {
                    callAlert(res.message);
                    paymentMangement_tb.ajax.reload();
                }

            },
            error: function () {
                callAlert("保存失败");
            }
        });
        $("#paymentRequestModal").modal('hide');

    }

    //发票详情
    function invoiceDetail(but) {
        $(".paymentManagement .checkchild").prop("checked", false);
        $("#paymentManagementTable tbody tr").each(function () {
            paymentMangement_tb.row( this ).deselect();
            $( this ).find('td:first-child').removeClass('selected');
        });
        // $(but).parents("tr").addClass('selected');
        var thiss=$(but).parents("tr");
        paymentMangement_tb.row( thiss ).select();
        $(but).parents("tr").find('td:first-child').addClass('selected');
        $(but).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);

        var data = paymentMangement_tb.rows(".selected").data()[0];
        var id=data.payableReconcileId;
        $.ajax({
            type : 'POST',
            url : getContextPath()
            + 'accountPayableReconcile/invoiceRegisterDetail.do',
            data : {
                payableReconcileId : id
            },
            dataType : 'json',
            beforeSend : function() {
                // showMask();//显示遮罩层
            },
            success : function(rsp) {
                $("#seeInvoiceDetailTable tbody tr").remove();
                $.each(rsp.accountPayableInvoices, function(i, item) {

                    var html = '<tr class="surcharge">'
                        + '<td style="width: 25%;">'
                        + '<input name="invoiceType" class="form-control" style="width:100%;border-style: none" readonly/>'
                        + '</td>'
                        + '<td style="width: 25%;">'
                        + '<input type="text" class="form-control" name="invoiceNumber" style="width:100%;border-style: none" readonly>'
                        + '</td>'
                        + '<td style="width: 25%;">'
                        + '<input name="invoiceCurrency" class="form-control" style="width:100%;border-style: none" readonly/>'
                        + '</td>'
                        + '<td style="width:25%;">'
                        + '<input type="text" class="form-control" name="invoiceAmount" style="width:100%;border-style: none" readonly>'
                        + '</td>'
                        + '<td style="display: none">' +
                        '<div class="form-group" hidden="true" style="display:none">'
                        + '<input type="text" name="payableReconcileId">'
                        + '<input type="text" name="payableManagement">'
                        +'</div>' + '</td>' + '</tr>';
                    $("#seeInvoiceDetailTable tbody").append(html);
                    // 循环赋值
                    $.each($("#seeInvoiceDetailTable .surcharge").eq(i).find("input"), function (k, input) {
                        $(this).val(item[$(this).attr("name")]);
                    });
                });

            },
            error : function() {
                // hideMask();
                callAlert("查看详情失败")
            }
        });

        $("#invoiceDetailModal").modal("show");

    }

    //对账单编号详情
    function statementDetail(but) {
        $(".paymentManagement .checkchild").prop("checked", false);
        $("#paymentManagementTable tbody tr").each(function () {
            paymentMangement_tb.row( this ).deselect();
            $( this ).find('td:first-child').removeClass('selected');
        });
        // $(but).parents("tr").addClass('selected');
        var thiss=$(but).parents("tr");
        paymentMangement_tb.row( thiss ).select();
        $(but).parents("tr").find('td:first-child').addClass('selected');
        $(but).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);

        var data = paymentMangement_tb.rows(".selected").data()[0];
        // 循环赋值
        $.each($("#detailsOfStatementModalForm").find("input","textarea"), function (k, input) {
            $(this).val(data[$(this).attr("name")]);
        });
        $('#detailsOfStatementSearch input[name="reconcileConfirmStatus"]').val("已确认");
        $('#detailsOfStatementSearch input[name="payableReconcileId"]').val(data.payableReconcileId);
        //对账单编号详情中预付款详情datatable
        detailsOfStatement_tb=$('#detailsOfStatementTable').DataTable({
            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            // 动态分页加载数据方式
            bProcessing: true,
            // bServerSide: true,
            aLengthMenu: [10, 20, 40, 60], // 动态指定分页后每页显示的记录数。
            searching: false,// 禁用搜索
            lengthChange: true, // 是否启用改变每页显示多少条数据的控件
            deferRender: true,// 延迟渲染
            bStateSave: false, // 在第三页刷新页面，会自动到第一页
            iDisplayLength: 10, // 默认每页显示多少条记录
            iDisplayStart: 0,
            ordering: false,// 全局禁用排序
            autoWidth: true,
            scrollX: true,
            serverSide: true,
            // scrollY:calcDataTableHeight(),
            colReorder: true,//列位置的拖动
            destroy:true, //Cannot reinitialise DataTable

            scrollY:200,
            dom:'<"top">rt<"bottom"flip><"clear">',
            ajax: {
                "type": "POST",
                // url: '../mock_data/payableAccount.json',

                "url": getContextPath() + 'accountPayableReconcile/listForReconcileDetail.do',
                "async": false,
                "data": function (d) {
                    search_data = $('#detailsOfStatementSearch').serializeObject();
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
                }
            },

            language: {
                "sInfoEmpty":"共 0 项",
                "sInfo":"共 _TOTAL_ 项",
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

                {title: "业务编号", data: "accountBusinessTotal.businessCode"},
                {title: "费用名称", data: "expenseName"},
                {title: "应付币种", data: "currencyExpense"},
                {title: "应付金额", data: "amountExpense"}
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
                        else

                            return type === 'display' && data.length > 30 ?
                                '<span title="' + data + '">' + data + '</span>' :
                                data;
                    },
                    targets: [0,1, 2, 3]
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
                }
            ],
            select: {
                // blurable: true,
                style: 'multi',//选中多行
                selector: 'td:first-child'//选中效果仅对第一列有效
                // info: false
            }
        });




        $("#detailsOfStatementModal").modal("show");
    }

    // //对账单详情datatable初始化
    // function initDetailsOfStatementTable() {
    //     //对账单详情
    //     detailsOfStatement_tb.ajax.reload();
    // }


    // 请款明细

    function invoiceDetailsRequest() {
        emptyAddForm();
        var selectRowData = paymentMangement_tb.rows('.selected').data();
        if (selectRowData.length != 1) {
            callAlert("请选择一条记录！");
            return;
        }
        if(selectRowData.status=='未申请'){
            callAlert("请选择已请款或已审批的数据进行查看！");
            return;
        }
        var data = selectRowData[0];
        var reconcileCode=selectRowData[0].reconcileCode;
        changeToInput();

        //循环赋值查询条件
        $.each($("#queryConditionsDetail").find("input"), function (k, input) {
            if (data[$(this).attr("name")] == null) {
                $(this).val(data["accountPayable"][$(this).attr("name")]);
            } else {
                $(this).val(data[$(this).attr("name")]);
            }
        });

        //循环赋值请款单信息
        $.each($("#paymentRequestDetailDiv").find("input"), function (k, input) {
            /*if (data[$(this).attr("name")] == null) {*/
            $(this).val(data["accountPayable"][$(this).attr("name")]);
            /*}*/
        });
        $.each($("#applyInfo1").find("input"), function (k, input) {

            if (data[$(this).attr("name")] == null) {
                $(this).val(data["accountPayable"][$(this).attr("name")]);
            }else {
                $(this).val(data[$(this).attr("name")]);
            }
        });
        //对账单详情加载

        var id = $("#queryConditionsDetail input[name = 'payableReconcileId']").val();
        $.ajax({
            type : 'POST',
            url : getContextPath() + 'accountPayableReconcile/getById.do',
            data : {
                id: id,
                type: "VIEW",
                type1: ""
            },
            dataType : 'json',
            beforeSend : function() {
                // showMask();//显示遮罩层
            },
            success : function(rsp) {
                $("#detailsOfReimburseDetailTable tbody tr").remove();
                var rmb = rsp['payableRmb'];
                var usd = rsp['payableUsd'];
                if (rmb == null || rmb == "") {
                    rmb = 0;
                }
                if (usd == null || usd == "") {
                    usd = 0;
                }
                var html = '<tr class="surcharge">'
                    + '<td style="width: 16%;">'
                    + rsp['reconcileCode']
                    + '</td>'
                    + '<td style="width: 16%;">'
                    + usd
                    + '</td>'
                    + '<td style="width: 17%;">'
                    + rmb
                    + '</td>'
                    + '<td style="width: 17%;">'
                    + rsp["reconcileCurrency"]
                    + '</td>'
                    + '<td style="width: 17%;">'
                    + rsp["exchangeRate"]
                    + '</td>'
                    + '<td style="width:17%;">'
                    + rsp["reconcileAmount"]
                    + '</td>'
                    + '</tr>';
                $("#detailsOfReimburseDetailTable tbody").append(html);
            },
            error : function() {
                // hideMask();
                callAlert("查看详情失败")
            }
        });
        //预付款详情加载
        prepaymentsDetail_tb1 = $("#prepaymentsDetailTable1").DataTable({
            paging:false,
            bInfo:false,
            bProcessing: true,
            bServerSide: true,
            aLengthMenu: [5, 10, 20, 30], // 动态指定分页后每页显示的记录数。
            searching: false,// 禁用搜索
            lengthChange: true, // 是否启用改变每页显示多少条数据的控件
            deferRender: true,// 延迟渲染
            stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
            iDisplayLength: 5, // 默认每页显示多少条记录
            iDisplayStart: 0,
            ordering: false,// 全局禁用排序
            serverSide: true,
            autoWidth: true,
            destroy: true,
            scrollX: true,
            // scrollY: '200px',
            colReorder: true,//列位置的拖动
            dom: '<"top">Brt<"bottom"flip><"clear">',
            // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
            ajax: {
                "type": "POST",
                "url": getContextPath() + 'accountPayable/listByPage.do',
                // "data": data
                "data": function (d) {
                    d.payableReconcileId = id;
                    d.type = "预付款1";
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
                    "Class": "text-center",
                    "data": "payableReconcileId",
                    "title": "<input type='checkbox' class='checkall2' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild2"  value="' + data + '" />';

                    },
                    "Sortable": false

                },
                {title: "往来单位", data: "contactCompany"},
                {title: "收款单位", data: "receiveCompany"},
                {title: "预付款编号", data: "payableCode"},
                {title: "付款币种", data: "payCurrency"},
                {title: "付款金额", data: "payAmount"},
                {title: "付款时间", data: "payDate"}



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
                        else if (type === 'display')
                            return type === 'display' && data.length > 30 ?
                                '<span title="' + data + '">' + data + '</span>' : data;
                        else if (type === 'copy') {
                            var api = new $.fn.dataTable.Api(meta.settings);
                            data = $(api.column(meta.col).header()).text() + ": " + data + "  ";
                        }
                        return data;
                    },
                    targets: [1, 2, 3, 4, 5, 6]
                }
            ],
            buttons: [],
            select: {
                style: 'multi',   //选中多行
                selector: 'td:first-child'//选中效果仅对第一列有效
            }

        });


        $("#paymentDetailModal").modal("show");
    }



    $('#paymentManagementPassBtn').on('click',function(){
        console.log(paymentManagementObject)
        var text = $("#paymentManagementOrFailModal textarea").val();
        var reData = {
            remark:text,
            billID:paymentManagementObject.paymentManagementId,
            isPass : true,
            taskId:paymentManagementObject.taskId,
            presentNode:paymentManagementObject.presentNode,
            bussinessCode:paymentManagementObject.bussinessCode,
            processName:processName
        };
        // console.log("presentNode"+presentNode)
        // console.log("reData.presentNode"+reData.presentNode)

        if(reData.presentNode=="财务经理审批"){
            console.log(processName)
            if(reData.processName=="付款申请流程"){
                requireAjax2(reData,"50000")
            }else if (reData.processName=="付款申请子公司流程"){
                requireAjax2(reData,"5000")
            }

        }else{
            requireAjax(reData);
        }



        // 移除缓存
        window.localStorage.removeItem('jsonData_paymentManagemen');
        //隐藏模态框
        $('#paymentWorkModal').modal('hide');
        endWorkFlow();
    });

    $('#paymentManagementFailBtn').on('click',function(){
        var text = $("#billingAllocatePassOrFailModal textarea").val();
        var reData = {
            remark:text,
            billID:paymentManagementObject.paymentManagementId,
            isPass : false,
            taskId:paymentManagementObject.taskId,
            presentNode:paymentManagementObject.presentNode,
            bussinessCode:paymentManagementObject.bussinessCode
        };
        console.log(paymentManagementId.taskId);
        requireAjax(reData);
        // 移除缓存
        window.localStorage.removeItem('jsonData_paymentManagement');
        //隐藏模态框
        $('#paymentWorkModal').modal('hide');
        endWorkFlow();
    });
    function requireAjax(jsonData) {
        $.ajax({
            url: getShipContextPath()+'workflow/audit.do',
            type: 'POST',
            data: JSON.stringify(jsonData),
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            success: function (data) {
                console.log(data);
                console.log(data.message);
                if (data.code == 0) {
                    callSuccess("操作成功");
                    approval.approvalDataTable1.ajax.reload();
                    approval.approvalDataTable2.ajax.reload();
                } else {
                    callAlert("操作失败");
                }
                hideMask();
            },
            error: function (err) {
                console.log(err);
                callAlert("操作失败");
                hideMask();
            }
        });
    }
    function requireAjax2(jsonData,typenum) {
        jsonData.businessKey=jsonData.billID;
        $.ajax({
            url: getContextPath()+'accountPayable/aduitPayable.do',
            type: 'POST',
            data: {
                wfAuditBaseInfo: JSON.stringify(jsonData),
                type:typenum
            },
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    callSuccess("操作成功");
                    approval.approvalDataTable1.ajax.reload();
                    approval.approvalDataTable2.ajax.reload();
                } else {
                    callAlert("操作失败");
                }
                hideMask();
            },
            error: function (err) {
                console.log(err);
                callAlert("操作失败");
                hideMask();
            }
        });
    }

    // 结束工作流界面
    function endWorkFlow() {
        //关闭TAB
        $("#tab_tab_220305").empty();
        $("#tab_tab_220305").remove();
        $(".paymentManagement").remove();
        $('.modal-backdrop').hide();
        ///刷新工作台待审核表格
        approval.approvalDataTable1.ajax.reload();
        approval.approvalDataTable2.ajax.reload();


        $('#tab_10').addClass('active');
    }

    return {
        // 将供页面该方法调用
        doSearch:doSearch,
        paymentRequest:paymentRequest,
        invoiceDetail:invoiceDetail,
        statementDetail:statementDetail,
        submitPaymentRequest:submitPaymentRequest,
        invoiceDetailsRequest:invoiceDetailsRequest,
        requireAjax:requireAjax
    };

})();



