//@ sourceURL=payableAccount.js

$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();

    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

});


var payableAccount = (function() {
    $.validator.setDefaults({
        submitHandler:submitEditpayableAccountModal
    });

    $().ready(
        function validatepayableAccountForm() {
            $("#editpayableAccountForm").validate({
                rules: {

                    goodsType: {
                        // required:true
                        maxlength:30
                        // digits: true
                    },
                    feeCode: {
                        required:true,
                        maxlength:40
                        // digits: true
                    },
                    feeName: {
                        maxlength:40
                    },
                    loadingPortId: {
                        required:true,
                        maxlength:11
                    },
                    dischargingPortId: {
                        required:true,
                        maxlength:11
                    },
                    vesselParameterId: {
                        required:true,
                        maxlength:11
                    },
                    verticalTeamId:{
                        required:true,
                        maxlength:11
                    },
                    route: {
                        required:true,
                        maxlength:11
                    },
                    price20: {
                        maxlength:10,
                        number:true
                    },
                    price40: {
                        maxlength:10,
                        number:true
                    },
                    price40h: {
                        maxlength:10,
                        number:true
                    },
                    price45: {
                        maxlength:10,
                        number:true
                    },
                    surchargeMoney:{
                        required:true,
                        maxlength:10
                    },
                    currencyCode:{
                        maxlength:11
                    },
                    paymentMethod: {
                        maxlength:40
                    },
                    beginEnableTime: {
                        required:true
                    },
                    description:{
                        maxlength:100
                    }
                },
                errorPlacement: function(){
                    return false;
                }

            });
        }
    );
    var payableAccount_table;
    var paral = {
        // "shippingSurchargeId": "银行ID",
        "status":"状态",
        "reconcileCode":"对账单编号",
        "customerCode":"供应商代码",
        "contactCompany":"供应商名称",
        "payableUsd": "应付USD",
        "payableRmb": "应付RMB",
        "reconcileCurrency":"对账币种",
        "exchangeRate": "汇率",
        "reconcileAmount": "对账金额",
        "notReconcileCount": "应付未对账",
        "checkerName": "核对人",
        "checkDate": "核对时间",

    };
    InitpayableAccount();
    function InitpayableAccount() {
        payableAccount_table = $("#payableAccountTable").DataTable({
            // fnRowCallback: rightClick,//利用行回调函数，来实现右键事件
            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
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
            bStateSave: false, // 在第三页刷新页面，会自动到第一页
            iDisplayLength: 10, // 默认每页显示多少条记录
            iDisplayStart: 0,
            ordering: false,// 全局禁用排序
            serverSide: true,
            scrollX: true,
            autoWidth: true,
            scrollY:calcDataTableHeight(),
            colReorder: true,//列位置的拖动,
            dom:'<"top">rt<"bottom"flip><"clear">',
            ajax: {
                "type": "POST",
                // url: '../mock_data/payableAccount.json',

                "url": getContextPath() + 'accountPayableReconcile/listByPage.do',
                "data": function (d) {
                    search_data = $('#payableAccountSearchForm').serializeObject();
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
                    d.type="应付对账";
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
                    "data": "payableReconcileId",
                    "title": "<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                    },
                    "bSortable": false

                },
                {title: "状态", data:"status"},
                {
                    title: "对账单编号",
                    data: "reconcileCode",
                    "render": function (data, type, full, meta) {
                        if(data!=""){
                            return  '<a class="reconcileCode" style="cursor:pointer" onclick="payableAccount.statementNumberDetails(this)">'+data+'</a>';
                        }else{
                            return "";
                        }
                    }
                },
                {title: "供应商代码", data: "customerCode"},
                {title: "供应商名称", data: "contactCompany"},
                {title: "应付USD", data: "payableUsd"},
                {title: "应付RMB", data: "payableRmb"},
                {title: "对账币种", data: "reconcileCurrency"},
                {title: "汇率", data: "exchangeRate"},
                {title:"对账金额",data:"reconcileAmount"},
                {
                    title: "应付未对账",
                    data:"notReconcileCount",
                    "render":function (data) {
                        if(data!=""){
                            return  '<a class="notReconcileCount" style="cursor:pointer" onclick="payableAccount.notReconcileCountDetails(this)">'+data+'</a>';
                        }else{
                            return "--";
                        }
                    }
                },
                {title: "核对人", data: "checkerName"},
                {title: "核对时间", data: "checkDate"},
                {title: "付款时间", data: "payTime"},

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
                    targets: [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12]
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
    $('body').on('click', '.payableAccountTable .checkall', function () {
        var check = $(this).prop("checked");
        $(".payableAccount .checkchild").prop("checked", check);
        $("#payableAccountTable tbody tr").each(function () {
            if (check){
                payableAccount_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                payableAccount_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });
    });


    $('#editpayableAccountModal').on('click' , '.checkall' , function(){
        var check = $(this).prop("checked");
        $("#editpayableAccountModal .checkchild").prop("checked", check);
        //通过调用datatables的select事件来触发选中
        $("#StatementConfirmTable tbody tr").each(function () {
            if (check){
                StatementConfirmTable.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                StatementConfirmTable.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

    });

    //监听分页事件,去除复选
    $('#payableAccount_table').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#payableAccount_table').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    // 点击第一格才能选中
    $('#payableAccountTable tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        // console.log(table.rows('.selected').data().length);
    });


    $('#StatementConfirmTable ').on('click', 'tr td:first-child', function () {
        // alert(1);
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        // console.log(table.rows('.selected').data().length);
    });

    //重置查询条件
    $("#payableAccountSeachPortForm").click( function() {
        $("#payableAccountSearchForm")[0].reset();
        $("#payableAccountSearchForm .select2-selection__rendered").attr("title","").text("");
        payableAccount_table.ajax.reload();
    });

    var StatementConfirmTable;
    //对账单确认
    var selectedFatherID;
    function statementAccountConfirm(){
       emptyAddForm();
        var selectedRowData = payableAccount_table.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录进行查看！")
            return;
        }
        if(selectedRowData[0].status=="已确认"){
            callAlert("请选择未确认的对账单");
            return;
        }
        selectedFatherID=selectedRowData[0].payableReconcileId;
        valueTheForm(selectedRowData[0],"editpayableAccountForm");
        $("#detailspayableAccountSearchForm")[0].reset();
        $('#detailspayableAccountSearchForm input[name="payableReconcileId"]').val(selectedRowData[0].payableReconcileId);
        $('#detailspayableAccountSearchForm input[name="confirmStatus"]').val("已确认");
        $('#detailspayableAccountSearchForm input[name="reconcileConfirmStatus"]').val("未确认");
        StatementConfirmTable=$("#StatementConfirmTable").DataTable({
            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            // 动态分页加载数据方式
            paging:false,
            bInfo:false,
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
            destroy:true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
            // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
            dom:'<"top">rt<"bottom"flip><"clear">',
            ajax: {
                "type": "POST",
                // url: '../mock_data/payableAccount.json',

                "url": getContextPath() + 'accountPayableReconcile/listForReconcileDetail.do',
                "data": function (d) {
                    search_data = $('#detailspayableAccountSearchForm').serializeObject();
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
                    "data": "expenseId",
                    "title": "<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                    },
                    "bSortable": false

                },

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
                    targets: [1, 2, 3, 4]
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
        $('#editpayableAccountModal').modal('show');//现实模态框

    }
    var StatementDetailsTable;
    //对账单详情
    function statementAccountDetails() {
        var selectedRowData = payableAccount_table.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录进行查看！")
            return;
        }
        if(selectedRowData[0].reconcileCode==""){
            callAlert("请选择已对账的记录进行查看！")
            return;
        }
        valueTheForm(selectedRowData[0],"detailspayableAccountForm");
        $("#detailspayableAccountSearchForm")[0].reset();
        $('#detailspayableAccountSearchForm input[name="payableReconcileId"]').val(selectedRowData[0].payableReconcileId);
        $('#detailspayableAccountSearchForm input[name="confirmStatus"]').val("已确认");
        $('#detailspayableAccountSearchForm input[name="reconcileConfirmStatus"]').val("已确认");
        StatementDetailsTable=$('#StatementDetailsTable').dataTable({
            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            // 动态分页加载数据方式
            paging:false,
            bInfo:false,
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
            destroy:true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
            // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
            dom:'<"top">rt<"bottom"flip><"clear">',
            ajax: {
                "type": "POST",
                // url: '../mock_data/payableAccount.json',

                "url": getContextPath() + 'accountPayableReconcile/listForReconcileDetail.do',
                "data": function (d) {
                    search_data = $('#detailspayableAccountSearchForm').serializeObject();
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
                // {
                //     "sClass": "text-center",
                //     "data": "expenseId",
                //     "title": "<input type='checkbox' class='checkall' />",
                //     "render": function (data, type, full, meta) {
                //         return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                //     },
                //     "bSortable": false

                // },

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

        $('#detailspayableAccountModal').modal('show');
    }

    //给表单赋值
    function valueTheForm(data,FormID) {
        // console.log(data);
        if(FormID=="detailspayableAccountForm"){
            $.each($('#detailspayableAccountForm input,#detailspayableAccountForm textarea'), function (i, input) {
                $(this).val(data[$(this).attr("name")]);

            });
        }
        else if(FormID=="editpayableAccountForm"){
            $.each($('#editpayableAccountForm input,#editpayableAccountForm textarea'), function (i, input) {
                $(this).val(data[$(this).attr("name")]);

            });
        }
    }

    // 弹出框提交按钮
    function submitEditpayableAccountModal() {
        // if(!validatepayableAccountForm()){
        //     alert("validate error!");
        //     return;
        // }
        var data = $("#editpayableAccountForm").serializeObject();
        var saveType = $("#editpayableAccountForm input[name='saveType']").val();
        // data = changeDatetoDatetime(data.beginEnableTime,data.endEnableTime,data);
        if(data.amendTime!=""){
            data.amendTime=null
        }else{
            data.amendTime=null
        }
        data.serviceLineId=$("#payableAccountServiceLineId").attr("title");
        // 判断是否编辑
        if(saveType=="update"){
            var selectedRowData = payableAccount_table.rows('.selected').data();
            var rowData = selectedRowData[0];
            // 循环给表单赋值
            $.each(data, function (i, input) {
                rowData[i]=data[i];
                // $(this).val(data[$(this).attr("name")]);
            });
            delete rowData["baseModel"];
        }else{
            var rowData=data;
        }
        $.ajax({
            url: getContextPath() + 'accountPayableReconcile/' + saveType + '.do',
            type: 'POST',
            data:{
                freightLandSurcharge: JSON.stringify(rowData)
            },
            dataType: 'json',
            async: false,
            success: function (res) {

                if(res.code ==0){
                    callSuccess(res.message);

                    payableAccount_table.ajax.reload();
                }
                else

                    callAlert(res.message);

            },
            error: function () {
                // alert("修改失败!");
                if(saveType=="insert"){
                    callAlert("新增失败");
                }else{
                    callAlert("修改失败");
                }

                // $.messager.alert('系统提示','申请失败,请重试！','warning');
            }
        });
        $('#editpayableAccountModal').modal('hide');//隐藏模态框
    }




    // 切换费用代码
    $('#payableAccountChargeId').on('change',function(){
        var str2value= $("#payableAccountChargeId").select2("val");
        var code=$("#payableAccountChargeId option[value='"+str2value+"']").attr("data-code");
        var name=$("#payableAccountChargeId option[value='"+str2value+"']").attr("data-name");
        $("#editpayableAccountForm input[name=feeCode]").val(code);
        $("#editpayableAccountForm input[name=feeName]").val(name);
    });




    // 清空弹框
    function emptyAddForm() {
        $("#editpayableAccountForm")[0].reset();

        $("label.error").remove();//清除提示语句
    }



    $("#refreshpayableAccount").click(function () {
        payableAccount_table.ajax.reload();
    })



    // click item display detail infomation
    $('#payableAccountTable tbody').on('dblclick', 'tr', function () {
        var data = payableAccount_table.rows($(this)).data()[0];
        $("#detail_table").html("");
        DisplayDetail(data, paral);
    });
    $('#showpayableAccountDetail').on('click', function () {
        var rows_data = payableAccount_table.rows('.selected').data();
        if (rows_data.length < 1) {
            callAlert("请选择一条数据进行查看");
            return;
        }
        for (var i = 0; i < rows_data.length; i++) {
            $("#detail_table").html("");
            DisplayDetail(rows_data[i], paral);
        }

    });

    //搜索 datatable搜索
    function doSearch(){
        payableAccount_table.ajax.reload();
    }


    //时间控件
    $(function(){
        //Date picker
        $('.payableAccount .startTime,.payableAccount .endTime,.payableAccount .startTime2,.payableAccount .endTime2').datepicker({
            autoclose: true,
            language:"zh-CN",//语言设置
            format: "yyyy-mm-dd"
        });
    });

    // $(".date-picker").datepicker({
    //     language: "zh-CN",
    //     autoclose: true
    // });
    // 开始时间
    $('#qBeginTime').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var startTime = e.date;
        console.log(startTime);
        $('#qEndTime').datepicker('setStartDate',startTime);
    });
    //结束时间：
    $('#qEndTime').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var endTime = e.date;

        $('#qBeginTime').datepicker('setEndDate',endTime);
    });

    function billApplication() {
        $('#billApplicationModal').modal('show');
    }


    function statementNumberDetails(but) {

        $(".payableAccount .checkchild").prop("checked", false);
        $("#payableAccountTable tbody tr").each(function () {
            payableAccount_table.row( this ).deselect();
            $( this ).find('td:first-child').removeClass('selected');
        });
        var thiss=$(but).parents("tr");
        payableAccount_table.row( thiss ).select();
        $(but).parents("tr").find('td:first-child').addClass('selected');
        $(but).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);
        statementAccountDetails();
       // $('#statementNumberDetailsModal').modal('show');
    }


var notReconcileCountTable;
function notReconcileCountDetails(but) {
    $(".payableAccount .checkchild").prop("checked", false);
    $("#payableAccountTable tbody tr").each(function () {
        payableAccount_table.row( this ).deselect();
        $( this ).find('td:first-child').removeClass('selected');
    });
    $("#detailspayableAccountSearchForm")[0].reset();
    var thiss=$(but).parents("tr");
    payableAccount_table.row( thiss ).select();
    $(but).parents("tr").find('td:first-child').addClass('selected');
    $(but).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);

    emptyAddForm("detailAirQuotationForm");
    var selectedRowData = payableAccount_table.rows('.selected').data();
    var data = selectedRowData[0];
   // alert(data["customerCode"]);
    $('#notReconcileCountDetails input[name="contactCompanyNo"]').val(data.contactCompany);
    $('#notReconcileCountDetails input[name="notReconcileCountNo"]').val(data.notReconcileCount);
    $('#notReconcileCountDetails input[name="businessApplicantName"]').val(data.businessApplicantName);

    $('#detailspayableAccountSearchForm input[name="customerCode"]').val(data["customerCode"]);
    $('#detailspayableAccountSearchForm input[name="reconcileStatus"]').val("应付未对账");
    var payableUSD=0;
    var payableRMB=0;
    notReconcileCountTable=$('#notReconcileCountTable').DataTable({
        fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
        // 动态分页加载数据方式
        paging:false,
        bInfo:false,
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
        destroy:true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
        // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
        dom:'<"top">rt<"bottom"flip><"clear">',
        ajax: {
            "type": "POST",
            // url: '../mock_data/payableAccount.json',

            "url": getContextPath() + 'accountPayableReconcile/listForReconcileDetail.do',
            "data": function (d) {
                search_data = $('#detailspayableAccountSearchForm').serializeObject();
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
            "dataSrc":function (data) {
                var data=data.aaData;
                for(var i=0;i<data.length;i++){
                    if(data[i].currencyExpense=="RMB"){
                        payableRMB+=Number(data[i].amountExpense)
                    }
                    else if(data[i].currencyExpense=="USD"){
                        payableUSD+=Number(data[i].amountExpense)
                    }
                }
                console.log("RMB"+payableRMB);
                console.log("USD"+payableUSD);
                $("#payableUSD").val(payableUSD);
                $("#payableRMB").val(payableRMB);
                return data;
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
                "data": "expenseId",
                "title": "<input type='checkbox' class='checkall' />",
                "render": function (data, type, full, meta) {
                    return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                },
                "bSortable": false

            },

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
                targets: [1, 2, 3, 4]
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



    $('#notReconcileCountDetails').modal('show');
}

    $('body').on('click', '.notReconcileCountTable .checkall', function () {
        var check = $(this).prop("checked");
        $(".notReconcileCountTable .checkchild").prop("checked", check);
        $("#notReconcileCountTable tbody tr").each(function () {
            if (check){
                notReconcileCountTable.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                notReconcileCountTable.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });
    });

function editpayableAccountConfirm() {
    var selectedRowData=StatementConfirmTable.rows('.selected').data();
    if (selectedRowData.length < 1) {
        callAlert("请选择至少一条记录！")
        return;
    }

    var ids=[];
    for(var i=0;i<selectedRowData.length;i++){
        ids.push(selectedRowData[i].expenseId);
    }
    $.ajax({
        type: 'POST',
        url: getContextPath() + 'accountPayableReconcile/reconcileConfirm.do',
        data: {
            'expandIds':ids.join(','),
            'payableReconcileId':selectedFatherID

        },
        cache: false,
        dataType: "json",
        beforeSend: function () {
            showMask();//显示遮罩层
        },
        success: function (data) {
            hideMask();
            callSuccess("success！");
            $('#editpayableAccountModal').modal('hide');
            payableAccount_table.ajax.reload();

        },
        error: function () {
            hideMask();
            callAlert("操作失败");
            // $('#editcustomsBillModal').modal('hide');//隐藏模态框
        }
    });
}
function editpayableAccountback() {
    var selectedRowData=StatementConfirmTable.rows('.selected').data();
    if (selectedRowData.length < 1) {
        callAlert("请选择至少一条记录！")
        return;
    }

    var ids=[];
    for(var i=0;i<selectedRowData.length;i++){
        ids.push(selectedRowData[i].expenseId);
    }
    $.ajax({
        type: 'POST',
        url: getContextPath() + 'accountPayableReconcile/reconcileRefuse.do',
        data: {
            'expandIds':ids.join(','),
            'payableReconcileId':selectedFatherID

        },
        cache: false,
        dataType: "json",
        beforeSend: function () {
            showMask();//显示遮罩层
        },
        success: function (data) {
            hideMask();
            callSuccess("success！");

            $('#editpayableAccountModal').modal('hide');
            payableAccount_table.ajax.reload();

        },
        error: function () {
            hideMask();
            callAlert("操作失败");
            // $('#editcustomsBillModal').modal('hide');//隐藏模态框
        }
    });
}

    function sendeditedMessage() {

        var businessApplicantName=$('#notReconcileCountDetails input[name="businessApplicantName"]').val();
        var selectedRowData=notReconcileCountTable.rows('.selected').data();
        if (selectedRowData.length < 1) {
            callAlert("请选择至少一条记录！")
            return;
        }

        var ids=[];
        for(var i=0;i<selectedRowData.length;i++){
            ids.push(selectedRowData[i].expenseId);
        }

        $.ajax({
            url: getContextPath()+'accountExpense/insertForAccount.do',//更新该条公告被读次数
            cache: false,
            dataType: "json",
            type: "POST",
            data:{
                expandIds:ids.join(","),
                businessApplicantName:businessApplicantName
            },
            success: function (res) {
                if (res.code == 0) {
                    callSuccess(res.message);
                }
                else
                    callAlert(res.message);

            },
            error: function () {
                callAlert("操作失败");
            }
        });
        $('#notReconcileCountDetails').modal('hide');//隐藏模态框
        /*sendMessage()*/
    }

    function print(){
        var selRow=payableAccount_table.rows('.selected').data();
        if(selRow.length<1){
            callAlert('请选择一条记录!');
        }else if(selRow.length>1){
            callAlert('仅能操作一条记录!');
        }else{
            //console.log(selRow[0].payableReconcileId);
            var payableReconcileId = selRow[0].payableReconcileId;
            var loginCookie=JSON.parse($.cookie("loginingEmployee"));
            var organizationStructrueCompanyName=loginCookie.organizationStructrueCompanyName;
            window.open(getPrintContextPath()+"stimulsoft_viewerfx?stimulsoft_report_key=seawin/5632ee47-aaf5-4cdd-9171-8a242f9f403e.mrt&payableReconcileId="+payableReconcileId+"&company="+organizationStructrueCompanyName);
        }
    }
    //撤销按钮
    function cancel(){
        var selRow=payableAccount_table.rows('.selected').data();
        if(selRow.length<1){
            callAlert('请选择一条记录!');
        }else if(selRow.length>1){
            callAlert('仅能操作一条记录!');
        }else{
            var id = selRow[0].payableReconcileId;
            $.ajax({
                url:getContextPath() +'accountPayableReconcile/financeRevokeReconcileConfrim.do',
                type:'POST',
                data:{
                    payableReconcileId:id
                },
                dataType:'json',
                async:false,
                beforeSend: function () {
                    showMask();//显示遮罩层
                },
                success:function(res){
                    hideMask();
                    if (res.code == 0) {
                        callSuccess(res.message);
                        payableAccount_table.ajax.reload();
                    }
                    else
                        callAlert(res.message);
                },
                error:function(){
                    hideMask();
                    alert('失败');
                }
            });

        }
    }

    return {
        // 将供页面该方法调用
        statementAccountConfirm:statementAccountConfirm,
        statementAccountDetails:statementAccountDetails,
        billApplication:billApplication,
        doSearch:doSearch,
        notReconcileCountDetails:notReconcileCountDetails,
        statementNumberDetails:statementNumberDetails,
        editpayableAccountConfirm:editpayableAccountConfirm,
        editpayableAccountback:editpayableAccountback,
        sendeditedMessage:sendeditedMessage,
        print:print,
        cancel:cancel
    };

})();