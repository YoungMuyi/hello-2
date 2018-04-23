//@ sourceURL=receivableWriteOff.js
// $('#lxy_basicdata_tb').DataTable().empty();
//标题行
var receivableWriteOff = (function(){

    $(function () {
        //Initialize Select2 Elements，初始化银行下拉框架
        $(".select2").select2();
        resizeL();
        //解决select2 在弹出框中不能搜索的问题
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };

        $("#writeOffInsertUpdateForm").validate({
            rules : {
                customerCode : {
                    required : true

                },
                contactCompany : {
                    required : true

                },
                receiveCompany : {
                    required : true

                },
                payMethod : {
                    required : true

                },
                receiveBank:{
                    required : true

                },
                receiveAccount:{
                    required : true

                },
                receiveAmount:{
                    required : true

                },
                payBank: {
                    required:true
                }

            },
            errorPlacement : function() {
                return false;
            }
        })

        // writeOffInsertSelect('customerCode','saleCustomer/listAllCustomers.do',null);
        writeOffInsertSelect('payMethod','accountPayable/listPayMethod.do',null);
        writeOffInsertSelect('receiveBank','basedataBank/listAllBank.do',null);

        initSelect2FromRedis("receivableWriteOffSendModalForm","objectionSelectCompany", "organization/listCompanyIdAndName.do", "{}", "objectionSelectCompany", "objectionSelectCompany");

        //Date picker
        $('.beginDate,.endDate').datepicker({
            autoclose: true,
            language:"zh-CN",//语言设置
            format: "yyyy-mm-dd"
        });

    });

    var receivableWriteOff_tb;
    var writeOffDetail_tb2;
    var writeOffDetail_tb;
    var receivableClient_table;
    var rate = 0.0; //汇率

    var paral={
        "writeOffStatus":"状态",
        "financialNumber":"财务编号",
        "customerCode":"客户代码",
        "contactCompany":"往来单位",
        "payCompany":"付款单位",
        "payBank":"付款银行",
        "payMethod":"付款方式",
        "receiveBank":"收款银行",
        "receiveAccount":"收款账户",
        "receiveCurrency":"收款币种",
        "receiveAmount":"收款金额",
        "receiveDate":"收款时间",
        "writeOffMethod":"核销方式",
        "writeOffDetail":"核销详情",
        "billingDate":"核销详情",
        "writeOffDate":"核销时间",
        "writeOffBalance":"核销余额"
    };
    Init();
    // 初始化
    function Init() {

        receivableWriteOff_tb =  $("#receivableWriteOffTable").DataTable( {
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
                "url" : getContextPath()+'accountReceivableWriteOff/listByPage.do',
                "data": function(d){
					//alert(JSON.stringify($('#searchForm').serializeObject()));
                    search_data = ($('#searchReceivableWriteOffForm').serializeObject());
                    var k = {};
                    for (var key in search_data) {
                        if (search_data[key] == "" || search_data[key] == null) {

                        } else {
                            k[key] = search_data[key];
                        }
                    }
                    // console.log(k);
                    k = JSON.stringify(k);
                    d.keys = k;
                },
                "dataSrc": function (data) {
                    //在该方法中可以对服务器端返回的数据进行处理
                    for(var i=0;i<data.aaData.length;i++){
                        if(data.aaData[i].amendTime != '' || data.aaData[i].amendTime == undefined){
                            data.aaData[i].amendTime = $.date.format(new Date(data.aaData[i].amendTime),"yyyy-MM-dd");
                        }
                        if(data.aaData[i].createTime != '' || data.aaData[i].createTime == undefined){
                            data.aaData[i].createTime = $.date.format(new Date(data.aaData[i].createTime),"yyyy-MM-dd");
                        }
                    }
                    return data.aaData;
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
                    "data": "receivableWriteOffId",
                    "title":"<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';

                    },
                    "Sortable": false

                },
                { title: "状态",data:"writeOffStatus" },
                { title: "财务编号", data:"financialNumber"},
                { title: "客户代码",data:"customerCode" },
                { title: "往来单位",data:"contactCompany" },
                { title: "付款单位",data:"payCompany" },

                { title: "付款银行",data:"payBank" },
                { title: "付款方式",data:"payMethod" },
                { title: "收款银行",data:"receiveBank" },
                { title: "收款账户",data:"receiveAccount" },
                { title: "账户类型",data:"receiveAccountType" },
                { title: "收款单位",data:"receiveCompany" },
                { title: "收款币种",data:"receiveCurrency" },
                { title: "收款金额",data:"receiveAmount" },
                { title: "收款时间",data:"receiveDate" },
                { title: "核销方式",data:"writeOffMethod" },
                {
                    title:"核销详情",
                    data:"writeOffStatus",
                    "render": function (data, type, full, meta) {
                        if (data == "已核销" || data == "部分核销") {
                            return '<a class="writeOffDetail" style="cursor: pointer" onclick="receivableWriteOff.seeWriteOffDetail(this)">详情</a>'
                        } else {
                            return null;
                        }
                    }
                },
                { title: "核销时间",data:"writeOffDate" },
                { title: "核销余额",data:"writeOffBalance" }

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
                    targets: [1,2,3,4,5,6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,17,18]
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


    //重置主页面查询条件
    $('#resetSearchReceivableWriteOffForm').click(function () {
        $("#searchReceivableWriteOffForm")[0].reset();
        $("#searchReceivableWriteOffForm .select2-selection_rendered").attr("title", "").text("");
        emptySelect2Value('searchReceivableWriteOffForm', 'writeOffStatus');
        emptySelect2Value('searchReceivableWriteOffForm', 'receiveCompany');
        receivableWriteOff_tb.ajax.reload();
    });

    //重置模态框中查询条件
    $("#searchModalReset").click(function () {
        $("#RWriteOffsearchModalForm input[name = 'currencyExpense']").val("");
        $("#RWriteOffsearchModalForm input[name = 'salesmanName']").val("");
        // writeOffDetail_tb.ajax.reload();
    });
    $("#resetClient").click(function () {
        $("#receivableClientDetailForm input[name = 'customerCode']").val("");
        $("#receivableClientDetailForm input[name = 'customerNameCn']").val("");
        // writeOffDetail_tb.ajax.reload();
        receivableClient_table.ajax.reload();
    });


    $('body').on('click', '.receivableWriteOffTableClass .checkall', function () {
        allSelection("receivableWriteOffTableClass","receivableWriteOffTable",receivableWriteOff_tb,this);
    });

    $('#receivableWriteOffTable tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        // console.log(table.rows('.selected').data().length);
    });


    //监听分页事件,去除复选
    $('#receivableWriteOffTable').on( 'page.dt', function () {
        $(".checkall").prop("checked",false);
    } );

    $('#receivableWriteOffTable').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );


    //监听分页事件,去除复选
    $('#clientTable').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#clientTable').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    /**
     * 核销详情的全选
     */
    $('body').on('click' , '.receivableWriteOff .checkall2' , function(){

        var check = $(this).prop("checked");
        $(".receivableWriteOff .checkchild2").prop("checked", check);
        //通过调用datatables的select事件来触发选中
        $("#writeOffDetailTable tbody tr").each(function () {
            if (check){
                // 点击选中
                writeOffDetail_tb.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                // 点击取消
                writeOffDetail_tb.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

    });




    /**
     * 发送按钮
     */
    function writeOffSend() {
        emptyAddForm('receivableWriteOffSendModalForm');
        var selectedRowData = receivableWriteOff_tb.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录！");
            return;
        }
        var data = selectedRowData[0];
        console.log(data);
        if (data["writeOffStatus"] != "未核销"&&data["writeOffStatus"] != "已发送") {
            callAlert("请选择一条未核销或已发送的记录进行发送");
            return;
        }
        $("#receivableWriteOffSendModalForm input[name = 'receivableWriteOffId']").val(data['receivableWriteOffId']);
        $("#receivableWriteOffSendModalForm input[name = 'customerCode']").val(data["customerCode"]);
        $("#receivableWriteOffSendModalForm input[name = 'contactCompany']").val(data["contactCompany"]);
        $("#receivableWriteOffSendModalForm input[name = 'payCompany']").val(data["payCompany"]);
        $("#receivableWriteOffSendModalForm input[name = 'payBank']").val(data["payBank"]);
        $("#receivableWriteOffSendModalForm input[name = 'receiveBank']").val(data["receiveBank"]);
        $("#receivableWriteOffSendModalForm input[name = 'receiveAccount']").val(data["receiveAccount"]);
        $("#receivableWriteOffSendModalForm input[name = 'receiveCurrency']").val(data["receiveCurrency"]);
        $("#receivableWriteOffSendModalForm input[name = 'receiveAmount']").val(data["receiveAmount"]);
        $("#receivableWriteOffSendModalForm input[name = 'receiveDate']").val(data["receiveDate"]);

        var objectionSelectCompany=$("#receivableWriteOffSendModal select[name=objectionSelectCompany]").val();
        //initSelect2FromAccount1("receivableWriteOffSendModalForm","objectionSelect", "organization/listCompanyIdAndName.do", objectionSelectCompany, "", "");
        $('#receivableWriteOffSendModal').modal('show');

    }


    /**
     * 核销余额计算
     * @param amount
     */
    // function calWriteOffBalance(amount) {
    //     var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val();
    //     if (total < amount) {
    //         callAlert("余额不足，请重新输入！");
    //         return;
    //     }
    //     $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((total - amount).toFixed(2));
    // }

    /**
     * 保留两位小数
     * @param x
     * @returns {*}
     */
    function toDecimal2(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    }


    /**
     * 核销按钮
     */
    function billingsWriteOff() {
        emptyAddForm("billingsWriteOffModalForm1");
        emptyAddForm("billingsWriteOffModalForm2");
        emptyAddForm("RWriteOffsearchModalForm");
        var selectedRowData = receivableWriteOff_tb.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录！");
            return;
        }
        var data = selectedRowData[0];
        if (data["writeOffStatus"] != "未核销" && data["writeOffStatus"] != "部分核销") {
            callAlert("请选择未核销或部分核销的记录进行核销");
            return;
        }
        $("#buttonWriteOff").css("display","block");
        $("#buttonClaim").css("display","none");
        $('#claim').hide();
        $('#writeOff').css("display","block");
        data["receiveAmount"] = toDecimal2(data["receiveAmount"]);
        if (data["writeOffBalance"] == null || data["writeOffBalance"] == 0) {
            data["writeOffBalance"] = data["receiveAmount"];
        }
        data["writeOffBalance"] = toDecimal2(data["writeOffBalance"]);
        // data["writeOffBalance"].toFixed(2);
        // 循环给表单赋值
        $.each($("#billingsWriteOffModalForm1 input"), function (i, input) {

            $(this).val(data[$(this).attr("name")]);

        });
        if(data["payMethod"]=="承兑"){
            $("#billingsWriteOffModalForm1 input[name=writeOffMethod]").val("预销");
        }else {
            $("#billingsWriteOffModalForm1 input[name=writeOffMethod]").val("现销");
        }
        $("#billingsWriteOffModalForm2 input[name = 'writeOffDate']").val($.date.format(new Date(), "yyyy-MM-dd"));
        //核销余额更新
        var amount = data["writeOffBalance"];
        var rate;
        $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val(amount);


        //月汇率计算
       // var exchangeRate = data["receiveDate"];
        var exchangeRate=$("#billingsWriteOffModalForm2 input[name='writeOffDate']").val()
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountExchangeRate/getRateByDate.do',
            data: {
                exchangeRate:exchangeRate
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
                $("#billingsWriteOffModalForm1 input[name = 'rate']").val(res);
                rate = parseFloat(res);
            },
            error: function () {
                callAlert("查看失败");
            }
        });
        /**
         * 加载核销详情
         * @type {jQuery}
         */
        $("#RWriteOffsearchModalForm input[name = 'customerCode']").val(data['customerCode']);
        $("#writeOffDetailTableParent").html('<table id="writeOffDetailTable" class="table table-bordered table-striped" style="width: 100%;"></table>');
        writeOffDetail_tb=$("#writeOffDetailTable").DataTable({
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
            paging:false,
            bInfo:false,
            ajax: {
                "type": "POST",
                "url": getContextPath() + 'accountReceivableWriteOff/detailOfWriteOff.do',
                "data": function(d){
                    //返回未核销状态的数据
                    // var statusList = new Array('未核销','部分核销');
                    // console.log(statusList);
                    // $("#RWriteOffsearchModalForm input[name = 'writeOffStatusList']").val(statusList);
                    search_data = ($('#RWriteOffsearchModalForm').serializeObject());
                    
                    var k = {};
                    k.receiveCurrency = $('#receivableWriteOffTable tbody tr.selected').find('td').eq(12).html();
                    for (var key in search_data) {
                        if (search_data[key] == "" || search_data[key] == null) {

                        } else {
                            k[key] = search_data[key];
                        }
                    }
                    k.writeOffStatusList = new Array('未核销','部分核销');

                    k = JSON.stringify(k);
                    d.keys = k;
                    // console.log(k);
                },
                "dataSrc": function ( data ) {
                    //在该方法中可以对服务器端返回的数据进行处理。
                    for(var i=0; i<data.aaData.length; i++) {
                        var xxx = 1;
                        if (data['aaData'][i]['currencyExpense'] != $("#billingsWriteOffModalForm1 input[name = 'receiveCurrency']").val()) {
                            xxx = rate;
                        }
                        data['aaData'][i]['writeOffRate'] = xxx;
                        data['aaData'][i]['writeOffCurrency'] = $("#billingsWriteOffModalForm1 input[name = 'receiveCurrency']").val();
                    }
                    

                    return data.aaData;

                     // console.log(data);
                },
                error: function (xhr, error, thrown) {
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
                    "Class": "text-center",
                    "title":"<input type='checkbox' class='checkall2' onclick='receivableWriteOff.xx(this)'/>",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild2"  value="" onclick="receivableWriteOff.xx(this)" />';

                    },
                    "Sortable": false

                },
                {title: "业务编号", data: "accountBusinessTotal.businessCode"},
                {title: "提单号", data: "accountBusinessTotal.billLadingNo"},
                {title: "应收日期", data: "accountBusinessTotal.sailingDate"},
                {title: "费用名称", data: "expenseName"},
                {title: "发票号", data: "accountReceivableInvoice.invoiceNumber"},
                {title: "应收币种", data: "currencyExpense"},
                {title: "应收金额", data: "amountExpense"},
                {title: "开票日期", data: "accountReceivableInvoice.billingDate"},
                {title: "业务员", data: "accountBusinessTotal.salesmanName"},
                {title: "汇率", data: "writeOffRate"},
                {title: "核销币种", data: "writeOffCurrency"},
                // {title: "余额",data:"balance"},
                {   
                    "Class": "text-center",
                    "title": "余额",
                    "render": function (data, type, full, meta) {
                        var amountExpense = full.amountExpense;
                        var writeOffRate = full.writeOffRate;
                        var writeOffAmount = full.writeOffAmount;

                        var receiveCurrency = $('#billingsWriteOffModalForm1 input[name="receiveCurrency"]').val();
                        

                        if(receiveCurrency == 'RMB'){//RMB
                            return amountExpense*writeOffRate-writeOffAmount;
                        }else{
                            return amountExpense/writeOffRate-writeOffAmount;
                        }



                        
                        
                    }
                },
                {
                    "Class": "text-center",
                    "title": "核销金额",
                    "data":"amountExpense",
                    "render": function (data, type, full, meta) {
                        var amountExpense = full.amountExpense;
                        var writeOffRate = full.writeOffRate;
                        var writeOffAmount = full.writeOffAmount;

                        var receiveCurrency = $('#billingsWriteOffModalForm1 input[name="receiveCurrency"]').val();
                        if(receiveCurrency == 'RMB'){//RMB
                            var hxje = (amountExpense-writeOffAmount)*writeOffRate;  
                        }else{
                            var hxje = (amountExpense-writeOffAmount)/writeOffRate; 
                        }
                        return '<input type="text" class="writeOffAmount" name="currentWriteOff" style="width: 50px" oninput="receivableWriteOff.yue(this)" onblur="receivableWriteOff.calAmount(this, 1)" value="'+ hxje +'"/>';

                    }

                },
                {
                    "Class": "text-center",
                    "title": "备注",
                    "render": function (data, type, full, meta) {
                        return '<input type="text" name="remark" style="width: 100px"/>';

                    }

                },
                {title: "创建时间", data: "createTime","visible": false}
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
                    targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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
                selector: 'td:first-child input'//选中效果仅对第一列有效
                // info: false
            }
        });
        //自动装入核销人员
        var loginCookie=JSON.parse($.cookie("loginingEmployee"));
        $("#billingsWriteOffModalForm2 input[name = 'writeOffStaffName']").val(loginCookie['employee']['employeeName']);
        $("#billingsWriteOffModalForm1 input[name = writeOffStaffId]").val(loginCookie["user"]["userDetailId"]);

        $("#billingsWriteOffModalTitle").html("财务核销");
        //核销余额
        var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val();
        $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").attr('total',total);


        $('#billingsWriteOffModal').modal('show');
        $('.modal').css("overflow","scroll");


    }

    /**
     * 合计金额计算
     */
    
    function xx(s) {

        var sss=$(s).parents('tr')
        //console.log("sssss"+s)
        var check = $(sss).hasClass("selected");
        if(check){
            // 点击取消
            $(sss).removeClass("selected");
            $(s).prop('checked',false);
            $(sss).find('td').removeClass("selected");

        }else{  
            // 点击选中
            $(sss).addClass("selected");
            $(s).prop('checked',true);

        }
        
        // 全选
        if($(s).hasClass("checkall2")){
            // 选中
            if($(s).is(":checked")){
                amount = 0.00;            
                var ss = $("#billingsWriteOffModalTitle").html();
                // 反核销
                if(ss == '反核销'){
                    $("#writeOffDetailTable tr input[name = writeOffAmount]").each(function(index,item){
                        if ($(this).val() == "") {
                            amount = amount
                        } else {
                            amount = amount + parseFloat($(this).val());

                        }
                    });
                    var t =parseFloat($("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").attr('total'));
                    $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((t + amount).toFixed(2));     
                }else{
                    $("#writeOffDetailTable tr input[name = currentWriteOff]").each(function (index, item) {
                        if ($(this).val() == "") {
                            amount = amount
                        } else {
                            amount = amount + parseFloat($(this).val());

                        }}
                    );
                    var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val();
                    $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((total - amount).toFixed(2)); 
                }


                // 应收合计
                var needAmount = 0.0;
                if(ss == '反核销'){
                    $('#writeOffDetailTable>tbody').find('tr').each(function(index,value){
                        var detailData = $(this).serializeObject();
                        if($(this).find("td:nth-child(13)").html() != null) {
                            needAmount+= parseFloat($(this).find("td:nth-child(13)").find('input').val());    
                        }                       
                                                        
                    });
                }else{
                    $('#writeOffDetailTable>tbody').find('tr').each(function(index,value){
                        var detailData = $(this).serializeObject();
                        if($(this).find("td:nth-child(14)").html() != null) {
                            needAmount+= parseFloat($(this).find("td:nth-child(14)").find('input').val());    
                        }                       
                                                        
                    });
                }                     
                $("#billingsWriteOffModalForm2 input[name = 'receivableSum']").val(needAmount);

        
            }else{ //没选中
                // 核销余额
                amount = 0.00;
                var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val();
                $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((total - amount).toFixed(2));
                // 应收合计
                var needAmount = 0.0;
                $("#billingsWriteOffModalForm2 input[name = 'receivableSum']").val(needAmount);

            }
            
        }else{ //不全选
            // 选择计算余额
            if($("#writeOffDetailTable>tbody>tr").hasClass('selected')){
                amount = 0.00;            
                var ss = $("#billingsWriteOffModalTitle").html();
                // 反核销
                if(ss == '反核销'){
                    $("#writeOffDetailTable tr.selected input[name = writeOffAmount]").each(function(index,item){
                        if ($(this).val() == "") {
                            amount = amount
                        } else {
                            amount = amount + parseFloat($(this).val());

                        }
                    });
                    var t =parseFloat($("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").attr('total'));
                    $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((t + amount).toFixed(2));     
                }else{
                    $("#writeOffDetailTable tr.selected input[name = currentWriteOff]").each(function (index, item) {
                        if ($(this).val() == "") {
                            amount = amount
                        } else {
                            amount = amount + parseFloat($(this).val());

                        }}
                    );
                    var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val();
                    $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((total - amount).toFixed(2)); 
                }
            }else{
                amount = 0.00;
                var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val();
                $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((total - amount).toFixed(2));  
            }

            // 应收合计
            var selectedRowData = writeOffDetail_tb.rows('.selected').data();
            var needAmount = 0.0;
            console.log(selectedRowData);
                if (selectedRowData.length < 1) {
                    // 点击选中       
                    console.log(needAmount);     
                    $("#billingsWriteOffModalForm2 input[name = 'receivableSum']").val(needAmount);
                    return;
                }else{
                    // 点击取消
                    // for (var i = 0; i < selectedRowData.length; i++) {
                    //     if (selectedRowData[i].amountExpense != null && selectedRowData[i].amountExpense != 0) {
                    //         needAmount += selectedRowData[i].amountExpense;
                    //     }
                    // }
                    var ss = $("#billingsWriteOffModalTitle").html();
                    if(ss == '反核销'){
                        $('#writeOffDetailTable>tbody').find('tr.selected').each(function(index,value){
                            var detailData = $(this).serializeObject();
                            if($(this).find("td:nth-child(13)").html() != null) {
                                needAmount+= parseFloat($(this).find("td:nth-child(13)").find('input').val());    
                            }                       
                                                    
                        });
                    }else{
                        $('#writeOffDetailTable>tbody').find('tr.selected').each(function(index,value){
                            var detailData = $(this).serializeObject();
                            if($(this).find("td:nth-child(14)").html() != null) {
                                needAmount+= parseFloat($(this).find("td:nth-child(14)").find('input').val());    
                            }                       
                                                    
                        });
                    }
                    
                    console.log(needAmount);     
                    
                    $("#billingsWriteOffModalForm2 input[name = 'receivableSum']").val(needAmount);
                }

        }
        

        


        // if (selectedRowData.length < 1) {
        //     // 点击选中
        //     console.log(selectedRowData.length);
        //     $("#billingsWriteOffModalForm2 input[name = 'receivableSum']").val(needAmount);
        //     return;
        // }
        // for (var i = 0; i < selectedRowData.length; i++) {
        //     if (selectedRowData[i].amountExpense != null && selectedRowData[i].amountExpense != 0) {
        //         needAmount += selectedRowData[i].amountExpense;
        //     }
        // }
        // $("#billingsWriteOffModalForm2 input[name = 'receivableSum']").val(needAmount);
        
        
        // event.preventDefault();
    }

    // 输入框 核销余额计算
    function yue(x){
        amount = 0.00;
        $("#writeOffDetailTable tr.selected input[name = currentWriteOff]").each(function (index, item) {


            if ($(this).val() == "") {
                amount = amount
            } else {
                amount = amount + parseFloat($(this).val())

            }}
        );
        var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val();
        $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((total - amount).toFixed(2)); 

        // 应收合计
        var selectedRowData = writeOffDetail_tb.rows('.selected').data();
            var needAmount = 0.0;

            if (selectedRowData.length < 1) {
                // 点击选中            
                $("#billingsWriteOffModalForm2 input[name = 'receivableSum']").val(needAmount);
                return;
            }else{
                // 点击取消
                // for (var i = 0; i < selectedRowData.length; i++) {
                //     if (selectedRowData[i].amountExpense != null && selectedRowData[i].amountExpense != 0) {
                //         needAmount += selectedRowData[i].amountExpense;
                //     }
                // }
                $('#writeOffDetailTable>tbody').find('tr.selected').each(function(index,value){
                    var detailData = $(this).serializeObject();
                    if($(this).find("td:nth-child(14)").html() != null) {
                        needAmount+= parseFloat($(this).find("td:nth-child(14)").find('input').val());    
                    }                       
                    
                    
                });
                $("#billingsWriteOffModalForm2 input[name = 'receivableSum']").val(needAmount);
            }      
    }
    // 选择计算余额
    // setInterval(function(){
    //     if($("#writeOffDetailTable>tbody>tr").hasClass('selected')){
    //         amount = 0.00;
    //         $("#writeOffDetailTable tr.selected input[name = currentWriteOff]").each(function (index, item) {
    //             if ($(this).val() == "") {
    //                 amount = amount
    //             } else {
    //                 amount = amount + parseFloat($(this).val())

    //             }}
    //         );
    //         var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val();
    //         $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((total - amount).toFixed(2));     

    //         // 反核销
    //         var total=0;
    //         $("#writeOffDetailTable tr.selected input[name = writeOffAmount]").each(function(index,item){
    //             total+=parseInt($(this).val());
    //         });
    //         console.log(total);
    //         $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val(total);     

    //     }else{
    //         amount = 0.00;
    //         var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val();
    //         $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((total - amount).toFixed(2));  
    //     }
    // },500);
    
    

    /**
     * 计算核销后的余额
     * @param x
     * @param y
     */
    function calAmount(x, y) {
        var amount = 0.00;
        // //获得该条数据的应收金额和汇率
        amount = parseFloat($(x).parents('tr').find('td:nth-child(8)').html());
        rate = parseFloat($(x).parents('tr').find('td:nth-child(11)').html());
        
        if (rate != 1 && rate != null) {
            if ($("#billingsWriteOffModalForm1 input[name = 'receiveCurrency']").val() == "USD") {
                rate = 1.0 / rate;
            }
        }

        // if (y == 1) {
        //     if ($(x).val() != amount * rate&&$(x).val() != 0&&$(x).val() != "") {
        //         var needAmount = Math.round(amount * rate * 100) / 100;
        //         callAlert("核销金额需等于汇率转换后的应收金额！");
        //         $(x).val(needAmount);
        //     }
        // } else if (y == 2) {
        //     if ($(x).val() != 0&&$(x).val() != "") {
        //         $(x).val("");
        //         return
        //     }
        // }
        // amount = 0.00;
        // $("#writeOffDetailTable input[name = currentWriteOff]").each(function (index, item) {


        //     if ($(this).val() == "") {
        //         amount = amount
        //     } else {
        //         amount = amount + parseFloat($(this).val())

        //     }}
        // );
        // var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val();
        // // if (total < amount) {
        // //     callAlert("核销余额不足，请重新输入！");
        // //     $(x).val("");
        // //     return;
        // // }

        // $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((total - amount).toFixed(2));

    }


    /**
     * 财务核销模态框保存按钮
     */
    function confirmWriteOff() {
        var url;
        var data;
        if ($("#billingsWriteOffModalTitle").html() == "财务核销" ) {
            data = $.extend($("#billingsWriteOffModalForm1").serializeObject(), $("#writeOff").serializeObject());
            url="accountReceivableWriteOff/updateDetail.do";
        } else if ($("#billingsWriteOffModalTitle").html() == "反核销") {
            data = $.extend($("#billingsWriteOffModalForm1").serializeObject(), $("#writeOff").serializeObject());
            data.writeOffType = 1;
            url="accountReceivableWriteOff/reWriteOff.do";
        } else if ($("#billingsWriteOffModalTitle").html() == "认领确认") {
            data = $.extend($("#billingsWriteOffModalForm1").serializeObject(), $("#claim").serializeObject());
            url="accountReceivableWriteOff/updateDetail.do";
        } else {
            callAlert("error!");
            return
        }
        var selectedData = writeOffDetail_tb.rows().data();
        if (selectedData.length == 0) {
            callAlert("无需核销记录！");
            return;
        }
        // 核销余额验证
        $('#writeOffDetailTable').find('tr.selected').each(function(index,value){
            // var amount = 0.00;
            //获得该条数据的应收金额和汇率
            var amount = parseFloat($(this).find('td:nth-child(8)').html());
            var rate = parseFloat($(this).find('td:nth-child(11)').html());
            
            if (rate != 1 && rate != null) {
                if ($("#billingsWriteOffModalForm1 input[name = 'receiveCurrency']").val() == "USD") {
                    rate = 1.0 / rate;
                }
            }
            // var $he = $(this).find('[name="currentWriteOff"]');
            // if($he.val() != amount*rate&&$he.val() != 0&&$he.val() != ""){
            //     var needAmount = Math.round(amount * rate * 100) / 100;
            //     callAlert("核销金额需等于汇率转换后的应收金额！");
            //     $he.val(needAmount);
            // }
            
            // $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val((total - amount).toFixed(2));

        });
        

        var i = 0;
        data.writeOffDetails = [];

        // $("#writeOffDetailTable tbody").find("tr").each(function () {
        //     var detailData = $(this).serializeObject();
        //     if ($(this).find("td:nth-child(11)").html() != null) {
        //         detailData.writeOffRate = $(this).find("td:nth-child(11)").html();
        //     }
        //     if ($(this).find("td:nth-child(12)").html() != null) {
        //         detailData.writeOffCurrency = $(this).find("td:nth-child(12)").html();
        //     }
        //     detailData.createTime = selectedData[i]['createTime'];
        //     detailData.expenseId = selectedData[i]['expenseId'];
        //     i += 1;
        //     data.writeOffDetails.push(detailData);
        // });
        
        $('#writeOffDetailTable>tbody').find('tr.selected').each(function(index,value){
            var detailData = $(this).serializeObject();
            // console.log(index,value);
            if ($(this).find("td:nth-child(11)").html() != null) {
                detailData.writeOffRate = $(this).find("td:nth-child(11)").html();
            } //汇率
            if ($(this).find("td:nth-child(12)").html() != null) {
                detailData.writeOffCurrency = $(this).find("td:nth-child(12)").html();
            }       //核销币种
            if($(this).find("td:nth-child(13)").html() != null) {
                detailData.balance = $(this).find("td:nth-child(13)").html();    
            }   


            var selectedData = writeOffDetail_tb.rows('.selected').data();
            // console.log(selectedData);
            detailData.createTime = selectedData[i]['createTime'];
            detailData.expenseId = selectedData[i]['expenseId'];
            i += 1;
            // console.log(i);
            // console.log(detailData);
            data.writeOffDetails.push(detailData);
            
            
            
        });


        var total = parseFloat($("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val());
        var amount = 0.00;
            $('#writeOffDetailTable>tbody').find('tr.selected').each(function(index,value){
                if($(this).find('[name="currentWriteOff"]').val() == ''){
                    amount += 0.00;
                }else{
                    amount += parseFloat($(this).find('[name="currentWriteOff"]').val());
                    // console.log(amount);
                }
            });
                    
        console.log(total,amount);
        if (total < amount) {
            callAlert("核销余额不足，请重新输入！");

            $('#writeOffDetailTable>tbody').find('tr.selected').find('[name="currentWriteOff"]').val("");
            return;
        }else{
            console.log(data);
            //传输数据
            $.ajax({
                url: getContextPath() + url,
                type: 'POST',
                data:{
                    receivableWriteOff: JSON.stringify(data)
                },
                dataType: 'json',
                async: false,
                success: function (res) {

                    if(res.code ==0){
                        callSuccess(res.message);
                        receivableWriteOff_tb.ajax.reload();
                        $('#billingsWriteOffModal').modal('hide');//现实模态框
                    }
                    else{
                        callAlert(res.message);
                    }

                },
                error: function () {
                    callAlert("保存失败！");
                }
            });

        }

        
    }



    /**
     * 核销详情查看
     * @param x
     */
    // $("#RWriteOffsearchModalForm input[name = 'customerCode']").val(data['customerCode']);
    function seeWriteOffDetail(x) {
        $(".receivableWriteOff .checkchild").prop("checked", false);
        $("#receivableWriteOffTable tbody tr").each(function () {
            receivableWriteOff_tb.row(this).deselect();
            $(this).find('td:first-child').removeClass('selected');
        });
        var thiss = $(x).parents("tr");
        receivableWriteOff_tb.row(thiss).select();
        $(x).parents("tr").find('td:first-child').addClass('selected');
        $(x).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);
        var data = receivableWriteOff_tb.rows(".selected").data()[0];
        $("#search input[name = 'receivableWriteOffId']").val(data['receivableWriteOffId']);
        //查看核销详情
        writeOffDetail_tb2=$("#writeOffDetailTable2").DataTable({
            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            // 动态分页加载数据方式
            bProcessing: true,
            // bServerSide: true,
            aLengthMenu: [10, 20, 30, 40], // 动态指定分页后每页显示的记录数。
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
                "url": getContextPath() + 'accountReceivableWriteOff/detailOfWriteOffHistory.do',
                "data": function(d){
                    //查询已核销的数据
                    // var statusList = new Array('已核销','部分核销');
                    // $("#search input[name = 'writeOffStatusList']").val(statusList);
					search_data = ($('#search').serializeObject());
					console.log(search_data);
                    var k = {};
                    for (var key in search_data) {
                        if (search_data[key] == "" || search_data[key] == null) {

                        } else {
                            k[key] = search_data[key];
                        }
                    }
                    k.writeOffStatusList = new Array('已核销','部分核销');
                    k = JSON.stringify(k);
                    d.keys = k;
                },
                "dataSrc":function (data) {


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
                    return data.aaData
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
                {title: "业务编号", data: "accountBusinessTotal.businessCode"},
                {title: "提单号", data: "accountBusinessTotal.billLadingNo"},
                {title: "开航日", data: "accountBusinessTotal.sailingDate"},
                {title: "费用名称", data: "expenseName"},
                {title: "发票号", data: "accountReceivableInvoice.invoiceNumber"},
                {title: "应收币种", data: "currencyExpense"},
                {title: "应收金额", data: "amountExpense"},
                {title: "核销币种", data: "writeOffCurrency"},
                {title: "核销金额", data: "writeOffMoney"},
                {title: "核销时间", data: "writeOffTime"},
                {title: "核销人", data: "writeOffMan"},

                {title: "汇率", data: "writeOffRate"},
                {title: "开票日期", data: "accountReceivableInvoice.billingDate"},
                {title: "业务员", data: "accountBusinessTotal.salesmanName"},
                {title: "备注", data: "remark"}
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
                    targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
        $('#writeOffDetailsModal').modal('show');
    }

    /**
     * 核销模态框查询按钮
     */
    function searchWriteOffDetail() {
        $('#searchModal').modal('show');
    }

    /**
     * 认领确认按钮
     */
    function confirmationOfClaim() {
        emptyAddForm("billingsWriteOffModalForm1");
        emptyAddForm("billingsWriteOffModalForm2");
        emptyAddForm("RWriteOffsearchModalForm");
        var selectedRowData = receivableWriteOff_tb.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录！");
            return;
        }
        var data = selectedRowData[0];
        if (data["writeOffStatus"] != "已认领") {
            callAlert("请选择已认领的记录进行认领确认");
            return;
        }
        $("#buttonWriteOff").css("display","none");
        $("#buttonClaim").css("display","block");
        console.log(data);
        $('#writeOff').hide();
        $('#claim').css("display","block");
        data["receiveAmount"] = toDecimal2(data["receiveAmount"]);
        data["writeOffBalance"] = toDecimal2(data["writeOffBalance"]);
        // 循环给表单赋值
        $.each($("#billingsWriteOffModalForm1 input,#claim input"), function (i, input) {

            $(this).val(data[$(this).attr("name")]);

        });
        var receivableWriteOffId=data['receivableWriteOffId'];
        if(data["payMethod"]=="预付"){
            $("#billingsWriteOffModalForm1 input[name=writeOffMethod]").val("预销");
        }else {
            $("#billingsWriteOffModalForm1 input[name=writeOffMethod]").val("现销");
        }
        //核销余额更新
        var amount = data["writeOffBalance"];
        var rate;
        $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val(amount);
        //月汇率计算
        var exchangeRate = data["receiveDate"];
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountExchangeRate/getRateByDate.do',
            data: {
                exchangeRate:exchangeRate
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
                $("#billingsWriteOffModalForm1 input[name = 'rate']").val(res);
                rate = parseFloat(res);
            },
            error: function () {
                callAlert("查看失败");
            }
        });

        /**
         * 加载核销详情
         * @type {jQuery}
         */
        var arrayId=[];
        $("#writeOffDetailTableParent").html('<table id="writeOffDetailTable" class="table table-bordered table-striped" style="width: 100%;"></table>');
        writeOffDetail_tb=$("#writeOffDetailTable").DataTable({
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
                "url": getContextPath() + 'accountReceivableWriteOff/detailOfWriteOff.do',
                "data": function(d){
                    //返回未核销状态的数据
                    $("#RWriteOffsearchModalForm input[name = 'writeOffStatus']").val("已认领");
                    $("#RWriteOffsearchModalForm input[name = 'receivableWriteOffId']").val(receivableWriteOffId);
                    search_data = ($('#RWriteOffsearchModalForm').serializeObject());
                    console.log(search_data);
                    var k = {};
                    for (var key in search_data) {
                        if (search_data[key] == "" || search_data[key] == null) {

                        } else {
                            k[key] = search_data[key];
                        }
                    }
                    k.writeOffStatus="已认领";
                    k = JSON.stringify(k);
                    d.keys = k;
                },
                "dataSrc": function ( data ) {
                    for(var i=0; i<data.aaData.length; i++) {
                        var xxx = 1;
                        if (data['aaData'][i]['currencyExpense'] != $("#billingsWriteOffModalForm1 input[name = 'receiveCurrency']").val()) {
                            xxx = rate;
                        }
                        data['aaData'][i]['writeOffRate'] = xxx;
                        data['aaData'][i]['writeOffCurrency'] = $("#billingsWriteOffModalForm1 input[name = 'receiveCurrency']").val();
                        arrayId.push(data['aaData'][i]['expenseId']);
                    }
                    if (arrayId === undefined || arrayId.length == 0) {
                        $("#refuseWriteOff").attr("data-expenseIds","");
                        $("#determineWriteOff").attr("data-expenseIds","");
                    }else{
                        var arrayIds=arrayId.toString();
                        $("#refuseWriteOff").attr("data-expenseIds",arrayIds);
                        $("#determineWriteOff").attr("data-expenseIds",arrayIds);
                    }

                    return data.aaData;
                },
                error: function (xhr, error, thrown) {
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
                    "Class": "text-center",
                    "title":"<input type='checkbox' class='checkall2' onclick='receivableWriteOff.xx(this)'/>",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild2"  value="" onclick="receivableWriteOff.xx(this)" />';

                    },
                    "Sortable": false

                },
                {title: "业务编号", data: "accountBusinessTotal.businessCode"},
                {title: "提单号", data: "accountBusinessTotal.billLadingNo"},
                {title: "开航日", data: "accountBusinessTotal.sailingDate"},
                {title: "费用名称", data: "expenseName"},
                {title: "发票号", data: "accountReceivableInvoice.invoiceNumber"},
                {title: "应收币种", data: "currencyExpense"},
                {title: "应收金额", data: "amountExpense"},
                {title: "开票日期", data: "accountReceivableInvoice.billingDate"},
                {title: "业务员", data: "accountBusinessTotal.salesmanName"},
                {title: "汇率", data: "writeOffRate"},
                {title: "核销币种", data: "writeOffCurrency"},
                {
                    "Class": "text-center",
                    "title": "核销金额",
                    "data":"writeOffAmount",
                    "render": function (data, type, full, meta) {
                        return '<input type="text" class="writeOffAmount" name="currentWriteOff" style="width: 50px" onblur="receivableWriteOff.calAmount(this, 1)" value="'+data+'" />';

                    }

                },
                {
                    "Class": "text-center",
                    "title": "备注",
                    "data":"remark",
                    "render": function (data, type, full, meta) {
                        return '<input type="text" name="remark" style="width: 100px" value="'+data+'"/>';

                    }

                }
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
                    targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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
        //自动装入核销人员
        var loginCookie=JSON.parse($.cookie("loginingEmployee"));
        $("#billingsWriteOffModalForm2 input[name = 'writeOffStaffName']").val(loginCookie['employee']['employeeName']);
        $("#billingsWriteOffModalForm1 input[name = writeOffStaffId]").val(loginCookie["user"]["userDetailId"]);
        $("#billingsWriteOffModalForm2 input[name = 'writeOffDate']").val($.date.format(new Date(), "yyyy-MM-dd"));
        $("#billingsWriteOffModalTitle").html("认领确认");
        $('#billingsWriteOffModal').modal('show');
        $('.modal').css("overflow","scroll");
    }
    //认领确认  拒绝/确定功能
    function buttonClaimWriteOff(but,isNo){
        var selectedRowData = receivableWriteOff_tb.rows('.selected').data();
        var data = selectedRowData[0];
        var expenseid=$(but).attr("data-expenseids");
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountReceivableWriteOff/confirmClaim.do',
            data: {
                receivableWriteOffId:data['receivableWriteOffId'],
                expenseIds:expenseid,
                confrimType:isNo?1:0
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
                if(res.code==0){
                    $("#refuseWriteOff").attr("data-expenseIds","");
                    $("#determineWriteOff").attr("data-expenseIds","");
                    callAlert(res.message);
                    $('#billingsWriteOffModal').modal('hide');
                }else{
                    callAlert(res.message);
                }
            },
            error: function () {
                hideMask();
                callAlert("操作失败");
            }
        });
    }

    /**
     * 反核销
     * @param f
     */
    function reBillingWriteOff() {
        emptyAddForm("billingsWriteOffModalForm1");
        emptyAddForm("billingsWriteOffModalForm2");
        emptyAddForm("RWriteOffsearchModalForm");
        var selectedRowData = receivableWriteOff_tb.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录！");
            return;
        }
        var data = selectedRowData[0];
        if (data["writeOffStatus"] != "已核销"&&data["writeOffStatus"] != "部分核销") {
            callAlert("请选择已核销或部分核销的记录进行反核销");
            return;
        }
        $("#buttonWriteOff").css("display","block");
        $("#buttonClaim").css("display","none");
        $('#claim').hide();
        $('#writeOff').css("display","block");
        data["receiveAmount"] = toDecimal2(data["receiveAmount"]);
        data["writeOffBalance"] = toDecimal2(data["writeOffBalance"]);
        // 循环给表单赋值
        $.each($("#billingsWriteOffModalForm1 input,#writeOff input"), function (i, input) {

            $(this).val(data[$(this).attr("name")]);

        });
        if(data["payMethod"]=="预付"){
            $("#billingsWriteOffModalForm1 input[name=writeOffMethod]").val("预销");
        }else {
            $("#billingsWriteOffModalForm1 input[name=writeOffMethod]").val("现销");
        }
        //核销余额更新
        var amount = data["writeOffBalance"];
        $("#billingsWriteOffModalForm1 input[name = 'writeOffBalanceTotal']").val(amount);

        /**
         * 加载核销详情
         * @type {jQuery}
         */
        $("#RWriteOffsearchModalForm input[name = 'customerCode']").val(data['customerCode']);
        $("#RWriteOffsearchModalForm input[name = 'receivableWriteOffId']").val(data['receivableWriteOffId']);
        $("#writeOffDetailTableParent").html('<table id="writeOffDetailTable" class="table table-bordered table-striped" style="width: 100%;"></table>');
        writeOffDetail_tb=$("#writeOffDetailTable").DataTable({
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
                "url": getContextPath() + 'accountReceivableWriteOff/detailOfWriteOff.do',
                "data": function(d){
                    //返回未核销状态的数据
                    $("#RWriteOffsearchModalForm input[name = 'writeOffStatus']").val("已核销");
                    search_data = ($('#RWriteOffsearchModalForm').serializeObject());
                    search_data.writeOffType = 1 ;
                    console.log(search_data);
                    var k = {};
                    for (var key in search_data) {
                        if (search_data[key] == "" || search_data[key] == null) {

                        } else {
                            k[key] = search_data[key];
                        }
                    }
                    k = JSON.stringify(k);
                    d.keys = k;
                },
                "dataSrc": function ( data ) {
                    //在该方法中可以对服务器端返回的数据进行处理。
                    console.log(data.aaData);
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
                    "Class": "text-center",
                    "title":"<input type='checkbox' class='checkall2' onclick='receivableWriteOff.xx(this)'/>",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild2"  value="" onclick="receivableWriteOff.xx(this)" />';

                    },
                    "Sortable": false

                },
                {title: "业务编号", data: "accountBusinessTotal.businessCode"},
                {title: "提单号", data: "accountBusinessTotal.billLadingNo"},
                {title: "开航日", data: "accountBusinessTotal.sailingDate"},
                {title: "费用名称", data: "expenseName"},
                {title: "发票号", data: "accountReceivableInvoice.invoiceNumber"},
                {title: "应收币种", data: "currencyExpense"},
                {title: "应收金额", data: "amountExpense"},
                {title: "开票日期", data: "accountReceivableInvoice.billingDate"},
                {title: "业务员", data: "accountBusinessTotal.salesmanName"},
                {title: "汇率", data: "writeOffRate"},
                {title: "核销币种", data: "writeOffCurrency"},
                {
                    "Class": "text-center",
                    "title": "核销金额",
                    "data":"writeOffAmount",
                    "render": function (data, type, full, meta) {
                        return '<input type="text" class="writeOffAmount" name="writeOffAmount" disabled style="width: 50px" onblur="receivableWriteOff.calAmount(this, 1)" value="'+data+'" />';

                    }

                },
                {
                    "Class": "text-center",
                    "title": "备注",
                    "data":"remark",
                    "render": function (data, type, full, meta) {
                        return '<input type="text" name="remark" style="width: 100px" value="'+data+'"/>';

                    }

                }
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
                    targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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
        $("#billingsWriteOffModalTitle").html("反核销");
        //核销余额
        var total = $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").val();
        $("#billingsWriteOffModalForm1 input[name = 'writeOffBalance']").attr('total',total);

        $('#billingsWriteOffModal').modal('show');
        $('.modal').css("overflow","scroll");
    }

    // $('body').on('click', '#writeOffDetailTable tbody tr td:first-child', function () {
    //     selection1(writeOffDetail_tb,this);
    // });

    // 清空弹框
    function emptyAddForm(f) {
        $("#" + f)[0].reset();
        $("label.error").remove();//清除提示语句
    }

    //查询按钮
    function doSearch() {
        receivableWriteOff_tb.ajax.reload();
    }
    function doSearch3(){
        receivableClient_table.ajax.reload();
    }

    //子查询

    function doSearch2() {
        writeOffDetail_tb.ajax.reload();
        $("#searchModal").modal('hide');
    }

    $("#receivableWriteOffSendModal select[name=objectionSelectCompany]").on('change',function () {
        var objectionSelectCompany=$("#receivableWriteOffSendModal select[name=objectionSelectCompany]").val();
        $("#receivableWriteOffSendModalForm select[name='objectionSelect'] option[value !='']").remove();
        console.log(objectionSelectCompany);
        $("#objectionSelect").empty();
        var html='<label style="width: 28%">对象部门</label>'+
            '<select name="objectionSelect"  class="form-control select2 select2-hidden-accessible" multiple="" data-placeholder="" style="width: 68%;" tabindex="-1" aria-hidden="true">'+
            '<option value=""></option>'+
            '</select>';
        $("#objectionSelect").append(html);
        $("#objectionSelect .select2").select2();
        if(objectionSelectCompany != '120'){
           // initSelect2FromRedis("receivableWriteOffSendModalForm","objectionSelect", "organization/listOrganizationLeafsById.do", objectionSelectCompany, "objectionSelect", "objectionSelect");


            $.ajax({
                type: 'POST',
                url: getContextPath()+"organization/listOrganizationAllChildById.do",
                cache: false,
                data:{
                    id:objectionSelectCompany
                },
                dataType: "json",
                success: function (res) {
                    // var data = $.map(res, function (obj) {
                    //     for (var key in obj){
                    //         console.log(key);
                    //         obj.id = obj['organizationStructureId'];// replace name with the property used for the text
                    //         obj.text = obj['name']; // replace pk with your identifier
                    //         return obj;
                    //
                    //     }
                    // });

                    // $("#objectionSelect select[name='objectionSelect']").select2({
                    //     // maximumInputLength:10,
                    //     closeOnSelect: false,
                    //     data: data
                    // });
                    var length= res.length;
                    var html="";
                    for(var i=0;i<length;i++){
                        html+= '<option value="'+res[i].organizationStructureId+'">'+res[i].name+'</option>';
                    }
                    $("#objectionSelect select[name='objectionSelect']").append(html);
                },
                error: function () {
                    callAlert("初始化失败!");
                }
            });
        }
        //initSelect2FromAccount1("receivableWriteOffSendModalForm","objectionSelect", "organization/listAllOrganizationNameByCompany.do", objectionSelectCompany, "", "");
    });

    
    
    

    function sendeditedMessage() {
        var receivableWriteOffId=$('#receivableWriteOffSendModalForm input[name=receivableWriteOffId]').val();
        var objectionSelect=$('#receivableWriteOffSendModalForm select[name=objectionSelect]').val();
        var objectionSelectCompany=$('#receivableWriteOffSendModalForm select[name=objectionSelectCompany]').val();
        if(objectionSelectCompany == "" || objectionSelectCompany == null){
            callAlert("请选择公司！");
            return;
        }
        console.log(objectionSelect)
        if(objectionSelect== null || objectionSelect == ""){
            objectionSelect="";
        }else{
            objectionSelect=objectionSelect.toString();
        }
        $.ajax({
            url: getContextPath()+'accountReceivableWriteOff/insertForReceivableWriteOff.do',//更新该条公告被读次数
            cache: false,
            dataType: "json",
            type: "POST",
            data:{
                receivableWriteOffId:receivableWriteOffId,
                objectionSelect:objectionSelect,
                objectionSelectCompany:objectionSelectCompany
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
        $('#receivableWriteOffSendModal').modal('hide');//隐藏模态框
        receivableWriteOff_tb.ajax.reload();


    }


    function print(){
        var selRow=receivableWriteOff_tb.rows('.selected').data();
        var data = selRow[0];
        if (data["writeOffStatus"] != "已核销"&&data["writeOffStatus"] != "部分核销") {
            callAlert("请选择已核销或部分核销的记录进行打印");
            return;
        }
        if(selRow.length<1){
            callAlert('请选择一条记录!');
        }else if(selRow.length>1){
            callAlert('仅能操作一条记录!');
        }else{
            var loginCookie=JSON.parse($.cookie("loginingEmployee"));
            var organizationStructrueCompanyName=loginCookie.organizationStructrueCompanyName;
            //console.log(selRow[0].payableReconcileId);
            var receivableWriteOffId = selRow[0].receivableWriteOffId;
            window.open(getPrintContextPath()+"stimulsoft_viewerfx?stimulsoft_report_key=seawin/27229f1e-93f2-4dcf-ad54-30e631f7a292.mrt&receivableWriteOffId="+receivableWriteOffId+"&company="+organizationStructrueCompanyName);
        }
    }


    // 当隐藏模态框时，将模态框内内容清空

    $('#writeOffInsertUpdateModal').on('hidden.bs.modal', function () {
        // $(this).removeData('bs.modal')
        // emptyAddForm('writeOffInsertUpdateForm')
        $('#writeOffInsertUpdateModal').find("select[name='contactCompany']").empty().attr("disabled",true);
        $('#writeOffInsertUpdateModal').find("select[name='payBank']").empty().attr("disabled",true);
        $('#writeOffInsertUpdateModal').find("select[name='receiveAccount']").empty().attr("disabled",true);
        $('#writeOffInsertUpdateModal').find("select[name='payCompany']").empty().attr("disabled",true);

    })
    InitReceivableClientDetail();
    function InitReceivableClientDetail(){
            receivableClient_table = $('.receivableWriteOff div#receivableClientDetail table#clientTable').DataTable({
              
                fnDrawCallback:changePage,
                bProcessing : true,
                bServerSide : true,
                aLengthMenu : [ 5, 10, 20, 40 ], // 动态指定分页后每页显示的记录数。
                searching : false,// 禁用搜索
                lengthChange : true, // 是否启用改变每页显示多少条数据的控件
                /*
                 * sort : "position",
                 * //是否开启列排序，对单独列的设置在每一列的bSortable选项中指定
                 */
                deferRender : true,// 延迟渲染
                stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
                iDisplayLength : 10, // 默认每页显示多少条记录
                iDisplayStart : 0,
                ordering : false,// 全局禁用排序
                serverSide: true,
                autoWidth: true,
                destroy: true,
                scrollX: true,
                scrollY:"200px",
                colReorder:true,
                destroy:true,
                dom:'<"top">rt<"bottom"flip><"clear">',
                ajax:{
                    "type":"POST",
                    "url":getContextPath() + 'saleCustomerEmployee/listByNewBusiness.do',
                    "data":function (d) {
                        search_data=$('#receivableClientDetailForm').serializeObject();
                        var k={"operatorLeader":""};
                        for(var key in search_data){
                            k[key]=search_data[key];
                        }
                        d.keys=JSON.stringify(k);
                    }
                },
                language:{
                     "url":"js/Chinese.json"
                },
                columns:[
                    {
                        "sClass": "text-center",
                        "data": "expenseId",
                        "title": "<input type='checkbox' class='checkall' />",
                        "render": function (data, type, full, meta) {
                            return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                        },
                        "bSortable": false

                    },
                    {title:'客户代码',data:'saleCustomer.customerCode'},
                    {title:'公司全称',data:'saleCustomer.customerNameCn'},
                ],
                columnDefs:[
                    {
                        orderable:false,
                        targets:0
                    },{
                    "render":function (data,type,full,meta) {
                        if($.string.isNullOrEmpty(data)){
                            return "";
                        }else{
                            return type==='display'&&data.length>8?
                                '<span title="'+data+'">'+data+'</span>':
                                data;
                        }
                    },
                    "targets":[1,2]
                    }
                ],
                buttons:[{

                }],
                select:{
                    style:'multi',                 //选中多行
                    selector:'td:first-child'   //选中效果仅对第一列有效
                },
                initCompltet:function () {
                    
                }
                
            });
    }
    $("#customerCodeSure").off();
    $("#customerCodeSure").on('click',function(){
        var selRow = receivableClient_table.rows('.selected').data();
        if(selRow.length==1){
            var customerCodeSel = selRow[0].saleCustomer.customerCode;
            $('#writeOffInsertUpdateForm select[name=customerCode]').select2({
                data:[customerCodeSel]
            });
            setFormSelect2Value("writeOffInsertUpdateForm", ["customerCode"],[customerCodeSel]);
            // console.log($('#writeOffInsertUpdateForm select[name=customerCode]').val())
            $("#receivableClientDetail").modal('hide');


        }else {
            callAlert('请选择一条记录');
        }

    });

    // $('#clientTable tbody').on('click', 'tr td:first-child', function () {
    //     // $(".selected").not(this).removeClass("selected");
    //     $(this).toggleClass("selected");
    //     var check = $(this).hasClass("selected");
    //     $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
    //     // console.log(table.rows('.selected').data().length);
    // });
    //全选
    $('body').on('click', '.clientTableClass .checkall', function () {
        allSelection("clientTableClass","clientTable",receivableClient_table,this);
    });
    $('#clientTable tbody').on('click', 'tr td:first-child', function () {
        selection1(receivableClient_table,this);
    });



    $('#writeOffInsertUpdateModal select[name=customerCode]').parent('td').on('click',function(){
        
        $('#receivableClientDetail').modal('show');
        $('#receivableClientDetail .search_reset').trigger('click');
        // console.log($(this).css('z-index'));
        $(this).css('z-index','-100px')
        console.log($(this).children('select').css('width'));

    })

    $("#writeOffInsertUpdateForm  select[name='customerCode']").off();
    $("#writeOffInsertUpdateForm  select[name='customerCode']").on('change',function(){
        var value = $(this).val();
        writeOffInsertSelect('payCompany','saleAssociatedUnit/listUnitAndSelfName.do',function(){
            $("#writeOffInsertUpdateForm  select[name='payCompany']").empty().attr('disabled',false);
            return {
                customerCode:value
            }
        });
        returnData('saleCustomer/getAccountByCode.do',function(){
            return { customerCode:value}
        }).then(function(res){
            $("#writeOffInsertUpdateForm  input[name=contactCompany]").val(res["customerNameCn"]);                
            var arrData = new Array(res["rmbBank"],res["foreignBank"]);
            var boolCheck = arrData.some(function(item){
                return item!="";
            })
            // console.log(arrData);
            if(boolCheck){
                $("#writeOffInsertUpdateForm  select[name=payBank]").empty().attr('disabled',false);
                $("#writeOffInsertUpdateForm  select[name=payBank]").select2({
                    data: arrData
                });
            }else {
                $("#writeOffInsertUpdateForm  select[name=payBank]").empty().attr('disabled',false);
                callAlert("付款银行 不存在")
            }
        }).catch(function(){
            callAlert('hello');
        })
    })


    $("#writeOffInsertUpdateForm  select[name='receiveBank']").off();
    $("#writeOffInsertUpdateForm  select[name='receiveBank']").on('change',function(){
        var value = $(this).val();
        writeOffInsertSelect('receiveAccount','basedataBankacnt/listAllBankAcnt.do',function(){
            $("#writeOffInsertUpdateForm  select[name=receiveAccount]").empty().attr('disabled',false);
            return {
                bankName:value
            }
        });
    })
    

    


    // 增加按钮
    function addWriteOff(){
        // 清空
        $("#writeOffInsertUpdateForm")[0].reset();
        $("label.error").remove();//清除提示语句


        $("#writeOffInsertUpdateForm .select2-selection__rendered").attr("title","").text("");
        $('#writeOffUpdateModalSubmit').html('确定');
        $('#writeOffInsertUpdateModalTitle').html('增加');
        

        var loginCookie=JSON.parse($.cookie("loginingEmployee"));
        var amenderName=loginCookie.user.username;
        var userId=loginCookie.user.userId;
        $('#writeOffInsertUpdateModal').find("input[name='amenderName']").val(amenderName).attr("title",userId);
        $('#writeOffInsertUpdateModal').find("input[name='amendTime']").val( $.date.format(new Date(),"yyyy-MM-dd"));
        $('#writeOffInsertUpdateModal').find("input[name='receiveDate']").datepicker("setDate",$.date.format(new Date(),"yyyy-MM-dd"));
        $('#writeOffInsertUpdateModal').modal('show');

        setFormSelect2Value("writeOffInsertUpdateForm",["receiveAccountType","receiveCurrency"],["对公","RMB"])
        $('#writeOffUpdateModalSubmit').off();

        $('#writeOffUpdateModalSubmit').on('click',function(event){
            // $(this).val('确定中...').attr('disabled','true');
            if($("#writeOffInsertUpdateForm").valid()){
                var data = $("#writeOffInsertUpdateForm").serializeObject();
                console.log(data);
                returnData('accountReceivableWriteOff/insertWriteOff.do',function(){
                    return {
                        accountReceivableWriteOff:JSON.stringify(data)
                    }
                    
                }).then(function(res){
                    $('#writeOffInsertUpdateModal').modal('hide');
                    callSuccess(res.message);
                    receivableWriteOff_tb.ajax.reload();
                }).catch(function(){
                    callAlert('增加失败');
                })
                


            }
            event.preventDefault();
            
        })
    }

    
    

    //修改按钮

    function updateWriteOff(){

        var selRow=receivableWriteOff_tb.rows('.selected').data();
        var status = selRow[0]?selRow[0].writeOffStatus:null;

        $("#writeOffInsertUpdateForm .select2-selection__rendered").attr("title","").text("");
        
        if(selRow.length<1){
            callAlert('请选择一条记录!');
        }else if(selRow.length>1){
            callAlert('仅能操作一条记录!');
        }else if(status=='未核销'){
            $('#writeOffInsertUpdateModalTitle').html('修改');
            var data = selRow[0];
            var receivableWriteOffId = data.receivableWriteOffId;

            console.log(data);
            // console.log(receivableWriteOffId);
            $.each($("#writeOffInsertUpdateForm input"), function (i, input) {
                $(this).val(data[$(this).attr("name")]);
            });
            $("#writeOffInsertUpdateForm input[name=amenderName]").val(data.baseModel.amenderName);
            $('#writeOffUpdateModalSubmit').val('确定')
            // console.log(data['customerCode'])
            $('#writeOffInsertUpdateForm select[name=customerCode]').select2({
                data:[data["customerCode"]]
            });
            // setFormSelect2Value("writeOffInsertUpdateForm", ["customerCode"],[]);
            // console.log($('#writeOffInsertUpdateForm select[name=customerCode]').val())
            

            setFormSelect2Value("writeOffInsertUpdateForm", ["customerCode","payCompany","payMethod","payBank","receiveCompany","receiveAccount","receiveAccountType","receiveCurrency","receiveBank"],
                [data["customerCode"],data["payCompany"],data["payMethod"],data["payBank"],data["receiveCompany"],data["receiveAccount"],data["receiveAccountType"],data["receiveCurrency"],data["receiveBank"]]);

            $('#writeOffInsertUpdateModal').modal('show');
            $('#writeOffUpdateModalSubmit').off();
            $('#writeOffUpdateModalSubmit').on('click',function(event){
                if($("#writeOffInsertUpdateForm").valid()){
                    var dataForm = $("#writeOffInsertUpdateForm").serializeObject();
                    dataForm.receivableWriteOffId = receivableWriteOffId;
                    console.log(dataForm);
                    returnData('accountReceivableWriteOff/updateWriteOff.do',function(){
                        return {
                            accountReceivableWriteOff:JSON.stringify(dataForm)
                        }
                        
                    }).then(function(res){
                        $('#writeOffInsertUpdateModal').modal('hide');
                        receivableWriteOff_tb.ajax.reload();
                    }).catch(function(){
                        callAlert('修改失败');
                    })
                }
                $('#writeOffInsertUpdateModal').modal('hide');
                event.preventDefault();
            })


            
        }else {
            callAlert('请选择一条未核销的记录进行修改')
        }   
        
    }

    // 删除按钮
    function deleteWriteOff(){
        var selRow=receivableWriteOff_tb.rows('.selected').data();
        var status = selRow[0]?selRow[0].writeOffStatus:null;
        if(selRow.length<1){
            callAlert('请选择一条或多条记录!');
        }else if(status=='未核销'){
            var arrWriteOffIds = selRow.map(function(item){
                return  item.receivableWriteOffId;
            })
            // console.log(arrWriteOffIds);
            returnData('accountReceivableWriteOff/deleteWriteOff.do',function(){
                return {
                    accountReceivableWriteOffIds:arrWriteOffIds.join(",")
                }
                
            }).then(function(res){
                receivableWriteOff_tb.ajax.reload();
            }).catch(function(){
                callAlert('修改失败');
            })
                
            
        }else {
            callAlert('请选择一条未核销的记录进行删除')
        }
    }



    // 将ajax封装 返回一个promise对象， handler回调函数 返回data对象
    function returnData(url,handler){
        return new Promise(function(resolve,reject){
            var ajaxObj = {
                type: 'POST',
                url: getContextPath() + url,
                cache: false,
                dataType: "json",
                success: function (res) {
                    resolve(res);
                },
                error: function () {
                    reject();
                }
            }
            if(handler){
                ajaxObj.data = handler()
            }
            $.ajax(ajaxObj);
        })   
    }
    // 对returnData方法调用，并且将
    function writeOffInsertSelect(selectName,url,handler){
        returnData(url,handler).then(function(res){
            var data = $.map(res, function (obj) {
                for (var key in obj){
                    obj.id = key;// replace name with the property used for the text
                    obj.text = obj[key]; // replace pk with your identifier
                    return obj;
                }
            });
            $("#writeOffInsertUpdateForm select[name="+selectName+"]").select2({
                data: data
            });
        }).catch(function(){
            callAlert('加载失败')
        })
    }


    
    return {
        // 将供页面该方法调用
        doSearch:doSearch,
        writeOffSend:writeOffSend,
        billingsWriteOff:billingsWriteOff,
        searchWriteOffDetail:searchWriteOffDetail,
        confirmationOfClaim:confirmationOfClaim,
        seeWriteOffDetail:seeWriteOffDetail,
        confirmWriteOff:confirmWriteOff,
        calAmount:calAmount,
        yue:yue,
        doSearch2:doSearch2,
        doSearch3:doSearch3,
        reBillingWriteOff:reBillingWriteOff,
        xx:xx,
        sendeditedMessage:sendeditedMessage,
        print:print,
        addWriteOff:addWriteOff,
        updateWriteOff:updateWriteOff,
        deleteWriteOff:deleteWriteOff,
        buttonClaimWriteOff:buttonClaimWriteOff

    };

})();



