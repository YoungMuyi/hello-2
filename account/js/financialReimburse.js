//@ sourceURL=financialReimburse.js
// $('#lxy_basicdata_tb').DataTable().empty();
//标题行

var financialReimburse = (function(){

    $(function () {
        //Initialize Select2 Elements，初始化银行下拉框架
        $(".select2").select2();
        resizeL();

        // //初始化查询form的港口下拉列表
        /*initSelect2FromRedis("searchAccountExchangeRateForm","originalCurrency", "redisController/listIdNameByName.do?name=basedataCommonSet_3", "{}", "currencyCode", "currencyName");
        initSelect2FromRedis("searchAccountExchangeRateForm","targetCurrency", "redisController/listIdNameByName.do?name=basedataCommonSet_3", "{}", "currencyCode", "currencyName");

        //初始化编辑form的港口下拉列表
        initSelect2FromRedis("editAccountExchangeRateForm","originalCurrency", "redisController/listIdNameByName.do?name=basedataCommonSet_3", "{}", "currencyCode", "currencyName");
        initSelect2FromRedis("editAccountExchangeRateForm","targetCurrency", "redisController/listIdNameByName.do?name=basedataCommonSet_3", "{}", "currencyCode", "currencyName");*/

        // initSelect2FromDB("editWharfForm","portId","basedataPort/listByKeys.do","{}","portId","portName");

        //解决select2 在弹出框中不能搜索的问题
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };

        //Date picker
        $('.beginDate,.endDate,.feeDate').datepicker({
            autoclose: true,
            language:"zh-CN",//语言设置
            format: "yyyy-mm-dd"
        });

    });

    $.validator.setDefaults({
        submitHandler: submitFinancialReimburse
    });
    $().ready(
        function validateFinancialReimburseModalForm1() {
            $("#financialReimburseModalForm1").validate({
                rules: {
                    feeStartTime: {
                        required: true
                    },
                    feeEndTime: {
                        required: true
                    },
                    customerName: {
                        required: true
                    },
                    businessId: {
                        required: true
                    },
                    feeName: {
                        required: true
                    },
                    feeCode: {
                        required: true
                    },
                    feeDate: {
                        required: true
                    },
                    billCount: {
                        required: true
                    },
                    feeAmount: {
                        required: true
                    },
                    description: {
                        required: true
                    }
                    // loadingWharfId: {
                    //     maxlength: 11
                    // },
                    // dischargingPortId: {
                    //     required: true,
                    //     // maxlength: 11
                    // },
                    // dischargingWharfId: {
                    //     // required: true,
                    //     maxlength: 11
                    // },
                    // transshipmentPortId: {
                    //     maxlength: 11
                    // },
                    // serviceLine: {
                    //     required: true,
                    //     maxlength: 30
                    // },
                    // closingDate: {
                    //     maxlength:20
                    // },
                    // sailingDate: {
                    //     required: true,
                    //     maxlength: 20
                    // },
                    // voyage: {
                    //     required: true,
                    //     maxlength: 11,
                    //     digits: true
                    // },
                    // vesselParameterId: {
                    //     required: true,
                    //     maxlength: 11
                    // },
                    // serviceLineId: {
                    //     maxlength: 30
                    // },
                    // swb: {
                    //     maxlength: 10
                    // },
                    // currencyId: {
                    //     maxlength: 11
                    // },
                    // price20: {
                    //     maxlength: 10,
                    //     min:0.01,
                    //     max:10000
                    // },
                    // price40: {
                    //     maxlength: 10,
                    //     min:0.01,
                    //     max:10000
                    // },
                    // price40h: {
                    //     maxlength: 10,
                    //     min:0.01,
                    //     max:10000
                    // },
                    // price45: {
                    //     maxlength: 10,
                    //     min:0.01,
                    //     max:10000
                    // },
                    // price20Remark:{
                    //     maxlength: 100
                    // },
                    // price40Remark:{
                    //     maxlength: 100
                    // },
                    // price40hRemark:{
                    //     maxlength: 100
                    // },
                    // price45Remark:{
                    //     maxlength: 100
                    // },
                    // priceOtherRemark:{
                    //     maxlength: 100
                    // },
                    // space: {
                    //     maxlength: 20
                    // },
                    // documentStyle: {
                    //     maxlength: 20
                    // },
                    // customerService: {
                    //     maxlength: 50
                    // },
                    // internalRemark:{
                    //     maxlength:100
                    // },
                    // beginEnableTime: {
                    //     required: true
                    // }
                },
                errorPlacement: function(){
                    return false;
                }

                // messages: {
                //     equipmentCode: {
                //         required: "这是必填字段",
                //         maxlength: "请不要超过限制的5个字符数"
                //     },
                //     shippingQuotationCode: {
                //         // required: true,
                //         maxlength:  "请不要超过限制的40个字符数"
                //     },
                //     loadingPortId: {
                //         required:"这是必填字段",
                //         // maxlength: 5
                //     },
                //     loadingWharfId: {
                //         maxlength:  "请不要超过限制的11个字符数"
                //     },
                //     dischargingPortId: {
                //         required: "这是必填字段",
                //         maxlength:  "请不要超过限制的11个字符数"
                //     },
                //     dischargingWharfId: {
                //         // required: true,
                //         maxlength:  "请不要超过限制的11个字符数"
                //     },
                //     transshipmentPortId: {
                //         maxlength:  "请不要超过限制的11个字符数"
                //     },
                //     serviceLine: {
                //         required: "这是必填字段",
                //         maxlength:  "请不要超过限制的30个字符数"
                //     },
                //     closingDate: {
                //         maxlength: "请不要超过限制的20个字符数"
                //     },
                //     sailingDate: {
                //         required: "这是必填字段",
                //         maxlength:  "请不要超过限制的20个字符数"
                //     },
                //     voyage: {
                //         required:"这是必填字段",
                //         maxlength:  "请不要超过限制的11个字符数",
                //         digits: "请输入正确的数字"
                //     },
                //     vesselParameterId: {
                //         required: "这是必填字段",
                //         maxlength:  "请不要超过限制的11个字符数"
                //     },
                //     serviceLineId: {
                //         maxlength:  "请不要超过限制的30个字符数"
                //     },
                //     swb: {
                //         maxlength:  "请不要超过限制的10个字符数"
                //     },
                //     currencyId: {
                //         maxlength:  "请不要超过限制的11个字符数"
                //     },
                //     price20: {
                //         maxlength:  "请不要超过限制的10个字符数",
                //         min:"请输入正确的数字"
                //     },
                //     price40: {
                //         maxlength:  "请不要超过限制的10个字符数",
                //         min:"请输入正确的数字"
                //     },
                //     price40h: {
                //         maxlength:  "请不要超过限制的10个字符数",
                //         min:"请输入正确的数字"
                //     },
                //     price45: {
                //         maxlength:  "请不要超过限制的10个字符数",
                //         min:"请输入正确的数字"
                //     },
                //     space: {
                //         maxlength:  "请不要超过限制的20个字符数"
                //     },
                //     documentStyle: {
                //         maxlength: "请不要超过限制的20个字符数"
                //     },
                //     customerService: {
                //         maxlength: "请不要超过限制的50个字符数"
                //     }
                // }
            });
            // return ShippingQuotation_Validator.form();
        }
    );

    var financialReimburse_tb;

    // var paral={
    //     "status":"状态",
    //     "reimburseCode":"报销编号",
    //     "feeName":"费用名称",
    //     "reimburseAmount":"金额(元)",
    //     "customerName":"客户名称",
    //     "businessCode":"业务编号",
    //     "applicantId":"上报人",
    //     "applyDate":"上报时间",
    //     "reviewerId":"审核人",
    //     "reviewDate":"审核时间",
    //     "reviewProcess":"审核过程",
    //     "remark":"备注"
    // };
    Init();
    function Init() {

        financialReimburse_tb =  $("#financialReimburseTable").DataTable( {
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
                "url" : getContextPath()+'accountFinancialReimburse/listByPage.do',
                "data": function(d){
					// alert(JSON.stringify($('#searchForm').serializeObject()));
                    search_data = $(
                        '#searchFinancialReimburseForm')
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
                    // d.keys =  JSON.stringify($('#searchFinancialReimburseForm').serializeObject());
                }

            },
            // "dataSrc" : function(data) {
            //     //在该方法中可以对服务器端返回的数据进行处理。
            //     ids1 = '(';
            //     for (var i = 0; i < data.aaData.length; i++) {
            //         if (data.aaData[i].beginEnableTime != ''
            //             || data.aaData[i].beginEnableTime == undefined) {
            //             data.aaData[i].beginEnableTime = $.date
            //                 .format(
            //                     new Date(
            //                         data.aaData[i].beginEnableTime),
            //                     "yyyy-MM-dd");
            //         }
            //         if (data.aaData[i].endEnableTime != ''
            //             || data.aaData[i].endEnableTime == undefined) {
            //             data.aaData[i].endEnableTime = $.date
            //                 .format(
            //                     new Date(
            //                         data.aaData[i].endEnableTime),
            //                     "yyyy-MM-dd");
            //         }
            //
            //         ids1 += data.aaData[i].invoiceManagementPayId;
            //         ids1 += ',';
            //     }
            //     ids1 = ids1.substring(0, ids1.length - 1);
            //     ids1 += ')';
            //
            //     return data.aaData;
            // },
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
                    "data": "financialReimburseId",
                    "title":"<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';

                    },
                    "Sortable": false

                },
                { title: "状态",data:"status" },
                {
                    title: "报销编号",
                    data:"reimburseCode"

                },
                { title: "金额(元)",data:"reimburseAmount" },
                { title: "客户名称",data:"customerName" },

                { title: "业务编号",data:"businessCode" },
                { title: "上报人",data:"applicantName" },
                { title: "上报时间",data:"applyDate" },
                { title: "审核人",data:"reviewerName" },
                { title: "审核时间",data:"reviewDate" },
                { title: "审核过程",data:"reviewProcess" },
                { title: "备注",data:"remark" }


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
                    targets: [1,2,3,4,5,6, 7, 8, 9, 10, 11, 12]
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
    $('#resetSearchFinancialReimburseForm').click(function () {
        $("#searchFinancialReimburseForm")[0].reset();
        $("#searchFinancialReimburseForm .select2-selection_rendered").attr("title", "").text("");
        emptySelect2Value('searchFinancialReimburseForm', 'status');
        financialReimburse_tb.ajax.reload();
    });

    //查询按钮
    function doSearch() {
        financialReimburse_tb.ajax.reload();
    }

    // select/not select all
    $('body').on('click' , '.financialReimburse .checkall' , function(){
        var check = $(this).prop("checked");
        $(".financialReimburse .checkchild").prop("checked", check);
        //通过调用datatables的select事件来触发选中
        $("#financialReimburseTable tbody tr").each(function () {
            if (check){
                financialReimburse_tb.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                financialReimburse_tb.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

    });

    //监听分页事件,去除复选
    $('#financialReimburse_tb').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#financialReimburse_tb').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#financialReimburseTable tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        // console.log(table.rows('.selected').data().length);
    });

    // 清空弹框
    function emptyAddForm() {
        $("#financialReimburseModalForm1")[0].reset();
        $("#financialReimburseDetailTable tbody").empty();
        $('#detailForm')[0].reset();
        $("#detailForm table tbody").empty();
        //设置select2默认值为空
        emptyFormSelect2Value("financialReimburseModalForm1", ["relatedProject", "customerName", "businessId"]);

        $("label.error").remove();//清除提示语句
    }
    

    //add
    function addFinancialReimburse() {
        emptyAddForm();
        // 开始增加一行
        $("#financialReimburseModalForm1 .error").removeClass("error");
        addReimburseDetail();
        //设置默认值amender,amenderName,amendTime
        setDefaultValue($('#financialReimburseModalForm1'),'insert');
        $("#financialReimburseModalForm1 input[name = 'reimburseCode']").val("自动生成");
        var loginCookie=JSON.parse($.cookie("loginingEmployee"));
        $("#financialReimburseModalForm1 input[name = 'applicantId']").val(loginCookie.user.userId);
         $("#financialReimburseModalForm1 input[name = 'applicantName']").val(loginCookie.user.username);
        $("#financialReimburseModalForm1 input[name = 'applyDepartment']").val(loginCookie["organizationStructrueName"]);
        $("#financialReimburseModalForm1 input[name = 'applyDate']").val( $.date.format(new Date(),"yyyy-MM-dd"));
        $("#financialReimburseModalTitle").html("增加");
        $('#financialReimburseModal').modal('show');

        initSelect2FromRedis14("financialReimburseModalForm1","customerName","saleCustomerEmployee/getAll.do","{}","customerNameForShow","customerCode");
    }

    function selector2(selector2)
    {
        var pvalue = $(selector2).val();
        var code = $(selector2).find("option[value='" + pvalue + "']").attr(
            "data-code");
        initSelect2FromRedis15("financialReimburseModalForm1","businessId","saleCustomerEmployee/getBusinessId.do","{customerCode:'"+code+"'}","businessCode");
    }


    // 费用开始时间
    $('#feeStartTime').datepicker({
        todayBtn : "linked",
        autoclose : true,
        language:"zh-CN",//语言设置
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var startTime = e.date;
        $('#feeEndTime').datepicker('setStartDate',startTime);
    });
    //费用结束时间：
    $('#feeEndTime').datepicker({
        todayBtn : "linked",
        autoclose : true,
        language:"zh-CN",//语言设置
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var endTime = e.date;
        $('#feeStartTime').datepicker('setEndDate',endTime);
    });

    //费用报销-新增保存按钮
    function submitFinancialReimburse() {
        var data = $("#financialReimburseModalForm1").serializeObject();
        data.reimbursementDetails = [];
        data.reimburseAmount = 0;
        //将报销明细也存入要传的数据中
        $("#financialReimburseDetailTable tbody").find("tr").each(function () {
            var detailDate = $(this).serializeObject();
            if (detailDate.feeAmount != null && detailDate.feeAmount != 0) {
                data.reimburseAmount += parseInt(detailDate.feeAmount);
            } else if (detailDate.feeAmount < 0) {
                callAlert("费用必须大于0！")
                return;
            }
            if (detailDate.feeName != null && detailDate.feeName != "") {
                data.reimbursementDetails.push(detailDate);
            }else {
                callAlert("请选择费用名称！");
                return;
            }
        });

        var saveType = "insert";
        //传输数据
        $.ajax({
            url: getContextPath() + 'accountFinancialReimburse/insert.do',
            type: 'POST',
            data:{
                financialReimburse: JSON.stringify(data)
            },
            dataType: 'json',
            async: false,
            success: function (res) {

                if(res.code ==0){
                    callSuccess(res.message);
                    financialReimburse_tb.ajax.reload();
                }
                else

                    callAlert(res.message);

            },
            error: function () {
                if(saveType=="insert"){
                    callAlert("新增失败！");
                }else {
                    callAlert("编辑失败！");
                }
                // $.messager.alert('系统提示','申请失败,请重试！','warning');
            }
        });
        $('#financialReimburseModal').modal('hide');//现实模态框
        financialReimburse_tb.ajax.reload();
    }


    //edit
    function editFinancialReimburse() {
        emptyAddForm();
        var selectRowData = financialReimburse_tb.rows('.selected').data();
        if (selectRowData.length != 1) {
            callAlert("请选择一条记录进行编辑！");
            return;
        }
        var data = selectRowData[0];
        if (data["status"] != "已上报" && data["status"] != "业务经理打回" && data["status"] != "财务经理打回" && data["status"] != "已撤回") {
            callAlert("该记录业务已审（财务已审），不能修改！");
            return;
        }

        initSelect2FromRedis14("financialReimburseModalForm1","customerName","saleCustomerEmployee/getAll.do","{}","customerNameForShow","customerCode");

        // 循环给表单赋值
        $.each($("#financialReimburseModalForm1 input,#financialReimburseModalForm1 select "), function (i, input) {

            $(this).val(data[$(this).attr("name")]);

        });
        //设置默认值amender ,amenderName,amendTime,saveType
        setDefaultValue($("#editInterestMaintenanceModalBody"), 'update');
        $("#financialReimburseModalForm1 input[name='financialReimburseId']").val(data['financialReimburseId']);
        $("#financialreimbursemodalform1 select[name='customerName']").select2('val',[data.customerName]);
        $("#financialReimburseModalTitle").html("修改");

        xx = data["financialReimburseId"];
        //加载费用报销修改
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountFinancialReimburse/detailOfReimburse.do',
            data: {
                financialReimburseId : xx
            },
            cache: false,
            dataType: "json",
            beforeSend: function () {
                showMask();//显示遮罩层
            },
            success: function (res) {
                hideMask();
                $('#financialReimburseDetailTable tbody').empty();
                $('#financialReimburseDetailTable tbody').empty();
                var financialReimburseId = $("#financialReimburseId").val();
                for (var i = 0; i < res["aaData"].length; i++){
                    var html = '<tr class="surcharge">'
                        + '<td style="width: 5%;">'
                        + '<input type="checkbox" name="checkSurcharge">'
                        + '<td style="width: 17%;">'
                        + '<input type="text" class="form-control" name="feeName" style="width:100%;height:30px;" disabled>'
                        + '</td>'

                        + '<td style="width: 17%;">'
                        + '<select name="feeCode" onchange="financialReimburse.selector(this)"  class="form-control select2 selector" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
                        + '<option value=""></option>'
                        + '</select>'
                        + '</td>'

                        + '<td style="width: 17%;">'
                        + '<input type="text" class="form-control feeDate" name="feeDate" style="width:100%;height:30px;">'
                        + '</td>'
                        + '<td style="width: 17%;">'
                        + '<input type="text" class="form-control" name="billCount" style="width:100%;height:30px;">'
                        + '</td>'
                        + '<td style="width: 10%;">'
                        + '<input type="text" class="form-control" name="feeAmount" style="width:100%;height:30px;">'
                        + '</td>'
                        + '<td style="width: 17%;">'
                        + '<input type="text" class="form-control" name="description" style="width:100%;height:30px;">'
                        + '</td>' + '<td style="display: none">' +
                        '<div class="form-group" hidden="true" style="display:none">'
                        + '<input type="text" name="financialReimburseId" value="'
                        + financialReimburseId + '">'
                        + '<input type="text" name="financialReimburseDetailId" value="'
                        + res['aaData'][i]['financialReimburseDetailId'] + '">'
                        +'</div>' + '</td>' + '</tr>';

                    $('#financialReimburseDetailTable tbody').append(html);
                    // 循环赋值
                    $.each($("#financialReimburseDetailTable .surcharge").eq(i).find("select"), function (k, input) {
                        $(this).val(res['aaData'][i][$(this).attr("name")]);
                    });
                    $.each($("#financialReimburseDetailTable .surcharge").eq(i).find("input"), function (k, input) {
                        $(this).val(res['aaData'][i][$(this).attr("name")]);
                    });
                    // $("#financialReimburseDetailTable select[name = 'feeName']").children().remove();
                    // $("#financialReimburseDetailTable select[name = 'feeName']").append("<option value='"+res['aaData'][i]['feeName']+"'>"+res['aaData'][i]['feeName']+"</option>");
                }

            },
            error: function () {
                callAlert("查看失败");
            }
        });
        $('#financialReimburseModal').modal('show');
    }

    // //revoke
    // function revokeFinancialReimburse() {
    //     emptyAddForm();
    //     $('#financialReimburseModal').modal('show');
    // }


    //查看详情
    function seeFinancialReimburseDetail() {
        emptyAddForm();
        var selectRowData = financialReimburse_tb.rows('.selected').data();
        if (selectRowData.length != 1) {
            callAlert("请选择一条记录查看详情！");
            return;
        }
        var data = selectRowData[0];
        // 循环给表单赋值
        $.each($("#detailForm input,#detailForm select "), function (i, input) {

            $(this).val(data[$(this).attr("name")]);

        });
        $("#financialReimburseModalTitle").html("费用报销-详情");
        xx = data["financialReimburseId"];
        //加载费用报销修改
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountFinancialReimburse/detailOfReimburse.do',
            data: {
                financialReimburseId : xx
            },
            cache: false,
            dataType: "json",
            beforeSend: function () {
                showMask();//显示遮罩层
            },
            success: function (res) {
                hideMask();
                $('#detail2_table tbody').empty();
                var financialReimburseId = $("#financialReimburseId").val();
                for (var i = 0; i < res["aaData"].length; i++){
                    var html = '<tr class="surcharge">'
                        + '<td style="width: 15%;">'
                        // + '<select name="feeName" class="form-control" style="width:100%;height: 30px" tabindex="-1" aria-hidden="true">'
                        // + '<option value=""></option>'
                        // + '<option value="招待费">招待费</option>'
                        // + '<option value="差旅费">差旅费</option>'
                        // + '</select>'
                        + res['aaData'][i]['feeName']
                        // + '</td>'
                        // + '<td style="width: 15%;">'
                        // + '<input type="text" class="form-control" name="feeCode" style="width:100%;height:30px;">'
                        // + '</td>'
                        + '<td style="width: 20%;">'
                        // + '<input type="text" class="form-control feeDate" name="feeDate" style="width:100%;height:30px;">
                        + res['aaData'][i]['feeDate']
                        + '</td>'
                        + '<td style="width: 15%;">'
                        // + '<input type="text" class="form-control" name="billCount" style="width:100%;height:30px;">'
                        + res['aaData'][i]['billCount']
                        + '</td>'
                        + '<td style="width: 15%;">'
                        // + '<input type="text" class="form-control" name="feeAmount" style="width:100%;height:30px;">'
                        + res['aaData'][i]['feeAmount']
                        + '</td>'
                        + '<td style="width: 20%;">'
                        // + '<input type="text" class="form-control" name="description" style="width:100%;height:30px;">'
                        + res['aaData'][i]['description']
                        + '</tr>';

                    $('#detail2_table tbody').append(html);
                    // // 循环赋值
                    // $.each($("#detail2_table .surcharge").eq(i).find("select"), function (k, input) {
                    //     $(this).val(res['aaData'][i][$(this).attr("name")]);
                    // });
                    // $.each($("#detail2_table .surcharge").eq(i).find("input"), function (k, input) {
                    //     $(this).val(res['aaData'][i][$(this).attr("name")]);
                    // });
                    // $("#financialReimburseDetailTable select[name = 'feeName']").append("<option value='"+res['aaData'][i]['feeName']+"'>"+res['aaData'][i]['feeName']+"</option>");
                }

            },
            error: function () {
                callAlert("查看失败");
            }
        });
        // $("#financialReimburseModalForm1 input").attr("readonly", "readonly");
        // $("#financialReimburseModalForm1 select").attr("disable", "disable");
        // $("#financialReimburseDetailTable input").attr("disable", "disable");
        // $('#financialReimburseModal').modal('show');
        $('#detailModal').modal('show');

    }

    //报销明细增加一行按钮
    function addReimburseDetail() {
        // var id="detailno."+adddetailid++;
        var financialReimburseId = $("#financialReimburseId").val();

        var html = '<tr  class="surcharge">'
            + '<td style="width: 5%;">'
            + '<input type="checkbox" name="checkSurcharge">'
            + '</td>'

            + '<td style="width: 17%;">'
            + '<input type="text" class="form-control" name="feeName" style="width:100%;height:30px;" readonly>'
            + '</td>'

            + '<td style="width: 17%;">'
            + '<select name="feeCode" onchange="financialReimburse.selector(this)"  class="form-control select2 selector" style="width:100% !important;height: 30px !important" tabindex="-1" aria-hidden="true">'
            + '<option value=""></option>'
            + '</select>'
            + '</td>'

            + '<td style="width: 17%;">'
            + '<input type="text" class="form-control feeDate" name="feeDate" style="width:100%;height:30px;">'
            + '</td>'
            + '<td style="width: 17%;">'
            + '<input type="text" class="form-control" name="billCount" style="width:100%;height:30px;">'
            + '</td>'
            + '<td style="width: 10%;">'
            + '<input type="text" class="form-control" name="feeAmount" style="width:100%;height:30px;">'
            + '</td>'
            + '<td style="width: 17%;">'
            + '<input type="text" class="form-control" name="description" style="width:100%;height:30px;">'
            + '</td>' + '<td style="display: none">' +
            '<div class="form-group" hidden="true" style="display:none">'
            + '<input type="text" name="financialReimburseId" value="'
            + financialReimburseId + '">'
            + '<input type="text" name="reimburseDetailId">'
            +'</div>' + '</td>' + '</tr>';

        $("#financialReimburseDetailTable tbody").append(html);

        //  $('#financialReimburseDetailTable select[name="feeCode"]').rules('add',{required:true});
        // $('#'+id+' input[name="feeName"]').rules('add',{required:true});
        // $('#'+id+' input[name="feeDate"]').rules('add',{required:true});
        // $('#'+id+' input[name="feeName"]').valid();

        $('.feeDate').datepicker({
            autoclose: true,
            language:"zh-CN",//语言设置
            format: "yyyy-mm-dd"
        });
        initSelect2FromRedis5("financialReimburseModalForm1", "feeCode", "basedataCharge/getAll.do", "{}", "chargeId", "code","cnName");
    }

    // $('#financialReimburseSubmit').on('click',function(){
    //     $('#financialReimburseModalForm1').valid();
    //
    // })

    function selector(selector) {
        var pvalue = $(selector).val();
        var name = $(selector).find("option[value='" + pvalue + "']").attr(
            "data-name");
        $(selector).parents("tr").find("input[name=feeName]").val(name).attr(
            "title", name);
    }

    //报销明细全选/全不选
    $(".checkAllSurcharge").on('click',function () {
        var check = $(this).prop("checked");
        if(check){
            $("#financialReimburseDetailTable input[name='checkSurcharge']").each(function () {
                $(this).prop('checked',true);
            });
        }else{
            $("#financialReimburseDetailTable input[name='checkSurcharge']").each(function () {
                $(this).prop('checked',false);
            });
        }
    });

    //报销明细中删除一条数据
    function deleteReimburseDetail() {
        $("#financialReimburseDetailTable input[name='checkSurcharge']:checked").each(function () {
            $(this).parent().parent().remove();
        });
    }


   


    return {
        // 将供页面该方法调用
        doSearch:doSearch,
        addFinancialReimburse:addFinancialReimburse,
        editFinancialReimburse:editFinancialReimburse,
        // revokeFinancialReimburse:revokeFinancialReimburse,
        seeFinancialReimburseDetail:seeFinancialReimburseDetail,
        addReimburseDetail:addReimburseDetail,
        deleteReimburseDetail:deleteReimburseDetail,
        submitFinancialReimburse:submitFinancialReimburse,
        selector:selector,
        selector2:selector2
    };

})();

// var adddetailid = 0;

// var financialReimburseSelector2={selector2:function()
//     {
//         var pvalue = $(selector).val();
//         var code = $(selector).find("option[value='" + pvalue + "']").attr(
//             "data-code");
//         initSelect2FromRedis14("financialReimburseModalForm1","businessId","saleCustomerEmployee/getBusinessId.do","{customerCode:"+code+"}","businessId","businessId");
//     }
// }