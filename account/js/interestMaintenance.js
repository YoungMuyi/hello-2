//@ sourceURL=interest_maintenance.js
// $('#lxy_basicdata_tb').DataTable().empty();
//标题行
var interestMaintenance = (function(){
    $.validator.setDefaults({
       submitHandler:submitEditAccountInterestMaintenanceModal

    });

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

    $().ready(
        function validateAccountInterestMaintenanceForm() {
            $("#editInterestMaintenanceForm").validate({
                rules: {
                    businessType: {
                        required:true
                    },
                    beginType: {
                        required:true
                    },
                    beginDate: {
                        required:true,
                        digits:true,
                        min:0,
                        max:120
                    },
                    interestPeriodDate:{
                        required:true,
                        digits:true,
                        min:0,
                        max:120
                    },
                    endType: {
                        required:true
                    },
                    endDate: {
                        digits:true
                    },
                    symbol:{
                        required:true,
                    },
                    interestRate: {
                        required:true,
                        digits:true,
                        min:0,
                        max:100
                    },
                    maintainPeople: {
                        required:true
                    },
                    maintainTime: {
                        required:true
                    }
                },
                errorPlacement: function(){
                    return false;
                },
                messages:
                    {
                        businessType: {
                            required:''
                        },
                        beginType: {
                            required:''
                        },
                        beginDate: {
                            required:'',
                            digits:''
                        },
                        endType: {
                            required:''
                        },
                        endDate: {
                            digits:''
                        },
                        interestRate: {
                            required:'',
                            digits:''
                        },
                        maintainPeople: {
                            required:''
                        },
                        maintainTime: {
                            required:''
                        }
                    }
            });
        }
    );
    var interestMaintenance_table;

    var paral={
        "businessType":"业务类型",
        "interestPeriodDate":"计息期(日)",
        "interestRate":"利率",
        "amenderName":"操作人",
        "amendTime":"操作时间"
    };
    Init();
    function Init() {

        interestMaintenance_table =  $("#interestMaintenanceTable").DataTable( {
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
                "url" : getContextPath()+'accountInterestPeriod/listByPage.do',
                "data": function(d){
//					alert(JSON.stringify($('#searchForm').serializeObject()));
                    d.keys =  JSON.stringify($('#interestMaintenanceSearchForm').serializeObject());
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
                    "data": "interestPeriodId",
                    "title":"<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';

                    },
                    "Sortable": false

                },
                { title: "业务类型",data:"businessType" },
                { title: "计息期(日)",data:"interestPeriodDate" },
                { title: "利率",data:"interestRate" },
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
                    targets: [1,2,3,4,5]
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
    $('body').on('click' , '.interestMaintenance .checkall' , function(){
        var check = $(this).prop("checked");
        $(".interestMaintenance .checkchild").prop("checked", check);
        //通过调用datatables的select事件来触发选中
        $("#interestMaintenanceTable tbody tr").each(function () {
            if (check){
                interestMaintenance_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                interestMaintenance_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

    });

    //监听分页事件,去除复选
    $('#interestMaintenanceTable').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#interestMaintenanceTable').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#interestMaintenanceTable tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        // console.log(table.rows('.selected').data().length);
    });

    //add
    function addInterestMaintenance() {

        emptyAddForm();

        //设置默认值amender ,amenderName,amendTime,saveType
        setDefaultValue($("#editInterestMaintenanceModalBody"), 'insert');

        // $('#editMaintenanceModalSubmit').val("新增");

        $('#editInterestMaintenanceModal').modal('show');//现实模态框
    }


    //edict item
    function editInterestMaintenance() {
        // $("#editAccountExchangeRate").click(function () {
        emptyAddForm();

        var selectedRowData = interestMaintenance_table.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录进行编辑！");
            return;
        }
        var data = selectedRowData[0];
        console.log(data);
        // console.log("11111", data);
        var date = data['interestPeriodDate'].split(',');
        console.log(date);
        var beginDate = date[0].substring(1);
        var endDate = date[1].substring(0, date[1].length - 1);
        var rate = data['interestRate'].split('%');

        // 循环给表单赋值
        $.each($("#editInterestMaintenanceForm input,#editInterestMaintenanceForm select "), function (i, input) {

            $(this).val(data[$(this).attr("name")]);

        });
        // data['beginDate'] = beginDate;
        // data['interestPeriodDate'] = endDate;
        $("#editInterestMaintenanceForm input[name = 'interestRate']").val(rate[0].substring(1));
        $("#editInterestMaintenanceForm input[name = 'beginDate']").val(beginDate);
        $("#editInterestMaintenanceForm input[name = 'interestPeriodDate']").val(endDate);

        //设置默认值amender ,amenderName,amendTime,saveType
        setDefaultValue($("#editInterestMaintenanceModalBody"), 'update');
        $("#editInterestMaintenanceForm input[name='interestPeriodId']").val(data['interestPeriodId']);
        $("#editInterestMaintenanceForm input[name = 'amenderName']").val(data.baseModel.amenderName);

        //

        var beginType = null;
        var endType = null;
        if (date[0][0] == '(') {
            beginType = "起始"
        } else if (date[0][0] == '[') {
            beginType = "起始(包含)"
        }
        if (date[1][date[1].length - 1] == ')') {
            endType = "终止";
        } else {
            endType = "终止(包含)"
        }
        setFormSelect2Value("editInterestMaintenanceForm", ["businessType","beginType", "endType", "symbol"],[data["businessType"],beginType, endType, rate[0][0]]);
        // $('#editMaintenanceModalSubmit').val("修改");
        $('#editInterestMaintenanceModal').modal('show');//现实模态框

        // })
    }
    //确定增加或者保存编辑；submitEditAccountExchangeRateModal
    function submitEditAccountInterestMaintenanceModal() {
        // if(!validateAccountInterestMaintenanceForm()){
        //     // alert("validate error!");
        //     return;
        // }
        var data = $("#editInterestMaintenanceForm").serializeObject();
        var saveType = $("#editInterestMaintenanceForm input[name='saveType']").val();
        // var name = $("#editInterestMaintenanceForm").find("input[name='amenderName']").val();
        // data.creator = data.amenderName;
        // data.createTime = data.amendTime;
        var isAllow = true;
        var diff = (data.beginDate - data.interestPeriodDate);
        if (data.beginDate - data.interestPeriodDate > 0) {
            if (data.interestPeriodDate.length === 0) {
                isAllow = true
            } else {
                callAlert("终止日期必须大于等于起始日期!");
                isAllow = false
            }
        }
        if (data.beginDate < 0) {
            callAlert("起始日期必须大于等于0!");
            isAllow = false
        }

        if (isAllow == true) {
            if (data.saveType == "insert" || data.saveType == "update") {
                if (data.interestPeriodDate.length === 0) {
                    data.interestPeriodDate = "..."
                }
                if (data.beginType == "起始" && data.endType == "终止") {
                    data.interestPeriodDate = "(" + data.beginDate + "," + data.interestPeriodDate + ")"
                } else if (data.beginType == "起始(包含)" && data.endType == "终止") {
                    data.interestPeriodDate = "[" + data.beginDate + "," + data.interestPeriodDate + ")"
                } else if ((data.beginType == "起始(包含)" && data.endType == "终止(包含)")) {
                    data.interestPeriodDate = "[" + data.beginDate + "," + data.interestPeriodDate + "]"
                } else if ((data.beginType == "起始" && data.endType == "终止(包含)")) {
                    data.interestPeriodDate = "(" + data.beginDate + "," + data.interestPeriodDate + "]"
                }

                if (data.symbol == "+") {
                    data.interestRate = "+" + data.interestRate + "%"
                } else {
                    data.interestRate = "-" + data.interestRate + "%"
                }
                //delete amendTime
                // delete data["amendTime"];
                delete data["beginType"];
                delete data["endType"];
                delete data["beginDate"];
                delete data["symbol"];
                delete data["saveType"];
            }


            // 测试使用
            // AccountExchangeRate_table.row.add(data).draw();//插入一行
            // callSuccess("保存成功");

            $.ajax({
                type: 'POST',
                url: getContextPath() + 'accountInterestPeriod/'+saveType+'.do',
                data: {
                    accountInterestPeriod: JSON.stringify(data)
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

                        interestMaintenance_table.ajax.reload();
                        $('#editInterestMaintenanceModal').modal('hide');//现实模态框
                    }
                    else

                        callAlert(res.message);
                    $('#editInterestMaintenanceModal').modal('hide');//现实模态框


                },
                error: function () {
                    if (saveType == 'insert'){
                        callAlert("增加失败");
                    } else {
                        callAlert("修改失败");
                    }
                    $('#editInterestMaintenanceModal').modal('hide');//现实模态框
                }
            });
        }
    }


    // delete item
    function deleteInterestMaintenance() {
        // $("#deleteAccountExchangeRate").click(function () {
        var info;
        var selectedRowData = interestMaintenance_table.rows('.selected').data();
        if(selectedRowData.length<1){
            info="请选择需要删除的数据！";
            callAlert(info);
            return;
        }

        info="确定要删除"+selectedRowData.length+"条数据吗?";
        callAlertModal(info,'InterestMaintenance_confirmDelete');


        //确定删除
        $('.InterestMaintenance_confirmDelete').unbind('click').click(function () {
            var ids = [];
            $.each(selectedRowData, function () {

                ids.push(this.interestPeriodId);
            });

            $.ajax({
                url: getContextPath() + 'accountInterestPeriod/delete.do',
                data: {
                    interestPeriodIds: ids.join(',')
                },
                dataType: 'json',
                beforeSend: function () {
                    showMask();//显示遮罩层
                },
                success: function (rsp) {
                    hideMask();

                    if(rsp.code ==0){
                        callSuccess(rsp.message);

                        interestMaintenance_table.ajax.reload();
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

        // });
    }

    //refesh table
    // $("#refreshAccountExchangeRate").click(function () {
    function doSearch() {
        // table.ajax.url( '../mock_data/objects_public_02.txt' ).load();
        interestMaintenance_table.ajax.reload();
    }


   /* // click item display detail infomation
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

    });*/




    // 清空弹框
    function emptyAddForm() {
        $("#editInterestMaintenanceForm")[0].reset();

        //设置select2默认值为空
        emptyFormSelect2Value("editInterestMaintenanceForm", ["businessType", "beginType", "endType"]);

        $("label.error").remove();//清除提示语句
    }
    function rightClick() {
        console.log("fnRowCallback");
        $.contextMenu({
            selector: '#interestMaintenanceTable tbody tr',
            callback: function (key, options) {
                //var row_data = AccountExchangeRate_table.rows(options.$trigger[0]).data()[0];
                switch (key) {
                    case "Add"://增加一条数据
                        addInterestMaintenance();
                        break;
                    case "Delete"://删除该节点
                        // $("#interestMaintenanceTable tr.selected").removeClass("selected").find("input[type=checkbox]").prop("checked", false);//把行取消选中；
                        // options.$trigger.click();//选中该行selected
                        deleteInterestMaintenance();
                        break;
                    case "Edit"://编辑该节点
                        // $("#interestMaintenanceTable tr.selected").removeClass("selected").find("input[type=checkbox]").prop("checked", false);//把行取消选中；
                        // options.$trigger.click();//选中该行selected
                        editInterestMaintenance();
                        break;
                    default:
                        options.$trigger.removeClass("selected").find("input[type=checkbox]").prop("checked", false);//取消选择selected
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
    return {
        // 将供页面该方法调用
        editInterestMaintenance: editInterestMaintenance,
        addInterestMaintenance:addInterestMaintenance,
        deleteInterestMaintenance:deleteInterestMaintenance,
        doSearch:doSearch
    };

})();


