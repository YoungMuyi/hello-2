//@ sourceURL=bank_account.js
    //标题行

$(function () {
    //Initialize Select2 Elements，初始化银行下拉框架
    $(".select2").select2();

    //解决select2 在弹出框中不能搜索的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    // advanceInsertSelect('payMethod','accountPayable/listPayMethod.do',null);

});
var bank = (function() {
    var bankacnt_tb;
    $.validator.setDefaults({
        submitHandler: submitEditBankModal
    });

    $().ready(
        function validateBankForm() {
            $("#editBankForm").validate({
                rules: {
                    bankCode: {
                        //required:true,
                        maxlength: 5
                    },
                    bankName: {
                        maxlength: 30
                    },
                    bankNameCn: {
                        maxlength: 30
                    },
                    abbrev:{
                        required:true
                    },
                    bankName:{
                        required:true
                    },
                    bankNameNative:{
                        required:true
                    },
                    addr:{required:true}
                },
                errorPlacement: function(){
                    return false;
                }
            });

        }
    );
    var Bank_table;
    var paral = {
        "abbrev": "银行简称",
        "bankName": "银行名称",
        "bankNameNative": "银行本地名称",
        "addr": "银行地址"
    };

    Init();
    function Init() {

        $("#editBankacntForm").validate({
            rules: {
                bacntName: {
                    required:true,
                },
                accounts:{
                    required:true,
                }

            },
            errorPlacement: function(){
                return false;
            }
        })

        Bank_table = $("#Bank_table").DataTable({
            fnRowCallback: rightClick,//利用行回调函数，来实现右键事件
            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            // 动态分页加载数据方式
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
            stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
            iDisplayLength: 20, // 默认每页显示多少条记录
            iDisplayStart: 0,
            ordering: false,// 全局禁用排序
            serverSide: true,
            //autoWidth: true,
            destroy: true,
            //scrollX: true,
            scrollY:calcDataTableHeight(),
            colReorder: true,//列位置的拖动
            dom:'<"top">Brt<"bottom"flip><"clear">',
            // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
//			 ajax: "../mock_data/user.txt",
            ajax: {
                "type": "POST",
                // "url": "../mock_data/Bank.json",
                "url": getContextPath()+'basedataBank/listByPage.do',
                "data": function (d) {
//					alert(JSON.stringify($('#searchForm').serializeObject()));
                    d.keys = JSON.stringify($('#searchBankForm').serializeObject());
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
                    "class": "details-control",
                    "orderable": false,
                    "data": null,
                    "defaultContent": ""
                },
                {
                    "Class": "text-center",
                    "data": "bankId",
                    "title": "<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox"  class="checkchild"  value="' + data + '" />';

                    },
                    "Sortable": false

                },
                // { title: "港口", data:"BankId"},
                {title: "序号",data: null,
                    render : function(data, type, row, meta) {
                        // 显示行号
                        var startIndex = meta.settings._iDisplayStart;
                        return startIndex + meta.row + 1;
                    }
                    },
                {title: "银行简称", data: "abbrev"},
                {title: "银行名称", data: "bankName"},
                {title: "银行本地名称", data: "bankNameNative"},
                {title: "银行地址", data: "addr"},

                {
                    title: "操作人",
                    "data": "baseModel",

                    "render": function (data, type, full, meta) {
                        return (data == null || data == undefined ) ? '' : data.amenderName;
                    },
                    // "bSortable": false,
                },

                {title: "操作时间", data: "amendTime"}


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
                                '<span title="' + data + '">' + data + '</span>' : data;
                        else if  (type === 'copy') {
                            var api = new $.fn.dataTable.Api(meta.settings);
                            data = $(api.column(meta.col).header()).text() + ": " + data+"  ";
                        }
                        return data;
                    },
                    targets: [1, 2, 3, 4, 5, 6, 7]
                }
            ],
            buttons: [

            ],
            select: {
                style: 'multi',   //选中多行
                selector: 'td:nth-child(2)'//选中效果仅对第一列有效
            }

        });

    }


    // select/not select all
    $('body').on('click' , '.bank_account .checkall' , function(){
        var check = $(this).prop("checked");
        $(".bank_account .checkchild").prop("checked", check);
        //通过调用datatables的select事件来触发选中
        $("#Bank_table tbody tr").each(function () {
            if (check){
                Bank_table.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                Bank_table.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });

    });

    $('#Bank_table tbody').on('click', 'tr td:nth-child(2)', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        // console.log(table.rows('.selected').data().length);
    });


// Array to track the ids of the details displayed rows
    var detailRows = [];

    $('#Bank_table tbody').on('click', 'tr td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = Bank_table.row(tr);

        var idx = $.inArray(tr.attr('id'), detailRows);

        if (row.child.isShown()) {
            tr.removeClass('details');
            row.child.hide();

            // Remove from the 'open' array
            detailRows.splice(idx, 1);
        }
        else {
            tr.addClass('details');
            row.child(format(row.data())).show();

            // Add to the 'open' array
            if (idx === -1) {
                detailRows.push(tr.attr('id'));
            }
        }
    });

// On each draw, loop over the `detailRows` array and show any child rows

    Bank_table.on('draw', function () {
        $.each(detailRows, function (i, id) {
            $('#' + id + ' td.details-control').trigger('click');
        });
    });

    function format(d) {

        var table = $("<table id='bankacnt_tb' class='table table-bordered  table-condensed'></table>");

        init_bankacnt_tb(table, d.bankId);


        return table;
        // 'Full name:  aaaa<br>'+
        //     'Salary: bbbb <br>'+
        //     'The child row can contain any data you wish, including links, images, inner tables etc.';
    }


    //edict item
    $("#addAccountToBank").click(function () {
        $("#editBankacntForm")[0].reset();

        $("label.error").remove();//清除提示语句
        $("#editBankacntForm .select2-selection__rendered").attr("title","").text("");
        var selectedRowData = Bank_table.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录进行新增账户操作！")
            return;
        }
        var data = selectedRowData[0];

        $("#editBankacntForm input[name='bankId']").val(data['bankId']);

        //设置默认值amender ,amenderName,amendTime,saveType
        setDefaultValue($("#editBankacntModal"), 'insert');

        $('#editBankacntModal').modal('show');//现实模态框

    })


//确定增加或者保存编辑；
    function submitEditBankacntForm() {
        if($("#editBankacntForm").valid()){
            var data = $("#editBankacntForm").serializeObject();
        var saveType = $("#editBankacntForm input[name='saveType']").val(); 
        
        //remove amendTime
        delete data["amendTime"];
        delete data["amender"];
        
        // 测试使用
        // Bank_table.row.add(data).draw();//插入一行
        // callSuccess("保存成功");

        $.ajax({
            type: 'POST',
            url: getContextPath() + 'basedataBankacnt/' + saveType + '.do',
            data: {
                bank:JSON.stringify(data)
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
                    //刷新新增的港口
                    bankacnt_tb.ajax.reload();
                    $('#editBankacntModal').modal('hide');//显示模态框

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
        
    }


//add
    function addBank() {
        // $("#addBank").on('click', function () {
        emptyAddForm();

        //设置默认值amender ,amenderName,amendTime,saveType
        setDefaultValue($("#editBankForm"), 'insert');

        $('#editBankModalTitle').html("新增");

        $('#editBankModal').modal('show');//现实模态框
        // })
    }
    //edict item
    function editBank() {
        // $("#editBank").click(function () {
        emptyAddForm();
        var selectedRowData = Bank_table.rows('.selected').data();
        if (selectedRowData.length != 1) {
            callAlert("请选择一条记录进行编辑！")
            return;
        }
        var data = selectedRowData[0];

        // 循环给表单赋值
        $.each($("#editBankForm input,#editBankForm select "), function (i, input) {

            $(this).val(data[$(this).attr("name")]);

        });


        //设置默认值amender ,amenderName,amendTime,saveType
        setDefaultValue($("#editBankModalBody"), 'update');
       
        $("#editBankForm input[name='amenderName']").val( data.baseModel.amenderName);

        $('#editBankModal').modal('show');//现实模态框

        // })
    }
    
    //edict item
    function editBankacnt(bankacntId) {
        // $("#editBank").click(function () {
        $("#editBankacntForm")[0].reset();
        $("label.error").remove();//清除提示语句
        $("#editBankacntForm .select2-selection__rendered").attr("title","").text("");
        $.ajax({
            type: 'POST',
            url: getContextPath() + 'basedataBankacnt/getById.do',
            data: {
            	
            	id:bankacntId
            },
            cache: false,
            dataType: "json",
            success: function (data) {
                // 循环给表单赋值
                $.each($("#editBankacntForm input"), function (i, input) {

                    $(this).val(data[$(this).attr("name")]);

                });
                setFormSelect2Value("editBankacntForm",["bacntType","paymentType","depositType"],[data["bacntType"],data["paymentType"],data["depositType"]]);
           
                //设置默认值amender ,amenderName,amendTime,saveType
                setDefaultValue($("#editBankacntModalBody"), 'update');
                $("#editBankacntModalBody").find("input[name='amendTime']").val( $.date.format(data.amendTime,"yyyy-MM-dd"));

            },
            error: function () {
                hideMask();
                callAlert("获取失败");
            }
        });
        $('#editBankacntModal').modal('show');


        // })
    }


    //确定增加或者保存编辑；submitEditBankModal
    function submitEditBankModal() {
        var data = $("#editBankForm").serializeObject();
        var saveType = $("#editBankForm input[name='saveType']").val();
        
        //remove amendTime
        delete data["amendTime"];

        data.isBulkSuit == undefined ? data.isBulkSuit = 0 : data.isBulkSuit = 1;
        data.isContainerSuit == undefined ? data.isContainerSuit = 0 : data.isContainerSuit = 1;

        $.ajax({
            type: 'POST',
            url: getContextPath() + '/basedataBank/' + saveType + '.do',
            data: {
                bank:JSON.stringify(data)
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

                    Bank_table.ajax.reload();
                    $('#editBankModal').modal('hide');//显示模态框
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
    // $("#deleteBank").click(function () {
    function deleteBank() {
        var info;
        var selectedRowData = Bank_table.rows('.selected').data();
        if (selectedRowData.length < 1) {
            info = "请选择需要删除的数据！";
            callAlert(info);
            return;
        }
        info = "确定要删除" + selectedRowData.length + "条数据吗?";
        callAlertModal(info,"Bank_confirmDelete");

        //确定删除
        $('.Bank_confirmDelete').unbind('click').click(function () {
            var ids = [];
            $.each(selectedRowData, function () {

                ids.push(this.bankId);
            });

            $.ajax({
                url: getContextPath() + 'basedataBank/delete.do',
                data: {
                    bankIds: ids.join(',')
                },
                dataType: 'json',
                success: function (rsp) {

                    if (rsp.code == 0) {
                        callSuccess(rsp.message);

                        Bank_table.ajax.reload();
                    }
                    else

                        callAlert(rsp.message);


                },
                error: function (res) {
                    alert(res.code);
                    callAlert("修改失败！")
                }
            });
        });

        // });
    }

    function doSearch() {
        Bank_table.ajax.reload();
    }


    //重置查询条件
    $("#resetSeachBankForm").click(function () {


        $("#searchBankForm")[0].reset();
        Bank_table.ajax.reload();

    });
    //监听分页事件,去除复选
    $('#Bank_table').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#Bank_table').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );


    // 清空弹框
    function emptyAddForm() {
        $("#editBankForm")[0].reset();
        $("label.error").remove();//清除提示语句
    }


//根据选择的用户，初始化角色datatable
    function init_bankacnt_tb(table, bankId) {
    	
        bankacnt_tb = $(table).DataTable(
            {

                // 动态分页加载数据方式
                bPaginate: false, // 翻页功能
                bProcessing: true,
                bServerSide: true,
                searching: false,// 禁用搜索
                // lengthChange: false, // 是否启用改变每页显示多少条数据的控件
                /*
                 * sort : "position",
                 * //是否开启列排序，对单独列的设置在每一列的bSortable选项中指定
                 */
                ordering: false,
                bInfo: false,
                deferRender: true,// 延迟渲染
                // iDisplayLength : 3, //默认每页显示多少条记录
                // iDisplayStart : 0,
//						ordering : false,// 全局禁用排序
                // "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
                // ajax: "../mock_data/user_role.txt",
                ajax: {
                    "type": "POST",
                    "url": getContextPath() + 'basedataBankacnt/listByKeys.do',
                    dataType: 'json',
                    data: {
                        keys: '{"bankId":' + bankId + '}',
                        length: 100,
                        start: 0

                    }
                },
                language: {
                    "url": "js/Chinese.json"
                },
                columns: [
                    {
                        title: "序号",
                        "data": null,
                        "render": function (data, type, full, meta) {
                            return meta.row + 1 + meta.settings._iDisplayStart;
                        }
                    },
                    {
                        title: "帐户名",
                        data: "bacntName"
                    }, {
                        title: "账号",
                        data: "accounts"
                    },
                    {
                        title: "账户类型",
                        data: "bacntType"
                    }, {
                        title: "账户收付类型",
                        data: "paymentType"
                    },  {
                        title: "存款类型",
                        data: "depositType"
                    }, {
                        title: "备注",
                        data: "description"
                    }, {
                        title: "操作",
                        data: "bankacntId",
                        "render": function (data, type, full, meta) {

                            if (data == undefined)
                                return "";
                            else
                                return "<button class='btn btn-info' onclick='bank.deleteBankacnt(" + data + ")'>删除</button>  &nbsp;&nbsp;" + "<button class='btn btn-info' onclick='bank.editBankacnt(" + data + ")'>修改</button> "
                        }
                    }],
                columnDefs: [{
                    orderable: false,
                    targets: [0]
                }]
            });

        $(table).on(
            'click',
            'tr',
            function (e) {
                e.stopPropagation();//阻止子元素触发父元素的事件的方法

            });
    }

    function deleteBankacnt(bankacntId) {

        info = "确定要删除此条数据吗?";
        callAlertModal(info,"Bank_confirmDelete");

        $('.Bank_confirmDelete').unbind('click').click(function () {
            $.ajax({
            type: 'POST',
            url: getContextPath() + 'basedataBankacnt/delete.do',
            data: {
                bankacntIds: bankacntId
            },
            dataType: 'json',
            success: function (rsp) {

                if (rsp.code == 0) {
                    callSuccess(rsp.message);

                    // Bankacnt_table
                    bankacnt_tb.ajax.reload();
                }
                else

                    callAlert(rsp.message);

            },
            error: function (res) {
                alert(res.code);
                callAlert("修改失败！")
            }
        });
        })
        
    }
    //作为fnRowCallback的回调函数增加右键菜单功能
    function rightClick() {
        console.log("fnRowCallback");
        $.contextMenu({
            selector: '#Bank_table tbody tr',
            callback: function (key, options) {
                //var row_data = Bank_table.rows(options.$trigger[0]).data()[0];
                switch (key) {
                    case "Add"://增加一条数据
                        addBank();
                        break;
                    case "Delete"://删除该节点
                        $("#Bank_table tr.selected").removeClass("selected").find("input[type=checkbox]").prop("checked", false);//把行取消选中；
                        options.$trigger.click();//选中该行selected
                        deleteBank();
                        break;
                    case "Edit"://编辑该节点
                        $("#Bank_table tr.selected").removeClass("selected").find("input[type=checkbox]").prop("checked", false);//把行取消选中；
                        options.$trigger.click();//选中该行selected
                        editBank();
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
    return {
        // 将供页面该方法调用
        editBank: editBank,
        addBank:addBank,
        deleteBank:deleteBank,
        doSearch:doSearch,
        submitEditBankacntForm:submitEditBankacntForm,
        deleteBankacnt:deleteBankacnt,
        editBankacnt:editBankacnt
    };

})();
