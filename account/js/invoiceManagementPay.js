//@ sourceURL=invoiceManagementPay.js
$(document).ready(function(){
    resizeL();

});
$(function() {
    //Initialize Select2 Elements，初始化下拉框架
    $(".select2").select2();

    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function() {
    };

});

var invoiceManagementPay = (function() {
    $.validator.setDefaults({
        submitHandler : submitEditInvoiceManagementPayModal
    });

    $().ready(

        function validateInvoiceManagementPayForm() {
            $("#editInvoiceManagementPayForm").validate({
                rules : {
                   /* invoiceManagementPayCode : {
                        // required: true,
                        maxlength : 40
                    },
                    vehicleTeamId : {
                        required : true
                        // maxlength: 5
                    },

                    startingPoint : {
                        required : true,
                        //maxlength: 11
                    },
                    price40 : {
                        maxlength : 10,
                        min : 0.01,
                        max : 10000
                    },

                    beginEnableTime : {
                        required : true
                    },

                    customerService : {
                        maxlength : 50
                    }*/
                },
                errorPlacement : function() {
                    return false;
                }
            });
            // return ShippingQuotation_Validator.form();
        });

    var invoiceManagementPay_table;
    var detailsInvoiceManagementPay_table;
    /*var paral = {
     // "invoiceManagementPayId": "箱型ID",
     "invoiceManagementPayCode" : "运价编号",
     "attachmentName" : "附件",
     "customerService" : "客服",
     "description" : "备注",
     "beginEnableTime" : "开始",
     "endEnableTime" : "结束",
     "amender" : "最新修改人",
     "amendTime" : "最新修改时间"
     };*/
    var ids1;
    Init();
    function Init() {
        // tableHeight = $("#invoiceManagementPayTable").height();
        invoiceManagementPay_table = $("#invoiceManagementPayTable").DataTable(
                {
                    /*fnRowCallback : rightClick,*///利用行回调函数，来实现右键事件
                    fnDrawCallback : changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
                    // 动态分页加载数据方式
                    bProcessing : true,
                    bServerSide : true,
                    aLengthMenu : [ 10, 20, 40, 60 ], // 动态指定分页后每页显示的记录数。
                    searching : false,// 禁用搜索
                    lengthChange : true, // 是否启用改变每页显示多少条数据的控件
                    /*
                     * sort : "position",
                     * //是否开启列排序，对单独列的设置在每一列的bSor选项中指定
                     */
                    deferRender : true,// 延迟渲染
                    bStateSave : false, // 在第三页刷新页面，会自动到第一页
                    iDisplayLength : 20, // 默认每页显示多少条记录
                    iDisplayStart : 0,
                    ordering : false,// 全局禁用排序
                    /*autoWidth : true,
                    scrollX : true,*/
                    serverSide : true,
                    scrollY : calcDataTableHeight(),
                    colReorder : true,//列位置的拖动,
                    dom : '<"top">rt<"bottom"flip><"clear">',
                    destroy : true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
                    // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
                    //			 ajax: "../mock_data/user.txt",

                    ajax : {
                        "type" : "POST",
                        // "url":"../mock_data/invoiceManagementPay.json",
                        "url" : getContextPath() + 'accountPayableReconcile/listByPage.do',
                        "data" : function(d) {

                            search_data = $(
                                '#invoiceManagementPaySearchForm')
                                .serializeObject();
                            var k = {};
                            for ( var key in search_data) {
                                if (search_data[key] == ""
                                    || search_data[key] == null) {
                                } else {
                                    k[key] = search_data[key];
                                }
                            }
                            k = JSON.stringify(k);
                            d.keys = k;
                            d.type="发票管理";
                        },
                        "dataSrc" : function(data) {
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

                                ids1 += data.aaData[i].invoiceManagementPayId;
                                ids1 += ',';
                            }
                            ids1 = ids1.substring(0, ids1.length - 1);
                            ids1 += ')';

                            return data.aaData;
                        },
                        error: function (xhr, error, thrown) {
                            console.log(xhr.responseText);
                            callAlert("获取数据失败，可通过console查看原因！");
                        }

                    },

                    language : {
                        "url" : "js/Chinese.json",
                        select : {
                            rows : "%d 行被选中"
                        },
                        buttons : {
                            copyTitle : '复制到剪切板',
                            // copyKeys: 'Appuyez sur <i>ctrl</i> ou <i>\u2318</i> + <i>C</i> pour copier les données du tableau à votre presse-papiers. <br><br>Pour annuler, cliquez sur ce message ou appuyez sur Echap.',
                            copySuccess : {
                                _ : '将%d 行复制到剪切板',
                                1 : '将1行复制到剪切板'
                            }
                        }
                    },
                    columns : [
                        {
                            "sClass" : "text-center",
                            "data" : "container_type_id",
                            "title" : "<input type='checkbox' class='checkall' />",
                            "render" : function(data, type, full,
                                                meta) {
                                return '<input type="checkbox"  class="checkchild"  value="'
                                    + data + '" />';
                            },
                            "bSortable" : false

                        },

                        {
                            title : "状态",
                            data : "invoiceRegisterStatus"
                        },
                        {
                            title : "对账单编号",
                            data : "reconcileCode",
                            "render" : function(data, type, full, meta) {
                                if (data != "") {
                                    return '<a class="customerDetail" style="cursor: pointer" onclick="invoiceManagementPay.seeReconcileDetail(this)">'+data+'</a>';
                                } else {
                                    return data;
                                }
                            }
                        },
                        {
                            title : "客户代码",
                            data : "customerCode"
                        },
                        {
                            title : "往来单位",
                            data : "contactCompany"
                        },
                        {
                            title : "应付USD",
                            data : "payableUsd"
                        },
                        {
                            title : "应付RMB",
                            data : "payableRmb"
                        },
                        {
                            title : "对账币种",
                            data : "reconcileCurrency"
                        },
                        {
                            title : "对账金额",
                            data : "reconcileAmount"
                        },
                        {
                            title : "发票号",
                            data : "invoiceNumbers",
                            "render" : function(data, type, full, meta) {
                                if (data != "") {
                                    return '<a class="customerDetail" style="cursor: pointer" onclick="invoiceManagementPay.seeInvoiceManagementPayDetail(this)">'+data+'</a>';
                                } else {
                                    return data;
                                }
                            }
                        },
                        {
                            title : "登记人",
                            data : "invoiceRegisterManName"
                        },
                        {
                            title : "登记时间",
                            data : "invoiceRegisterDate"
                        }

                    ],
                    columnDefs : [
                        {
                            orderable : false,
                            targets : 0
                        },
                        {
                            "render" : function(data, type, full, meta) {
                                if ($.string.isNullOrEmpty(data))
                                    return "";
                                else if (type === 'display')
                                    return type === 'display'
                                    && data.length > 30 ? '<span title="' + data + '">' + data + '</span>' : data;
                                else if (type === 'copy') {
                                    var api = new $.fn.dataTable.Api(meta.settings);
                                    data = $(api.column(meta.col).header()).text() + ": " + data + "  ";
                                }
                                return data;
                            },
                            targets : [ 1, 2, 3, 4, 5, 6, 7, 8, 9,
                                10, 11 ]
                        } ],
                    buttons : [ {
                        extend : 'excelHtml5'
                        // text:"导出Excel"
                    }, {
                        extend : 'copyHtml5',
                        text : '拷贝选中行',
                        header : false,
                        exportOptions : {
                            modifier : {
                                selected : true
                            },
                            orthogonal : 'copy'
                        }
                    }, {
                        extend : 'print',
                        text : '打印全部'
                    }, {
                        extend : 'print',
                        text : '打印选中行',
                        exportOptions : {
                            modifier : {
                                selected : true
                            }
                        }
                    } ],
                    select : {
                        // blurable: true,
                        style : 'multi',//选中多行
                        selector : 'td:first-child'//选中效果仅对第一列有效
                        // info: false
                    }
                });

    }

// select/not select all
    $('body').on('click', '.invoiceManagementPay .checkall', function () {
        var check = $(this).prop("checked");
        $(".invoiceManagementPay .checkchild").prop("checked", check);
        $("#invoiceManagementPayTable tbody tr").each(function () {
            if (check){
                invoiceManagementPay_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                invoiceManagementPay_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });
    });

    //监听分页事件,去除复选
    $('#invoiceManagementPay_table').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#invoiceManagementPay_table').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    // 点击第一格才能选中
    $('#invoiceManagementPayTable tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
    });

    //重置查询条件
    $("#invoiceManagementPaySeachSiteForm").click(
        function() {
            $("#invoiceManagementPaySearchForm")[0].reset();
            //设置国家和航线默认值为空
            // emptyFormSelect2Value("invoiceManagementPaySearchForm",["rankCode"]);
            $("#invoiceManagementPaySearchForm .select2-selection__rendered").attr("title", "").text("");
            invoiceManagementPay_table.ajax.reload();
        });

    function addInvoiceManagementPay() {
        var selectedRowData = invoiceManagementPay_table.rows('.selected').data();
        if (selectedRowData.length <1) {
            callAlert("请选择一条记录进行编辑！")
            return;
        }
        var flag=0;

        $.each(selectedRowData,function () {
            if(this.invoiceRegisterStatus!="未登记"){
                flag=1;
            }
        });
        if(flag==1){
            callAlert("发票已登记！")
            return;
        }
        var data = selectedRowData[0];
        $("#detailInvoiceManagementPayTable tbody tr").remove();

        /*$("#payableReconcileId").val(data.payableReconcileId);*/
        var loginCookie=JSON.parse($.cookie("loginingEmployee"));

        $("#editInvoiceManagementPayForm").find("input[type='submit']").val("确认");
        $("#editInvoiceManagementPayForm").find("input[name='invoiceRegisterManId']").val(loginCookie.user.userDetailId);
        $("#editInvoiceManagementPayForm").find("input[name='invoiceRegisterName']").val(loginCookie.user.username);
        $("#editInvoiceManagementPayForm").find("input[name='invoiceRegisterDate']").val( $.date.format(new Date(),"yyyy-MM-dd"));
        $("#editInvoiceManagementPayForm").prev('.modal-header').find('.modal-title').html("发票登记");
        addInvoiceManagementPaySurcharge();

        /*var id=data.payableReconcileId;
        $.ajax({
            type : 'POST',
            url : getContextPath() + 'accountPayableReconcile/invoiceRegisterDetail.do',
            data : {
                payableReconcileId : id
            },
            dataType : 'json',
            beforeSend : function() {
                // showMask();//显示遮罩层
            },
            success : function(rsp) {
                // hideMask();
                if(rsp.accountPayableInvoices.length==0){
                    addInvoiceManagementPaySurcharge();
                }
                $.each(rsp.accountPayableInvoices, function(i, item) {
                    var html = '<tr class="surcharge">'
                        + '<td style="width: 6%;">'
                        + '<input type="checkbox" name="checkSurcharge">'
                        + '</td>'
                        + '<td style="width: 23.5%;">'
                        + '<select name="invoiceType" class="form-control select2" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
                        + '<option value=""></option>'
                        + '<option>复印件</option>'
                        + '<option>原票</option>'
                        + '</select>'
                        + '</td>'
                        + '<td style="width: 23.5%;">'
                        + '<input type="text" class="form-control" name="invoiceNumber" style="width:100%;height:30px;">'
                        + '</td>'
                        + '<td style="width: 23.5%;">'
                        + '<select name="invoiceCurrency" class="form-control select2" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
                        + '<option value=""></option>'
                        + '<option>USD</option>'
                        + '<option>RMB</option>'
                        + '</select>'
                        + '</td>'
                        + '<td style="width: 23.5%;">'
                        + '<input type="text" class="form-control" name="invoiceAmount" style="width:100%;height:30px;">'
                        + '</td>'
                        + '<td style="display: none">' +
                        '<div class="form-group" hidden="true" style="display:none">'
                        + '<input type="text" name="payableReconcileId">'
                        + '<input type="text" name="payableInvoiceId">'
                        +'</div>' + '</td>' + '</tr>';
                    $("#detailInvoiceManagementPayTable tbody").append(html);

                    // 循环赋值
                    $.each($("#detailInvoiceManagementPayTable .surcharge").eq(i).find("input,select"), function (k, input) {
                        $(this).val(item[$(this).attr("name")]);
                    });
                });
            },
            error : function() {
                // hideMask();
                callAlert("附件修改失败")
            }
        });*/

        $('#editInvoiceManagementPayModal').modal('show');//显示模态框


    }

    //发票查看
    function seeInvoiceManagementPayDetail(but) {
        $(".invoiceManagementPay .checkchild").prop("checked", false);
        $("#invoiceManagementPayTable tbody tr").each(function () {
            invoiceManagementPay_table.row( this ).deselect();
            $( this ).find('td:first-child').removeClass('selected');
        });
        // $(but).parents("tr").addClass('selected');
        var thiss=$(but).parents("tr");
        invoiceManagementPay_table.row( thiss ).select();
        $(but).parents("tr").find('td:first-child').addClass('selected');
        $(but).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);

        var data = invoiceManagementPay_table.rows(".selected").data()[0];
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
                $("#seeInvoiceManagementPaySurChargeTable tbody tr").remove();
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
                        + '<input type="text" name="payableInvoiceId">'
                        +'</div>' + '</td>' + '</tr>';
                    $("#seeInvoiceManagementPaySurChargeTable tbody").append(html);
                    // 循环赋值
                    $.each($("#seeInvoiceManagementPaySurChargeTable .surcharge").eq(i).find("input"), function (k, input) {
                        $(this).val(item[$(this).attr("name")]);
                    });
                });

                $('#seeInvoiceManagementPaySurChargeModal').modal('show');//现实模态框
            },
            error : function() {
                // hideMask();
                callAlert("查看详情失败")
            }
        });
        $('#seeInvoiceManagementPaySurChargeModal').modal('show');//现实模态框
    }
    //发票修改
    function modifyInvoiceManagementPay(){
        var selectedRowData = invoiceManagementPay_table.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录进行编辑！")
            return;
        }
        var flag=0;

        $.each(selectedRowData,function () {
            if(this.invoiceRegisterStatus!="已登记"){
                flag=1;
            }
        });
        if(flag==1){
            callAlert("发票未登记！")
            return;
        }
        var data = selectedRowData[0];
        $("#modifyInvoiceManagementPayTable tbody tr").remove();

        var loginCookie=JSON.parse($.cookie("loginingEmployee"));

        $("#modifyInvoiceManagementPayForm").find("input[type='submit']").val("确认");
        $("#modifyInvoiceManagementPayForm").find("input[name='invoiceRegisterManId']").val(loginCookie.user.userDetailId);
        $("#modifyInvoiceManagementPayForm").find("input[name='invoiceRegisterName']").val(loginCookie.user.username);
        $("#modifyInvoiceManagementPayForm").find("input[name='invoiceRegisterDate']").val( $.date.format(new Date(),"yyyy-MM-dd"));
        $("#modifyInvoiceManagementPayForm").prev('.modal-header').find('.modal-title').html("发票修改");
        modifyInvoiceManagementPaySurcharge();

        $('#modifyInvoiceManagementPayModal').modal('show');//现实模态框
        
    }

    //确定增加或者保存编辑
    function submitEditInvoiceManagementPayModal() {
        var data = $.extend($("#infoExDetail").serializeObject(),$("#infoExDetail1").serializeObject());

        data.invoiceManagementPay = [];
        $("#detailInvoiceManagementPayTable tbody").find("tr").each(function () {
            var detailDate=$(this).serializeObject();
            if(detailDate.invoiceType!=null&&detailDate.invoiceType!="") {
                data.invoiceManagementPay.push(detailDate);
            }
        });
        if(data.invoiceManagementPay.length==0){
            callAlert("无发票信息！")
            return;
        }
        var selectedRowData = invoiceManagementPay_table.rows('.selected').data();
        var ids=[];
        $.each(selectedRowData,function () {
            ids.push(this.payableReconcileId);
        });

        $.ajax({
            type : 'POST',
            url : getContextPath() + 'accountPayableReconcile/invoiceRegister.do',
            data : {
                accountPayableReconcile : JSON.stringify(data),
                payableReconcileIds:ids.join(",")
            },
            cache : false,
            dataType : "json",
            beforeSend : function() {
                showMask();//显示遮罩层
            },
            success : function(res) {
                hideMask();

                if (res.code == 0) {
                    callSuccess(res.message);

                    invoiceManagementPay_table.ajax.reload();
                } else
                    callAlert(res.message);

            },
            error : function() {
                hideMask();
                callAlert("登记失败");
            }
        });
        $('#editInvoiceManagementPayModal').modal('hide');//隐藏模态框
    }
    //确定修改
    function submitModifyInvoiceManagementPayModal() {
        var data = $.extend($("#infoExModify").serializeObject(),$("#infoExModify1").serializeObject());
        data.payableReconcileId = $('#modifyInvoiceManagementPayTable').attr('payablereconcileid');
        data.invoiceManagementPay = [];
        $("#modifyInvoiceManagementPayTable tbody").find("tr").each(function () {
            var detailDate=$(this).serializeObject();
            console.log(detailDate);
            detailDate.payableInvoiceId = $(this).attr('payableinvoiceid');
            if(detailDate.invoiceType!=null&&detailDate.invoiceType!="") {
                data.invoiceManagementPay.push(detailDate);
            }
        });
        
        

        $.ajax({
            type : 'POST',
            url : getContextPath() + 'accountPayableReconcile/updateInvoiceRegister.do',
            data : {
                accountPayableReconcile : JSON.stringify(data)
            },
            cache : false,
            dataType : "json",
            beforeSend : function() {
                showMask();//显示遮罩层
            },
            success : function(res) {
                hideMask();

                if (res.code == 0) {
                    callSuccess(res.message);

                    invoiceManagementPay_table.ajax.reload();
                } else
                    callAlert(res.message);

            },
            error : function() {
                hideMask();
                callAlert("登记失败");
            }
        });
        $('#modifyInvoiceManagementPayModal').modal('hide');//隐藏模态框
    }


    //发票查看2
    function seeInvoiceManagementPayDetail1() {
        var selectedRowData = invoiceManagementPay_table.rows(".selected").data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录进行查看！");
            return;
        }
        var data = invoiceManagementPay_table.rows(".selected").data()[0];
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
                $("#seeInvoiceManagementPaySurChargeTable tbody tr").remove();
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
                        + '<input type="text" name="payableInvoiceId">'
                        +'</div>' + '</td>' + '</tr>';
                    $("#seeInvoiceManagementPaySurChargeTable tbody").append(html);
                    // 循环赋值
                    $.each($("#seeInvoiceManagementPaySurChargeTable .surcharge").eq(i).find("input"), function (k, input) {
                        $(this).val(item[$(this).attr("name")]);
                    });
                });

                $('#seeInvoiceManagementPaySurChargeModal').modal('show');//现实模态框
            },
            error : function() {
                // hideMask();
                callAlert("查看详情失败")
            }
        });
        $('#seeInvoiceManagementPaySurChargeModal').modal('show');//现实模态框
    }

    //时间控件
    $(function() {
        //Date picker
        $('.invoiceManagementPay .startTime,.invoiceManagementPay .endTime').datepicker({
            autoclose : true,
            format : "yyyy-mm-dd"
        });
    });

    //搜索 datatable搜索
    function doSearch() {

        invoiceManagementPay_table.ajax.reload();

    }


    //新增一条发票
    function addInvoiceManagementPaySurcharge() {

        /*var payableReconcileId = $("#payableReconcileId").val();*/


        var html = '<tr class="surcharge">'
            + '<td style="width: 6%;">'
            + '<input type="checkbox" name="checkSurcharge">'
            + '</td>'
            + '<td style="width: 23.5%;">'
            + '<select name="invoiceType" class="form-control select2" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
            + '<option value=""></option>'
            + '<option>复印件</option>'
            + '<option>原票</option>'
            + '</select>'
            + '</td>'
            + '<td style="width: 23.5%;">'
            + '<input type="text" class="form-control" name="invoiceNumber" style="width:100%;height:30px;">'
            + '</td>'
            + '<td style="width: 23.5%;">'
            + '<select name="invoiceCurrency" class="form-control select2" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
            + '<option value=""></option>'
            + '<option>USD</option>'
            + '<option>RMB</option>'
            + '</select>'
            + '</td>'
            + '<td style="width: 23.5%;">'
            + '<input type="text" class="form-control" name="invoiceAmount" style="width:100%;height:30px;">'
            + '</td>'
            + '<td style="display: none">' +
            '<div class="form-group" hidden="true" style="display:none">'
            /*+ '<input type="text" name="payableReconcileId" value="'
            + payableReconcileId + '">'*/
            + '<input type="text" name="payableInvoiceId">'
            +'</div>' + '</td>' + '</tr>';

        $("#detailInvoiceManagementPayTable tbody").append(html);
    }
    //修改发票
    function modifyInvoiceManagementPaySurcharge(){
        var selectedRowData = invoiceManagementPay_table.rows('.selected').data();
        var payableReconcileId = selectedRowData[0].payableReconcileId;
        $.ajax({
            url:getContextPath() + 'accountPayableReconcile/invoiceRegisterDetail.do',
            type:'POST',
            data:{
                payableReconcileId:payableReconcileId
            },
            dataType:'json',
            async:false,
            success:function(res){
                var html = '';
                data = res.accountPayableInvoices;
                var length = data.length;
                $.each(data,function(index,item){
                    // console.log(item.invoiceType,item.invoiceCurrency);
                    html+= '<tr class="surcharge">'
                        + '<td style="width: 25%;">'
                        + '<select name="invoiceType" class="form-control select2" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
                        + '<option value=""></option>'
                        + '<option value="复印件">复印件</option>'
                        + '<option value="原票">原票</option>'
                        + '</select>'
                        + '</td>'
                        + '<td style="width: 25%;">'
                        + '<input type="text" value=" '+item.invoiceNumber+' " class="form-control" name="invoiceNumber" style="width:100%;height:30px;">'
                        + '</td>'
                        + '<td style="width: 25%;">'
                        + '<select name="invoiceCurrency" class="form-control select2" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
                        + '<option value=" "></option>'
                        + '<option>USD</option>'
                        + '<option>RMB</option>'
                        + '</select>'
                        + '</td>'
                        + '<td style="width: 25%;">'
                        + '<input type="text" value=" '+item.invoiceAmount+' " class="form-control" name="invoiceAmount" style="width:100%;height:30px;">'
                        + '</td>'
                        + '<td style="display: none">' +
                        '<div class="form-group" hidden="true" style="display:none">'
                        + '<input type="text" name="payableInvoiceId">'
                        + '<input type="text" name="exchange_operate" value="update">'
                        +'</div>' + '</td>' + '</tr>';

                });
                $("#modifyInvoiceManagementPayTable tbody").append(html);

                for (var i=0;i<length;i++) {
                    // 发票类型赋值
                    $.each($("#modifyInvoiceManagementPayTable select[name='invoiceType']").eq(i), function () {
                        $(this).val(data[i].invoiceType);
                    });
                    // 币种赋值
                    $.each($("#modifyInvoiceManagementPayTable select[name='invoiceCurrency']").eq(i), function () {
                        $(this).val(data[i].invoiceCurrency);
                    });

                    $.each($("#modifyInvoiceManagementPayTable tr").eq(i), function () {
                        // $(this).val(data[i].payableInvoiceId);
                        $(this).attr('payableInvoiceId',data[i].payableInvoiceId);
                    });
                    
                }
                // console.log(data);
                // var payableReconcileId = data[0].payableReconcileId;
                $('#modifyInvoiceManagementPayTable').attr('payableReconcileId',data[0].payableReconcileId);
                
            },
            error:function(){
                callAlert('error');
            }

        });
    }
    //选中一条发票
    $("#modifyInvoiceManagementPayTable tbody").on("click","tr input,tr select",function(event){
        event.stopPropagation();
    })
    $("#modifyInvoiceManagementPayTable tbody").on("click","tr",function(event){
        $(this).toggleClass("selected");
        event.stopPropagation();
    })
    //新增一条发票
    function modifyInvoiceManagementPayTableInsert(){
        var html= '<tr class="surcharge" payableinvoiceid="">'
            + '<td style="width: 25%;">'
            + '<select name="invoiceType" class="form-control select2" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
            + '<option value=""></option>'
            + '<option value="复印件">复印件</option>'
            + '<option value="原票">原票</option>'
            + '</select>'
            + '</td>'
            + '<td style="width: 25%;">'
            + '<input type="text" class="form-control" name="invoiceNumber" style="width:100%;height:30px;">'
            + '</td>'
            + '<td style="width: 25%;">'
            + '<select name="invoiceCurrency" class="form-control select2" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
            + '<option value=" "></option>'
            + '<option>USD</option>'
            + '<option>RMB</option>'
            + '</select>'
            + '</td>'
            + '<td style="width: 25%;">'
            + '<input type="text" class="form-control" name="invoiceAmount" style="width:100%;height:30px;">'
            + '</td>'
            + '<td style="display: none">' +
            '<div class="form-group" hidden="true" style="display:none">'
            + '<input type="text" name="payableInvoiceId">'
            + '<input type="text" name="exchange_operate" value="insert">'
            +'</div>' + '</td>' + '</tr>';
        $("#modifyInvoiceManagementPayTable tbody").append(html);
    }
    //删除发票
    function modifyInvoiceManagementPayTableDelete(){
        $("#modifyInvoiceManagementPayTable tbody tr.selected").each(function(){
            if($(this).attr("payableinvoiceid")==""||$(this).attr("payableinvoiceid")==undefined){
                $(this).remove();
            }else{
                $(this).hide();
                $(this).find("input[name=exchange_operate]").val("delete");
            }
        })
    }




    //删除一条发票
    function deleteInvoiceManagementPaySurcharge() {
        $("#detailInvoiceManagementPayTable input[name='checkSurcharge']:checked").each(function () {
            $(this).parent().parent().remove();
        });
    }
    //发票全选/全不选
    $(".checkAllSurcharge").on('click',function () {
        var check = $(this).prop("checked");
        if(check){
            $("#detailInvoiceManagementPayTable input[name='checkSurcharge']").each(function () {
                $(this).prop('checked',true);
            });
        }else{
            $("#detailInvoiceManagementPayTable input[name='checkSurcharge']").each(function () {
                $(this).prop('checked',false);
            });
        }
    });


    $('.notLastModal').on('hide.bs.modal', function() {
        $('.modal').css("overflow","scroll");
    });

    //多选框连续选择
    $("#editInvoiceManagementPayForm  select[name='transportFrequency']").select2({
        closeOnSelect: false
    });




    function seeReconcileDetail(but) {
        // $(but).parents("tr").addClass('selected');
        var thiss=$(but).parents("tr");
        invoiceManagementPay_table.row( thiss ).select();
        $(but).parents("tr").find('td:first-child').addClass('selected');
        $(but).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);

        var data = invoiceManagementPay_table.rows(".selected").data()[0];
        // 循环赋值
        $.each($("#detailsInvoiceManagementPayForm").find("input","textarea"), function (k, input) {
            $(this).val(data[$(this).attr("name")]);
        });
        $('#detailsInvoiceManagementPaySearch input[name="reconcileConfirmStatus"]').val("已确认");

        detailsInvoiceManagementPay_table=$('#detailsInvoiceManagementPayTable').DataTable({
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
            dom:'<"top">rt<"bottom"flip><"clear">',
            ajax: {
                "type": "POST",
                // url: '../mock_data/payableAccount.json',

                "url": getContextPath() + 'accountPayableReconcile/listForReconcileDetail.do',
                "async": false,
                "data": function (d) {
                    search_data = $('#detailsInvoiceManagementPaySearch').serializeObject();
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
                /*{
                 "sClass": "text-center",
                 "data": "payableReconcileId",
                 "title": "<input type='checkbox' class='checkall' />",
                 "render": function (data, type, full, meta) {
                 return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                 },
                 "bSortable": false

                 },*/

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

        $('#detailsInvoiceManagementPayModal').modal('show');

    }
    return {
        // 将供页面该方法调用
        addInvoiceManagementPay : addInvoiceManagementPay,
        doSearch : doSearch,
        seeInvoiceManagementPayDetail:seeInvoiceManagementPayDetail,
        addInvoiceManagementPaySurcharge : addInvoiceManagementPaySurcharge,
        modifyInvoiceManagementPay : modifyInvoiceManagementPay,
        submitEditInvoiceManagementPayModal:submitEditInvoiceManagementPayModal,
        submitModifyInvoiceManagementPayModal:submitModifyInvoiceManagementPayModal,
        deleteInvoiceManagementPaySurcharge:deleteInvoiceManagementPaySurcharge,
        seeInvoiceManagementPayDetail1:seeInvoiceManagementPayDetail1,
        seeReconcileDetail:seeReconcileDetail,
        modifyInvoiceManagementPayTableInsert:modifyInvoiceManagementPayTableInsert,
        modifyInvoiceManagementPayTableDelete:modifyInvoiceManagementPayTableDelete
    };

})();