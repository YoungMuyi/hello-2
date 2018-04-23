//@ sourceURL=smart_release_doc.js
 // $('#lxy_basicdata_tb').DataTable().empty();
    //标题行

$(document).ready(function(){
    resizeL();

});

$(function () {

    $(".select2").select2();

    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    //Date picker
    $('.beginDate,.endDate').datepicker({
        autoclose: true,
        language:"zh-CN",//语言设置
        format: "yyyy-mm-dd"
    });
});
var AccountSmartReleaseDoc = (function(){
 $.validator.setDefaults({
     submitHandler:addSubmit

 });

 $().ready(
     function validateAccountSmartReleaseDocForm() {
         $("#editAccountSmartReleaseDocForm").validate({
             rules: {
            	 customerType: {
                     required:true
                 },
                 byCondition: {
                     required:true
                 },
                 byConditionValue: {
                     required:true,
                     max:100,
                     min:0
                 },
                 beginDate: {
                     required:true
                 },
                 endDate: {
                     required:true
                 },
                 weightContract:{
                     required:true,
                     max:1,
                     min:0
                 },
                 weightAccountPeriod:{
                     required:true,
                     max:1,
                     min:0
                 },
                 weightFollowList:{
                     required:true,
                     max:1,
                     min:0
                 },
                 weightLegalRisk:{
                     required:true,
                     max:1,
                     min:0
                 },
                 scoreContractYes:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreContractNo:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreAccountPeriodYes:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreAccountPeriodNo:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreFollowListYes:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreFollowListNo:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreOverPaytimeYes:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreOverPaytimeNo:{
                     required:true,
                     max:100,
                     min:-1000
                 },


                 scoreArrearsYes:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreArrearsNo:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreCompanyContractYes:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreCompanyContractNo:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreLegalRiskYes:{
                     required:true,
                     max:100,
                     min:-1000
                 },
                 scoreLegalRiskNo:{
                     required:true,
                     max:100,
                     min:-1000
                 }
             },
             errorPlacement: function(){
                 return false;
             }
         });
     }
 );
    var AccountSmartReleaseDoc_table;


    Init();
    function Init() {

        AccountSmartReleaseDoc_table =  $("#AccountSmartReleaseDoc_table").DataTable( {
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
                 // "url": "../mock_data/AccountSmartReleaseDoc.json",
                "url" : getContextPath()+'accountSmartReleaseDoc/listByPage.do',
                "data": function(d){
//					alert(JSON.stringify($('#searchForm').serializeObject()));
                    d.keys =  JSON.stringify($('#searchAccountSmartReleaseDocForm').serializeObject());
                }

            },
            "dataSrc": function ( data ) {
                //在该方法中可以对服务器端返回的数据进行处理。
                for(var i=0;i<data.aaData.length;i++){
                    if(data.aaData[i].amendTime != '' || data.aaData[i].amendTime == undefined){
                        data.aaData[i].amendTime = $.date.format(new Date(data.aaData[i].amendTime),"yyyy-MM-dd");
                    }
                    if(data.aaData[i].createTime != '' || data.aaData[i].createTime == undefined){
                        data.aaData[i].createTime = $.date.format(new Date(data.aaData[i].createTime),"yyyy-MM-dd");
                    }
                }

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
                    "data": "exchangeRateId",
                    "title":"<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';

                    },
                    "Sortable": false,

                },
                { title: "客户类型",data:"customerType" },
                { title: "规则条件",
                    "render": function (data, type, full, meta) {
                        return '<a onclick="AccountSmartReleaseDoc.showRuelConditionDetail(this)">详情</a>';

                    },

                },
                { title: "通过条件",data:"byCondition" },
                { title: "通过条件值",data:"byConditionValue" },
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

    //  显示详情
    
    function showRuelConditionDetail(but) {
        $(".smart_release_doc .checkchild").prop("checked", false);
        $("#AccountSmartReleaseDoc_table tbody tr").each(function () {
            AccountSmartReleaseDoc_table.row( this ).deselect();
            $( this ).find('td:first-child').removeClass('selected');
        });
        var thiss=$(but).parents("tr");
        AccountSmartReleaseDoc_table.row( thiss ).select();
        $(but).parents("tr").find('td:first-child').addClass('selected');
        $(but).parents("tr").find('td:first-child').find("input[class=checkchild]").prop("checked", true);
        var data = AccountSmartReleaseDoc_table.rows(".selected").data()[0];
        console.log(data);


        if(data["customerType"]=="同行"){
            $('#viewRuleConditionModal #detailTable tfoot').css('display','none');
        }else {
            $('#viewRuleConditionModal #detailTable tfoot').css('display','table-row-group');

        }

        // 循环给表单赋值
        $.each($("#viewRuleConditionModal input"), function (i, input) {

            $(this).val(data[$(this).attr("name")]);

        });
        
        $('#viewRuleConditionModal').modal('show');//规则详情模态框

    }

// select/not select all
    $('body').on('click', '.smart_release_doc .checkall', function () {
        var check = $(this).prop("checked");
        $(".smart_release_doc .checkchild").prop("checked", check);
        $("#AccountSmartReleaseDoc_table tbody tr").each(function () {
            if (check){
                AccountSmartReleaseDoc_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                AccountSmartReleaseDoc_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });
    });

    //监听分页事件,去除复选
    $('#AccountSmartReleaseDoc_table').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#AccountSmartReleaseDoc_table').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

// 点击第一格才能选中
    $('#AccountSmartReleaseDoc_table tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
    });





// 判断客户类型
    function customerType(handler){
        $('#editAccountSmartReleaseDocForm select[name=customerType]').off();
        $('#editAccountSmartReleaseDocForm select[name=customerType]').on('change',function(){
            var customerType = $(this).val();
            if(customerType=="同行" ){
                $('#editAccountSmartReleaseDocForm #indexTable tfoot').css('display','none');
                $.each($("#editAccountSmartReleaseDocForm #indexTable tfoot input"), function (i, input) {
                    $(this).val(0)
                });
            }
            if(customerType=="直客"){
                handler();
                $('#editAccountSmartReleaseDocForm #indexTable tfoot').css('display','table-row-group');


            }
        })
    }
    

    //add
    function addAccountSmartReleaseDoc() {
    // $("#addAccountSmartReleaseDoc").on('click',function () {
        emptyAddForm();

        //设置默认值amender ,amenderName,amendTime,saveType
        setDefaultValue($("#editAccountSmartReleaseDocForm"), 'insert');
        
        // 初始化规则条件的datatable
        ruleConditionList.InitRuleConditionList(-1);
        
        //清空表单数据
        customerType(function(type){
            $.each($("#editAccountSmartReleaseDocForm #indexTable tfoot input"), function (i, input) {
                $(this).val("")
            },null);
        })
    	$("#ruleConditionList select[name='customerType']").val(['同行']).trigger('change');
        var customerTypeVal = $("#ruleConditionList select[name='customerType']").val();

        $('#accountSmartReleaseDocEndDate2').datepicker('setStartDate',null);
        $('#accountSmartReleaseDocBeginDate2').datepicker('setEndDate',null);


        $("#ruleConditionList select[name='customerType']").select2([customerTypeVal]);
    	$("#ruleConditionList select[name='byCondition']").val("");
    	$("#ruleConditionList input[name='byConditionValue']").val("");
    	$("#editAccountSmartReleaseDocModalTitle").html("新增");
        // $("#editlogisticSurchargeForm select[name=surchargeType]").val(['箱型']).trigger('change');

        $('#editAccountSmartReleaseDocModal').modal('show');//现实模态框
        // })
    }
    //edict item
    function editAccountSmartReleaseDoc() {
        // $("#editAccountSmartReleaseDoc").click(function () {
        emptyAddForm();
        var selectedRowData = AccountSmartReleaseDoc_table.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录进行编辑！");
            return;
        }
        var data = selectedRowData[0];
        
        //根据智能放单Id，生成规则条件的datatable
        ruleConditionList.InitRuleConditionList(data.smartReleaseDocId);

        // 循环给表单赋值
        $.each($("#editAccountSmartReleaseDocModal input"), function (i, input) {

            $(this).val(data[$(this).attr("name")]);

        });

        customerType(function(){
            $.each($("#editAccountSmartReleaseDocModal input"), function (i, input) {
                $(this).val(data[$(this).attr("name")]);
            });
            $('#editAccountSmartReleaseDocModalSubmit').val('保存')
        })
        var customerTypeVal = $("#ruleConditionList select[name='customerType']").val();
        $("#ruleConditionList select[name='customerType']").select2([customerTypeVal]);
        //设置form外的表单值
        setFormSelect2Value("ruleConditionList", ["customerType","byCondition"],[data['customerType'], data['byCondition']]);
        $("#ruleConditionList input[name='byConditionValue']").val(data['byConditionValue']);

        
        
        //设置默认值amender ,amenderName,amendTime,saveType
        setDefaultValue($("#editAccountSmartReleaseDocModalBody"), 'update');
        $("#editAccountSmartReleaseDocForm input[name='amenderName']").val(  data.baseModel.amenderName);
        $('#editAccountSmartReleaseDocModalTitle').html("修改");
        $('#editAccountSmartReleaseDocModal').modal('show');//现实模态框

        // })
    }


    //确定增加或者保存编辑；submitEditAccountSmartReleaseDocModal
    function addSubmit() {
        /*
        var index1 = $("#indexTable tbody tr td input[name = 'weightContract']").val();
        var index2 = $("#indexTable tbody tr td input[name = 'weightAccountPeriod']").val();
        var index3 = $("#indexTable tbody tr td input[name = 'weightFollowList']").val();
        var index4 = $("#indexTable tbody tr td input[name = 'weightLegalRisk']").val();



        var weight = parseFloat(index1) + parseFloat(index2) + parseFloat(index3) + parseFloat(index4);
        if (Math.abs(1 - weight) >= 0.01) {
            callAlert("权重之和必须为1!");
            return;
        }
        */
        var data = $("#editAccountSmartReleaseDocModal").serializeObject();
        var saveType = $("#editAccountSmartReleaseDocForm input[name='saveType']").val();


        //判断是否已存在smartReleaseDocId ，存在则改为修改
        if( $("#editAccountSmartReleaseDocForm input[name='smartReleaseDocId']").val() != "" )
            saveType = "update";

        $.ajax({
            type: 'POST',
            url: getContextPath() + 'accountSmartReleaseDoc/'+saveType+'.do',
            data: {
                accountSmartReleaseDoc: JSON.stringify(data)
            },
            cache: false,
            dataType: "json",
            beforeSend: function () {
                /*showMask();//显示遮罩层*/
            },
            success: function (res) {
                /*hideMask();*/

                if(res.code ==0){
                    callSuccess("success!");

                    //初始化规则条件的datatable,返回值包括当前插入的smartReleaseDocId
                    ruleConditionList.InitRuleConditionList(res.data);

                    //将新增的id设置到smartReleaseDocId 表单中，用于判断当前未修改模块
                    $("#editAccountSmartReleaseDocForm input[name='smartReleaseDocId']").val(res.data);
                    $('#editAccountSmartReleaseDocModal').modal('hide');
                    AccountSmartReleaseDoc_table.ajax.reload();
                }
                else
                    callAlert(res.message);
            },
            error: function () {
                /*hideMask();*/
                callAlert("增加失败");
            }
        });

    }


    // delete item
    function deleteAccountSmartReleaseDoc() {
        // $("#deleteAccountSmartReleaseDoc").click(function () {
        var info;
        var selectedRowData = AccountSmartReleaseDoc_table.rows('.selected').data();
        if (selectedRowData.length < 1) {
            info = "请选择需要删除的数据！";
            callAlert(info);
            return;
        }

        info = "确定要删除" + selectedRowData.length + "条数据吗?";
        callAlertModal(info, 'AccountSmartReleaseDoc_confirmDelete');
    }
    $('#alertModal').on('click',".AccountSmartReleaseDoc_confirmDelete",function () {
        //确定删除
            var ids = [];
        var selectedRowData = AccountSmartReleaseDoc_table.rows('.selected').data();
            $.each(selectedRowData, function () {

                ids.push(this.smartReleaseDocId);
            });

            $.ajax({
                url: getContextPath() + 'accountSmartReleaseDoc/delete.do',
                data: {
                	smartReleaseDocIds: ids.join(',')
                },
                dataType: 'json',
                beforeSend: function () {
                    /*showMask();//显示遮罩层*/
                },
                success: function (rsp) {
                   /* hideMask();*/

                    if(rsp.code ==0){
                        callSuccess(rsp.message);

                        AccountSmartReleaseDoc_table.ajax.reload();
                    }
                    else
                        callAlert(rsp.message);
                },
                error: function (res) {
                    /*hideMask();*/
                    alert(res.code);
                    callAlert("修改失败！")
                }
            });
        });


    function doSearch() {
        // table.ajax.url( '../mock_data/objects_public_02.txt' ).load();
        AccountSmartReleaseDoc_table.ajax.reload();
    }


    $('#showAccountSmartReleaseDocDetail').on('click',function () {
        var rows_data = AccountSmartReleaseDoc_table.rows('.selected').data();
        if(rows_data.length<1){
            callAlert("请选择一条数据进行查看");
            return;
        }
        for (var i=0;i<rows_data.length;i++){
            $("#detail_table").html("");
            DisplayDetail(rows_data[i],paral);
        }

    });
    
	 //重置查询条件
	function resetSearchForm() {
	     $("#searchAccountSmartReleaseDocForm")[0].reset();
        emptyFormSelect2Value("searchAccountSmartReleaseDocForm", ["customerType"]);
	     AccountSmartReleaseDoc_table.ajax.reload();
	 }

	 

    // 清空弹框
    function emptyAddForm() {
        $("#editAccountSmartReleaseDocForm")[0].reset();
        $("#indexTable tbody tr td input").val("");
        //设置select2默认值为空
        emptyFormSelect2Value("ruleConditionList", ["customerType", "byCondition"]);
        $("label.error").remove();//清除提示语句
    }
    function rightClick() {
        console.log("fnRowCallback");
        $.contextMenu({
            selector: '#AccountSmartReleaseDoc_table tbody tr',
            callback: function (key, options) {
                //var row_data = AccountSmartReleaseDoc_table.rows(options.$trigger[0]).data()[0];
                switch (key) {
                    case "Add"://增加一条数据
                        addAccountSmartReleaseDoc();
                        break;
                    case "Delete"://删除该节点
                        $("#AccountSmartReleaseDoc_table tr.selected").removeClass("selected").find("input[type=checkbox]").prop("checked", false);//把行取消选中；
                        options.$trigger.click();//选中该行selected
                        deleteAccountSmartReleaseDoc();
                        break;
                    case "Edit"://编辑该节点
                        $("#AccountSmartReleaseDoc_table tr.selected").removeClass("selected").find("input[type=checkbox]").prop("checked", false);//把行取消选中；
                        options.$trigger.click();//选中该行selected
                        editAccountSmartReleaseDoc();
                        break;
                    default:
                        options.$trigger.removeClass("selected").find("input[type=checkbox]").prop("checked", false);;//取消选择selected
                }
            },
            items: {
                "Edit": {name: "修改", icon: "edit"},
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
    }

    // 开始时间
    $('#accountSmartReleaseDocBeginDate1').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var startTime = e.date;
        $('#accountSmartReleaseDocEndDate1').datepicker('setStartDate',startTime);
    });
//结束时间：
    $('#accountSmartReleaseDocEndDate1').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var endTime = e.date;
        $('#accountSmartReleaseDocBeginDate1').datepicker('setEndDate',endTime);
    });

    // 开始时间
    $('#accountSmartReleaseDocBeginDate2').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var startTime = e.date;
        $('#accountSmartReleaseDocEndDate2').datepicker('setStartDate',startTime);
    });
//结束时间：
    $('#accountSmartReleaseDocEndDate2').datepicker({
        todayBtn : "linked",
        autoclose : true,
        todayHighlight : true,
        // endDate : new Date(),
        format: "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var endTime = e.date;
        $('#accountSmartReleaseDocBeginDate2').datepicker('setEndDate',endTime);
    });


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
    return {
        // 将供页面该方法调用
        editAccountSmartReleaseDoc: editAccountSmartReleaseDoc,
        addAccountSmartReleaseDoc:addAccountSmartReleaseDoc,
        deleteAccountSmartReleaseDoc:deleteAccountSmartReleaseDoc,
        doSearch:doSearch,
        showRuelConditionDetail:showRuelConditionDetail,
        resetSearchForm:resetSearchForm,
        addSubmit:addSubmit
    };

})();
