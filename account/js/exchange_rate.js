//@ sourceURL=exchange_rate.js
 // $('#lxy_basicdata_tb').DataTable().empty();
    //标题行
var AccountExchangeRate = (function(){
 $.validator.setDefaults({
     submitHandler:submitEditAccountExchangeRateModal

 });
$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();

    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    //Date picker
    $('.beginDate,.endDate').datepicker({
        autoclose: true,
        language:"zh-CN",//语言设置
        format: "yyyy-mm-dd"
    });


    //根据上月末汇率+本月初汇率自动计算汇率
    $("input[name='lastMonthExchangeRate']").blur(function(){

       var  lastMonthExchangeRate = $("input[name='lastMonthExchangeRate']").val();
       var  thisMonthExchangeRate = $("input[name='thisMonthExchangeRate']").val();

       if(lastMonthExchangeRate != undefined && lastMonthExchangeRate !="" &&
           thisMonthExchangeRate != undefined && thisMonthExchangeRate != "")
           $("input[name='exchangeRate']").val((Number(lastMonthExchangeRate) + Number(thisMonthExchangeRate))/2 );

    });

    $("input[name='thisMonthExchangeRate']").blur(function(){

        var  lastMonthExchangeRate = $("input[name='lastMonthExchangeRate']").val();
        var  thisMonthExchangeRate = $("input[name='thisMonthExchangeRate']").val();

        if(lastMonthExchangeRate != undefined && lastMonthExchangeRate !="" &&
            thisMonthExchangeRate != undefined && thisMonthExchangeRate != "")
            $("input[name='exchangeRate']").val((Number(lastMonthExchangeRate) + Number(thisMonthExchangeRate))/2 );
    });


});

 $().ready(
     function validateAccountExchangeRateForm() {
         $("#editAccountExchangeRateForm").validate({
             rules: {
                 originalCurrencyName: {
                     required:true
                 },
                 targetCurrencyName: {
                     required:true
                 },
                 lastMonthExchangeRate: {
                     required:true,
                     max:10000,
                     af:true
                 },
                 thisMonthExchangeRate: {
                     required:true,
                     max:10000,
                     af:true
                 },
                 beginDate: {
                     required:true
                 },
                 endDate: {
                     required:true
                 }
             },
             errorPlacement: function(){
                 return false;
             }
         });
     }
 );
    var AccountExchangeRate_table;

    var paral={
        "originalCurrencyName":"原币种",
        "targetCurrencyName":"目标币种",
        /*"lastMonthExchangeRate":"上月末汇率",
        "thisMonthExchangeRate":"本月初汇率",*/
        "exchangeRate":"汇率",
        "beginDate":"开始",
        "endDate":"结束"
    };

    Init();
    function Init() {

        AccountExchangeRate_table =  $("#AccountExchangeRate_table").DataTable( {
            fnRowCallback: rightClick,//利用行回调函数，来实现右键事件
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
//			 ajax: "../mock_data/user.txt",
            ajax : {
                "type" : "POST",
                 // "url": "../mock_data/AccountExchangeRate.json",
                "url" : getContextPath()+'accountExchangeRate/listByPage.do',
                "data": function(d){
//					alert(JSON.stringify($('#searchForm').serializeObject()));
                    d.keys =  JSON.stringify($('#searchAccountExchangeRateForm').serializeObject());
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
                    "data": "exchangeRateId",
                    "title":"<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';

                    },
                    "Sortable": false

                },
                { title: "原币种",data:"originalCurrencyName" },
                { title: "目标币种",data:"targetCurrencyName" },
           /*     { title: "上月末汇率",data:"lastMonthExchangeRate" },
                { title: "本月初汇率", data:"thisMonthExchangeRate"},*/
                { title: "汇率", data:"exchangeRate"},
                { title: "开始", data:"beginDate"},
                { title: "结束", data:"endDate"},
                {
                    title: "操作人",
                    "data": "baseModel",

                    "render": function (data, type, full, meta) {
                        return (data == null || data == undefined ) ? '': data.amenderName;
                    },
                    // "bSortable": false,
                },

                { title: "操作时间",data:"amendTime"}


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
                    targets: [1,2,3,4,5,6]
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


    // select/not select all
    $('body').on('click' , '.exchange_rate .checkall' , function(){
        var check = $(this).prop("checked");
        $(".exchange_rate .checkchild").prop("checked", check);
        //通过调用datatables的select事件来触发选中
        $("#AccountExchangeRate_table tbody tr").each(function () {
            if (check){
                AccountExchangeRate_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                AccountExchangeRate_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

    });

    //监听分页事件,去除复选
    $('#AccountExchangeRate_table').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#AccountExchangeRate_table').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#AccountExchangeRate_table tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        // console.log(table.rows('.selected').data().length);
    });

    //add
    function addAccountExchangeRate() {
    // $("#addAccountExchangeRate").on('click',function () {
        emptyAddForm();

        //设置默认值amender ,amenderName,amendTime,saveType

        $('#exchangeRateEndDate1').datepicker('setStartDate',null);
        $('#exchangeRateBeginDate2').datepicker('setEndDate',null);

        setDefaultValue($("#editAccountExchangeRateModal"), 'insert');

        $('#editAccountExchangeRateModalTitle').html("新增");

        $('#editAccountExchangeRateModal').modal('show');//现实模态框
        // })
    }
    //edict item
    function editAccountExchangeRate() {
        // $("#editAccountExchangeRate").click(function () {
        emptyAddForm();
        var selectedRowData = AccountExchangeRate_table.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录进行编辑！");
            return;
        }
        var data = selectedRowData[0];

        // 循环给表单赋值
        $.each($("#editAccountExchangeRateForm input,#editAccountExchangeRateForm select "), function (i, input) {

            $(this).val(data[$(this).attr("name")]);

        });

        //设置默认值amender ,amenderName,amendTime,saveType
        setDefaultValue($("#editAccountExchangeRateModalBody"), 'update');
        $("#editAccountExchangeRateForm input[name='amenderName']").val(  data.baseModel.amenderName);

        //设置原币种、目标币种的值
        setFormSelect2Value("editAccountExchangeRateForm", ["originalCurrencyName","targetCurrencyName"],[data["originalCurrencyName"],data["targetCurrencyName"]]);

        $('#editAccountExchangeRateModal').modal('show');//现实模态框

        // })
    }
    //确定增加或者保存编辑；submitEditAccountExchangeRateModal
     function submitEditAccountExchangeRateModal() {
        // if(!validateAccountExchangeRateForm()){
        //     // alert("validate error!");
        //     return;
        // }
            var data = $("#editAccountExchangeRateForm").serializeObject();
            var saveType = $("#editAccountExchangeRateForm input[name='saveType']").val();
            
            //delete amendTime
            delete data["amendTime"];

            // 测试使用
            // AccountExchangeRate_table.row.add(data).draw();//插入一行
            // callSuccess("保存成功");

            $.ajax({
                type: 'POST',
                url: getContextPath() + 'accountExchangeRate/'+saveType+'.do',
                data: {
                    accountExchangeRate: JSON.stringify(data)
                },
                cache: false,
                dataType: "json",
                beforeSend: function () {
                    showMask();//显示遮罩层
                },
                success: function (res) {
                    hideMask();

                    if (res.code == 0) {
                        callSuccess(res.message);
                        $('#editAccountExchangeRateModal').modal('hide');//现实模态框
                        AccountExchangeRate_table.ajax.reload();

                    }
                    else
                        callAlert(res.message);
                	 
                	
                },
                error: function () {
                    hideMask();
                    callAlert("增加失败");
                }
            });

        }


    // delete item
    function deleteAccountExchangeRate() {
        // $("#deleteAccountExchangeRate").click(function () {
        var info;
        var selectedRowData = AccountExchangeRate_table.rows('.selected').data();
        if (selectedRowData.length < 1) {
            info = "请选择需要删除的数据！";
            callAlert(info);
            return;
        }

        info = "确定要删除" + selectedRowData.length + "条数据吗?";
        callAlertModal(info, 'AccountExchangeRate_confirmDelete');

    }
    $('#alertModal').on('click',".AccountExchangeRate_confirmDelete",function () {
        //确定删除
            var ids = [];
        var selectedRowData = AccountExchangeRate_table.rows('.selected').data();
            $.each(selectedRowData, function () {

                ids.push(this.exchangeRateId);
            });

            $.ajax({
                url: getContextPath() + 'accountExchangeRate/delete.do',
                data: {
                    exchangeRateIds: ids.join(',')
                },
                dataType: 'json',
                beforeSend: function () {
                    showMask();//显示遮罩层
                },
                success: function (rsp) {
                    hideMask();

                    if(rsp.code ==0){
                        callSuccess(rsp.message);

                        AccountExchangeRate_table.ajax.reload();
                    }
                    else
                        callAlert(rsp.message);
                },
                error: function (res) {
                    hideMask();
                    alert(res.code);
                    callAlert("修改失败！")
                }
            });
        });


    //refesh table
   // $("#refreshAccountExchangeRate").click(function () {
    function doSearch() {
        // table.ajax.url( '../mock_data/objects_public_02.txt' ).load();
        AccountExchangeRate_table.ajax.reload();
    }
    //
    // $('#AccountExchangeRate_table tbody').on('click', 'tr', function () {
    //     // $(".selected").not(this).removeClass("selected");
    //     $(this).toggleClass("selected");
    //     var check = $(this).hasClass("selected")
    //     $(this).find("input[type=checkbox]").prop("checked", check);//把查找到checkbox并且勾选
    //     console.log( AccountExchangeRate_table.rows('.selected').data().length);
    // } );


    // click item display detail infomation
    $('#AccountExchangeRate_table tbody').on('dblclick', 'tr', function () {
        var  data = AccountExchangeRate_table.rows($(this)).data()[0];
        $("#detail_table").html("");
        DisplayDetail(data,paral);
    } );
    $('#showAccountExchangeRateDetail').on('click',function () {
        var rows_data = AccountExchangeRate_table.rows('.selected').data();
        if(rows_data.length<1){
            callAlert("请选择一条数据进行查看");
            return;
        }
        for (var i=0;i<rows_data.length;i++){
            $("#detail_table").html("");
            DisplayDetail(rows_data[i],paral);
        }

    })




 //重置查询条件
 $("#resetSeachAccountExchangeRateForm").click( function() {


     $("#searchAccountExchangeRateForm")[0].reset();

     //设置select2默认值为空
     emptyFormSelect2Value("searchAccountExchangeRateForm", ["originalCurrencyName","targetCurrencyName"]);
     AccountExchangeRate_table.ajax.reload();
 })


    // 开始时间
    $('#exchangeRateBeginDate1').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var startTime = e.date;
        $('#exchangeRateEndDate1').datepicker('setStartDate',startTime);
    });
//结束时间：
    $('#exchangeRateEndDate1').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var endTime = e.date;
        $('#exchangeRateBeginDate1').datepicker('setEndDate',endTime);
    });

    // 开始时间
    $('#exchangeRateBeginDate2').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var startTime = e.date;
        $('#exchangeRateEndDate2').datepicker('setStartDate',startTime);
    });
//结束时间：
    $('#exchangeRateEndDate2').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var endTime = e.date;
        $('#exchangeRateBeginDate2').datepicker('setEndDate',endTime);
    });


    // 清空弹框
    function emptyAddForm() {
        $("#editAccountExchangeRateForm")[0].reset();

        //设置select2默认值为空
        emptyFormSelect2Value("editAccountExchangeRateForm", ["originalCurrencyName","targetCurrencyName"]);
        $("#editAccountExchangeRateForm .error").removeClass("error");
        // $("label.error").remove();//清除提示语句
    };
    function rightClick() {
        console.log("fnRowCallback");
        $.contextMenu({
            selector: '#AccountExchangeRate_table tbody tr',
            callback: function (key, options) {
                //var row_data = AccountExchangeRate_table.rows(options.$trigger[0]).data()[0];
                switch (key) {
                    case "Add"://增加一条数据
                        addAccountExchangeRate();
                        break;
                    case "Delete"://删除该节点
                        $("#AccountExchangeRate_table tr.selected").removeClass("selected").find("input[type=checkbox]").prop("checked", false);//把行取消选中；
                        options.$trigger.click();//选中该行selected
                        deleteAccountExchangeRate();
                        break;
                    case "Edit"://编辑该节点
                        $("#AccountExchangeRate_table tr.selected").removeClass("selected").find("input[type=checkbox]").prop("checked", false);//把行取消选中；
                        options.$trigger.click();//选中该行selected
                        editAccountExchangeRate();
                        break;
                    default:
                        options.$trigger.removeClass("selected").find("input[type=checkbox]").prop("checked", false);;//取消选择selected
                }
            },
            items: {
                "Edit": {name: "修改", icon: "edit"},
                // "cut": {name: "Cut", icon: "cut"},
                // copy: {name: "Copy", icon: "copy"},
                // "paste": {name: "Paste", icon: "paste"},
                "Delete": {name: "删除", icon: "delete"},
                "Add": {name: "新增", icon: "add"},
                "sep1": "---------",
                "quit": {
                    name: "取消操作", icon: function () {
                        return 'context-menu-icon context-menu-icon-quit';
                    }
                }
            }
        });
    };
    return {
        // 将供页面该方法调用
        editAccountExchangeRate: editAccountExchangeRate,
        addAccountExchangeRate:addAccountExchangeRate,
        deleteAccountExchangeRate:deleteAccountExchangeRate,
        doSearch:doSearch
    };

})();
