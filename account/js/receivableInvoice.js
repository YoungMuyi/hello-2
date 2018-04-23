//@ sourceURL=receivableInvoice.js
// $('#lxy_basicdata_tb').DataTable().empty();
//标题行

var receivableInvoice = (function(){

    $(function () {
        //Initialize Select2 Elements，初始化银行下拉框架
        $(".select2").select2();
        resizeL();


        //解决select2 在弹出框中不能搜索的问题
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };

        //Date picker
        $('.beginDate,.endDate').datepicker({
            autoclose: true,
            language:"zh-CN",//语言设置
            format: "yyyy-mm-dd"
        });

    });

    var receivableInvoice_tb;
    var loginCookie=JSON.parse($.cookie("loginingEmployee"));

    var paral={
        "billingApplyStatus":"状态",
        "billingApplyNumber":"开票申请编号",
        "customerCode":"客户代码",
        "contactCompany":"往来单位",
        "invoiceType":"发票类型",
        "receiptCurrency":"开票申请币种",
        "receiptAmount":"开票申请金额",
        "taxRate":"税率",
        "tax":"税金",
        "invoiceNumber":"发票号",
        "breakCurrency":"折开币种",
        "breakRate":"折开汇率",
        "breakAmount":"折开金额",
        "billingDate":"开票日期",
        "drawerId":"开票人",
        "receiptorId":"领票人",
        "receiveDate":"领票日期",
        "remark":"备注",
        "invalidReason":"作废"
    };
    Init();
    function Init() {

        receivableInvoice_tb =  $("#receivableInvoiceTable").DataTable( {
            // fnRowCallback: rightClick,//利用行回调函数，来实现右键事件
            fnDrawCallback:changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            // 动态分页加载数据方式
            bProcessing : true,
            bServerSide : true,
            aLengthMenu : [ 10, 20, 40, 60 ], // 动态指定分页后每页显示的记录数。
            searching : false,// 禁用搜索
            lengthChange : true, // 是否启用改变每页显示多少条数据的控件
            /*
             * sort : "position",
             * //是否开启列排序，对单独列的设置在每一列的bSortable选项中指定
             */
            deferRender : true,// 延迟渲染
            stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
            iDisplayLength : 20, // 默认每页显示多少条记录
            iDisplayStart : 0,
            ordering : false,// 全局禁用排序
            serverSide: true,
            autoWidth: true,
            destroy: true,
            scrollX: true,
            scrollY: calcDataTableHeight(),
            colReorder: true,//列位置的拖动
            dom:'<"top">Brt<"bottom"flip><"clear">',
            // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
            ajax : {
                "type" : "POST",
                "url" : getContextPath()+'accountReceivableInvoice/listByPage.do',
                "data": function(d){
//					alert(JSON.stringify($('#searchForm').serializeObject()));
                    d.keys =  JSON.stringify($('#searchReceivableInvoiceForm').serializeObject());
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
                    "data": "receivableInvoiceId",
                    "title":"<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';

                    },
                    "Sortable": false

                },
                { title: "状态",data:"billingApplyStatus" },
                {
                    title: "开票申请编号",
                    data:"billingApplyNumber",
                    "render":function (data, type, full, meta) {
                        if (data != ""){
                            return '<a class="billingDetail" style="cursor: pointer" onclick="receivableInvoice.seeBillingDetail(this)">'+data+'</a>';
                        } else {
                            return  data;
                        }
                    }
                },
                { title: "客户代码",data:"relateCompanyCode" },
                { title: "往来单位",data:"relateCompanyName" },
                { title: "发票类型",data:"invoiceMethod" },
                { title: "开票申请币种",data:"receiptCurrency" },
                { title: "开票申请金额",data:"receiptAmount" },
                { title: "税率",data:"taxRate" },
                { title: "税金",data:"tax" },
                { title: "发票号",data:"invoiceNumber" },
                { title: "折开币种",data:"breakCurrency" },
                { title: "折开汇率",data:"breakRate" },
                { title: "折开金额",data:"breakAmount" },
                { title: "开票日期",data:"billingDate" },
                { title: "开票人",data:"drawerName" },
                { title: "领票人",data:"receiptorName" },
                { title: "领票日期",data:"receiveDate" },
                {
                    title: "备注",
                    data:"remark"
                },
                { title: "作废",data:"invalidReason" ,
                    "render" : function (data, type, full, meta) {
                        if (data != ""){
                            return  '<a class="invalidReasonDetail" style="cursor: pointer" onclick="receivableInvoice.seeInvalidReason(this)">详情</a>';
                        } else {
                            return data;
                        }
                    }
                }

                // {
                //     title: "维护人",
                //     "data": "amender",
                //
                //     "render": function (data, type, full, meta) {
                //         return (data == null) ? '': data.amenderName;
                //     }
                //     // "bSortable": false,
                // },

                // { title: "维护时间",data:"amendTime"}

            ],
            columnDefs: [
                {
                    orderable: false,
                    targets: 0 },
                {
                    "render": function ( data, type, full, meta ) {
                        if($.string.isNullOrEmpty(data))
                            return "";
                        else if  (type === 'display')
                            return type === 'display' && data.length > 30 ?
                                '<span title="'+data+'">'+data+'</span>' : data;
                        else if  (type === 'copy') {
                            var api = new $.fn.dataTable.Api(meta.settings);
                            data = $(api.column(meta.col).header()).text() + ": " + data+"  ";
                        }
                        return data;
                    },
                    targets: [1,2,3,4,5,6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
                }
            ],
            buttons: [

            ],
            select: {
                style: 'multi',   //选中多行
                selector: 'td:first-child'//选中效果仅对第一列有效
            }

        } );

    }

    //重置查询条件
    $('#resetSearchReceivableInvoiceForm').click(function () {
        $("#searchReceivableInvoiceForm")[0].reset();
        $("#searchReceivableInvoiceForm .select2-selection_rendered").attr("title", "").text("");
        emptySelect2Value('searchReceivableInvoiceForm', 'billingApplyStatus');
        emptySelect2Value('searchReceivableInvoiceForm' ,'customerCode')
        receivableInvoice_tb.ajax.reload();
    });

    // select/not select all
    $('body').on('click' , '.receivableInvoice .checkall' , function(){
        var check = $(this).prop("checked");
        $(".receivableInvoice .checkchild").prop("checked", check);
        //通过调用datatables的select事件来触发选中
        $("#receivableInvoiceTable tbody tr").each(function () {
            if (check){
                receivableInvoice_tb.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                receivableInvoice_tb.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

    });

    //监听分页事件,去除复选
    $('#receivableInvoice_tb').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#receivableInvoice_tb').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#receivableInvoiceTable tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        // console.log(table.rows('.selected').data().length);
    });

    /**
     * 领票登记按钮
     */
    function invoiceCheck() {
        emptyAddForm("invoiceCheckModalForm");
        var selectedRowData = receivableInvoice_tb.rows('.selected').data();
        if (selectedRowData.length<1){
            callAlert("请选择记录进行领票登记！");
            return;
        }
        for(var i=0;i<selectedRowData.length;i++){
            var data = selectedRowData[i];
            if (data["billingApplyStatus"] != "已开票") {
                callAlert("请选择已开票的记录进行领票登记！");
                return;
            }
        }

        //自动装入领票人信息
        //$("#invoiceCheckModalForm input[name = 'receiptorId']").val(loginCookie.user.userDetailId);
        $("#invoiceCheckModalForm input[name = 'receiptorName']").val(loginCookie.user.username);
        $("#invoiceCheckModalForm input[name = 'receiveDate']").val($.date.format(new Date(),"yyyy-MM-dd"));
        // $("#invoiceCheckModalForm input[name='receivableInvoiceId']").val(data['receivableInvoiceId']);
        $('#invoiceCheckModal').modal('show');
    }

    /**
     * 领票登记模态框确定按钮
     */
    function submitInvoiceCheck() {
        $("#invoiceCheckModalForm input[name = 'billingApplyStatus']").val("已领取");
        var dataAdd = $("#invoiceCheckModalForm").serializeObject();
        if (dataAdd["receiptorName"].length == 0 || dataAdd["receiveDate"].length == 0){
            callAlert("请填入相关信息");
            return;
        }
        var selectedRowData = receivableInvoice_tb.rows('.selected').data();
        var receivableInvoiceIds=[];
        for(var i=0;i<selectedRowData.length;i++){

            receivableInvoiceIds.push(selectedRowData[i].receivableInvoiceId)
            // receivableInvoiceIds.push(key['receivableInvoiceId'])
        }
        console.log(receivableInvoiceIds);

        //更新领票人和领票时间
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountReceivableInvoice/registerTicket.do',
            data: {
                accountReceivableInvoice: JSON.stringify(dataAdd),
                receivableInvoiceIds:receivableInvoiceIds.join(',')
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

                    receivableInvoice_tb.ajax.reload();
                }
                else

                    callAlert(res.message);


            },
            error: function () {

                callAlert("修改失败");
            }
        });

        $('#invoiceCheckModal').modal('hide');//现实模态框

    }

    /**
     * 领票作废按钮
     */
    function invoiceInvalid() {
        emptyAddForm("invoiceInvalidModalForm");
        var selectedRowData = receivableInvoice_tb.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录作废！");
            return;
        }
        var data = selectedRowData[0];
        // if (data["billingApplyStatus"] != "已开票") {
        //     callAlert("请选择已开票的记录进行作废！");
        //     return;
        // }
        //设置作废人和作废时间
        $("#invoiceInvalidModalForm input[name = 'invalidStaffId']").val(loginCookie.user.userDetailId);
        $("#invoiceInvalidModalForm input[name = 'invalidStaffName']").val(loginCookie.user.username);
        $("#invoiceInvalidModalForm input[name = 'invalidDate']").val($.date.format(new Date(),"yyyy-MM-dd"));
        $("#invoiceInvalidModalForm input[name='receivableInvoiceId']").val(data['receivableInvoiceId']);
        $('#invoiceInvalidModalTitle').html("领票作废");
        //去除readonly属性
        $("#invoiceInvalidModalForm textarea[name = 'invalidReason']").removeAttr('readonly');
        $("#invoiceInvalidSubmit").show();
        $('#invoiceInvalidModal').modal('show');
    }

    // 清空弹框
    function emptyAddForm(f) {
        $("#" + f)[0].reset();
        $("label.error").remove();//清除提示语句
    }

    /**
     * 作废详情查看
     * @param x
     */
    function seeInvalidReason(x) {
        $(".receivableInvoice .checkchild").prop("checked", false);
        $("#receivableInvoiceTable tbody tr").each(function () {
            receivableInvoice_tb.row(this).deselect();
            $(this).find('td:first-child').removeClass('selected');
        });
        var thiss = $(x).parents("tr");
        receivableInvoice_tb.row(thiss).select();
        $(x).parents("tr").find('td:first-child').addClass('selected');
        $(x).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);

        var data = receivableInvoice_tb.rows(".selected").data()[0];
        console.log(data);
        $('#invoiceInvalidModalForm textarea[name = invalidReason]').val(data['invalidReason']);
        $('#invoiceInvalidModalForm input[name = invalidStaffName]').val(data['invalidStaffName']);
        $('#invoiceInvalidModalForm input[name = invalidDate]').val(data['invalidDate']);
        $("#invoiceInvalidModalForm textarea[name = invalidReason]").attr('readonly', 'readonly');
        $("#invoiceInvalidModalTitle").html("作废详情");
        $("#invoiceInvalidSubmit").hide();
        $('#invoiceInvalidModal').modal('show');//现实模态框

    }

    //查看业务详情
    function seeBillingDetail(x) {
        $(".receivableInvoice .checkchild").prop("checked", false);
        $("#receivableInvoiceTable tbody tr").each(function () {
            receivableInvoice_tb.row(this).deselect();
            $(this).find('td:first-child').removeClass('selected');
        });
        var thiss = $(x).parents("tr");
        receivableInvoice_tb.row(thiss).select();
        $(x).parents("tr").find('td:first-child').addClass('selected');
        $(x).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);
        var data = receivableInvoice_tb.rows(".selected").data()[0];
        if (data["billingApplyNumber"].length == 0){
            callAlert("不存在该编号！")
        }
        data = data["receivableInvoiceId"];
        //查看业务详情
        businessDetail_tb=$("#businessDetailTable").DataTable({
            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            // 动态分页加载数据方式
            bProcessing: true,
            // bServerSide: true,
            aLengthMenu: [5, 10, 20, 40], // 动态指定分页后每页显示的记录数。
            searching: false,// 禁用搜索
            lengthChange: true, // 是否启用改变每页显示多少条数据的控件
            deferRender: true,// 延迟渲染
            bStateSave: false, // 在第三页刷新页面，会自动到第一页
            iDisplayLength: 5, // 默认每页显示多少条记录
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
                "url": getContextPath() + 'accountReceivableInvoice/detailOfBillingNumber.do',
                "data": function(d){
//					alert(JSON.stringify($('#searchForm').serializeObject()));
                        d.keys =  data;
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
                {title: "业务编号", data: "businessCode"},
                {title: "费用名称", data: "expenseName"},
                {title: "应收币种", data: "currencyExpense"},
                {title: "应收金额", data: "amountExpense"}

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
                    targets: [1, 2, 3]
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
        $('#businessDetailModal').modal('show');
    }


    /**
     * 领票作废模态框确认按钮
     */
    function invalidInvoice() {
        $("#invoiceInvalidModalForm input[name = 'billingApplyStatus']").val("作废");
        var dataAdd = $("#invoiceInvalidModalForm").serializeObject();
        if (dataAdd["invalidReason"].length == 0){
            callAlert("请填入作废原因");
            return;
        }
        // $("#invoiceInvalidModalForm input[name = 'billingApplyStatus']").val("作废");
        //更新作废人和作废时间
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountReceivableInvoice/update.do',
            data: {
                accountReceivableInvoice: JSON.stringify(dataAdd)
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

                    receivableInvoice_tb.ajax.reload();
                }
                else
                    callAlert(res.message);

            },
            error: function () {

                callAlert("修改失败");
            }
        });
        $('#invoiceInvalidModal').modal('hide');//现实模态框
    }



    // click item display detail infomation
    $('#interestMaintenanceTable tbody').on('dblclick', 'tr', function () {
        var  data = interestMaintenance_table.rows($(this)).data()[0];
        $("#detail_table").html("");
        DisplayDetail(data, paral);
    } );

    $('#showInterestMaintenanceDetail').on('click',function () {
        var rows_data = interestMaintenance_table.rows('.selected').data();
        if(rows_data.length<1){
            callAlert("请选择一条数据进行查看");
            return;
        }
        for (var i=0;i<rows_data.length;i++){
            $("#detail_table").html("");
            DisplayDetail(rows_data[i], paral);
        }

    });

    //主查询按钮
    function doSearch() {
        receivableInvoice_tb.ajax.reload();
    }


    // 开票导入
    function importExcel() {
        $('#form1ReceivableInvoice input[name=excel]').val("");
        $('#importExcelReceivableInvoiceModal').modal('show');//现实模态框
    }
// 导入提交
    function importExcel2() {
        // var modelName = "";
        var titleName = $('#form1ReceivableInvoice input[name=TicketOpenInfo]').val();
        if (!titleName) {
            callAlert("请选择文件");
            return;
        }
        // $("#importResultsTable tbody .importResultsTable").remove();
        var form = $('#form1ReceivableInvoice')[0];
        var formdata = new FormData(form);
        // formdata.append("type","宁波港");
        $.ajax({
            type: 'POST',
            mimeType: "multipart/form-data",
            url: getContextPath() +"accountStatistics/importTicketOpenInfo.do",
            data: formdata,
            contentType: false,
            cache: false,
            processData: false,
            dataType: "json",
            beforeSend:function(){
                showMask();
            },
            success: function (rsp) {
                hideMask();
                if (rsp.code == 0) {
                    callSuccess(rsp.message);
                    // configure.configure_table.ajax.reload();
                    $("#importExcelReceivableInvoiceModal").modal('hide');
                    receivableInvoice_tb.ajax.reload();
                } else {
                    callAlert(rsp.message);
                    // receivableInvoice_tb.ajax.reload();

                }
            },
            error: function () {
                hideMask();
                callAlert("处理数据失败！")
            }
        });
    }

    // 导出
    function exportInvoice(){
        emptyAddForm("invoiceInvalidModalForm");
        var selectedRowData = receivableInvoice_tb.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录导出！");
            return;
        }
        var data = selectedRowData[0];
        window.open(getContextPath() + 'accountStatistics/excleTicketOpenInfo.do?receivableInvoiceId='+data.receivableInvoiceId);
        // $.ajax({
        //     type: 'POST',
        //     url: getContextPath() + 'accountStatistics/excleTicketOpenInfo.do',
        //     data: {
        //         receivableInvoiceId:data.receivableInvoiceId
        //     },
        //     // data: data,
        //     cache: false,
        //     dataType: "json",
        //     beforeSend: function () {
        //         showMask();//显示遮罩层
        //     },
        //     success: function (res) {
        //         hideMask();
        //
        //         if(res.code ==0){
        //             callSuccess(res.message);
        //
        //             // receivableInvoice_tb.ajax.reload();
        //         }
        //         else
        //             callAlert(res.message);
        //
        //     },
        //     error: function () {
        //         hideMask();
        //         callAlert("导出失败");
        //     }
        // });
    }

    return {
        // 将供页面该方法调用
        doSearch:doSearch,
        invoiceCheck:invoiceCheck,
        invoiceInvalid:invoiceInvalid,
        seeInvalidReason:seeInvalidReason,
        seeBillingDetail:seeBillingDetail,
        invalidInvoice:invalidInvoice,
        submitInvoiceCheck:submitInvoiceCheck,
        importExcel:importExcel,
        importExcel2:importExcel2,
        exportInvoice:exportInvoice

    };

})();



