/**
 * Created by huwf on 2017/8/29.
 */
//@ sourceURL=payableWriteOff.js
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


var payableWriteOff = (function() {
    // $.validator.setDefaults({
    //     submitHandler: submitEditPayableWriteOffModal
    // });
    /*$().ready(
     function validatePayableWriteOffForm() {
     $("#editPayableWriteOffForm").validate({
     rules: {

     },
     errorPlacement: function(){
     return false;
     }


     });
     // return PayableWriteOff_Validator.form();
     }
     );
     */

    $(function () {
        //Initialize Select2 Elements，初始化银行下拉框架
        $(".select2").select2();

        //解决select2 在弹出框中不能搜索的问题
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };
        $('.beginDate,.endDate').datepicker({
            autoclose: true,
            language:"zh-CN",//语言设置
            format: "yyyy-mm-dd"
        });


    });

    var payableWriteOff_table;
    Init();
    function Init() {
        // tableHeight = $("#payableWriteOffTable").height();
        payableWriteOff_table = $("#payableWriteOffTable").DataTable({
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
            /*autoWidth: true,
             scrollX: true,*/
            serverSide: true,
            scrollY:calcDataTableHeight(),
            colReorder: true,//列位置的拖动,
            dom:'<"top">rt<"bottom"flip><"clear">',
            // destroy:true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
            // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
            //			 ajax: "../mock_data/user.txt",

            ajax: {
                "type": "POST",
                "url": getContextPath() + 'accountPayable/listByPage.do',
                "data": function (d) {
                    search_data = $('#payableWriteOffSearchForm').serializeObject();
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
                    d.type="付款核销";
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
                 "data": "payableWriteOffId",
                 "title": "<input type='checkbox' class='checkall' />",
                 "render": function (data, type, full, meta) {
                 return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                 },
                 "bSortable": false

                 },
                // {title: "箱型ID", data: "payableWriteOffId"},
                {title: "状态", data: "status"},
                {
                    title: "请款单号", 
                    data: "payableCode",
                    "render": function (data, type, full, meta) {
                        return '<a onclick="payableWriteOff.invoiceDetailsRequest(this)">'+data+'</a>';

                    }
                },
                {title: "收款单位", data: "receiveCompany"},
                {title: "请款币种",data: "requestCurrency"},
                {title: "请款金额", data: "requestAmount"},
                {
                    title: "财务编号",
                    data: "financialNumbers",
                    "render": function (data, type, full, meta) {
                        return '<a onclick="payableWriteOff.showPayableWriteOffDetail(this)">'+data+'</a>';

                    }
                },
                {title: "实付币种", data: "payCurrency"},
                {title: "实付金额", data: "payAmount"},
                {title: "实付时间", data: "payDate"}

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
                    targets: [1, 2, 3, 4, 5, 6, 7, 8, 9]
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
                    container: '#payableWriteOff_export-copy'
                },
                {
                    extend: 'colvis',
                    text: '自定义列表头',
                    container: '#payableWriteOff_export-columnVisibility'
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
    $('body').on('click', '.payableWriteOff .checkall', function () {
        var check = $(this).prop("checked");
        $(".payableWriteOff .checkchild").prop("checked", check);
        $("#payableWriteOffTable tbody tr").each(function () {
            if (check){
                payableWriteOff_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                payableWriteOff_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });
    });

    //监听分页事件,去除复选
    $('#payableWriteOff_table').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#payableWriteOff_table').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

// 点击第一格才能选中
    $('#payableWriteOffTable tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
    });


//重置查询条件
    $("#payableWriteOffSearchPortForm").click( function() {
        $("#payableWriteOffSearchForm")[0].reset();
        $("#payableWriteOffSearchForm .select2-selection__rendered").attr("title","").text("");
        payableWriteOff_table.ajax.reload();
    });

    //搜索 datatable搜索
    function doSearch(){

        payableWriteOff_table.ajax.reload();

    }

    // 收放搜索栏
    function telescopic(but) {
        var text=$(but).text();
        if(text=="更多搜索"){
            $("#payableWriteOffSearchForm").animate({height:'100px'});
            // $(but).text("收起搜索").find("i").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
            $(but).html("收起搜索<i class='fa fa-fw fa-angle-double-up'></i>")
            resize2(106);
        }else{
            $("#payableWriteOffSearchForm").animate({height:'66px'});
            // $(but).text("更多搜索").find("i").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
            $(but).html("更多搜索<i class='fa fa-fw fa-angle-double-down'></i>")
            // resize2(100);
        }

    }
    function showPayableWriteOffDetail(but) {
        $(".payableWriteOff .checkchild").prop("checked", false);
        $("#payableWriteOffTable tbody tr").each(function () {
            payableWriteOff_table.row( this ).deselect();
            $( this ).find('td:first-child').removeClass('selected');
        });
        var thiss=$(but).parents("tr");
        payableWriteOff_table.row( thiss ).select();
        $(but).parents("tr").find('td:first-child').addClass('selected');
        $(but).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);
        var data = payableWriteOff_table.rows(".selected").data()[0];

        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountPayable/listPayableDetail.do',
            data: {
                payableId: data.payableId
            },
            cache: false,
            dataType: "json",
            beforeSend: function () {
                /*showMask();//显示遮罩层*/
            },
            success: function (rsp) {
                /*hideMask();*/
                $("#PayableWriteOffDetailTable tbody tr").remove();
                $.each(rsp, function(i, item) {
                    var html= '<tr class="surcharge">'
                        + '<td style="width: 20%;">'
                        + '<input type="text" name="financialNumber" style="width: 100px" readonly/>'
                        + '</td>'
                        + '<td style="width: 20%;">'
                        + '<input type="text" name="payMethod" style="width: 100px" readonly/>'
                        + '</td>'
                        + '<td style="width: 20%;">'
                        + '<input type="text" name="payCurrency" style="width: 100px" readonly/>'
                        + '</td>'
                        + '<td style="width: 20%;">'
                        + '<input type="text" name="payAmount" style="width: 100px" readonly/>'
                        + '</td>'
                        + '<td style="width: 20%;">'
                        + '<input type="text" name="payDate"  style="width: 100px" readonly/>'
                        + '</td>' + '</tr>';
                    $("#PayableWriteOffDetailTable tbody").append(html);
                    // 循环赋值
                    $.each($("#PayableWriteOffDetailTable .surcharge").eq(i).find("input"), function (k, input) {
                        $(this).val(item[$(this).attr("name")]);
                    });
                });

                $('#viewPayableWriteOffModal').modal('show');//现实模态框

            },
            error: function () {
               /* hideMask();*/
                callAlert("增加失败");
            }
        });


    }




    function WriteOff() {
        $("#detailLandQuotationDisperseTable tbody tr").remove();
        $("#infoExDetail select[name='payCurrency']").val(['RMB']).trigger('change');
        var selectRowData = payableWriteOff_table.rows('.selected').data();
        if(selectRowData.length != 1){
            callAlert("请选择一条数据进行核销");
            return;
        }
        if(selectRowData[0].status !="部分核销"&&selectRowData[0].status !="已请款"){
            callAlert("请选择一条部分核销或已请款的数据进行核销");
            return;
        }
        $.each($("#infoExDetail input,#infoExDetail select,#infoExDetail3 input"), function (i, input) {
            // console.log(selectRowData[0]);
            $(this).val(selectRowData[0][$(this).attr("name")]);
        });
        $("#infoExDetail input").eq(4).val(selectRowData[0].requestAmount);
        // $("#infoExDetail select[name=payCurrency]").val(['USD']).trigger('change');

        setFormSelect2Value("infoExDetail", ["payCurrency"],
            [selectRowData[0]["payCurrency"]]);
        var payableId=selectRowData[0].payableId;
        $.ajax({
            type:"post",
            url:getContextPath() +"accountPayable/listPayableDetail.do",
            data:{
                payableId:payableId
            },
            success:function (data) {
                data=JSON.parse(data);
                console.log(data);
                for(var i=0;i<data.length;i++){
                    var html = '<tr class="surcharge">'
                        + '<td style="width: 5%;">'
                        + '<input type="checkbox" name="checkSurcharge" value="'+data[i].payableDetailId+'">'
                        + '</td>'
                        + '<td style="width: 19%;">'
                        + '<input type="text" class="form-control" name="financialNumber" style="width:100%;height:30px;" readonly value="'+data[i].financialNumber+'">'
                        + '</td>'
                        + '<td style="width: 19%;">'
                        + '<select name="payMethod"  class="form-control select2 selector" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true" value="'+data[i].payMethod+'">'
                        + '<option value="'+data[i].payMethod+'" selected>'+data[i].payMethod+'</option>'
                        + '</select>'
                        + '</td>'
                        + '<td style="width: 19%;">'
                        + '<select name="payCurrency"  class="form-control select2 selector" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true" >'
                        + '<option value="'+data[i].payCurrency+'" selected>'+data[i].payCurrency+'</option>'
                        + '<option value="USD">USD</option>'
                        + '<option value="RMB">RMB</option>'
                        + '</select>'
                        + '</td>'
                        + '<td style="width: 19%;">'
                        + '<input type="text" class="form-control" name="payAmount"  onblur="payableWriteOff.calculateSum(this)" style="width:100%;height:30px;" value="'+data[i].payAmount+'">'
                        + '</td>'
                        + '<td style="width: 19%;">'
                        + '<input type="text" class="form-control beginDate" name="payDate" style="width:100%;height:30px;" value="'+data[i].payDate+'">'
                        + '</td>' + '</tr>';


                    $("#detailLandQuotationDisperseTable tbody").append(html);
                    
                }
            },
            error:function () {

            }
        })
        $("#infoExDetail select[name=payCurrency]").val([selectRowData[0].requestCurrency]).trigger('change');
        addpayableWriteOff();
    
        

        $("#PayableWriteOffModal").modal("show")
    }

    function cancel(){
        var selectRowData = payableWriteOff_table.rows('.selected').data();
        if(selectRowData.length != 1){
            callAlert("请选择一条数据进行撤销");
            return;
        }else{
            var payableId=selectRowData[0].payableId;
            $.ajax({
                type:"POST",
                url:getContextPath() +"accountPayable/revokeRequestFundsWriteOff.do",                
                data:{
                    payableId:payableId
                },
                dataType:'json',
                async:false,
                success:function (res) {
                    callAlert('撤销成功');
                },
                error:function () {
                    callAlert('撤销失败');
                }
            })

        }
        
    }

    // 增加一条付款核销
    function addpayableWriteOff() {

        writeOffInsertSelect('payMethod','accountPayable/listPayMethod.do',null);

        
        var html = '<tr class="surcharge">'
            + '<td style="width: 5%;">'
            + '<input type="checkbox" name="checkSurcharge">'
            + '</td>'
            + '<td style="width: 19%;">'
            + '<input type="text" class="form-control" name="financialNumber" style="width:100%;height:30px;" readonly value="自动编号">'
            + '</td>'
            + '<td style="width: 19%;">'
            + '<select name="payMethod"  class="form-control select2 selector" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
            + '<option value=""></option>'
            + '</select>'
            + '</td>'
            + '<td style="width: 19%;">'
            + '<select name="payCurrency"  class="form-control select2 selector" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true" >'
            + '<option value=""></option>'
            + '<option value="USD">USD</option>'
            + '<option value="RMB">RMB</option>'
            + '</select>'
            + '</td>'
            + '<td style="width: 19%;">'
            + '<input type="text" class="form-control" name="payAmount"  onblur="payableWriteOff.calculateSum(this)" style="width:100%;height:30px;">'
            + '</td>'
            + '<td style="width: 19%;">'
            + '<input type="text" class="form-control beginDate" name="payDate" style="width:100%;height:30px;">'
            + '</td>' + '</tr>';


        $("#detailLandQuotationDisperseTable tbody").append(html);
        initSelect2FromRedis5("editLandQuotationDisperseForm", "chargeId", "basedataCharge/getAll.do", "{}", "chargeId", "code");
        $('.beginDate,.endDate').datepicker({
            autoclose: true,
            language:"zh-CN",//语言设置
            format: "yyyy-mm-dd"
        });

        var sfje = $("#infoExDetail input").eq(4).val();
        var sfbz = $("#infoExDetail select[name=payCurrency]").val();
        $("#detailLandQuotationDisperseTable tbody select[name='payCurrency']:last").val([sfbz]).trigger('change');
        $("#detailLandQuotationDisperseTable tbody input[name='payAmount']:last").val(sfje);
    }



    function calculateSum(x) {
        var sum = 0.00;   //合计(全部换算成RMB)
        var amount = 0.00;  //单条
        var nowRate=0;   //税额
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
                nowRate = res;
            },
            error: function () {
                callAlert("获取汇率失败");
            }
        });

        var paidCurrency;//当前一行实付币种
        var taxAmount=0.00;
        //计算合计金额
        $(x).parents('tbody').find('tr').each(function () {
            amount = parseFloat($(this).find("input[name = 'payAmount']").val());
            paidCurrency = $(this).find("select[name='payCurrency']").val();
            if(paidCurrency=="RMB"){
                sum += amount;
            }
            else if(paidCurrency=="USD"){
                amount=amount*nowRate;
                sum += amount;
            }
        });
        if($("#infoExDetail select[name='payCurrency']").val()=="RMB"){
            $("#infoExDetail input[name='payAmount']").val(sum.toFixed(2));
        }else if($("#infoExDetail select[name='payCurrency']").val()=="USD"){
            $("#infoExDetail input[name='payAmount']").val((sum/nowRate).toFixed(2));
        }
    }

    // 复制一条付款核销
    function copypayableWriteOff() {
        $("#detailLandQuotationDisperseTable input[name='checkSurcharge']:checked").each(function () {
            $(this).attr('checked',false);
            var $tr = $(this).parent().parent();
            var a = $tr.find('select[name="payMethod"]').val();
            var b = $tr.find('select[name="payCurrency"]').val();
            var c = $tr.find('input[name="payAmount"]').val();
            var d = $tr.find('input[name="payDate"]').val();
            addpayableWriteOff();
            
            $("#detailLandQuotationDisperseTable tbody tr:last").find("select[name='payCurrency']").val(b);
            $("#detailLandQuotationDisperseTable tbody tr:last").find('input[name="payAmount"]').val(c);
            $("#detailLandQuotationDisperseTable tbody tr:last").find('input[name="payDate"]').val(d);
            $("#detailLandQuotationDisperseTable tbody tr:last").find("select[name='payMethod']").val([a]).trigger('change');
        });
        
    }
    function deletepayableWriteOff() {
        $("#detailLandQuotationDisperseTable input[name='checkSurcharge']:checked").each(function () {
            $(this).parent().parent().remove();
        });
    }
    $("#PayableWriteOffFormSave").click(function () {
        //var selectRowData = payableWriteOff_table.rows('.selected').data();
        //var data=selectRowData[0];
        var data=$("#infoExDetail,#infoExDetail3").serializeObject();
        data.accountPayableDetailList = [];
        $("#detailLandQuotationDisperseTable tbody").find("tr").each(function () {
            var detailDate=$(this).serializeObject();
            if(detailDate.payAmount!=0&&detailDate.payAmount!="") {
                data.accountPayableDetailList.push(detailDate);
            }

        });
        $.ajax({
            type : 'POST',
            url : getContextPath() +"accountPayable/payableWriteOff.do" ,
            data : {
                accountPayable : JSON.stringify(data)
            },
            cache : false,
            dataType : "json",
            beforeSend : function() {
                showMask();//显示遮罩层
            },
            success : function(res) {
                hideMask();
                callAlert(res.message)
                $("#PayableWriteOffModal").modal('hide');
                payableWriteOff_table.ajax.reload();

            },
            error : function() {
                hideMask();
                callAlert("增加失败");
            }
        });
    })

    function emptyAddForm() {
        $("#detailsOfReimburseDetailTableId tbody").empty();
        //$("#detailsOfReimburseTable tbody").empty();
        //$('#paymentRequestModalForm')[0].reset();
        $('#paymentDetailModalForm')[0].reset();
        $("#prepaymentsDetailTable tbody").empty();
        $("label.error").remove();//清除提示语句
    }


    //预付款详情加载
    var prepaymentsDetail_tb1 = $("#prepaymentsDetailTable1").DataTable({
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
        iDisplayLength: 5, // 默认每页显示多少条记录
        iDisplayStart: 0,
        ordering: false,// 全局禁用排序
        autoWidth: true,
        scrollX: true,
        serverSide: true,
        scrollY:true,
        colReorder: true,//列位置的拖动,
        dom: '<"top">Brt<"bottom"><"clear">',
        // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
        ajax: {
            "type": "POST",
            "url": getContextPath() + 'accountPayable/listAdvanceByPayableReconcileId.do',
            // "data": data
            "data": function (d) {
                var id = $("#queryConditionsDetailId input[name = 'payableReconcileId']").val();
                if(id==""){
                    id=-1;
                }
                d.payableReconcileId = id;
                // d.type = "预付款1";
            },
            "dataSrc": function ( data ) {
                //在该方法中可以对服务器端返回的数据进行处理。
                // data=JSON.parse(data);
                // var aaData=[];
                var aData={"aaData":[]};
                if(data.length>=1){
                    for(var i=0;i<data.length;i++){
                        aData.aaData.push(data[i]);
                    }
                    // aData.aaData=aaData;
                    return aData.aaData;
                }else{
                    // aData.aaData=aaData;
                    return aData.aaData;
                }
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
            {title: "核销金额", data: "writeOffAmount"},
            {title: "核销时间", data: "writeOffDate"},
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
                targets: [1, 2, 3, 4, 5, 6,7,8]
            }
        ],
        buttons: [],
        select: {
            style: 'multi',   //选中多行
            selector: 'td:first-child'//选中效果仅对第一列有效
        }

    });





    //查看详情
    function invoiceDetailsRequest(but) {
        $(".payableWriteOff .checkchild").prop("checked", false);
        $("#payableWriteOffTable tbody tr").each(function () {
            payableWriteOff_table.row( this ).deselect();
            $( this ).find('td:first-child').removeClass('selected');
        });
        var thiss=$(but).parents("tr");
        payableWriteOff_table.row( thiss ).select();
        $(but).parents("tr").find('td:first-child').addClass('selected');
        $(but).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);
        emptyAddForm();
        var selectRowData = payableWriteOff_table.rows('.selected').data();
        if (selectRowData.length != 1) {
            callAlert("请选择一条记录！");
            return;
        }
        if(selectRowData.status=='未申请'){
            callAlert("请选择已请款或已审批的数据进行查看！");
            return;
        }
        var data = selectRowData[0];
        //var reconcileCode=selectRowData[0].reconcileCode;
        changeToInput();

        //循环赋值查询条件
        $.each($("#queryConditionsDetailId").find("input"), function (k, input) {
            if (data[$(this).attr("name")] == null) {
                $(this).val(data["accountPayable"][$(this).attr("name")]);
            } else {
                $(this).val(data[$(this).attr("name")]);
            }
        });

        //循环赋值请款单信息
        $.each($("#paymentRequestDetailDivId").find("input"), function (k, input) {
            /*if (data[$(this).attr("name")] == null) {*/
            $(this).val(data[$(this).attr("name")]);
            /*}*/
        });
        $.each($("#applyInfo11").find("input"), function (k, input) {

            // if (data[$(this).attr("name")] == null) {
            //     $(this).val(data["accountPayable"][$(this).attr("name")]);
            // }else {
                $(this).val(data[$(this).attr("name")]);
            // }
        });
        //对账单详情加载

        var id = $("#queryConditionsDetailId input[name = 'payableReconcileId']").val();
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
                $("#detailsOfReimburseDetailTableId tbody tr").remove();
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
                $("#detailsOfReimburseDetailTableId tbody").append(html);
            },
            error : function() {
                // hideMask();
                callAlert("查看详情失败")
            }
        });
        //预付款详情加载
        prepaymentsDetail_tb1.ajax.reload();

        $("#paymentDetailModalId").modal("show");
    }


    function changeToInput() {
        $("#paymentRequestModalForm input[name = 'advanceChargeCurrency']").show();
        $("#hide1").hide();
        $("#paymentRequestModalForm input[name = 'requestCurrency']").show();
        $("#hide2").hide();

    }

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
    function writeOffInsertSelect(selectName,url,handler){
        returnData(url,handler).then(function(res){
            var data = $.map(res, function (obj) {
                for (var key in obj){
                    obj.id = key;// replace name with the property used for the text
                    obj.text = obj[key]; // replace pk with your identifier
                    return obj;
                }
            });
            $("#detailLandQuotationDisperseTable select[name="+selectName+"]").select2({
                data: data
            });
        }).catch(function(){
            callAlert('加载失败')
        })
    }

    return {
        // 将供页面该方法调用
        doSearch:doSearch,
        telescopic:telescopic,
        showPayableWriteOffDetail:showPayableWriteOffDetail,
        WriteOff:WriteOff,
        cancel:cancel,
        addpayableWriteOff:addpayableWriteOff,
        copypayableWriteOff:copypayableWriteOff,
        deletepayableWriteOff:deletepayableWriteOff,
        calculateSum:calculateSum,
        invoiceDetailsRequest:invoiceDetailsRequest
    };

})();