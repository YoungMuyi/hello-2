/**
 * Created by huwf on 2017/8/29.
 */
//@ sourceURL=releaseDocVerify.js
$(document).ready(function(){
    // resize2(190);
    resizeL();
    showButton();
});
$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();

    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

});


var releaseDocVerify = (function() {
     $.validator.setDefaults({
         submitHandler: submitLadingBillRegister
     });
    $().ready(
     function validateReleaseDocVerifyForm() {
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
     // return ReleaseDocVerify_Validator.form();
     }
     );

    var releaseDocVerify_table;
    // var paral = {
    //     // "ReleaseDocVerifyId": "箱型ID",
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
        // tableHeight = $("#releaseDocVerifyTable").height();
        releaseDocVerify_table = $("#releaseDocVerifyTable").DataTable({
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
                "url": getContextPath() + 'accountReleaseDocVerify/accountReleaseDocVerify.do',
                "data": function (d) {
                    search_data = $('#releaseDocVerifySearchForm').serializeObject();
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
                // {title: "箱型ID", data: "releaseDocVerifyId"},
                {title: "业务编号", data: "businessCode"},
                {title: "状态", data: "accountReleaseDocVerify.releaseStatus"},
                {title: "放单方式", data: "accountReleaseDocVerify.releaseMethod"},
                {title: "客户类型",data: "accountReleaseDocVerify.customerType"},
                {title: "客户名称", data: "customerName"},
                {title: "业务范围", data: "businessType"},
                {title: "提单号", data: "billLadingNo"},
                {title: "申请部门", data: "accountReleaseDocVerify.applyDepartment"},
                {title: "申请时间", data: "accountReleaseDocVerify.applyDate"},
                {title: "申请人", data: "applicantName"},
                {title: "申请备注", data: "accountReleaseDocVerify.applyRemark"},
                {title: "审核人", data: "checkName"},
                {title: "审核时间", data: "accountReleaseDocVerify.checkTime"},
                {title: "系统审核评分", data: "accountReleaseDocVerify.systemCheckScore"},
                {title: "领单人", data: "accountReleaseDocVerify.receiveBillManName"},
                {title: "领单时间", data: "accountReleaseDocVerify.receiveBillDate"}

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
                    targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15,16,17]
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
                    container: '#releaseDocVerify_export-copy'
                },
                {
                    extend: 'colvis',
                    text: '自定义列表头',
                    container: '#releaseDocVerify_export-columnVisibility'
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
     $('body').on('click', '.releaseDocVerify .checkall', function () {
         var check = $(this).prop("checked");
         $(".releaseDocVerify .checkchild").prop("checked", check);
         $("#releaseDocVerifyTable tbody tr").each(function () {
         if (check){
         releaseDocVerify_table.row( this ).select();
         $( this ).find('td:first-child').addClass('selected');
         }
         else{
         releaseDocVerify_table.row( this ).deselect();
         $( this ).find('td:first-child').removeClass('selected');
         }
         });
     });

    //监听分页事件,去除复选
    $('#releaseDocVerifyTable').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#releaseDocVerifyTable').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

     // 点击第一格才能选中
     $('#releaseDocVerifyTable tbody').on('click', 'tr td:first-child', function () {
     // $(".selected").not(this).removeClass("selected");
         $(this).toggleClass("selected");
         var check = $(this).hasClass("selected");
         $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
     });

//重置查询条件
    $("#releaseDocVerifySearchPortForm").click( function() {
        $("#releaseDocVerifySearchForm")[0].reset();
        $("#releaseDocVerifySearchForm .select2-selection__rendered").attr("title","").text("");
        releaseDocVerify_table.ajax.reload();
    });

    //搜索 datatable搜索
    function doSearch(){

        releaseDocVerify_table.ajax.reload();

    }

    // 收放搜索栏
    function telescopic(but) {
        var text=$(but).text();
        if(text=="更多搜索"){
            $("#releaseDocVerifySearchForm").animate({height:'100px'});
            // $(but).text("收起搜索").find("i").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
            $(but).html("收起搜索<i class='fa fa-fw fa-angle-double-up'></i>")
            resize2(106);
        }else{
            $("#releaseDocVerifySearchForm").animate({height:'66px'});
            // $(but).text("更多搜索").find("i").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
            $(but).html("更多搜索<i class='fa fa-fw fa-angle-double-down'></i>")
            // resize2(100);
        }

    }

    //时间控件
    $(function(){
        //Date picker
        $('.releaseDocVerify .startTime,.releaseDocVerify .endTime,.releaseDocVerify .receiveBillDate').datepicker({
            autoclose: true,
            language:"zh-CN",//语言设置
            format: "yyyy-mm-dd"
        });
    });
    // 开始时间
    $('#releaseDocVerifyBeginTime').datepicker({
        todayBtn : "linked",
        autoclose : true,
        language:"zh-CN",//语言设置
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var startTime = e.date;
        $('#releaseDocVerifyEndTime').datepicker('setStartDate',startTime);
    });
//结束时间：
    $('#releaseDocVerifyEndTime').datepicker({
        todayBtn : "linked",
        autoclose : true,
        language:"zh-CN",//语言设置
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var endTime = e.date;
        $('#releaseDocVerifyBeginTime').datepicker('setEndDate',endTime);
    });

    function ladingBillRegister() {
        var selectRowData=releaseDocVerify_table.rows('.selected').data();
        if(selectRowData.length!=1){
            callAlert("请选择一条记录！");
            return;
        }
        var data=selectRowData[0];
        if(data.billLadingNo==""){
            callAlert("无提单号可领取！");
            return;
        }else if (data.accountReleaseDocVerify.releaseStatus=="放单失败"){
            callAlert("该条记录不能进行登记！");
            return;
        }else if (data.accountReleaseDocVerify.releaseStatus=="已登记"){
            callAlert("该条记录已登记！");
            return;
        }
        $("#ladingBillRegisterModalForm input[name='billLadingNo']").val(data.billLadingNo);
        $("#ladingBillRegisterModalForm input[name='releaseDocVerifyId']").val(data.accountReleaseDocVerify.releaseDocVerifyId);
        $("#ladingBillRegisterModalForm input[name='receiveBillDate']").val($.date.format(new Date(),"yyyy-MM-dd"));
        $("#ladingBillRegisterModal").modal("show");
    }
    function submitLadingBillRegister() {
        var accountReleaseDocVerify=$("#ladingBillRegisterModalForm").serializeObject();
        $.ajax({
            type : 'POST',
            url : getContextPath() + 'accountReleaseDocVerify/ladingBillRegister.do',
            data : {
                accountReleaseDocVerify : JSON.stringify(accountReleaseDocVerify)
            },
            dataType : 'json',
            beforeSend : function() {
                // showMask();//显示遮罩层
            },
            success : function(rsp) {
                if (rsp.code == 0) {
                    callSuccess(rsp.message);
                    $('#ladingBillRegisterModal').modal('hide');
                    releaseDocVerify_table.ajax.reload();

                }
                else
                    callAlert(rsp.message);
            },
            error : function() {
                // hideMask();
                callAlert("登记失败")
            }
        });

    }

    return {
        // 将供页面该方法调用
        doSearch:doSearch,
        telescopic:telescopic,
        ladingBillRegister:ladingBillRegister,
        submitLadingBillRegister:submitLadingBillRegister

    };

})();